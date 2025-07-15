import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticleById } from "../api/articles";
import type { Article as ArticleType } from "../types/Article";
import {
  Accordion,
  Alert,
  AccordionSummary,
  AccordionDetails,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  Stack,
  Paper,
  Fade,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTags } from "../context/TagsContext";
import DOMPurify from "dompurify";

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImages, setShowImages] = useState(false);
  const { tags } = useTags();
  const theme = useTheme();

  const tagNames =
    article?.tags
      ?.map((tagId) => tags.find((tag) => tag.id === tagId)?.name)
      .filter((name): name is string => Boolean(name)) || [];

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error("Failed to fetch article:", err);
        setError("Failed to load article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formattedDate = article?.dateCreated
    ? new Date(article.dateCreated).toLocaleDateString()
    : "";

  const renderImage = (url?: string, label?: string) =>
    url ? (
      <Box
        component="img"
        src={url}
        alt={label || "Article Image"}
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      />
    ) : null;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh">
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box p={4}>
        <Alert severity="info">Article not found.</Alert>
      </Box>
    );
  }

  return (
    <Box
      px={{ xs: 2, md: 4 }}
      py={4}
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        paddingTop: "64px",
      }}
    >
      {/* Back Button */}
      <Tooltip title="Go Back">
        <IconButton
          onClick={() => navigate(-1)}
          size="large"
          sx={{
            mb: 2,
            backgroundColor: theme.palette.action.hover,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: theme.palette.action.selected,
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
  
      {/* Main Article Card */}
      <Fade in>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          {/* Header */}
          <Stack spacing={2} mb={3}>
            {/* Title */}
            <Typography variant="h4" fontWeight="bold">
              {article.title}
            </Typography>
  
            {/* Technical Info */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
              flexWrap="wrap"
            >
              <Typography variant="body2" color="text.secondary">
                <strong>Platform:</strong> {article.platform}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Category:</strong> {article.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Segment:</strong> {article.segment}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>User ID:</strong> {article.userId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong> {formattedDate}
              </Typography>
            </Stack>
  
            {/* Tags */}
            {tagNames.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <LabelOutlinedIcon fontSize="small" color="action" />
                {tagNames.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      borderRadius: "16px",
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    }}
                  />
                ))}
              </Stack>
            )}
          </Stack>
  
          {/* Overview */}
          <Divider textAlign="left" sx={{ my: 4 }}>
            <Chip label="Overview" variant="outlined" />
          </Divider>
  
          {article.description ? (
            <Box
              sx={{ fontSize: "1rem", color: "text.primary", mb: 3 }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(article.description),
              }}
            />
          ) : (
            <Alert severity="info">No description provided.</Alert>
          )}
  
          {/* Solution */}
          <Divider textAlign="left" sx={{ my: 4 }}>
            <Chip
              icon={<CheckCircleOutlineIcon />}
              label="Solution Steps"
              variant="outlined"
            />
          </Divider>
  
          {article.solution ? (
            <Box
              sx={{
                fontSize: "1rem",
                backgroundColor: theme.palette.action.hover,
                p: 2,
                borderRadius: 2,
                whiteSpace: "pre-wrap",
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(article.solution),
              }}
            />
          ) : (
            <Alert severity="info">No solution steps provided.</Alert>
          )}
  
          {/* Images */}
          {(article.imageUrl1 || article.imageUrl2) && (
            <Accordion
              sx={{
                mt: 4,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                "&:before": { display: "none" },
              }}
              onChange={(_, expanded) => setShowImages(expanded)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ImageIcon />
                  <Typography fontWeight="medium">View Images</Typography>
                  {article.imageUrl1 && (
                    <Box
                      component="img"
                      src={article.imageUrl1}
                      alt="Thumbnail"
                      sx={{
                        height: 40,
                        width: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                        ml: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2} mt={2}>
                  {showImages && renderImage(article.imageUrl1, "Image 1")}
                  {showImages && renderImage(article.imageUrl2, "Image 2")}
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}
        </Paper>
      </Fade>
    </Box>
  );
  
  
}
