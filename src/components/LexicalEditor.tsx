import { useMemo, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import DOMPurify from "dompurify";
import { LinkNode } from "@lexical/link";
import type { EditorState, LexicalEditor as LexicalEditorInstance } from "lexical";
import {
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import LexicalToolbar from "./LexicalToolbar";
import { useDebouncedValue } from "../utils/useDebouncedValue";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  showPreview?: boolean;
};

export default function RichTextEditor({
  value,
  onChange,
  label = "Rich Text Editor",
  showPreview = true,
}: Props) {
  const [latestHtml, setLatestHtml] = useState("");

  const debouncedHtml = useDebouncedValue(latestHtml, 2000);

  useMemo(() => {
    if (debouncedHtml) {
      onChange(debouncedHtml);
      console.log("Sanitized HTML:", debouncedHtml);
    }
  }, [debouncedHtml]);

  const initialConfig = useMemo(
    () => ({
      namespace: "CEWKnowledgeEditor",
      onError: (error: Error) => {
        console.error("Lexical error:", error);
      },
      nodes: [LinkNode],
      editorState: () => {
        if (value && typeof value === "string") {
          return (editor: LexicalEditorInstance) => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(value, "text/html");
            const root = editor.getRootElement();
            if (root instanceof HTMLElement) {
              root.innerHTML = dom.body.innerHTML;
            }
          };
        }
      },
    }),
    [value]
  );

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={4}
      sx={{ width: "100%", alignItems: "flex-start" }}
    >
      {/* Editor */}
      <Box
        sx={{
          flex: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          px: 2,
          py: 1,
          backgroundColor: "background.paper",
          minHeight: "200px",
          width: "100%",
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <LexicalComposer initialConfig={initialConfig}>
          <LexicalToolbar />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-label={`${label} input`}
                style={{
                  outline: "none",
                  minHeight: "180px",
                  fontSize: "1rem",
                  padding: "8px 0",
                }}
              />
            }
            placeholder={
              <Typography color="text.secondary">
                Write your content here…
              </Typography>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <LinkPlugin />
          <OnChangePlugin
            onChange={(editorState: EditorState) => {
              editorState.read(() => {
                const rawHtml =
                  document.querySelector("[contenteditable=true]")?.innerHTML || "";
                const cleanHtml = DOMPurify.sanitize(rawHtml);
                setLatestHtml(cleanHtml);
              });
            }}
          />
        </LexicalComposer>
      </Box>

      {/* Optional Preview */}
      {showPreview && (
        <Box
          sx={{
            flex: 1,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            px: 2,
            py: 1,
            minHeight: "200px",
            backgroundColor: "#fafafa",
            width: "100%",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Preview
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{ fontSize: "1rem", color: "text.primary" }}
            dangerouslySetInnerHTML={{ __html: debouncedHtml }}
          />
        </Box>
      )}
    </Stack>
  );
}
