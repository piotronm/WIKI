// src/pages/Home.tsx
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" fontWeight="bold">
            Welcome to the CEW Knowledge Base
          </Typography>
          <Typography variant="body1" textAlign="center">
            Access helpful articles and find answers to your questions.
          </Typography>
          <Stack direction="column" spacing={2} width="100%">
            <Button
              component={Link}
              to="/search"
              variant="contained"
              color="primary"
              fullWidth
            >
              Search Knowledge Base
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              fullWidth
            >
              Login
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
