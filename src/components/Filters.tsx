import { useState } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type FiltersProps = {
  allTags: string[];
  activeTags: Set<string>;
  onTagClick: (tag: string) => void;
  sortBy: "newest" | "oldest";
  setSortBy: (val: "newest" | "oldest") => void;
};

const Filters = ({
  allTags,
  activeTags,
  onTagClick,
  sortBy,
  setSortBy,
}: FiltersProps) => {
  const [tagsVisible, setTagsVisible] = useState(false);

  return (
    <Box mt={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Box>
          <IconButton onClick={() => setTagsVisible((prev) => !prev)} size="small">
            {tagsVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <span style={{ fontWeight: 600, fontSize: "1rem" }}>Filters</span>
        </Box>
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
      <Collapse in={tagsVisible}>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {allTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              color={activeTags.has(tag) ? "primary" : "default"}
              onClick={() => onTagClick(tag)}
              clickable
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default Filters;
