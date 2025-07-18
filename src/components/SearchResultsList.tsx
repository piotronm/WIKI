import { Link } from "react-router-dom";
import { Paper, Typography, Stack, Button, Box, Chip } from "@mui/material";
import type { Tag } from "../types/Tag";
import type { Article } from "../types/Article";
import DOMPurify from "dompurify";

interface SearchResultsListProps {
  articles: Article[];
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  tags: Tag[];
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  articles,
  page,
  pageSize,
  setPage,
  tags,
}) => {
  const paginated = articles.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Stack spacing={3}>
        {paginated.map((article) => (
          <Paper
            key={article.id || crypto.randomUUID()}
            component={Link}
            to={`/article/${article.id ?? "#"}`}
            elevation={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              textDecoration: "none",
              borderRadius: 3,
              overflow: "hidden",
              transition: "all 0.25s ease",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: 6,
                backgroundColor: "background.default",
              },
            }}>
            {/* Left accent strip */}
            <Box
              sx={{
                width: 6,
                backgroundColor: "primary.main",
                flexShrink: 0,
              }}
            />

            <Box sx={{ p: 3, flex: 1 }}>
              <Stack spacing={1.25}>
                {/* Platform */}
                {article.platform && (
                  <Typography
                    variant="overline"
                    color="secondary"
                    sx={{ fontWeight: 700 }}>
                    {article.platform}
                  </Typography>
                )}

                {/* Title */}
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ color: "text.primary" }}>
                  {article.title || "Untitled"}
                </Typography>

                {/* Description */}
                <Box
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.95rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      article.description || "<i>No description available</i>"
                    ),
                  }}
                />

                {/* Tags */}
                <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
                  {(article.tags ?? [])
                    .map((id) => tags.find((t: Tag) => t.id === id)?.name)
                    .filter((name): name is string => !!name)
                    .map((name) => (
                      <Chip
                        key={name}
                        label={name}
                        size="small"
                        color="secondary"
                        sx={{ fontWeight: 500 }}
                      />
                    ))}
                  {(!article.tags || article.tags.length === 0) && (
                    <Typography
                      variant="caption"
                      sx={{ fontStyle: "italic", color: "text.disabled" }}>
                      No tags
                    </Typography>
                  )}
                </Stack>

                {/* Segment & Date */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1}
                  mt={1.5}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}>
                    Segment: {article.segment || "Unknown"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ fontWeight: 500 }}>
                    Created:{" "}
                    {article.dateCreated
                      ? new Date(article.dateCreated).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "Unknown"}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Pagination */}
      {articles.length > pageSize && (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          mt={4}>
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Typography variant="body2" color="text.secondary">
            Page {page} of {Math.ceil(articles.length / pageSize)}
          </Typography>
          <Button
            variant="outlined"
            disabled={page >= Math.ceil(articles.length / pageSize)}
            onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </Stack>
      )}
    </>
  );
};

export default SearchResultsList;
