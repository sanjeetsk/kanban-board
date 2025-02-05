import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../store/kanbanSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from "@mui/material";
import dayjs from "dayjs";

const UpdateTaskForm = ({ open, onClose, task, sectionId }) => {
  const dispatch = useDispatch();

  const [updatedTask, setUpdatedTask] = useState({
    name: task.name,
    description: task.description,
    dueDate: dayjs(task.dueDate).format("YYYY-MM-DD"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitUpdate = () => {
    dispatch(updateTask({ 
      taskId: task._id, 
      sectionId, 
      updatedTaskData: updatedTask 
    }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Task</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Task Name"
          type="text"
          fullWidth
          name="name"
          value={updatedTask.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          name="description"
          value={updatedTask.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Due Date"
          type="date"
          fullWidth
          name="dueDate"
          value={updatedTask.dueDate}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmitUpdate} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTaskForm;
