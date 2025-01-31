import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../Axios/api";

export const fetchSections = createAsyncThunk("kanban/fetchSections", async () => {
    const response = await API.get("/section");
    return response.data;
});

const initialState = {
    sections: [],
    loading: false,
    error: null,
};

export const addSection = createAsyncThunk("kanban/addSection", async (name) => {
    const response = await API.post("/section", { name });
    return response.data;
});

export const updateSection = createAsyncThunk(
    "kanban/updateSection",
    async ({ sectionId, name }) => {
        await API.put(`/section/${sectionId}`, { name });
        return { sectionId, name };
    }
);

export const deleteSection = createAsyncThunk("kanban/deleteSection", async (sectionId) => {
    await API.delete(`/section/${sectionId}`);
    return sectionId;
});

export const addTask = createAsyncThunk("kanban/addTask", async ({ sectionId, task }) => {
    const response = await API.post("/task", { ...task, section: sectionId });
    return { sectionId, task: response.data };
});

export const updateTask = createAsyncThunk("kanban/updateTask", async ({ taskId, updates }) => {
    await API.put(`/task/${taskId}`, updates);
    return { taskId, updates };
});

export const deleteTask = createAsyncThunk("kanban/deleteTask", async ({ sectionId, taskId }) => {
    await API.delete(`/task/${taskId}`);
    return { sectionId, taskId };
});

export const moveTask = createAsyncThunk("kanban/moveTask", async ({ sourceSectionId, destinationSectionId, sourceIndex, destinationIndex }, { getState }) => {
    const state = getState().kanban;
    const sourceSection = state.sections.find((s) => s.id.toString() === sourceSectionId);
    const destinationSection = state.sections.find((s) => s.id.toString() === destinationSectionId);

    if (!sourceSection || !destinationSection) return;

    const movedTask = sourceSection.tasks[sourceIndex];

    // Update task section in the backend
    await API.put(`/task/${movedTask.id}`, { section: destinationSectionId });

    return { movedTask, sourceSectionId, destinationSectionId, sourceIndex, destinationIndex };
});


const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers: {
        addSectionLocal: (state, action) => {
            state.sections.push(action.payload);
        },
        updateSectionLocal: (state, action) => {
            const { sectionId, name } = action.payload;
            const section = state.sections.find((s) => s.id === sectionId);
            if (section) section.name = name;
        },
        deleteSectionLocal: (state, action) => {
            state.sections = state.sections.filter((s) => s.id !== action.payload);
        },
        addTaskLocal: (state, action) => {
            const { sectionId, task } = action.payload;
            const section = state.sections.find((s) => s.id === sectionId);
            if (section) section.tasks.push(task);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSections.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSections.fulfilled, (state, action) => {
                state.loading = false;
                state.sections = action.payload;
            })
            .addCase(fetchSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addSection.fulfilled, (state, action) => {
                state.sections.push(action.payload);
            })
            .addCase(updateSection.fulfilled, (state, action) => {
                const section = state.sections.find((s) => s.id === action.payload.sectionId);
                if (section) section.name = action.payload.name;
            })
            .addCase(deleteSection.fulfilled, (state, action) => {
                state.sections = state.sections.filter((s) => s.id !== action.payload);
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const section = state.sections.find((s) => s.id === action.payload.sectionId);
                if (section) section.tasks.push(action.payload.task);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.sections.forEach((section) => {
                    const task = section.tasks.find((t) => t.id === action.payload.taskId);
                    if (task) Object.assign(task, action.payload.updates);
                });
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const section = state.sections.find((s) => s.id === action.payload.sectionId);
                if (section) section.tasks = section.tasks.filter((t) => t.id !== action.payload.taskId);
            })
            .addCase(moveTask.fulfilled, (state, action) => {
                const { movedTask, sourceSectionId, destinationSectionId, sourceIndex, destinationIndex } = action.payload;
              
                const sourceSection = state.sections.find((s) => s.id.toString() === sourceSectionId);
                const destinationSection = state.sections.find((s) => s.id.toString() === destinationSectionId);
              
                if (!sourceSection || !destinationSection) return;
              
                sourceSection.tasks.splice(sourceIndex, 1);
                destinationSection.tasks.splice(destinationIndex, 0, movedTask);
            });
    },
});

export default kanbanSlice.reducer;

