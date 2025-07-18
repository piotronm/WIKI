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
            elevation={3}
            sx={{
              textDecoration: "none",
              borderRadius: 4,
              overflow: "hidden",
              transition: "all 0.3s ease",
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                boxShadow: 8,
                transform: "translateY(-3px)",
                backgroundColor: "action.hover",
              },
            }}
          >
            <Stack direction="column" spacing={0}>
              {/* Header strip */}
              <Box
                sx={{
                  height: 6,
                  backgroundColor: "primary.main",
                }}
              />
  
              {/* Main Content */}
              <Box sx={{ px: 3, py: 2 }}>
                <Stack spacing={1.5}>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "text.primary" }}
                  >
                    {article.title || "Untitled Article"}
                  </Typography>
  
                  {/* Description */}
                  <Box
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
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
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(article.tags ?? [])
                      .map((id) => tags.find((t: Tag) => t.id === id)?.name)
                      .filter((name): name is string => !!name)
                      .map((name) => (
                        <Chip
                          key={name}
                          label={name}
                          size="small"
                          color="secondary"
                          sx={{
                            fontWeight: 500,
                            backgroundColor: "secondary.light",
                          }}
                        />
                      ))}
                    {(!article.tags || article.tags.length === 0) && (
                      <Typography
                        variant="caption"
                        sx={{ fontStyle: "italic", color: "text.disabled" }}
                      >
                        No tags
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Box>
  
              {/* Footer Metadata */}
              <Box
                sx={{
                  backgroundColor: "grey.100",
                  px: 3,
                  py: 1.5,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1}
                >
                  <Stack direction="row" spacing={2}>
                    {article.platform && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Platform: {article.platform}
                      </Typography>
                    )}
  
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Segment: {article.segment || "Unknown"}
                    </Typography>
                  </Stack>
  
                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ fontWeight: 500 }}
                  >
                    Created:{" "}
                    {article.dateCreated
                      ? new Date(article.dateCreated).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
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
          mt={4}
        >
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Typography variant="body2" color="text.secondary">
            Page {page} of {Math.ceil(articles.length / pageSize)}
          </Typography>
          <Button
            variant="outlined"
            disabled={page >= Math.ceil(articles.length / pageSize)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Stack>
      )}
    </>
  );
  
};

export default SearchResultsList;
