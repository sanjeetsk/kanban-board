import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, deleteSection, updateSection } from "../store/kanbanSlice";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { Draggable } from "react-beautiful-dnd";

const Section = ({ section }) => {
  const dispatch = useDispatch();

  // State for task form
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  // State for section menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isUpdateSection, setIsUpdateSection] = useState(false);

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
    <Box bgcolor="white" p={2} borderRadius={2} boxShadow={1}>
      {/* Section Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{section.name}</Typography>
        <Box>
          <IconButton onClick={() => setIsTaskFormOpen(true)}>
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
            aria-controls="section-menu"
            aria-haspopup="true"
          >
            <MoreVertIcon />
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
      <Box mt={2}>
        {section.tasks.length === 0 ? (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => setIsTaskFormOpen(true)}
          >
            + Add Task
          </Button>
        ) : (
          section.tasks.map((task, index) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCard task={task} sectionId={section._id} />
                </Box>
              )}
            </Draggable>
          ))
        )}
      </Box>

      {/* Task Form Popup */}
      <TaskForm
        open={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleAddTask}
        defaultAssignee="Current User" // Replace with logged-in user if available
      />
    </Box>
  );
};

export default Section;
