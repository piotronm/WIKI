// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ArticlesProvider } from "./context/ArticlesContext";
import { AuthProvider } from "./context/AuthContext";
import { TagsProvider } from "./context/TagsContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/KB_Service">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <TagsProvider>
            <ArticlesProvider>
              <App />
            </ArticlesProvider>
          </TagsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
