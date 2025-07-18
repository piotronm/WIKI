// src/components/ArticleCard.tsx
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import type { Article } from "../types/Article";
import {
  Paper,
  Typography,
  Box,
  Stack,
  useTheme,
  Divider,
} from "@mui/material";

type Props = {
  article: Article;
};

export default function ArticleCard({ article }: Props) {
  const { id, title, platform, category, description } = article;
  const theme = useTheme();

  return (
    <Paper
      component={Link}
      to={`/article/${id}`}
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "row",
        textDecoration: "none",
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      {/* Left Accent Strip */}
      <Box
        sx={{
          width: 6,
          backgroundColor: theme.palette.primary.main,
        }}
      />

      {/* Content */}
      <Box sx={{ p: 2, flex: 1 }}>
        <Stack spacing={1}>
          {/* Title */}
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            {title}
          </Typography>

          {/* Meta Info */}
          <Typography variant="body2" color="text.secondary">
            {category} &nbsp;|&nbsp; {platform}
          </Typography>

          <Divider />

          {/* Description Preview */}
          <Box
            sx={{
              color: "text.secondary",
              fontSize: "0.95rem",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mt: 0.5,
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          />
        </Stack>
      </Box>
    </Paper>
  );
}
