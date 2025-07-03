//src/components/ArticleFormdialog.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
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
  Chip,
  Box,
  type SelectChangeEvent,
} from "@mui/material";
import type { Article } from "../types/Article";
import { fetchTags } from "../api/articles";

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
  const [tagLoadError, setTagLoadError] = useState(false);

  useEffect(() => {
    if (form?.id === "" && titleRef.current) {
      titleRef.current.focus();
    }
  }, [form?.id]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsFromDB = await fetchTags();
        setAvailableTags(tagsFromDB);
        setTagLoadError(false);
      } catch (err) {
        console.error("Failed to load tags from API:", err);
        setAvailableTags([]);
        setTagLoadError(true);
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
    const uniqueTags = Array.from(new Set(e.target.value as string[]));
    onChange({ ...form, tags: uniqueTags });
  };

  const dialogTitle = form?.id ? "Edit Article" : "New Article";

  return (
    <Dialog
      open={!!form}
      onClose={onClose}
      fullScreen
      aria-labelledby="article-form-dialog-title">
      <DialogTitle id="article-form-dialog-title">{dialogTitle}</DialogTitle>

      {loadingTags ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogContent onKeyDown={onKeyDown}>
            <Stack spacing={2} mt={2}>
              {tagLoadError && (
                <Box>
                  <Alert
                    severity="error"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setLoadingTags(true);
                          setTagLoadError(false);
                          fetchTags()
                            .then((tags) => setAvailableTags(tags))
                            .catch((err) => {
                              console.error("Retry failed:", err);
                              setAvailableTags([]);
                              setTagLoadError(true);
                            })
                            .finally(() => setLoadingTags(false));
                        }}>
                        Retry
                      </Button>
                    }>
                    Failed to load tags. Saving is disabled until the issue is
                    resolved.
                  </Alert>
                </Box>
              )}

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

              {/* Tag Selector */}
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
                      {[...new Set(selected as string[])].map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}>
                  {tagLoadError ? (
                    <MenuItem disabled>
                      Failed to load tags from server
                    </MenuItem>
                  ) : availableTags.length === 0 ? (
                    <MenuItem disabled>No tags available</MenuItem>
                  ) : (
                    availableTags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.name}>
                        {tag.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
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
              aria-label="Save article"
              disabled={tagLoadError || availableTags.length === 0}>
              Save Article
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ArticleFormDialog;
