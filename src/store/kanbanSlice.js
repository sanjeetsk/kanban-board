// src/store/kanbanSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sections: [
        { id: "1", name: "To Do", tasks: [{ id: 101, name: "Task 1", due: "29-01-2025", assignee: "current user"}],},
        { id: "2", name: "In Progress", tasks: [{ id: 201, name: "Task 2", due: "29-01-2025", assignee: "current user"}] },
        { id: "3", name: "Done", tasks: [] },
    ],
};

const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers: {
        addSection: (state, action) => {
            state.sections.push({
                id: Date.now(),
                name: action.payload.name,
                tasks: [],
            });
        },
        addTask: (state, action) => {
            const { sectionId, task } = action.payload;
            const section = state.sections.find((s) => s.id === sectionId);
            if (section) {
                section.tasks.push({ ...task, id: Date.now() });
            }
        },
        deleteTask: (state, action) => {
            const { sectionId, taskId } = action.payload;
            const section = state.sections.find((s) => s.id === sectionId);
            if (section) {
                section.tasks = section.tasks.filter((task) => task.id !== taskId);
            }
        },
        updateSection: (state, action) => {
            const { sectionId, name } = action.payload;
            const section = state.sections.find((sec) => sec.id === sectionId);
            if (section) section.name = name;
        },
        deleteSection: (state, action) => {
            const { sectionId } = action.payload;
            state.sections = state.sections.filter((sec) => sec.id !== sectionId);
        },
        moveTask: (state, action) => {
            const {
                sourceSectionId,
                destinationSectionId,
                sourceIndex,
                destinationIndex,
            } = action.payload;

            const sourceSection = state.sections.find(
                (section) => section.id.toString() === sourceSectionId
            );
            const destinationSection = state.sections.find(
                (section) => section.id.toString() === destinationSectionId
            );

            if (!sourceSection || !destinationSection) return;

            // Remove task from source section
            const [movedTask] = sourceSection.tasks.splice(sourceIndex, 1);

            // Add task to destination section
            destinationSection.tasks.splice(destinationIndex, 0, movedTask);
        },

    },
});

export const { addSection, addTask, deleteTask, updateSection, deleteSection,  moveTask } = kanbanSlice.actions;

export default kanbanSlice.reducer;
