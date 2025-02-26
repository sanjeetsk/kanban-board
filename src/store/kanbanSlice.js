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

export const addSection = createAsyncThunk("kanban/addSection", async (sectionData) => {
    try {
        const response = await API.post('/section', sectionData);
        return response.data;
    } catch (error) {
        throw error;
    }
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

export const addTask = createAsyncThunk("kanban/addTask", async (taskData) => {
    const response = await API.post("/task", taskData);
    return {
        sectionId: taskData.section,
        task: response.data.task,
    };
});

export const updateTask = createAsyncThunk("kanban/updateTask", async ({ taskId, sectionId, taskData }) => {
    const response = await API.put(`/task/${taskId}`, taskData);
    return { sectionId, taskId, updatedTask: response.data.task };
});

export const deleteTask = createAsyncThunk("kanban/deleteTask", async ({ sectionId, taskId }) => {
    await API.delete(`/task/${taskId}`);
    return { sectionId, taskId };
});

export const moveTask = createAsyncThunk(
    'kanban/moveTask',
    async ({ taskId, sourceSectionId, destinationSectionId }, { dispatch }) => {
        try {
            // Call the backend API to update the task
            const response = await API.patch(`/task/move`, {
                taskId,
                sourceSectionId,
                destinationSectionId
            });

            return {
                taskId,
                sourceSectionId,
                destinationSectionId,
                task: response.data.task
            };
        } catch (error) {
            throw error;
        }
    }
);

const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers: {
        addSectionLocal: (state, action) => {
            state.sections.push(action.payload);
        },
        updateSectionLocal: (state, action) => {
            const { sectionId, name } = action.payload;
            const section = state.sections.find((s) => s._id === sectionId);
            if (section) section.name = name;
        },
        deleteSectionLocal: (state, action) => {
            state.sections = state.sections.filter((s) => s._id !== action.payload);
        },
        addTaskLocal: (state, action) => {
            const { sectionId, task } = action.payload;
            const section = state.sections.find((s) => s._id === sectionId);
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
            .addCase(addSection.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSection.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure the new section has a tasks array
                const newSection = {
                    ...action.payload,
                    tasks: []
                };
                state.sections.push(newSection);
                // Sort sections based on createdAt timestamp
                state.sections.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            })
            .addCase(addSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateSection.fulfilled, (state, action) => {
                const section = state.sections.find((s) => s._id === action.payload.sectionId);
                if (section) section.name = action.payload.name;
            })
            .addCase(deleteSection.fulfilled, (state, action) => {
                state.sections = state.sections.filter((s) => s._id !== action.payload);
            })
            .addCase(addTask.fulfilled, (state, action) => {

                const { sectionId, task } = action.payload;
                const section = state.sections.find((s) => s._id === sectionId);

                if (section) {
                    if (!section.tasks) section.tasks = [];
                    section.tasks.push({...task
                    });
                }
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const { sectionId, taskId, updatedTask } = action.payload;
                const section = state.sections.find((s) => s._id === sectionId);
                if (section) {
                    const taskIndex = section.tasks.findIndex((t) => t._id === taskId);
                    if (taskIndex !== -1) {
                        section.tasks[taskIndex] = updatedTask;
                    }
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const section = state.sections.find((s) => s._id === action.payload.sectionId);
                if (section) section.tasks = section.tasks.filter((t) => t._id !== action.payload.taskId);
            })
            .addCase(moveTask.fulfilled, (state, action) => {
                const { taskId, sourceSectionId, destinationSectionId, task } = action.payload;

                const sourceSection = state.sections.find(s => s._id === sourceSectionId);
                const destSection = state.sections.find(s => s._id === destinationSectionId);

                if (sourceSection && destSection) {
                    // Remove task from source section
                    sourceSection.tasks = sourceSection.tasks.filter(t => t._id !== taskId);

                    // Add task to destination section
                    if (!destSection.tasks) destSection.tasks = [];
                    destSection.tasks.push(task);
                }
            });
    },
});

export default kanbanSlice.reducer;

