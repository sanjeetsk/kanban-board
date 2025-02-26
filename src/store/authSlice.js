import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../Axios/api";

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
      const token = localStorage.getItem("token");
      if (!token) {
          return rejectWithValue("No token found");
      }

      const response = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;
  } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching user");
  }
});

export const fetchUserCount = createAsyncThunk("kanban/fetchUserCount", async () => {
  const response = await API.get("/auth/count");
  return response.data.totalUsers;
});

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/login", credentials);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
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
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: JSON.parse(localStorage.getItem("user")) || null, token: localStorage.getItem("token") || null, loading: false, error: null, signupSuccess: false, userCount: 0 },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
    })
    .addCase(fetchUserCount.fulfilled, (state, action) => {
      state.userCount = action.payload;
    });
},
});

export default authSlice.reducer;
