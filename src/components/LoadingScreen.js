import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        textAlign: "center",
      }}
    >
      <CircularProgress sx={{ color: "white", mb: 2 }} size={60} />
      <Typography variant="h5" fontWeight="bold">
        Loading your Kanban Board...
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
        Please wait a moment
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
