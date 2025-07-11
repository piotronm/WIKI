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
        p: 2,
        borderRadius: 3, 
        textDecoration: "none",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
        },
      }}
    >
      <Stack spacing={0.75}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {category} • {platform}
        </Typography>

        <Box
          sx={{
            mt: 0.5,
            color: "text.secondary",
            fontSize: "0.875rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description),
          }}
        />
      </Stack>
    </Paper>
  );
}
