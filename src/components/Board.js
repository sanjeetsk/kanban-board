import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { addSection, moveTask, fetchSections } from "../store/kanbanSlice";
import { loginUser, signupUser, logoutUser } from "../store/authSlice";
import {
  Box,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
} from "@mui/material";
import Section from "./Section";

const Board = () => {
  const { sections, loading } = useSelector((state) => state.kanban);

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth) || {};  // FIX: Prevent undefined
  const user = auth?.user;
  const token = auth?.token;

  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const [authFormOpen, setAuthFormOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [authData, setAuthData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);



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

  const handleAuthSubmit = () => {
    if (authMode === "login") {
      dispatch(loginUser({ email: authData.email, password: authData.password }));
    } else {
      dispatch(signupUser(authData));
    }
    setAuthFormOpen(false);
  };
  

  if (loading) return <p>Loading...</p>;

  return (
    <Box p={3} bgcolor="#f5f5f5" minHeight="100vh">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Kanban Board
          </Typography>
          {token ? (
            <Button color="inherit" onClick={() => dispatch(logoutUser())}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => { setAuthMode("login"); setAuthFormOpen(true); }}>
                Login
              </Button>
              <Button color="inherit" onClick={() => { setAuthMode("signup"); setAuthFormOpen(true); }}>
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Button variant="contained" color="primary" onClick={() => setIsSectionFormOpen(true)}>
        + Add Section
      </Button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2} mt={2}>
          {sections.map((section) => (
            <Grid item xs={12} sm={4} key={section.id}>
              <Droppable droppableId={section.id.toString()}>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps} bgcolor="white" borderRadius={2} boxShadow={1} p={2}>
                    <Section section={section} />
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
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

      {/* Authentication Popup */}
      <Dialog open={authFormOpen} onClose={() => setAuthFormOpen(false)}>
        <DialogTitle>{authMode === "login" ? "Login" : "Signup"}</DialogTitle>
        <DialogContent>
          {authMode === "signup" && (
            <TextField
              label="Username"
              fullWidth
              value={authData.username}
              onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
              sx={{ mt: 2 }}
            />
          )}
          <TextField
            label="Email"
            fullWidth
            value={authData.email}
            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={authData.password}
            onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthFormOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAuthSubmit}>
            {authMode === "login" ? "Login" : "Signup"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Board;