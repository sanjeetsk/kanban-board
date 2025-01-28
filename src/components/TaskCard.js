import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask } from "../store/kanbanSlice";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const TaskCard = ({ task, sectionId }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteTask({ sectionId, taskId: task.id }));
    handleMenuClose();
  };

  return (
    <Box
      bgcolor="#f9f9f9"
      p={2}
      mb={1}
      borderRadius={2}
      boxShadow={1}
      position="relative"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">{task.name}</Typography>
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>
      <Typography variant="body2" color="textSecondary">
        {task.description}
      </Typography>
      <Typography variant="caption" display="block" color="textSecondary">
        Due: {task.dueDate}
      </Typography>
      <Typography variant="caption" display="block" color="textSecondary">
        Assignee: {task.assignee}
      </Typography>
    </Box>
  );
};

export default TaskCard;
