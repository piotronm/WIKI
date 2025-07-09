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
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Alert,
} from "@mui/material";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ArticleFormDialog from "../components/ArticleFormDialog";
import AdminArticleListItem from "../components/AdminArticleListItem";
import { useArticles } from "../context/ArticlesContext";
import { useTags } from "../context/TagsContext";
import { useDebouncedValue } from "../utils/useDebouncedValue";
import { createArticle, updateArticle, deleteArticle } from "../api/articles";
import Fuse from "fuse.js";
import type { Article } from "../types/Article";

export default function AdminPanel() {
  const { articles, setArticles, loading } = useArticles();
  const { tags } = useTags();

  const [form, setForm] = useState<Partial<Article> | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(articles, {
        keys: ["title", "description"],
        threshold: 0.3,
        minMatchCharLength: 2,
        ignoreLocation: true,
      }),
    [articles]
  );

  const debouncedQuery = useDebouncedValue(query, 300);

  const fuseResults = useMemo(() => {
    return debouncedQuery.trim().length < 2 ? [] : fuse.search(debouncedQuery);
  }, [debouncedQuery, fuse]);

  const pageSize = 5;

  const handleNewArticle = () => {
    setForm({ id: "", title: "", description: "", tags: [] });
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

  const filteredArticles = useMemo(() => {
    const baseArticles =
      debouncedQuery.trim().length >= 2
        ? fuseResults.map((r) => r.item)
        : articles;

    return baseArticles
      .filter(
        (article) =>
          activeTags.length === 0 ||
          article.tags.some((tagId) => activeTags.includes(tagId))
      )
      .sort((a, b) => {
        const aTime = new Date(a.dateCreated ?? 0).getTime();
        const bTime = new Date(b.dateCreated ?? 0).getTime();
        return sortBy === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [articles, fuseResults, debouncedQuery, activeTags, sortBy]);

  const paginatedArticles = filteredArticles.slice(0, page * pageSize);

  const getTagNames = useCallback(
    (tagIds: string[]) =>
      tagIds
        .map((id) => tags.find((t) => t.id === id)?.name)
        .filter((name): name is string => !!name)
        .sort((a, b) => a.localeCompare(b)),
    [tags]
  );

  const handleEdit = (article: Article) => {
    setForm({ ...article });
  };

  const handleDelete = (id: string) => {
    setArticleToDelete(articles.find((a) => a.id === id) || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
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
      setSnackbarMessage("Failed to delete article.");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setSubmitting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleArticleFormClose = () => {
    if (
      form?.title?.trim() !== "" ||
      form?.description?.trim() !== "" ||
      (form.tags && form.tags.length > 0)
    ) {
      setCancelDialogOpen(true);
    } else {
      setForm(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleArticleFormClose();
    else if (e.key === "Enter" && e.ctrlKey) handleSubmit();
  };

  return (
    <Box
      display="flex"
      minHeight="100vh"
      width="100%"
      px={{ xs: 2, md: 4, lg: 6 }}
      py={4}>
      {/* Sidebar */}
      <Box
        width={{ xs: "100%", md: 320, lg: 360 }}
        maxWidth="360px"
        pr={3}
        display="flex"
        flexDirection="column"
        gap={2}
        flexShrink={0}>
        <Typography variant="h5" gutterBottom>
          Manage Articles
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleNewArticle}>
          + Add New Article
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleExport}
          disabled={!!form}>
          Export Articles
        </Button>

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
      </Box>

      {/* Main Content */}
      <Box flex={1} minWidth={0}>
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={() => {}}
          loading={loading}
          suggestions={fuseResults.slice(0, 5).map((r) => r.item.title)}
          onSelectSuggestion={(val) => setQuery(val)}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {(loading || submitting) && (
          <Box mt={2} textAlign="center">
            <CircularProgress />
          </Box>
        )}

        <Paper
          elevation={2}
          sx={{
            mt: 2,
            opacity: form ? 0.3 : 1,
            pointerEvents: form ? "none" : "auto",
          }}>
          <List>
            {paginatedArticles.map((a) => (
              <AdminArticleListItem
                key={a.id}
                article={a}
                tagNames={getTagNames(a.tags)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isExpanded={expandedArticleId === a.id}
                toggleExpanded={() =>
                  setExpandedArticleId((prev) => (prev === a.id ? null : a.id))
                }
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
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!!form}>
              Load More
            </Button>
          </Box>
        )}

        <Footer />
      </Box>

      {/* Dialogs and Snackbar */}
      {form && (
        <ArticleFormDialog
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={handleArticleFormClose}
          onKeyDown={handleKeyDown}
        />
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{articleToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          Are you sure you want to discard the changes you made?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Editing
          </Button>
          <Button
            color="error"
            variant="contained"
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
          severity={snackbarSeverity}
          onClose={() => setShowSnackbar(false)}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
