// src/components/Filters.tsx
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTags } from "../context/TagsContext";

type FiltersProps = {
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
  sortBy: "newest" | "oldest";
  setSortBy: (val: "newest" | "oldest") => void;
  onResetFilters: () => void;
};

const Filters = ({
  activeTags,
  setActiveTags,
  sortBy,
  setSortBy,
  onResetFilters,
}: FiltersProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { tags } = useTags();

  const handleTagClick = (tag: string) => {
    const updatedTags = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];
    setActiveTags(updatedTags);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFiltersVisible(false);
      }
    };

    if (filtersVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filtersVisible]);

  return (
    <Box mt={2} position="relative">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}>
        <Box>
          <IconButton
            onClick={() => setFiltersVisible((prev) => !prev)}
            size="small">
            {filtersVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <span style={{ fontWeight: 600, fontSize: "1rem" }}>Filters</span>
        </Box>

        <FormControl size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            label="Sort By">
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filtersVisible && (
        <Box
          ref={dropdownRef}
          position="absolute"
          top="100%"
          left={0}
          width="100%"
          zIndex={10}
          sx={{
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #ddd",
            borderRadius: 1,
            boxShadow: 4,
            p: 2,
            mt: 1,
          }}>
          <Stack spacing={2}>
            {/* Tags */}
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

            {/* Reset Button */}
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                onClick={onResetFilters}>
                Reset Filters
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Filters;
