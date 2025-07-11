import { Link } from "react-router-dom";
import {
  Paper,
  Typography,
  Stack,
  Button,
  Box,
  Chip,
  Divider,
} from "@mui/material";
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
      <Stack spacing={2}>
        {paginated.map((article) => (
          <Paper
            key={article.id || crypto.randomUUID()}
            component={Link}
            to={`/article/${article.id ?? "#"}`}
            elevation={3}
            sx={{
              p: 2,
              textDecoration: "none",
              color: "inherit",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <Stack spacing={1}>
              <Typography variant="h6" fontWeight={600}>
                {article.title || "Untitled"}
              </Typography>

              <Box
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    article.description || "<i>No description available</i>"
                  ),
                }}
              />

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
                      sx={{ fontWeight: 500 }}
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

              <Divider sx={{ my: 1 }} />

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
          </Paper>
        ))}
      </Stack>

      {articles.length > pageSize && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
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
