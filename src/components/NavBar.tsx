import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function NavBar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo and Brand */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <HomeIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component={Link} to="/" color="inherit" sx={{ textDecoration: "none" }}>
            CEW Knowledgebase
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{
            textTransform: "none",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
          }}
        >
          Home
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/search"
          startIcon={<SearchIcon />}
          sx={{
            textTransform: "none",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
          }}
        >
          Search
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/admin"
          startIcon={<AdminPanelSettingsIcon />}
          sx={{
            textTransform: "none",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
          }}
        >
          Admin
        </Button>
      </Toolbar>
    </AppBar>
  );
}
