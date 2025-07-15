// src/config.ts

// Use env variable if provided (via .env or Jenkins), otherwise fall back to default
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";
export const APP_NAME = "CEW Knowledgebase";
