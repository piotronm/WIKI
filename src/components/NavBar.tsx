import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const stickyRoutes = ["/", "/search", "/admin"];
  const isSticky = stickyRoutes.includes(location.pathname);

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar
      position={isSticky ? "sticky" : "static"}
      sx={{
        top: 0,
        zIndex: theme.zIndex.appBar,
        backgroundColor: "#0D1B2A",
        color: "#E0E1DD",
      }}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <MenuBookIcon sx={{ mr: 1, color: "#00B4D8" }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: "#E0E1DD",
              textDecoration: "none",
              fontWeight: "bold",
              mr: 4,
              letterSpacing: 0.5,
            }}>
            CEW Knowledge
          </Typography>

          {!isMobile && (
            <Box display="flex" gap={2}>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{
                  borderBottom: isActive("/") ? "2px solid #00B4D8" : "none",
                }}>
                Home
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/search"
                sx={{
                  borderBottom: isActive("/search")
                    ? "2px solid #00B4D8"
                    : "none",
                }}>
                Knowledge Base
              </Button>
              {user?.role === "admin" && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/admin"
                  sx={{
                    borderBottom: isActive("/admin")
                      ? "2px solid #00B4D8"
                      : "none",
                  }}>
                  Admin Dashboard
                </Button>
              )}
            </Box>
          )}
        </Box>

        {user ? (
          <Button
            color="inherit"
            onClick={() => {
              logout();
              navigate("/");
            }}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
