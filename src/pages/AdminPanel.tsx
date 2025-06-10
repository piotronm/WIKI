// src/pages/AdminPanel.tsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  DialogContentText,
  Alert,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useArticles } from "../context/ArticlesContext";
import type { Article } from "../context/ArticlesContext";
import ArticleFormDialog from "../components/ArticleFormDialog";
import { createArticle, updateArticle, deleteArticle } from "../api/articles";

export default function AdminPanel() {
  const { articles, setArticles } = useArticles();
  const [form, setForm] = useState<
    (Partial<Article> & { tagsInput?: string }) | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [deleteTagDialogOpen, setDeleteTagDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const pageSize = 5;

  useEffect(() => {
    const tagsSet = new Set<string>();
    articles.forEach((a) => (a.tags || []).forEach((tag) => tagsSet.add(tag)));
    setAllTags([...tagsSet]);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (query.length < 1) return articles;
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()) ||
        (article.tags || []).some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    );
  }, [articles, query]);

  const paginatedArticles = filteredArticles.slice(0, page * pageSize);

  const handleEdit = (article: Article) => {
    setForm({
      ...article,
      tagsInput: (article.tags || []).join(", "),
    });
  };

  const handleDelete = (id: string) => {
    setArticleToDelete(articles.find((a) => a.id === id) || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (articleToDelete) {
      setLoading(true);
      setError(null);
      try {
        await deleteArticle(articleToDelete.id);
        setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
      } catch (err) {
        console.error("Failed to delete article:", err);
        setError("Failed to delete article. Please try again later.");
      } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        setArticleToDelete(null);
      }
    }
  };

  const handleDeleteTag = (tag: string) => {
    setArticles((prev) =>
      prev.map((a) => ({
        ...a,
        tags: (a.tags || []).filter((t) => t !== tag),
      }))
    );
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
    if (!form?.title?.trim() || !form.content?.trim()) {
      alert("Title and content cannot be empty.");
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

    const cleanedTags = (form.tagsInput || "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    if (form.id && articles.find((a) => a.id === form.id)) {
      // Edit existing article via API
      setLoading(true);
      setError(null);
      try {
        const updatedArticleData: Partial<Article> = {
          title: form.title!.trim(),
          content: form.content!.trim(),
          tags: cleanedTags,
        };
        const updatedArticle = await updateArticle(form.id, updatedArticleData);
        setArticles((prev) =>
          prev.map((a) => (a.id === form.id ? updatedArticle : a))
        );
        setForm(null);
      } catch (err) {
        console.error("Failed to update article:", err);
        setError("Failed to update article. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      // New article via API call
      setLoading(true);
      setError(null);
      try {
        const newArticleData: Partial<Article> = {
          title: form.title!.trim(),
          content: form.content!.trim(),
          tags: cleanedTags,
        };
        const savedArticle = await createArticle(newArticleData);
        setArticles((prev) => [savedArticle, ...prev]);
        setForm(null);
      } catch (err) {
        console.error("Failed to create article:", err);
        setError("Failed to create article. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearSearch = () => {
    setQuery("");
  };

  const hasUnsavedChanges = () => {
    if (!form) return false;
    return (
      form.title?.trim() !== "" ||
      form.content?.trim() !== "" ||
      (form.tagsInput && form.tagsInput.trim() !== "")
    );
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
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setForm({ id: "", title: "", content: "", tags: [], tagsInput: "" })
          }>
          + Add New Article
        </Button>
        <Button variant="outlined" onClick={handleExport} disabled={!!form}>
          Export Articles
        </Button>
        <Button
          variant="outlined"
          onClick={() => setTagManagerOpen(true)}
          disabled={!!form}>
          Manage Tags
        </Button>
      </Stack>

      <TextField
        label="Search Articles"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        margin="normal"
        disabled={!!form}
        placeholder="Type to search by title, content, or tags"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {loading && (
        <Box mt={2} textAlign="center">
          <CircularProgress />
        </Box>
      )}

      <Paper
        elevation={2}
        sx={{ opacity: form ? 0.3 : 1, pointerEvents: form ? "none" : "auto" }}>
        <List>
          {paginatedArticles.map((a) => (
            <ListItem
              key={a.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              divider>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {a.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tags: {(a.tags || []).join(", ")}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Button
                  component={Link}
                  to={`/article/${a.id}`}
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<VisibilityIcon />}>
                  View
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(a)}>
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(a.id)}>
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

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

      {/* Delete Article Confirmation */}
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

      {/* Tag Manager */}
      <Dialog open={tagManagerOpen} onClose={() => setTagManagerOpen(false)}>
        <DialogTitle>Manage Tags</DialogTitle>
        <DialogContent>
          {allTags.map((tag, i) => (
            <Box key={i} display="flex" alignItems="center" mb={1}>
              <Typography sx={{ flexGrow: 1 }}>{tag}</Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => {
                  setTagToDelete(tag);
                  setDeleteTagDialogOpen(true);
                }}>
                Delete
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setTagManagerOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Tag Confirmation */}
      <Dialog
        open={deleteTagDialogOpen}
        onClose={() => setDeleteTagDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the tag "{tagToDelete}" from all
            articles? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setDeleteTagDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (tagToDelete) handleDeleteTag(tagToDelete);
              setDeleteTagDialogOpen(false);
              setTagToDelete(null);
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}
