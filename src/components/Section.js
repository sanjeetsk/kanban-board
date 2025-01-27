// src/components/Section.js
import React, { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "./TaskCard";

const Section = ({ section }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      name: `Task ${tasks.length + 1}`,
      description: "Task description here",
      dueDate: "2025-01-31",
      assignee: "User",
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <Box bgcolor="white" p={2} borderRadius={2} boxShadow={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{section.name}</Typography>
        <IconButton onClick={addTask}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box mt={2}>
        {tasks.length === 0 ? (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={addTask}
          >
            Add Task
          </Button>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </Box>
    </Box>
  );
};

export default Section;
