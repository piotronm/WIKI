import { Link } from "react-router-dom";
import {
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
  Paper,
  Box,
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
    <ListItem disableGutters>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          p: 2.5,
          borderRadius: 3,
          transition: "0.3s ease",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}>
        <Stack spacing={2}>
          {/* Title & Expand */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ color: "text.primary", wordBreak: "break-word" }}>
              {article.title}
            </Typography>

            <Tooltip
              title={
                isExpanded ? "Collapse description" : "Expand description"
              }>
              <IconButton
                onClick={() => toggleExpanded(article.id)}
                size="small"
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  backgroundColor: isExpanded
                    ? theme.palette.action.selected
                    : "transparent",
                }}>
                {isExpanded ? <ExpandLessIcon /> : <MoreHorizIcon />}
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Description */}
          <Fade in={isExpanded} timeout={300}>
            <Collapse in={isExpanded}>
              <Box sx={{ overflowX: "hidden" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    mt: 1,
                  }}>
                  {stripHtml(article.description)}
                </Typography>
              </Box>
            </Collapse>
          </Fade>

          {/* Tags */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {tagNames.length > 0 ? (
              tagNames.map((name) => (
                <Chip key={name} label={name} size="small" color="secondary" />
              ))
            ) : (
              <Typography
                variant="body2"
                color="text.disabled"
                fontStyle="italic">
                No tags
              </Typography>
            )}
          </Stack>

          {/* Badges */}
          <Stack direction="row" spacing={1}>
            {getBadges()}
          </Stack>

          {/* Platform / Segment */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
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

          {/* Admin Controls */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="flex-end"
            alignItems="flex-start">
            <Button
              component={Link}
              to={`/article/${article.id}`}
              variant="outlined"
              size="small"
              color="primary"
              startIcon={<VisibilityIcon />}
              fullWidth={isSmallScreen}>
              View
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => onEdit(article)}
              fullWidth={isSmallScreen}>
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(article.id)}
              fullWidth={isSmallScreen}>
              Delete
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </ListItem>
  );
};

export default AdminArticleListItem;
