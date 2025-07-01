// src/components/Footer.tsx
import { Box, Typography } from "@mui/material";

type FooterProps = {
  usingFallback: boolean;
};

const Footer = ({ usingFallback }: FooterProps) => {
  if (!usingFallback) return null;

  return (
    <Box mt={4} textAlign="center">
      <Typography variant="caption" color="text.secondary">
        Displaying mock data due to unavailable API.
      </Typography>
    </Box>
  );
};

export default Footer;
