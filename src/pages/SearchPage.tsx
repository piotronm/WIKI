import { useState, useMemo, useEffect } from "react";
import { useArticles } from "../context/ArticlesContext";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Fade,
} from "@mui/material";
import Fuse from "fuse.js";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import SearchResultsList from "../components/SearchResultsList";
import { useTags } from "../context/TagsContext";

const SearchPage = () => {
  const { articles } = useArticles();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(false);
  const [page, setPage] = useState(1);
  const { tags, loading: tagsLoading } = useTags();
  const pageSize = 5;

  const fuse = useMemo(() => {
    return new Fuse(articles, {
      keys: ["title", "description", "tags"],
      threshold: 0.3,
      minMatchCharLength: 2,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [articles]);

  useEffect(() => {
    if (page > 1) setPage(1);
  }, [query, activeTags, sortBy, startDate, endDate]);

  const handleSearch = () => {
    setLoading(true);
    setSearchTimeout(false);

    const timer = setTimeout(() => {
      setLoading(false);
      setSearchTimeout(true);
    }, 5000);

    setTimeout(() => {
      setLoading(false);
      clearTimeout(timer);
    }, 1200);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch();
  };

  const fuseResults = useMemo(() => {
    return query.trim().length < 2 ? [] : fuse.search(query);
  }, [query, fuse]);

  const filteredArticles = useMemo(() => {
    const baseArticles =
      query.trim().length >= 2 ? fuseResults.map((res) => res.item) : articles;

    return baseArticles
      .filter((article) => {
        const inTags = article.tags || [];
        const tagCondition =
          activeTags.length === 0 ||
          inTags.some((tag) => activeTags.includes(tag));

        const created = new Date(article.dateCreated ?? "");
        const afterStart = startDate ? created >= startDate : true;
        const beforeEnd = endDate ? created <= endDate : true;

        return tagCondition && afterStart && beforeEnd;
      })
      .sort((a, b) => {
        const aTime = new Date(a.dateCreated ?? "").getTime();
        const bTime = new Date(b.dateCreated ?? "").getTime();
        return sortBy === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [articles, fuseResults, activeTags, startDate, endDate, sortBy, query]);

  const suggestionTitles = useMemo(() => {
    return fuseResults.slice(0, 5).map((r) => r.item.title);
  }, [fuseResults]);

  const handleResetFilters = () => {
    setQuery("");
    setActiveTags([]);
    setSortBy("newest");
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  };

  return (
    <Box
      maxWidth="md"
      mx="auto"
      my={4}
      px={{ xs: 2, md: 4 }}
      sx={{ paddingTop: "64px" }} // ensures no overlap with sticky NavBar
    >
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Search Knowledge Base
        </Typography>

        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          loading={loading}
          suggestions={suggestionTitles}
          onSelectSuggestion={handleSelectSuggestion}
        />

        <Divider sx={{ my: 3 }} />

        {tagsLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Filters
            activeTags={activeTags}
            setActiveTags={setActiveTags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onResetFilters={handleResetFilters}
          />
        )}
      </Paper>

      <Fade in={!loading}>
        <Box>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : searchTimeout ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Search took too long. Please try again or refine your query.
            </Alert>
          ) : filteredArticles.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No articles found.
            </Alert>
          ) : (
            <SearchResultsList
              articles={filteredArticles}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              tags={tags}
            />
          )}
        </Box>
      </Fade>

      <Box mt={6}>
        <Footer />
      </Box>
    </Box>
  );
};

export default SearchPage;
