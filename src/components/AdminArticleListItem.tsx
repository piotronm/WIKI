import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  ListItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Collapse,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type { Article } from "../types/Article";

interface AdminArticleListItemProps {
  article: Article;
  tagNames: string[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  isExpanded: boolean;
  toggleExpanded: (id: string) => void;
}

const AdminArticleListItem: React.FC<AdminArticleListItemProps> = ({
  article,
  tagNames,
  onEdit,
  onDelete,
  isExpanded,
  toggleExpanded,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const hasImages = !!article.imageUrl1 || !!article.imageUrl2;
  const hasSolution = !!article.solution;

  const getBadges = () => {
    const badges = [];

    if (hasImages) {
      badges.push(
        isSmallScreen ? (
          <Tooltip title="Has Images" key="image">
            <ImageIcon fontSize="small" color="action" />
          </Tooltip>
        ) : (
          <Chip
            key="image"
            icon={<ImageIcon fontSize="small" />}
            label="Images"
            size="small"
            variant="outlined"
          />
        )
      );
    }

    if (hasSolution) {
      badges.push(
        isSmallScreen ? (
          <Tooltip title="Has Solution" key="solution">
            <CheckCircleIcon fontSize="small" color="action" />
          </Tooltip>
        ) : (
          <Chip
            key="solution"
            icon={<CheckCircleIcon fontSize="small" />}
            label="Solution"
            size="small"
            color="success"
            variant="outlined"
          />
        )
      );
    }

    return badges;
  };

  return (
    <ListItem
      divider
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 2,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      <Box flex={1} minWidth={250}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ wordBreak: "break-word" }}
        >
          {article.title}
        </Typography>

        <Box display="flex" alignItems="center">
          <Collapse in={isExpanded} collapsedSize={48}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: isExpanded ? "normal" : "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {article.description}
            </Typography>
          </Collapse>
          <IconButton
            size="small"
            onClick={() => toggleExpanded(article.id)}
            aria-label={isExpanded ? "Collapse description" : "Expand description"}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

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

        <Stack direction="row" spacing={1} mt={1}>
          {getBadges()}
        </Stack>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
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

export default AdminArticleListItem;
