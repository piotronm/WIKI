import { useState, useMemo } from "react";
import { useArticles } from "../context/ArticlesContext";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Select,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const SearchPage = () => {
  const { articles, loading } = useArticles();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  const handleTagClick = (tag: string) => {
    setActiveTags((prev) => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const filteredArticles = useMemo(() => {
    if (query.length < 2) return [];
    return articles
      .filter((article) => {
        const searchMatch =
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          (article.tags || []).some((tag: string) =>
            tag.toLowerCase().includes(query.toLowerCase())
          );
        const tagMatch =
          activeTags.size === 0 ||
          (article.tags || []).some((tag: string) => activeTags.has(tag));
        return searchMatch && tagMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || "").getTime();
        const dateB = new Date(b.createdAt || "").getTime();
        return sortBy === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [query, articles, activeTags, sortBy]);

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags || [])));

  return (
    <Box my={4}>
      <Typography variant="h4" gutterBottom>
        Search Knowledge Base
      </Typography>
      <TextField
        fullWidth
        label="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        margin="normal"
        variant="outlined"
      />

      <Box my={2} display="flex" flexWrap="wrap" gap={1}>
        {allTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            color={activeTags.has(tag) ? "primary" : "default"}
            onClick={() => handleTagClick(tag)}
            clickable
          />
        ))}
      </Box>

      <Select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
        size="small">
        <MenuItem value="newest">Newest First</MenuItem>
        <MenuItem value="oldest">Oldest First</MenuItem>
      </Select>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {filteredArticles.map((article) => (
            <ListItem
              key={article.id}
              component={Link}
              to={`/article/${article.id}`}
              sx={{ cursor: "pointer" }}>
              <ListItemText
                primary={article.title}
                secondary={
                  <>
                    {article.content.substring(0, 100)}...
                    <br />
                    Tags: {(article.tags || []).join(", ")}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchPage;
