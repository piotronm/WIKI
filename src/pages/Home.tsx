// src/pages/Home.tsx
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function Home() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
      sx={{
        background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, #1B263B)`,
        color: theme.palette.text.primary,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 4, sm: 5 },
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          bgcolor: "background.default",
          borderRadius: 4,
        }}
      >
        <Stack spacing={3} alignItems="center">
          <HelpOutlineIcon
            sx={{
              fontSize: 48,
              color: theme.palette.secondary.main,
              mb: 1,
            }}
          />

          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            color="primary"
            sx={{ lineHeight: 1.2 }}
          >
            CEW Knowledgebase
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mt: -1, mb: 1 }}
          >
            Find answers. Solve problems. Learn faster.
          </Typography>

          <Divider flexItem sx={{ borderColor: "divider", my: 2 }} />

          <Button
            component={Link}
            to="/search"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SearchIcon />}
            fullWidth
            sx={{
              fontWeight: 600,
              py: 1.4,
              fontSize: "1rem",
            }}
          >
            Browse Articles
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
