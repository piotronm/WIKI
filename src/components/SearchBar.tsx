// src/components/SearchBar.tsx
import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchBarProps {
  query: string;
  setQuery: (val: string) => void;
  onSearch: () => void;
  loading?: boolean;
  suggestions: string[];
  onSelectSuggestion: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  onSearch,
  loading = false,
  suggestions,
  onSelectSuggestion,
}) => {
  const [localQuery, setLocalQuery] = useState(query);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleSearch = () => {
    if (localQuery.trim().length < 2) {
      setError("Please enter at least 2 characters.");
      return;
    }
    setError("");
    setQuery(localQuery);
    onSearch();
  };

  const handleSuggestionSelect = (value: string | null) => {
    if (value) {
      setLocalQuery(value);
      onSelectSuggestion(value);
    }
  };

  const isSearchDisabled = localQuery.trim().length < 2 || loading;

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        sx={{
          "& .MuiAutocomplete-root": { flexGrow: 1 },
        }}>
        <Autocomplete
          freeSolo
          options={suggestions}
          inputValue={localQuery}
          onInputChange={(_, newInput) => {
            setLocalQuery(newInput);
            if (error) setError("");
          }}
          onChange={(_, value) => handleSuggestionSelect(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={inputRef}
              label="Search Articles"
              variant="outlined"
              placeholder="Search articles by title, content, or tags..."
              fullWidth
              error={Boolean(error)}
              InputProps={{
                ...params.InputProps,
                sx: {
                  fontSize: "1rem", // Increase text size
                  paddingY: 1.5, // Add vertical padding
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: localQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setLocalQuery("");
                        setQuery("");
                        onSearch(); // <- reset filteredArticles to all
                      }}
                      aria-label="Clear search"
                      size="small">
                      <ClearIcon color="action" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSearchDisabled) {
                  handleSearch();
                }
              }}
            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{
            minHeight: 56, // Match TextField height
            px: 3,
            fontSize: "1rem",
          }}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SearchIcon />
            )
          }
          disabled={isSearchDisabled}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </Box>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
};

export default SearchBar;
