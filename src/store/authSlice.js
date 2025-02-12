import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../Axios/api";

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/login", credentials);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const signupUser = createAsyncThunk("auth/signup", async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/signup", credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Signup failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: localStorage.getItem("token"), loading: false, error: null, signupSuccess: false},
  reducers: {},
  extraReducers: (builder) => {
    builder
    // Signup
    .addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.signupSuccess = false;
    })
    .addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.signupSuccess = true;
      state.error = null;
    })
    .addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.signupSuccess = false;
    })
    // Login
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Logout
    .addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.signupSuccess = false;
    });
  },
});

export default authSlice.reducer;
