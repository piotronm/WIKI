// src/pages/Home.tsx
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  useTheme,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function Home() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1B263B 100%)`,
        px: 2,
        py: 6,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: 1000,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Left panel */}
        <Box
          sx={{
            bgcolor: theme.palette.secondary.main,
            color: "#fff",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: { xs: 4, md: 8 },
            px: 3,
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            textAlign="center"
            sx={{ lineHeight: 1.2 }}
          >
            CEW Knowledgebase
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2, maxWidth: 280 }}
          >
            Supporting your success with searchable guides, how-to articles, and curated platform knowledge.
          </Typography>
        </Box>

        {/* Right panel */}
        <Box
          sx={{
            flex: 1,
            bgcolor: theme.palette.background.default,
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: theme.palette.primary.main }}
          >
            Get Started
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Quickly find troubleshooting steps, usage tips, and internal solutions in one place.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack direction="column" spacing={2}>
            <Button
              component={Link}
              to="/search"
              variant="contained"
              size="large"
              color="primary"
              startIcon={<SearchIcon />}
              fullWidth
              sx={{ fontWeight: "bold", py: 1.4 }}
            >
              Browse Articles
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
