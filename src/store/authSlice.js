import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../Axios/api";

export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  localStorage.setItem("token", response.data.token);
  return response.data;
});

export const signupUser = createAsyncThunk("auth/signup", async (credentials) => {
  const response = await API.post("/auth/signup", credentials);
  localStorage.setItem("token", response.data.token);
  return response.data;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: localStorage.getItem("token") || null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
