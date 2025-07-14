// src/components/LexicalEditor.tsx
import { useMemo, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { $generateNodesFromDOM } from "@lexical/html";
import type { LexicalEditor } from "lexical";
import DOMPurify from "dompurify";

import { Box, Typography, Stack } from "@mui/material";
import LexicalToolbar from "./LexicalToolbar";

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
}: Props) {
  const editableRef = useRef<HTMLDivElement | null>(null);

  const initialConfig = useMemo(() => {
    return {
      namespace: "CEWKnowledgeEditor",
      theme: {},
      onError: (error: Error) => {
        console.error("Lexical error:", error);
      },
      editorState: (editor: LexicalEditor) => {
        if (!value) return;

        const parser = new DOMParser();
        const dom = parser.parseFromString(value, "text/html");

        editor.update(() => {
          const nodes = $generateNodesFromDOM(editor, dom);
          const root = editor.getRootElement();
          if (root && nodes.length > 0) {
            editor.setEditable(true);
            editor.getEditorState().read(() => {
              const editorRoot = editor.getRootElement();
              if (editorRoot) {
                root.replaceChildren(...dom.body.childNodes);
              }
            });
          }
        });
      },
      nodes: [LinkNode, HeadingNode, ListNode, ListItemNode, QuoteNode],
    };
  }, [value]);

  const handleBlur = () => {
    const rawHtml = editableRef.current?.innerHTML || "";
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    onChange(cleanHtml);
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={4}
      sx={{ width: "100%", alignItems: "flex-start" }}
    >
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
                ref={editableRef}
                aria-label={`${label} input`}
                onBlur={handleBlur}
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
        </LexicalComposer>
      </Box>
    </Stack>
  );
}
