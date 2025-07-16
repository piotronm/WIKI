// src/components/Filters.tsx
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { useTags } from "../context/TagsContext";
import { useArticles } from "../context/ArticlesContext";

type FiltersProps = {
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
  activePlatform: string;
  setActivePlatform: (platform: string) => void;
  sortBy: "newest" | "oldest";
  setSortBy: (val: "newest" | "oldest") => void;
  onResetFilters: () => void;
};

const Filters = ({
  activeTags,
  setActiveTags,
  activePlatform,
  setActivePlatform,
  sortBy,
  setSortBy,
  onResetFilters,
}: FiltersProps) => {
  const { tags } = useTags();
  const { articles } = useArticles();

  const handleTagClick = (tag: string) => {
    const updatedTags = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];
    setActiveTags(updatedTags);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <span style={{ fontWeight: 600, fontSize: "1rem" }}>Filters</span>
  
        <FormControl size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            label="Sort By"
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Box>
  
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
        }}
      >
        <Stack spacing={3}>
          {/* Tags Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              gutterBottom
              color="text.secondary"
            >
              Tags
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {tags.map((tag) => {
                if (!tag.id) console.warn("Missing tag ID", tag);
                return (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    color={
                      activeTags.includes(tag.name) ? "primary" : "default"
                    }
                    onClick={() => handleTagClick(tag.name)}
                    clickable
                  />
                );
              })}
            </Box>
          </Box>
  
          {/* Platform Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              gutterBottom
              color="text.secondary"
            >
              Platform
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Array.from(
                new Set(articles.map((a) => a.platform).filter(Boolean))
              )
                .sort()
                .map((platform) => (
                  <Chip
                    key={platform}
                    label={platform}
                    color={
                      activePlatform === platform ? "primary" : "default"
                    }
                    onClick={() =>
                      setActivePlatform(
                        activePlatform === platform ? "" : platform
                      )
                    }
                    clickable
                  />
                ))}
            </Box>
          </Box>
  
          {/* Reset Button */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
  
};

export default Filters;
