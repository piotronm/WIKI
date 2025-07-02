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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImages, setShowImages] = useState(false);

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
          mb: 2,
          border: "1px solid #eee",
        }}
      />
    ) : null;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh">
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }
  if (error) return <Typography color="error">{error}</Typography>;
  if (!article) return <Typography>Article not found.</Typography>;

  return (
<Box p={4} bgcolor="#f9f9fb" minHeight="100vh">
      {/* Back Button */}
      <Box mb={3}>
        <Tooltip title="Go Back">
          <IconButton
            onClick={() => navigate(-1)}
            size="large"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: 2,
              padding: 1.5,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}>
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </Box>
      <Paper elevation={3} sx={{ p: 4, bgcolor: "#fff", borderRadius: 2 }}>
        {/* Title */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {article.title}
        </Typography>
        {/* Meta Info: Created Date + Tags */}
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mt={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Created on: {formattedDate}
          </Typography>

          {article.tags && article.tags.length > 0 && (
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
              <LabelOutlinedIcon fontSize="small" color="action" />
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {article.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      bgcolor: "#f5f5f5",
                      borderColor: "#ccc",
                      fontWeight: 500,
                      color: "#333",
                      "& .MuiChip-label": {
                        px: 1.5,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
      <Divider sx={{ my: 3 }} />

      {/* Description */}
      <Stack spacing={2} mb={5}>
        <Typography variant="body1" color="text.primary">
          {article.description ? (
            article.description
          ) : (
            <Alert severity="info">No description provided.</Alert>
          )}
        </Typography>
      </Stack>
      <Divider sx={{ my: 4, borderColor: "#e0e0e0" }} />

      {/* Solution */}
      <Stack spacing={2} mb={5}>
        <Typography
          variant="h6"
          display="flex"
          alignItems="center"
          gutterBottom>
          <CheckCircleOutlineIcon sx={{ mr: 1 }} /> Steps & Solution
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", fontFamily: "monospace" }}>
          {article.solution || "No solution steps provided."}
        </Typography>
      </Stack>
      <Divider sx={{ my: 4, borderColor: "#e0e0e0" }} />

      {/* Image Accordion */}
      {(article.imageUrl1 || article.imageUrl2) && (
        <Paper elevation={2} sx={{ p: 3, mb: 5 }}>
          <Accordion
            disableGutters
            elevation={0}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              "&:before": { display: "none" },
            }}
            onChange={(_, expanded) => setShowImages(expanded)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={1}>
                <ImageIcon />
                <Typography fontWeight="medium">View Images</Typography>

                {article.imageUrl1 && (
                  <Box
                    component="img"
                    src={article.imageUrl1}
                    alt="Image thumbnail"
                    sx={{
                      height: 40,
                      width: 60,
                      objectFit: "cover",
                      borderRadius: 1,
                      ml: 2,
                      border: "1px solid #ccc",
                    }}
                  />
                )}
              </Box>
            </AccordionSummary>
            <Divider sx={{ my: 4, borderColor: "#e0e0e0" }} />
            <AccordionDetails>
              <Stack spacing={2}>
                {showImages &&
                  article.imageUrl1 &&
                  renderImage(article.imageUrl1, "Image 1")}
                {showImages &&
                  article.imageUrl2 &&
                  renderImage(article.imageUrl2, "Image 2")}
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Divider sx={{ my: 4, borderColor: "#e0e0e0" }} />
        </Paper>
      )}

      {/* Technical Details */}
      <Stack spacing={1} mb={5}>
        <Typography
          variant="h6"
          sx={{
            backgroundColor: "#f0f0f0",
            px: 2,
            py: 1,
            borderRadius: 1,
            fontWeight: "medium",
          }}>
          <InfoOutlinedIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Technical Details
        </Typography>

        <Typography variant="body2">
          <strong>Platform:</strong> {article.platform}
        </Typography>
        <Typography variant="body2">
          <strong>Category:</strong> {article.category}
        </Typography>
        <Typography variant="body2">
          <strong>Segment:</strong> {article.segment}
        </Typography>
        <Typography variant="body2">
          <strong>User ID:</strong> {article.userId}
        </Typography>
      </Stack>
    </Box>
  );
}
