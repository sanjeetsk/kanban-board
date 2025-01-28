import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { addSection, moveTask } from "../store/kanbanSlice";
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
} from "@mui/material";
import Section from "./Section";

const Board = () => {
  const sections = useSelector((state) => state.kanban.sections);
  const dispatch = useDispatch();

  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

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

  return (
    <Box p={3} bgcolor="#f5f5f5" minHeight="100vh">
      <Typography variant="h4" gutterBottom>
        Kanban Board
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsSectionFormOpen(true)}
      >
        + Add Section
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2} mt={2}>
          {sections.map((section) => (
            <Grid item xs={12} sm={4} key={section.id}>
              <Droppable droppableId={section.id.toString()}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    bgcolor="white"
                    borderRadius={2}
                    boxShadow={1}
                    p={2}
                  >
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
      <Dialog
        open={isSectionFormOpen}
        onClose={() => setIsSectionFormOpen(false)}
      >
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            label="Section Title"
            fullWidth
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSectionFormOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSection}
          >
            Add Section
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Board;
