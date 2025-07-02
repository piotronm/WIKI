// src/components/Footer.tsx
import { Box, Typography } from "@mui/material";
import { APP_NAME, APP_VERSION } from "../config";

const Footer = () => {
  return (
    <Box mt={4} textAlign="center">
      <Typography variant="caption" color="text.secondary">
        {APP_NAME} {APP_VERSION} &copy; {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;
