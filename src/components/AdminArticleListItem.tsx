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
  Fade,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type { Article } from "../types/Article";
import { stripHtml } from "../utils/stripHtml";

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
      }}>
      <Box flex={1} minWidth={250}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ wordBreak: "break-word" }}>
            {article.title}
          </Typography>
          <Tooltip
            title={isExpanded ? "Collapse description" : "Expand description"}>
            <IconButton
              size="small"
              onClick={() => toggleExpanded(article.id)}
              sx={{
                ml: 1,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                backgroundColor: isExpanded
                  ? theme.palette.action.selected
                  : "transparent",
                transition: "background-color 0.2s",
              }}
              aria-label="Toggle description">
              {isExpanded ? <ExpandLessIcon /> : <MoreHorizIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Fade in={isExpanded} timeout={300}>
          <Collapse in={isExpanded}>
            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
              sx={{ whiteSpace: "pre-wrap" }}>
              {stripHtml(article.description)}
            </Typography>
          </Collapse>
        </Fade>

        <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
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
        <Stack direction="row" spacing={1} mt={1}>
          {article.platform && (
            <Chip
              label={`Platform: ${article.platform}`}
              size="small"
              color="info"
              variant="outlined"
            />
          )}
          {article.segment && (
            <Chip
              label={`Segment: ${article.segment}`}
              size="small"
              color="default"
              variant="outlined"
            />
          )}
        </Stack>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Button
          component={Link}
          to={`/article/${article.id}`}
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<VisibilityIcon />}>
          View
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          startIcon={<EditIcon />}
          onClick={() => onEdit(article)}>
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(article.id)}>
          Delete
        </Button>
      </Box>
    </ListItem>
  );
};

export default AdminArticleListItem;
