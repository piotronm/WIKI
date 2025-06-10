import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";

export default function Home() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(to bottom right, #e3f2fd, #ffffff)",
      }}
      px={2}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          backgroundColor: "#ffffffdd", // slight transparency for a modern touch
          borderRadius: 3,
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" fontWeight="bold" color="primary">
            Welcome to the CEW Knowledge Base
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Your hub for helpful articles, guides, and solutions.
          </Typography>
          <Stack direction="column" spacing={2} width="100%">
            <Button
              component={Link}
              to="/search"
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              fullWidth
              sx={{
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Search Knowledge Base
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              startIcon={<LoginIcon />}
              fullWidth
              sx={{
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              Login
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
