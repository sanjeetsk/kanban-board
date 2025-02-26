import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const TaskForm = ({ open, onClose, onSubmit }) => {

  // Get logged-in user from Redux store
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    assignee: user ? user.name : "", // Default to logged-in user's name
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      assignee: user ? user.name : "",
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: "", description: "", dueDate: "", assignee: user ? user.name : ""});
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Task Name"
          fullWidth
          margin="dense"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          rows={3}
          margin="dense"
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          name="dueDate"
          label="Due Date"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={formData.dueDate}
          onChange={handleChange}
        />
        <TextField
          name="assignee"
          label="Assignee"
          fullWidth
          margin="dense"
          value={formData.assignee}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;