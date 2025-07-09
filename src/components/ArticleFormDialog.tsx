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
import RichTextEditor from "./LexicalEditor";

const [validationErrors, setValidationErrors] = useState<{
  [key: string]: boolean;
}>({});
const descriptionRef = useRef<HTMLDivElement>(null);
const solutionRef = useRef<HTMLDivElement>(null);
const platformRef = useRef<HTMLDivElement>(null);

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

const platformOptions = [
  "",
  "macOS",
  "iOS",
  "Android",
  "Salesforce",
  "Azure",
  "Other",
];

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

  const handleTagChange = (e: SelectChangeEvent<string[]>) => {
    const uniqueTags = Array.from(new Set(e.target.value as string[]));
    onChange({ ...form, tags: uniqueTags });
  };

  const dialogTitle = form?.id ? "Edit Article" : "New Article";

  const handleValidationAndSubmit = () => {
    const errors: { [key: string]: boolean } = {};

    if (!form.title?.trim()) errors.title = true;
    if (!form.description?.trim()) errors.description = true;
    if (!form.solution?.trim()) errors.solution = true;
    if (!form.platform?.trim()) errors.platform = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.title && titleRef.current)
        titleRef.current.scrollIntoView({ behavior: "smooth" });
      else if (errors.description && descriptionRef.current)
        descriptionRef.current.scrollIntoView({ behavior: "smooth" });
      else if (errors.platform && platformRef.current)
        platformRef.current.scrollIntoView({ behavior: "smooth" });
      else if (errors.solution && solutionRef.current)
        solutionRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    onSubmit();
  };

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
            <Stack spacing={2} sx={{ mt: 2 }}>
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
              <Box ref={descriptionRef}>
                <RichTextEditor
                  label="Description"
                  showPreview={false}
                  value={form.description || ""}
                  onChange={(val) => onChange({ ...form, description: val })}
                />
                {validationErrors.description && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Description is required
                  </Alert>
                )}
              </Box>

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
                      {(selected as string[]).map((id) => {
                        const tag = availableTags.find((t) => t.id === id);
                        return <Chip key={id} label={tag?.name || id} />;
                      })}
                    </Box>
                  )}>
                  {availableTags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box ref={platformRef}>
                <FormControl fullWidth required>
                  <InputLabel id="platform-label">Platform</InputLabel>
                  <Select
                    labelId="platform-label"
                    value={form?.platform || ""}
                    label="Platform"
                    onChange={(e) =>
                      onChange({ ...form, platform: e.target.value })
                    }
                    error={!form?.platform}>
                    {platformOptions.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </Select>
                  {!form?.platform && (
                    <Box pl={2} pt={0.5}>
                      <Alert severity="error" variant="outlined">
                        Platform is required
                      </Alert>
                    </Box>
                  )}
                </FormControl>
              </Box>
              <TextField
                label="Segment"
                value={form?.segment || ""}
                onChange={(e) => onChange({ ...form, segment: e.target.value })}
                fullWidth
                placeholder="e.g. Internal Support, Customer-Facing, etc."
              />
              <Box ref={solutionRef}>
                <RichTextEditor
                  label="Steps & Solution"
                  showPreview
                  value={form.solution || ""}
                  onChange={(val) => onChange({ ...form, solution: val })}
                />
                {validationErrors.solution && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Solution is required
                  </Alert>
                )}
              </Box>
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
              onClick={handleValidationAndSubmit}
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
