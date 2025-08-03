import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuthStore from "../store/useAuthStore";
import { useNavigate, useLocation, Outlet } from "react-router";

const DashboardLayout = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const { logout, role } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  // ------------------------------------

  const navItems = [
    { label: "View Categories", path: "/dashboard" },
    { label: "Add Categories", path: "/dashboard/add" },
    { label: "Promote Users", path: "/dashboard/promote" },
  ].filter((item) => item.label !== "Promote Users" || role === "admin");

  // ------------------------------------

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
          },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map(({ label, path }) => (
            <ListItemButton
              key={path}
              selected={location.pathname === path}
              onClick={() => navigate(path)}
              sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItemButton
            onClick={handleLogout}
            sx={{ mx: 1, mb: 2, color: "error.main" }}
          >
            <LogoutIcon sx={{ mr: 1 }} />
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
