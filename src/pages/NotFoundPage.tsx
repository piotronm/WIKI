// src/pages/NotFoundPage.tsx
import { Box, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function NotFoundPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      px={2}
    >
      <SentimentDissatisfiedIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3} maxWidth={400}>
        Oops! The page you’re looking for doesn’t exist or has been moved. Please
        check the URL or return to the home page.
      </Typography>
      <Stack direction="column" spacing={2} alignItems="center">
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
        >
          Go Back Home
        </Button>
        <Button
          component={Link}
          to="/contact" // Adjust as needed if you have a contact page
          variant="outlined"
          color="secondary"
          size="large"
        >
          Contact Support
        </Button>
      </Stack>
    </Box>
  );
}
