import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const TaskForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: "", description: "", dueDate: ""});
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
          multiline
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
          disabled
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