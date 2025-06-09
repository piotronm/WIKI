import { useState, useMemo, useEffect } from "react";
import { useArticles } from "../context/ArticlesContext";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Paper,
  Button,
  Alert,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";

const SearchPage = () => {
  const { articles } = useArticles();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (page > 1) setPage(1);
  }, [query, activeTags, sortBy]);

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

  const handleSearch = () => {
    setLoading(true);
    setSearchTimeout(false);

    const searchTimer = setTimeout(() => {
      setLoading(false);
      setSearchTimeout(true);
    }, 5000);

    setTimeout(() => {
      setLoading(false);
      clearTimeout(searchTimer);
    }, 1200);
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

  const paginatedArticles = filteredArticles.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags || [])));

  return (
    <Box maxWidth="md" mx="auto" my={4} px={2}>
      <Typography variant="h4" gutterBottom>
        Search Knowledge Base
      </Typography>

      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      <Filters
        allTags={allTags}
        activeTags={activeTags}
        onTagClick={handleTagClick}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : searchTimeout ? (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Search took too long. Please try again or refine your query.
        </Alert>
      ) : filteredArticles.length === 0 && query.length >= 2 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No articles found.
        </Alert>
      ) : (
        <>
          <Paper elevation={2}>
            <List disablePadding>
              {paginatedArticles.map((article) => (
                <ListItem
                  key={article.id}
                  component={Link}
                  to={`/article/${article.id}`}
                  divider
                  sx={{
                    "&:hover": { backgroundColor: "action.hover" },
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {article.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="span"
                        >
                          {article.content.substring(0, 100)}...
                        </Typography>
                        <br />
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          component="span"
                        >
                          Tags: {(article.tags || []).join(", ")}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          {filteredArticles.length > pageSize && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Typography variant="body2">
                Page {page} of {Math.ceil(filteredArticles.length / pageSize)}
              </Typography>
              <Button
                variant="outlined"
                disabled={page >= Math.ceil(filteredArticles.length / pageSize)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchPage;
