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
import type { Tag } from "../types/Tag";
import type { Article } from "../types/Article";

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
      <Paper elevation={2}>
        <List disablePadding>
          {paginated.map((article) => (
            <ListItem
              key={article.id || crypto.randomUUID()}
              component={Link}
              to={`/article/${article.id ?? "#"}`}
              divider
              sx={{
                "&:hover": { backgroundColor: "action.hover" },
                textDecoration: "none",
                color: "inherit",
              }}>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="span">
                    {article.title || "Untitled"}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="span">
                      {(
                        article.description || "No description available"
                      ).slice(0, 100)}
                      ...
                    </Typography>
                    <br />
                    <Typography
                      variant="caption"
                      component="span"
                      sx={{ fontWeight: "bold", color: "text.primary" }}>
                      Tags:
                    </Typography>{" "}
                    <Typography
                      variant="caption"
                      component="span"
                      sx={{ color: "secondary.main" }}>
                      {(article.tags ?? [])
                        .map((id) => tags.find((t: Tag) => t.id === id)?.name)
                        .filter((name): name is string => !!name)
                        .join(", ") || "None"}
                    </Typography>
                    <br />
                    <Typography
                      variant="caption"
                      color="primary.main"
                      component="span"
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
          mt={2}>
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Typography variant="body2">
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
