// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ArticlesProvider } from "./context/ArticlesContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>  {/* ✅ Wrap with AuthProvider */}
        <ArticlesProvider>
          <App />
        </ArticlesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
