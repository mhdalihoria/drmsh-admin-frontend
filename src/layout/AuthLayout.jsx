import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
        <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'background.default',
        px: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Outlet/>
      </Paper>
    </Box>
  );
};
