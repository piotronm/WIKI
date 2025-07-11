// src/pages/UnauthorizedPage.tsx
import { Box, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h3" color="error" gutterBottom>
          403 - Unauthorized
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Sorry, you do not have permission to access this page.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
}
