// src/pages/AdminPanel.tsx
import { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useArticles } from "../context/ArticlesContext";
import type { Article } from "../context/ArticlesContext";

export default function AdminPanel() {
  const { articles, setArticles } = useArticles();
  const [form, setForm] = useState<Article | null>(null);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [confirmDeleteTag, setConfirmDeleteTag] = useState<{
    open: boolean;
    tag: string | null;
  }>({ open: false, tag: null });
  const [confirmDeleteArticle, setConfirmDeleteArticle] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [allTags, setAllTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const pageSize = 5;

  // Update tags dynamically
  useEffect(() => {
    const tagsSet = new Set<string>();
    articles.forEach((a) => (a.tags || []).forEach((tag) => tagsSet.add(tag)));
    setAllTags([...tagsSet]);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (query.length < 2) return articles;
    return articles.filter((article) =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase()) ||
      (article.tags || []).some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [articles, query]);

  const paginatedArticles = filteredArticles.slice(0, page * pageSize);

  const handleEdit = (article: Article) => {
    setForm(article);
  };

  const requestDeleteArticle = (id: string) => {
    setConfirmDeleteArticle({ open: true, id });
  };

  const handleDeleteArticleConfirm = () => {
    if (confirmDeleteArticle.id) {
      setArticles((prev) => prev.filter((a) => a.id !== confirmDeleteArticle.id));
    }
    setConfirmDeleteArticle({ open: false, id: null });
  };

  const handleDeleteArticleCancel = () => {
    setConfirmDeleteArticle({ open: false, id: null });
  };

  const handleDeleteTagRequest = (tag: string) => {
    setConfirmDeleteTag({ open: true, tag });
  };

  const handleDeleteTagConfirm = () => {
    if (confirmDeleteTag.tag) {
      setArticles((prev) =>
        prev.map((a) => ({
          ...a,
          tags: (a.tags || []).filter((t) => t !== confirmDeleteTag.tag),
        }))
      );
    }
    setConfirmDeleteTag({ open: false, tag: null });
  };

  const handleDeleteTagCancel = () => {
    setConfirmDeleteTag({ open: false, tag: null });
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

  const handleSubmit = () => {
    if (!form?.title || !form.content) return;

    if (form.id && articles.find((a) => a.id === form.id)) {
      // Update
      setArticles((prev) =>
        prev.map((a) =>
          a.id === form.id
            ? { ...form, updatedAt: new Date().toISOString() }
            : a
        )
      );
    } else {
      // Add new
      const newArticle = {
        ...form,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      setArticles((prev) => [newArticle, ...prev]);
    }

    setForm(null);
  };

  const handleClearSearch = () => {
    setQuery("");
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
        flexWrap="wrap"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setForm({ id: "", title: "", content: "", tags: [] })}
        >
          + Add New Article
        </Button>
        <Button variant="outlined" onClick={handleExport}>
          Export Articles
        </Button>
        <Button variant="outlined" onClick={() => setTagManagerOpen(true)}>
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

      {form && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              label="Tags (comma separated)"
              value={form.tags?.join(", ") || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value.split(",").map((t) => t.trim()),
                })
              }
              fullWidth
            />
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Save Article
            </Button>
          </Stack>
        </Paper>
      )}

      <Paper elevation={2}>
        <List>
          {paginatedArticles.map((a) => (
            <ListItem
              key={a.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              divider
            >
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
                  variant="outlined"
                  size="small"
                  onClick={() => handleEdit(a)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => requestDeleteArticle(a.id)}
                >
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {filteredArticles.length > paginatedArticles.length && (
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={() => setPage(page + 1)}>
            Load More
          </Button>
        </Box>
      )}

      {/* Tag Manager Dialog */}
      <Dialog open={tagManagerOpen} onClose={() => setTagManagerOpen(false)}>
        <DialogTitle>Manage Tags</DialogTitle>
        <DialogContent>
          {allTags.map((tag, i) => (
            <Box key={i} display="flex" alignItems="center" mb={1}>
              <Typography sx={{ flexGrow: 1 }}>{tag}</Typography>
              <Button
                color="error"
                size="small"
                onClick={() => handleDeleteTagRequest(tag)}
              >
                Delete
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagManagerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Tag Delete */}
      <Dialog
        open={confirmDeleteTag.open}
        onClose={handleDeleteTagCancel}
      >
        <DialogTitle>Confirm Delete Tag</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the tag "
            <strong>{confirmDeleteTag.tag}</strong>"? This will remove the tag
            from all articles.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteTagCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteTagConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Article Delete */}
      <Dialog
        open={confirmDeleteArticle.open}
        onClose={handleDeleteArticleCancel}
      >
        <DialogTitle>Confirm Delete Article</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this article? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteArticleCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteArticleConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
