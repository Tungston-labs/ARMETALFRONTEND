import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";
import { listEmployeeDash } from "../services/employeeService";


export const fetchEmployeeDash = createAsyncThunk(
  "auth/fetchEmployeeDash",
  async (id, thunkAPI) => {
    try {
      const data = await listEmployeeDash(id);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
const initialState = {
  userName: null,
  accessToken: null,
  user: null, // your current user info
  employeeDashData: null,
  loadingEmployeeDash: false,
  employeeDashError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userName = action.payload.userName;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.userName = null;
      state.accessToken = null;
      state.user = null;
      state.employeeDashData = null;
      state.loadingEmployeeDash = false;
      state.employeeDashError = null;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeDash.pending, (state) => {
        state.loadingEmployeeDash = true;
        state.employeeDashError = null;
      })
      .addCase(fetchEmployeeDash.fulfilled, (state, action) => {
        state.loadingEmployeeDash = false;
        state.employeeDashData = action.payload;
      })
      .addCase(fetchEmployeeDash.rejected, (state, action) => {
        state.loadingEmployeeDash = false;
        state.employeeDashError = action.payload || "Failed to fetch employee data";
      });
  },
});

export const { login, logout, setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer;
