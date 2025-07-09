import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  Paper,
  Stack,
  DialogContentText,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Snackbar, Alert as MuiAlert } from "@mui/material";
import Footer from "../components/Footer";
import { useArticles } from "../context/ArticlesContext";
import type { Article } from "../types/Article";
import ArticleFormDialog from "../components/ArticleFormDialog";
import { useTags } from "../context/TagsContext";
import { createArticle, updateArticle, deleteArticle } from "../api/articles";
import Fuse from "fuse.js";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import { useDebouncedValue } from "../utils/useDebouncedValue";
import AdminArticleListItem from "../components/AdminArticleListItem";

export default function AdminPanel() {
  const { articles, setArticles, loading } = useArticles();
  const { tags } = useTags();
  const [form, setForm] = useState<Partial<Article> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    null
  );
  const fuse = useMemo(() => {
    return new Fuse(articles, {
      keys: ["title", "description"],
      threshold: 0.3,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [articles]);

  const debouncedQuery = useDebouncedValue(query, 300);

  const fuseResults = useMemo(() => {
    return debouncedQuery.trim().length < 2 ? [] : fuse.search(debouncedQuery);
  }, [debouncedQuery, fuse]);

  const pageSize = 5;
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const handleNewArticle = useCallback(() => {
    setForm({
      id: "",
      title: "",
      description: "",
      tags: [],
    });
  }, []);

  const filteredArticles = useMemo(() => {
    const baseArticles =
      debouncedQuery.trim().length >= 2
        ? fuseResults.map((r) => r.item)
        : articles;

    return baseArticles
      .filter((article) => {
        const tagMatch =
          activeTags.length === 0 ||
          article.tags.some((tagId) => activeTags.includes(tagId));

        return tagMatch;
      })
      .sort((a, b) => {
        const aTime = new Date(a.dateCreated ?? 0).getTime();
        const bTime = new Date(b.dateCreated ?? 0).getTime();
        return sortBy === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [articles, fuseResults, debouncedQuery, activeTags, sortBy]);

  const suggestionTitles = useMemo(() => {
    return fuseResults.slice(0, 5).map((r) => r.item.title);
  }, [fuseResults]);

  const paginatedArticles = filteredArticles.slice(0, page * pageSize);

  const handleEdit = (article: Article) => {
    setForm({ ...article });
  };

  const handleDelete = (id: string) => {
    setArticleToDelete(articles.find((a) => a.id === id) || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (articleToDelete) {
      setSubmitting(true);
      setError(null);
      try {
        await deleteArticle(articleToDelete.id);
        setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
        setSnackbarMessage("Article deleted successfully");
        setSnackbarSeverity("success");
        setShowSnackbar(true);
      } catch (err) {
        console.error("Failed to delete article:", err);
        setError("Failed to delete article. Please try again later.");
        setSnackbarMessage("Failed to delete article. Please try again.");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      }
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(articles, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "knowledgebase_export.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!form?.title?.trim() || !form.description?.trim()) {
      alert("Title and description cannot be empty.");
      return;
    }

    if (
      articles.some(
        (a) =>
          a.title.trim().toLowerCase() === form.title!.trim().toLowerCase() &&
          a.id !== form.id
      )
    ) {
      alert("An article with this title already exists.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (form.id && articles.find((a) => a.id === form.id)) {
        const updated = await updateArticle(form.id, form);
        updated.tags = form.tags ?? [];
        setArticles((prev) =>
          prev.map((a) => (a.id === form.id ? updated : a))
        );
        setSnackbarMessage("Article updated successfully");
      } else {
        const created = await createArticle(form);
        created.tags = form.tags ?? [];
        setArticles((prev) => [created, ...prev]);
        setSnackbarMessage("Article created successfully");
      }

      setSnackbarSeverity("success");
      setShowSnackbar(true);
      setForm(null);
    } catch (err) {
      console.error("Error saving article:", err);
      setError("Failed to save article. Please try again later.");
      setSnackbarMessage("Failed to save article.");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const hasUnsavedChanges = () => {
    if (!form) return false;
    return (
      form.title?.trim() !== "" ||
      form.description?.trim() !== "" ||
      (form.tags && form.tags.length > 0)
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedArticleId((prevId) => (prevId === id ? null : id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleArticleFormClose();
    } else if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleArticleFormClose = () => {
    if (hasUnsavedChanges()) {
      setCancelDialogOpen(true);
    } else {
      setForm(null);
    }
  };

  const getTagNames = useCallback(
    (tagIds: string[]) =>
      tagIds
        .map((id) => tags.find((t) => t.id === id)?.name)
        .filter((name): name is string => !!name)
        .sort((a, b) => a.localeCompare(b)),
    [tags]
  );

  return (
    <Box maxWidth="md" mx="auto" my={4} px={2}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={2}
        flexWrap="wrap">
        <Button variant="contained" color="primary" onClick={handleNewArticle}>
          + Add New Article
        </Button>
        <Button variant="outlined" onClick={handleExport} disabled={!!form}>
          Export Articles
        </Button>
      </Stack>

      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={() => {}}
        loading={loading}
        suggestions={suggestionTitles}
        onSelectSuggestion={(val) => setQuery(val)}
      />
      <Filters
        activeTags={activeTags}
        setActiveTags={setActiveTags}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilters={() => {
          setActiveTags([]);
          setSortBy("newest");
          setQuery("");
        }}
      />

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {(loading || submitting) && (
        <Box mt={2} textAlign="center">
          <CircularProgress />
        </Box>
      )}

      <Paper
        elevation={2}
        sx={{ opacity: form ? 0.3 : 1, pointerEvents: form ? "none" : "auto" }}>
        <List>
          {paginatedArticles.map((a) => (
            <AdminArticleListItem
              key={a.id}
              article={a}
              tagNames={getTagNames(a.tags)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isExpanded={expandedArticleId === a.id}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </List>
      </Paper>
      {filteredArticles.length === 0 && (
        <Box mt={2}>
          <Alert severity="info">
            No articles match your search or filters.
          </Alert>
        </Box>
      )}

      {filteredArticles.length > paginatedArticles.length && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            onClick={() => setPage(page + 1)}
            disabled={!!form}>
            Load More
          </Button>
        </Box>
      )}

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the article "
            {articleToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to discard the changes you made? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setCancelDialogOpen(false)}>
            Keep Editing
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setForm(null);
              setCancelDialogOpen(false);
            }}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <MuiAlert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Footer />
      {/* Article Form Dialog */}
      {form && (
        <ArticleFormDialog
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={handleArticleFormClose}
          onKeyDown={handleKeyDown}
        />
      )}
    </Box>
  );
}
