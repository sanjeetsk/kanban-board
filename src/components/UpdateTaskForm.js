import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../store/kanbanSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const UpdateTaskForm = ({ open, onClose, task, sectionId }) => {
  const dispatch = useDispatch();
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    dueDate: dayjs(),
    assignee: ""
  });

  useEffect(() => {
    if (task) {
      setTaskData({
        name: task.name || "",
        description: task.description || "",
        dueDate: dayjs(task.dueDate),
        assignee: task.assignee || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setTaskData((prev) => ({
      ...prev,
      dueDate: newDate,
    }));
  };

  const handleSubmit = () => {
    dispatch(
      updateTask({
        taskId: task._id,
        sectionId,
        taskData: {
          ...taskData,
          dueDate: taskData.dueDate.toISOString(),
          section: sectionId,
        },
      })
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Task Name"
          type="text"
          fullWidth
          value={taskData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          rows={3}
          value={taskData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="assignee"
          label="Assignee"
          type="text"
          fullWidth
          value={taskData.assignee}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={taskData.dueDate}
            onChange={handleDateChange}
            slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            sx={{ mb: 2 }}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Update Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTaskForm;