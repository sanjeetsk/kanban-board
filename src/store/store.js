import { configureStore } from '@reduxjs/toolkit';
import kanbanReducer from './kanbanSlice';

const store = configureStore({
    reducer: {
        kanban: kanbanReducer,
    },
});

export default store;