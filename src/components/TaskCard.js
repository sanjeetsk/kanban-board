// import React, { useState } from "react";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { useDispatch } from "react-redux";
// import { deleteTask } from "../store/kanbanSlice";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
//   Avatar,
//   Button,
// } from "@mui/material";
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import dayjs from "dayjs";
// import UpdateTaskForm from "./UpdateTaskForm";

// // Import plugins for relative date formatting
// import relativeTime from "dayjs/plugin/relativeTime";
// import isToday from "dayjs/plugin/isToday";
// import isYesterday from "dayjs/plugin/isYesterday";
// import isTomorrow from "dayjs/plugin/isTomorrow";

// dayjs.extend(relativeTime);
// dayjs.extend(isToday);
// dayjs.extend(isYesterday);
// dayjs.extend(isTomorrow);

// const formatDueDate = (dueDate) => {
//   const date = dayjs(dueDate);
//   if (date.isToday()) return { text: "Today", color: "#48494C" };
//   if (date.isTomorrow()) return { text: "Tomorrow", color: "#3B82F6" }; // Blue
//   if (date.isYesterday()) return { text: "Yesterday", color: "#EF4444" }; // Red
//   return { text: date.format("DD MMM"), color: "#6B7280" }; // Gray
// };


// const TaskCard = ({ task, sectionId }) => {
//   const dispatch = useDispatch();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

//   const { text: dueText, color: dueColor } = formatDueDate(task.dueDate);

//   const handleMenuOpen = (event) => {
//     event.stopPropagation(); // Prevent drag & drop issues
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDelete = (event) => {
//     event.stopPropagation();
//     dispatch(deleteTask({ sectionId, taskId: task._id }));
//     handleMenuClose();
//   };

//   const handleUpdateTask = (event) => {
//     event.stopPropagation();
//     setIsUpdateFormOpen(true);
//     handleMenuClose();
//   }

//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
//     id: task._id,
//     data: { sectionId },
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     backgroundColor: "#fff",
//     padding: "10px",
//     marginBottom: "8px",
//     borderRadius: "4px",
//     boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
//   };

//   return (
//     <Box
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       // sx={{
//       //   m: 1,
//       //   bgcolor: "#fff",
//       //   py: 1,
//       //   px: 2,
//       //   borderRadius: 2,
//       //   boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
//       //   position: "relative",
//       //   display: "flex",
//       //   flexDirection: "column",
//       //   gap: 1,
//       //   cursor: "grab"
//       // }}
//       sx={style}
//     >
//       {/* Task Title and Menu Button */}
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//           {task.name}
//         </Typography>
//         <IconButton size="small"onClick={handleMenuOpen} onMouseDown={(e) => e.stopPropagation()}>
//           <MoreHorizIcon />
//         </IconButton>
//         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} disableAutoFocusItem MenuListProps={{ onClick: handleMenuClose }} >
//           <MenuItem onClickCapture={handleDelete}>Delete</MenuItem>
//           <MenuItem onClickCapture={handleUpdateTask}>Update</MenuItem>
//         </Menu>
//       </Box>

//       {/* Assignee Avatar, Due Date & Task Description (All in One Line) */}
//       <Box display="flex" alignItems="center" justifyContent="space-between">
//         {/* Left Side: Avatar & Due Date */}
//         <Box display="flex" alignItems="center" gap={1}>
//           {task.assignee && (
//             <Avatar src={task.assignee.photoUrl} sx={{ width: 24, height: 24 }} />
//           )}
//           <Typography variant="caption" sx={{ fontWeight: 600, color: dueColor }}>
//             {dueText}
//           </Typography>
//         </Box>

//         {/* Right Side: Task Description as Button */}
//         {task.description && (
//           <Button
//             variant="contained"
//             size="small"
//             sx={{
//               bgcolor: "#F3F4F6",
//               color: "#6B7280",
//               fontSize: "0.75rem",
//               fontWeight: 600,
//               textTransform: "none",
//               borderRadius: 2,
//               px: 1.5,
//               py: 0.5,
//               width: "fit-content",
//             }}
//             disableElevation
//           >
//             {task.description}
//           </Button>
//         )}
//       </Box>

//       {/* Update Task Dialog */}
//       <UpdateTaskForm
//         open={isUpdateFormOpen}
//         onClose={() => setIsUpdateFormOpen(false)}
//         task={task}
//         sectionId={sectionId}
//       />
//     </Box>
//   );
// };

// export default TaskCard;

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
  if (date.isTomorrow()) return { text: "Tomorrow", color: "#3B82F6" };
  if (date.isYesterday()) return { text: "Yesterday", color: "#EF4444" };
  return { text: date.format("DD MMM"), color: "#6B7280" };
};

const TaskCard = ({ task, sectionId }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const { text: dueText, color: dueColor } = formatDueDate(task.dueDate);

  const handleMenuOpen = (event) => {
    event.stopPropagation(); // Prevents drag interference
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    dispatch(deleteTask({ sectionId, taskId: task._id }));
    handleMenuClose();
  };

  const handleUpdateTask = (event) => {
    event.stopPropagation();
    setIsUpdateFormOpen(true);
    handleMenuClose();
  };

  // Drag and Drop Configuration
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
    data: { sectionId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "#fff",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "4px",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
    cursor: "grab",
  };

  return (
    <Box ref={setNodeRef} {...attributes} {...listeners} sx={style}>
      {/* Task Title and Menu Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {task.name}
        </Typography>

        {/* Menu Button */}
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          onMouseDown={(e) => e.stopPropagation()} // Prevents drag interference
        >
          <MoreHorizIcon />
        </IconButton>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          disableAutoFocusItem
        >
          <MenuItem onClick={handleUpdateTask}>Update</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>

      {/* Assignee Avatar, Due Date & Task Description */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          {task.assignee && (
            <Avatar src={task.assignee.photoUrl} sx={{ width: 24, height: 24 }} />
          )}
          <Typography variant="caption" sx={{ fontWeight: 600, color: dueColor }}>
            {dueText}
          </Typography>
        </Box>

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
};

export default TaskCard;
