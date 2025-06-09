import { useRef, useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  query: string;
  setQuery: (val: string) => void;
  onSearch: () => void;
  loading?: boolean;
};

const SearchBar = ({ query, setQuery, onSearch, loading = false }: Props) => {
  const [localQuery, setLocalQuery] = useState(query);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (localQuery.trim().length < 2) {
      setError("Please enter at least 2 characters.");
      return;
    }
    setError("");
    setQuery(localQuery);
    onSearch();
  };

  const isSearchDisabled = localQuery.trim().length < 2 || loading;

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          fullWidth
          inputRef={inputRef}
          label="Search Articles"
          variant="outlined"
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            if (error) setError("");
          }}
          placeholder="Type at least 2 letters to start searching..."
          size="medium"
          error={Boolean(error)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: localQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setLocalQuery("")}
                  aria-label="Clear search"
                  size="small"
                >
                  <ClearIcon color="action" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SearchIcon />
            )
          }
          disabled={isSearchDisabled}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </Box>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
};

export default SearchBar;
