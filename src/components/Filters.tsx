// src/components/Filters.tsx
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
  Stack,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type FiltersProps = {
  allTags: string[];
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
  sortBy: "newest" | "oldest";
  setSortBy: (val: "newest" | "oldest") => void;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  onResetFilters: () => void;
};

const Filters = ({
  allTags,
  activeTags,
  setActiveTags,
  sortBy,
  setSortBy,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onResetFilters,
}: FiltersProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleTagClick = (tag: string) => {
    const updatedTags = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];
    setActiveTags(updatedTags);
  };

  return (
    <Box mt={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Box>
          <IconButton
            onClick={() => setFiltersVisible((prev) => !prev)}
            size="small"
          >
            {filtersVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <span style={{ fontWeight: 600, fontSize: "1rem" }}>
            Filters
          </span>
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

      <Collapse in={filtersVisible}>
        <Stack spacing={2} mt={1}>
          {/* Tags */}
          <Box display="flex" flexWrap="wrap" gap={1}>
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                color={activeTags.includes(tag) ? "primary" : "default"}
                onClick={() => handleTagClick(tag)}
                clickable
              />
            ))}
          </Box>

          {/* Date Filters */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          {/* Reset Filters Button */}
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
      </Collapse>
    </Box>
  );
};

export default Filters;
