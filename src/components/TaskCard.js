import React, { useState, memo, useCallback } from "react";
import { useDrag } from "react-dnd";
import { useDispatch } from "react-redux";
import { deleteTask } from "../store/kanbanSlice";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Tooltip,
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import dayjs from "dayjs";
import UpdateTaskForm from "./UpdateTaskForm";

// Import plugins for relative date formatting
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isTomorrow from "dayjs/plugin/isTomorrow";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);

const formatDueDate = (dueDate) => {
  const date = dayjs(dueDate);
  if (date.isToday()) return { text: "Today", color: "#48494C" };
  if (date.isTomorrow()) return { text: "Tomorrow", color: "#3B82F6" }; // Blue
  if (date.isYesterday()) return { text: "Yesterday", color: "#EF4444" }; // Red
  return { text: date.format("DD MMM"), color: "#6B7280" }; // Gray
};


const TaskCard = memo(({ task, sectionId }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const { text: dueText, color: dueColor } = formatDueDate(task.dueDate);

  // Drag handling
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: () => ({
      taskId: task._id,
      sourceSectionId: sectionId,
      task: task
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleMenuOpen = useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete the task "${task.name}"?`)) {
      dispatch(deleteTask({ sectionId, taskId: task._id }));
    }
    handleMenuClose();
  }, [dispatch, handleMenuClose, sectionId, task._id, task.name]);

  const handleUpdateTask = useCallback(() => {
    setIsUpdateFormOpen(true);
    handleMenuClose();
  }, [handleMenuClose]);

  return (
    <Box
      ref={drag}
      sx={{
        m: 1,
        bgcolor: "#fff",
        py: 1,
        px: 2,
        borderRadius: 2,
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        opacity: isDragging ? 0.5 : 1, // Reduce opacity while dragging
        cursor: "grab",
        transition: 'all 0.15s ease',
        willChange: 'transform, opacity',
        transform: 'translate3d(0,0,0)',
        '&:hover': {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
        }
      }}
    >
      {/* Task Title and Menu Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {task.name}
        </Typography>
        <IconButton size="small" onClick={handleMenuOpen} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
          <MoreHorizIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} disableAutoFocusItem MenuListProps={{ onClick: handleMenuClose }}>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
          <MenuItem onClick={handleUpdateTask}>Update</MenuItem>
        </Menu>
      </Box>

      {/* Assignee Avatar, Due Date & Task Description (All in One Line) */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {/* Left Side: Avatar & Due Date */}
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title={task.assignee || "Unassigned"} arrow>
            <Avatar
              src={task.assignee? `https://avatar.iran.liara.run/username?username=${task.assignee}` : "?"}
              sx={{ width: 24, height: 24, fontSize: "0.875rem" }}
            />
          </Tooltip>
          <Typography variant="caption" sx={{ fontWeight: 600, color: dueColor }}>
            {dueText}
          </Typography>
        </Box>

        {/* Right Side: Task Description as Button */}
        {task.description && (
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#F3F4F6",
              color: "#6B7280",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              width: "fit-content",
              '&:hover': {
                bgcolor: "#E5E7EB",
              }
            }}
            disableElevation
          >
            {task.description}
          </Button>
        )}
      </Box>

      {/* Update Task Dialog */}
      <UpdateTaskForm
        open={isUpdateFormOpen}
        onClose={() => setIsUpdateFormOpen(false)}
        task={task}
        sectionId={sectionId}
      />
    </Box>
  );
});

export default TaskCard;
