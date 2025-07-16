import { useState, useMemo, useEffect } from "react";
import { useArticles } from "../context/ArticlesContext";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Fade,
  Slide,
  Chip,
  Stack,
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
  const [activePlatform, setActivePlatform] = useState<string>("");

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
        const selectedTagIds = tags
          .filter((t) => activeTags.includes(t.name))
          .map((t) => t.id);

        const tagCondition =
          selectedTagIds.length === 0 ||
          inTags.some((tagId) => selectedTagIds.includes(tagId));

        const platformCondition =
          !activePlatform || article.platform === activePlatform;

        const created = new Date(article.dateCreated ?? "");
        const afterStart = startDate ? created >= startDate : true;
        const beforeEnd = endDate ? created <= endDate : true;

        return tagCondition && platformCondition && afterStart && beforeEnd;
      })
      .sort((a, b) => {
        const aTime = new Date(a.dateCreated ?? "").getTime();
        const bTime = new Date(b.dateCreated ?? "").getTime();
        return sortBy === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [
    articles,
    fuseResults,
    activeTags,
    activePlatform,
    startDate,
    endDate,
    sortBy,
    query,
    tags,
  ]);

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
    setActivePlatform("");
  };

  return (
    <Box sx={{ paddingTop: "64px", px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Knowledge Base
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Search support documentation by title, category, or tags.
        </Typography>

        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          loading={loading}
          suggestions={suggestionTitles}
          onSelectSuggestion={handleSelectSuggestion}
        />
      </Paper>

      {/* Main Layout: Filters and Results */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        alignItems="flex-start">
        {/* Filters Sidebar */}
        <Slide direction="right" in={!tagsLoading} mountOnEnter unmountOnExit>
          <Box
            sx={{
              width: "100%",
              maxWidth: 300,
              position: { md: "sticky" },
              top: 100,
              alignSelf: "flex-start",
              backgroundColor: "background.paper",
              borderRadius: 2,
              boxShadow: 2,
              p: 2,
            }}>
            {tagsLoading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Filters
                activeTags={activeTags}
                setActiveTags={setActiveTags}
                activePlatform={activePlatform}
                setActivePlatform={setActivePlatform}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onResetFilters={handleResetFilters}
              />
            )}
          </Box>
        </Slide>

        {/* Results Content */}
        <Box flex={1}>
          <Paper
            elevation={1}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}>
            {/* Search Status Summary */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              flexWrap="wrap"
              rowGap={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                {filteredArticles.length} result
                {filteredArticles.length !== 1 && "s"} found
              </Typography>

              {/* Optional: Chip summary of active filters */}
              {(activeTags.length > 0 || activePlatform) && (
                <Stack direction="row" spacing={1}>
                  {activePlatform && (
                    <Chip
                      label={activePlatform}
                      onDelete={() => setActivePlatform("")}
                    />
                  )}
                  {activeTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() =>
                        setActiveTags((prev) => prev.filter((t) => t !== tag))
                      }
                    />
                  ))}
                </Stack>
              )}
            </Stack>

            {/* Results */}
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
          </Paper>
        </Box>
      </Stack>

      <Box mt={6}>
        <Footer />
      </Box>
    </Box>
  );
};

export default SearchPage;
