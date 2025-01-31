import { configureStore } from "@reduxjs/toolkit";
import kanbanReducer from "./kanbanSlice";
import authReducer from "./authSlice";  // Import auth slice

const store = configureStore({
  reducer: {
    kanban: kanbanReducer,
    auth: authReducer,  // Add auth reducer
  },
});

export default store;
