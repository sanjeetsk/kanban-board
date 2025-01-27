// src/components/Board.js
import React, { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Section from "./Section";

const Board = () => {
  const [sections, setSections] = useState([
    { id: 1, name: "To Do" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "Done" },
  ]);

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: `New Section ${sections.length + 1}`,
    };
    setSections([...sections, newSection]);
  };

  return (
    <Box p={3} bgcolor="#f5f5f5" minHeight="100vh">
      <Typography variant="h4" gutterBottom>
        Kanban Board
      </Typography>
      <Button variant="contained" color="primary" onClick={addSection}>
        + Add Section
      </Button>
      <Grid container spacing={2} mt={2}>
        {sections.map((section) => (
          <Grid item xs={12} sm={4} key={section.id}>
            <Section section={section} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Board;
