// src/components/SearchResultsList.tsx
import { Link } from "react-router-dom";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import type { Article } from "../context/ArticlesContext";

interface SearchResultsListProps {
  articles: Article[];
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  articles,
  page,
  pageSize,
  setPage,
}) => {
  const paginated = articles.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Paper elevation={2}>
        <List disablePadding>
          {paginated.map((article) => (
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
                    <Typography variant="body2" color="textSecondary">
                      {article.content.slice(0, 100)}...
                    </Typography>
                    <br />
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      Tags:
                    </Typography>{" "}
                    <Typography
                      variant="caption"
                      sx={{ color: "secondary.main" }}
                    >
                      {(article.tags || []).join(", ")}
                    </Typography>
                    <br />
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{ fontWeight: 500 }}
                    >
                      Created:{" "}
                      {new Date(article.createdAt ?? "").toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {articles.length > pageSize && (
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
