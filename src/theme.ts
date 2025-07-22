// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0D1B2A",
    },
    secondary: {
      main: "#00B4D8", 
    },
    background: {
      default: "#F4F6F8",
    },
    text: {
      primary: "#E0E1DD",
      secondary: "#A9A9B3",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
