import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Typography,
  Chip,
  Box,
  type SelectChangeEvent,
} from "@mui/material";
import type { Article } from "../types/Article";
import { fetchTags, wasMockUsedForTags } from "../api/articles";

type Tag = {
  id: string;
  name: string;
};

interface ArticleFormDialogProps {
  form: Partial<Article>;
  onChange: (form: Partial<Article>) => void;
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
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    if (form && titleRef.current) {
      titleRef.current.focus();
    }
  }, [form]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsFromDB = await fetchTags();
        setAvailableTags(tagsFromDB);
      } catch (err) {
        console.error("Failed to load tags from API:", err);
        setAvailableTags([]);
      } finally {
        setLoadingTags(false);
      }
    };

    loadTags();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...form, title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...form, description: e.target.value });
  };

  const handleTagChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value as string[];
    onChange({ ...form, tags: value });
  };

  const dialogTitle = form?.id ? "Edit Article" : "New Article";

  return (
    <Dialog
      open={!!form}
      onClose={onClose}
      fullScreen
      aria-labelledby="article-form-dialog-title">
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
            label="Description"
            value={form?.description || ""}
            onChange={handleDescriptionChange}
            fullWidth
            multiline
            rows={4}
            required
            error={!form?.description?.trim()}
            helperText={
              !form?.description?.trim() ? "Description is required" : ""
            }
          />

          {/* Tag Selector with Label and Fallback */}
          <FormControl fullWidth>
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              label="Tags"
              multiple
              value={form.tags || []}
              onChange={handleTagChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}>
              {availableTags.length === 0 && !loadingTags ? (
                <MenuItem disabled>No tags available</MenuItem>
              ) : (
                availableTags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.name}>
                    {tag.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {wasMockUsedForTags() && (
              <Typography variant="caption" color="warning.main">
                Using mock tags (fallback)
              </Typography>
            )}

            {loadingTags && (
              <Typography variant="caption" color="text.secondary" mt={1}>
                <CircularProgress size={16} sx={{ mr: 1 }} /> Loading tags...
              </Typography>
            )}
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          aria-label="Cancel article creation">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onSubmit}
          aria-label="Save article">
          Save Article
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArticleFormDialog;
