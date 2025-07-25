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
import {
  platformSegmentMap,
  platformOptions,
} from "../config/platformSegmentMap";
import CancelIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

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
  const descriptionRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [tagLoadError, setTagLoadError] = useState(false);

  useEffect(() => {
    if (form?.id === "" && titleRef.current) {
      titleRef.current.focus();
    }
    console.log("Form state in dialog:", form);
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
  console.log("form received in dialog:", form);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...form, title: e.target.value });
  };

  const handleTagChange = (e: SelectChangeEvent<string[]>) => {
    const uniqueTags = Array.from(new Set(e.target.value as string[]));
    onChange({ ...form, tags: uniqueTags });
  };

  const isExistingArticle = Boolean(form?.id?.trim());
  const filteredSegmentOptions = platformSegmentMap[form.platform || ""] || [];

  const handleValidationAndSubmit = () => {
    const errors: { [key: string]: boolean } = {};

    if (!form.title?.trim()) errors.title = true;
    if (!form.description?.trim()) errors.description = true;
    if (!form.solution?.trim()) errors.solution = true;

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
      aria-labelledby="article-form-dialog-title"
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          borderRadius: 0,
        },
      }}
    >
      {/* Title Bar */}
      <Box
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle
          id="article-form-dialog-title"
          sx={{ m: 0, p: 0, fontSize: "1.5rem", fontWeight: 700 }}
        >
          {isExistingArticle ? "Edit Article" : "Create New Article"}
        </DialogTitle>
        <Button
          onClick={onClose}
          startIcon={<CancelIcon />}
          color="inherit"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
      </Box>
  
      {/* Loading */}
      {loadingTags ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Form Body */}
          <DialogContent
            onKeyDown={onKeyDown}
            sx={{
              p: { xs: 2, md: 4 },
              backgroundColor: "background.default",
            }}
          >
            <Stack
              spacing={4}
              sx={{
                maxWidth: "800px",
                mx: "auto",
                backgroundColor: "background.paper",
                borderRadius: 3,
                boxShadow: 3,
                p: { xs: 2, md: 4 },
              }}
            >
              {tagLoadError && (
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
                      }}
                    >
                      Retry
                    </Button>
                  }
                >
                  Failed to load tags. Saving is disabled until the issue is
                  resolved.
                </Alert>
              )}
  
              {/* Title */}
              <TextField
                inputRef={titleRef}
                label="Title"
                variant="outlined"
                value={form?.title || ""}
                onChange={handleTitleChange}
                fullWidth
                required
                error={validationErrors.title}
                helperText={validationErrors.title ? "Title is required" : ""}
              />
  
              {/* Description */}
              <Box ref={descriptionRef}>
                <RichTextEditor
                  key={`desc-${form.id}`}
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
  
              {/* Tags */}
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
                  )}
                >
                  {availableTags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
  
              {/* Platform */}
              <Box ref={platformRef}>
                <FormControl fullWidth>
                  <InputLabel id="platform-label">Platform</InputLabel>
                  <Select
                    labelId="platform-label"
                    value={form?.platform || ""}
                    label="Platform"
                    onChange={(e) => {
                      const newPlatform = e.target.value;
                      if (!platformOptions.includes(newPlatform)) return;
                      const validSegments = platformSegmentMap[newPlatform] || [];
                      const currentSegment = form.segment || "";
  
                      onChange({
                        ...form,
                        platform: newPlatform,
                        segment: validSegments.includes(currentSegment)
                          ? currentSegment
                          : "",
                      });
                    }}
                  >
                    {platformOptions.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
  
              {/* Segment */}
              {form.platform && filteredSegmentOptions.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel id="segment-label">Segment</InputLabel>
                  <Select
                    labelId="segment-label"
                    value={form?.segment || ""}
                    label="Segment"
                    onChange={(e) =>
                      onChange({ ...form, segment: e.target.value })
                    }
                  >
                    {filteredSegmentOptions.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
  
              {/* Solution */}
              <Box ref={solutionRef}>
                <RichTextEditor
                  key={`sol-${form.id}`}
                  label="Steps & Solution"
                  showPreview={true}
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
  
          {/* Footer Actions */}
          <DialogActions
            sx={{
              px: 4,
              py: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              startIcon={<CancelIcon />}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
  
            <Button
              variant="contained"
              color="primary"
              onClick={handleValidationAndSubmit}
              startIcon={<SaveIcon />}
              disabled={tagLoadError || availableTags.length === 0}
              sx={{
                fontWeight: 600,
                px: 3,
                borderRadius: "8px",
                boxShadow: 2,
                "&:disabled": {
                  backgroundColor: "action.disabledBackground",
                  color: "text.disabled",
                },
              }}
            >
              Save Article
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
  
};

export default ArticleFormDialog;
