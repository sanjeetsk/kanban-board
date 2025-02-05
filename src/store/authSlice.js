import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../Axios/api";

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/login", credentials);
    localStorage.setItem("token", response.data);
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
  initialState: { user: null, token: localStorage.getItem("token") || null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
    });
  },
});

export default authSlice.reducer;
