import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { useDispatch} from "react-redux";
import { addTask, deleteSection, updateSection, moveTask } from "../store/kanbanSlice";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

const Section = ({ section }) => {
  const dispatch = useDispatch();

  // State for task form
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  // State for section menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // Drop handling
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      if (item.sourceSectionId !== section._id) {
        dispatch(moveTask({
          taskId: item.taskId,
          sourceSectionId: item.sourceSectionId,
          destinationSectionId: section._id,
        })).then(() => {
          dispatch(updateSection({ sectionId: section._id, name: section.name }));
        });
      }
    }
  });

  const handleAddTask = (taskData) => {
    const newTask = { ...taskData, section: section._id };
    dispatch(addTask(newTask));
  };

  const handleDeleteSection = () => {
    if (window.confirm(`Are you sure you want to delete the section "${section.name}"?`)) {
      dispatch(deleteSection(section._id));
    }
    setMenuAnchorEl(null);
  };

  const handleUpdateSection = () => {
    const newTitle = prompt("Enter new title for the section:", section.name);
    if (newTitle && newTitle.trim() !== "") {
      dispatch(updateSection({ sectionId: section._id, name: newTitle }));
    }
    setMenuAnchorEl(null);
  };

  return (
    <Box ref={drop} height="100%" bgcolor="white" p={2} >
      {/* Section Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h6 className="section-title">{section.name}</h6>
        <Box>
          <IconButton onClick={() => setIsTaskFormOpen(true)}>
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
            aria-controls="section-menu"
            aria-haspopup="true"
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            id="section-menu"
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={() => setMenuAnchorEl(null)}
          >
            <MenuItem onClick={handleUpdateSection}>Update Title</MenuItem>
            <MenuItem onClick={handleDeleteSection} style={{ color: "red" }}>
              Delete Section
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Section Body */}
      <Box
        mt={1}
        sx={{
          height: "95%",
          bgcolor: "#F5F5F5",
          padding: 1,
          borderRadius: 2,
        }}
      >
        {/* If no tasks, show "+ Add Task" at the top */}
        {section.tasks.length === 0 && (
          <Button variant="text" fullWidth onClick={() => setIsTaskFormOpen(true)} sx={{ color: "#a2a5ab", mt: 1 }}>
            + Add Task
          </Button>
        )}

        {/* Render Tasks */}
        {section.tasks.map((task) => (
          <TaskCard key={task._id} task={task} sectionId={section._id} />
        ))}


        {/* If tasks exist, show "+ Add Task" at the bottom */}
        {section.tasks.length > 0 && (
          <Button variant="text" fullWidth onClick={() => setIsTaskFormOpen(true)} sx={{ color: "#a2a5ab", mt: 1 }}>
            + Add Task
          </Button>
        )}
      </Box>

      {/* Task Form Popup */}
      <TaskForm
        open={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleAddTask}
        defaultAssignee="Current User" // Replace with logged-in user if available
      />
    </Box >
  );
};

export default Section;
