import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import itemsReducer from './itemsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    },
  });

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
