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
    const response = await API.post('/section', name);
    return response.data;
});

export const updateSection = createAsyncThunk(
    "kanban/updateSection",
    async ({ sectionId, name }) => {
        console.log('sectionIdss', `/section/${sectionId}`, name);
        await API.put(`/section/${sectionId}`, { name });
        return { sectionId, name };
    }
);

export const deleteSection = createAsyncThunk("kanban/deleteSection", async (sectionId) => {
    await API.delete(`/section/${sectionId}`);
    return sectionId;
});

export const addTask = createAsyncThunk("kanban/addTask", async (taskData) => {
    console.log('data', taskData);
    // Send the taskData directly, as it already contains `section`
    const response = await API.post("/task", taskData);
    return {
        sectionId: taskData.section,
        task: response.data.task // Extracting the actual task object 
    };
});

export const updateTask = createAsyncThunk("kanban/updateTask", async ({ taskId, sectionId, updatedTaskData }) => {
    const response = await API.put(`/task/${taskId}`, updatedTaskData);
    return { sectionId, taskId, updatedTask: response.data.task };
});

export const deleteTask = createAsyncThunk("kanban/deleteTask", async ({ sectionId, taskId }) => {
    await API.delete(`/task/${taskId}`);
    return { sectionId, taskId };
});

// export const moveTask = createAsyncThunk("kanban/moveTask", async ({ sourceSectionId, destinationSectionId, sourceIndex, destinationIndex }, { getState }) => {
//     const state = getState().kanban;
//     const sourceSection = state.sections.find((s) => s.id.toString() === sourceSectionId);
//     const destinationSection = state.sections.find((s) => s.id.toString() === destinationSectionId);

//     if (!sourceSection || !destinationSection) return;

//     const movedTask = sourceSection.tasks[sourceIndex];

//     // Update task section in the backend
//     await API.put(`/task/${movedTask.id}`, { section: destinationSectionId });

//     return { movedTask, sourceSectionId, destinationSectionId, sourceIndex, destinationIndex };
// });

export const moveTask = createAsyncThunk(
    'kanban/moveTask',
    async ({ taskId, sourceSectionId, destinationSectionId }, { dispatch }) => {
        try {
            console.log("ids", taskId, sourceSectionId, destinationSectionId)
            // Call the backend API to update the task
            const response = await API.patch(`/task/move`, {
                taskId,
                sourceSectionId,
                destinationSectionId
            });
            console.log(response);

            return response.data; // Assuming the API returns the updated task
        } catch (error) {
            console.error('Error moving task:', error);
            throw error;
        }
    }
);

export const reorderTask = createAsyncThunk(
    "kanban/reorderTask",
    async ({ sectionId, newOrder }) => {
        console.log('sectionId', sectionId, newOrder);
        const response = await API.put(`/section/${sectionId}/reorder`, { newOrder });
        console.log('response', response);
        return response.data;
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
            .addCase(addSection.fulfilled, (state, action) => {
                state.sections.push(action.payload);
            })
            .addCase(updateSection.fulfilled, (state, action) => {
                const section = state.sections.find((s) => s._id === action.payload.sectionId);
                if (section) section.name = action.payload.name;
            })
            .addCase(deleteSection.fulfilled, (state, action) => {
                state.sections = state.sections.filter((s) => s._id !== action.payload);
            })
            .addCase(addTask.fulfilled, (state, action) => {
                console.log("Task Added to Redux:", action.payload);

                const { sectionId, task } = action.payload;
                const section = state.sections.find((s) => s._id === sectionId);

                if (section) {
                    if (!section.tasks) section.tasks = []; // Ensure tasks array exists
                    section.tasks.push(task);
                }
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const { sectionId, taskId, updatedTask } = action.payload;
                const section = state.sections.find((s) => s._id === sectionId);
                if (section) {
                    const taskIndex = section.tasks.findIndex((t) => t._id === taskId);
                    if (taskIndex !== -1) {
                        section.tasks[taskIndex] = updatedTask; // Update task in state
                    }
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const section = state.sections.find((s) => s._id === action.payload.sectionId);
                if (section) section.tasks = section.tasks.filter((t) => t._id !== action.payload.taskId);
            })
            .addCase(moveTask.fulfilled, (state, action) => {
                const { taskId, destinationSectionId, sourceSectionId } = action.payload;

                if (!sourceSectionId || !destinationSectionId || !taskId) return;

                // 1️⃣ Find source & destination sections
                const sourceSection = state.sections.find((section) => section._id === sourceSectionId);
                const destinationSection = state.sections.find((section) => section._id === destinationSectionId);

                if (!sourceSection || !destinationSection) return;

                // 2️⃣ Remove the task from source section
                const taskIndex = sourceSection.tasks.findIndex((task) => task._id === taskId);
                if (taskIndex !== -1) {
                    const [task] = sourceSection.tasks.splice(taskIndex, 1); // Remove from source
                    task.section = destinationSectionId; // Update task's section ID

                    // 3️⃣ Add the task to the destination section
                    destinationSection.tasks.push(task);
                }
            })
            .addCase(reorderTask.fulfilled, (state, action) => {
                const { sectionId, newOrder } = action.payload;
                const section = state.sections.find((section) => section._id === sectionId);
                section.tasks = newOrder.map(taskId => section.tasks.find(task => task._id === taskId));
            });
    },
});

export default kanbanSlice.reducer;

