// src/components/ArticleListItem.tsx
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  ListItem,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Article } from "../types/Article";

interface ArticleListItemProps {
  article: Article;
  tagNames: string[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({
  article,
  tagNames,
  onEdit,
  onDelete,
}) => {
  return (
    <ListItem
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      divider
    >
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {article.title}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
          {tagNames.length > 0 ? (
            tagNames.map((name) => (
              <Chip key={name} label={name} size="small" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No tags
            </Typography>
          )}
        </Stack>
      </Box>
      <Box display="flex" gap={1}>
        <Button
          component={Link}
          to={`/article/${article.id}`}
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<VisibilityIcon />}
        >
          View
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          startIcon={<EditIcon />}
          onClick={() => onEdit(article)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(article.id)}
        >
          Delete
        </Button>
      </Box>
    </ListItem>
  );
};

export default ArticleListItem;
