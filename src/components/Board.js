import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { addSection, moveTask, fetchSections } from "../store/kanbanSlice";
import { logoutUser } from "../store/authSlice";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  InputAdornment
} from "@mui/material";
import Section from "./Section";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AppleIcon from '@mui/icons-material/Apple';
import AuthForm from "./AuthForm";

const Board = () => {
  const { sections, loading } = useSelector((state) => state.kanban);
  const auth = useSelector((state) => state.auth) || {};
  const user = auth?.user;
  const token = auth?.token;
  const members = user?.members || 0;

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim() !== "") {
      dispatch(addSection({ name: newSectionTitle }));
      setNewSectionTitle("");
      setIsSectionFormOpen(false);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside any droppable
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Dispatch action to move the task
    dispatch(
      moveTask({
        sourceSectionId: source.droppableId,
        destinationSectionId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div height="100vh">
      {/* Top Navbar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: "white", color: "black", boxShadow: "none", }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          {/* Left: Logo & Title */}
          <Box display="flex" alignItems="center">
            <Box
              alt="Logo"
            ><AppleIcon fontSize="large" /></Box>
            <Box>
              <Typography variant="body2">Kanban Board</Typography>
              <Typography variant="caption" color="textSecondary">
                {sections.length} boards • {members} members
              </Typography>
            </Box>
          </Box>

          {/* Search Bar & Auth Buttons */}
          <Box>
            <TextField
              variant="outlined"
              placeholder="Search"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              sx={{ width: 250, bgcolor: "#F4F5F7", borderRadius: 1, mr: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="disabled" />
                  </InputAdornment>
                ),
              }}
            />
            {/* Auth Buttons */}
            {!token ? (
              <Button variant="contained" color="primary" onClick={() => setIsAuthFormOpen(true)}>
                Sign Up / Login
              </Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={() => dispatch(logoutUser())}>
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drag & Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            height: "calc(100vh - 64px - 20px)", // Full height
            overflowX: "auto",
            overflowY: "auto",
            padding: 1,
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "#D1D5DB transparent", // Custom color
            "&::-webkit-scrollbar": {
              height: "5px", // Thin scrollbar
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#D1D5DB", // Grey color
              borderRadius: "10px",
            },
          }}
        >
          {sections.map((section) => (
            <Droppable key={section._id} droppableId={section._id}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}
                  sx={{
                    minWidth: 300,
                    maxWidth: 300,
                  }}
                >
                  <Section section={section} />
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
          {/* Add Section Button (At End, Aligned with Section Title) */}
          <Box sx={{ display: "flex", alignItems: "center", height: "40px", mt: "10px", ml: "10px" }}>
            <Button variant="text" onClick={() => setIsSectionFormOpen(true)} sx={{ height: "40px", width: "200px", color: "#a2a5ab" }}>
              <AddIcon /> Add Section
            </Button>
          </Box>
        </Box>

      </DragDropContext>

      {/* Add Section Popup */}
      <Dialog open={isSectionFormOpen} onClose={() => setIsSectionFormOpen(false)}>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField label="Section Title" fullWidth value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSectionFormOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddSection}>
            Add Section
          </Button>
        </DialogActions>
      </Dialog>

      {/* Auth Form Popup */}
      <AuthForm open={isAuthFormOpen} handleClose={() => setIsAuthFormOpen(false)} />
    </div>
  );
};

export default Board;