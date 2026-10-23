// src/Redux/holidaySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchHolidays,
  createHolidays,
  updateHolidays,
  deleteHolidays,
  
} from "../services/holidayService";

// Thunks
// Redux/holidaySlice.js
export const getHolidays = createAsyncThunk("holidays/get", async (page = 1) => {
  return await fetchHolidays(page);
});


export const addHoliday = createAsyncThunk("holidays/add", async (data) => {
  return await createHolidays(data);
});

export const editHoliday = createAsyncThunk("holidays/update", async ({ id, data }) => {
  return await updateHolidays(id, data);
});

export const removeHoliday = createAsyncThunk("holidays/delete", async (id) => {
  await deleteHolidays(id);
  return id;
});

export const getHolidayById = createAsyncThunk("holidays/getOne", async (id) => {
  return await fetchHolidaysById(id);
});

// Slice
const holidaySlice = createSlice({
  name: "holidays",
  initialState: {
    list: [],
    count: 0,
    totalPages: 1,
    currentPage: 1,
    next: null,
    previous: null,
    loading: false,
    error: null,
    selected: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHolidays.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHolidays.fulfilled, (state, action) => {
        const payload = action.payload;
        state.loading = false;
        state.list = payload.results; 
        state.count = payload.total_items;
        state.totalPages = payload.total_pages;
        state.currentPage = payload.current_page;
        state.next = payload.next;
        state.previous = payload.previous;
      })
      
      .addCase(getHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addHoliday.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(removeHoliday.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item.id !== action.payload);
      });
  }
});

export default holidaySlice.reducer;