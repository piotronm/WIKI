import {
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Filters from "./Filters";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  form: any;
  handleNewArticle: () => void;
  handleExport: () => void;
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
  activePlatform: string;
  setActivePlatform: (platform: string) => void;
  sortBy: "newest" | "oldest";
  setSortBy: (val: "newest" | "oldest") => void;
  setQuery: (q: string) => void;
};

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  form,
  handleNewArticle,
  handleExport,
  activeTags,
  setActiveTags,
  activePlatform,
  setActivePlatform,
  sortBy,
  setSortBy,
  setQuery,
}: Props) {
  return (
    <Box
      sx={{
        width: { md: sidebarOpen ? 320 : 64 },
        flexShrink: 0,
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        transition: "width 0.3s ease",
        px: sidebarOpen ? 3 : 1,
        py: sidebarOpen ? 4 : 2,
        display: { xs: "none", md: "block" },
      }}>
      {/* Header with Toggle */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}>
        <Typography variant="h5" fontWeight={700}>
          {sidebarOpen ? "Manage Articles" : ""}
        </Typography>
        <Tooltip title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
          <IconButton
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            size="small"
            sx={{
              ml: 1,
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "50%",
              boxShadow: 1,
              transition: "all 0.3s ease",
              transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
            }}>
            {sidebarOpen ? (
              <ChevronLeftIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {sidebarOpen && (
        <>
          <Stack spacing={1.5} mb={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleNewArticle}>
              + Add New Article
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleExport}
              disabled={!!form}>
              Export Articles
            </Button>
          </Stack>

          <Filters
            activeTags={activeTags}
            setActiveTags={setActiveTags}
            activePlatform={activePlatform}
            setActivePlatform={setActivePlatform}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onResetFilters={() => {
              setActiveTags([]);
              setActivePlatform("");
              setSortBy("newest");
              setQuery("");
            }}
          />
        </>
      )}
    </Box>
  );
}
