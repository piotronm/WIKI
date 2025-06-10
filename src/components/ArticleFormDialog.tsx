// src/components/ArticleFormDialog.tsx
import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import type { Article } from "../context/ArticlesContext";

interface ArticleFormDialogProps {
  form: Partial<Article> & { tagsInput?: string };
  onChange: (form: Partial<Article> & { tagsInput?: string }) => void;
  onSubmit: () => void;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const ArticleFormDialog: React.FC<ArticleFormDialogProps> = ({
  form,
  onChange,
  onSubmit,
  onClose,
  onKeyDown,
}) => {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (form && titleRef.current) {
      titleRef.current.focus();
    }
  }, [form]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...form, title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...form, content: e.target.value });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...form, tagsInput: e.target.value });
  };

  const dialogTitle = form?.id ? "Edit Article" : "New Article";

  return (
    <Dialog
      open={!!form}
      onClose={onClose}
      fullScreen
      aria-labelledby="article-form-dialog-title"
    >
      <DialogTitle id="article-form-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent onKeyDown={onKeyDown}>
        <Stack spacing={2} mt={2}>
          <TextField
            inputRef={titleRef}
            label="Title"
            value={form?.title || ""}
            onChange={handleTitleChange}
            fullWidth
            required
            error={!form?.title?.trim()}
            helperText={!form?.title?.trim() ? "Title is required" : ""}
          />
          <TextField
            label="Content"
            value={form?.content || ""}
            onChange={handleContentChange}
            fullWidth
            multiline
            rows={4}
            required
            error={!form?.content?.trim()}
            helperText={!form?.content?.trim() ? "Content is required" : ""}
          />
          <TextField
            label="Tags (comma separated)"
            value={form?.tagsInput || ""}
            onChange={handleTagsChange}
            fullWidth
            placeholder="e.g. react, frontend, notes"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          aria-label="Cancel article creation"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onSubmit}
          aria-label="Save article"
        >
          Save Article
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArticleFormDialog;
