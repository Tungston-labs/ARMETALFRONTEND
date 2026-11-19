import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllLeaveRequests,
  fetchLeaveDetailsById,
  updateLeaveStatus,
  fetchLeaveConflicts,
  fetchLeaveCounts,
  fetchEmployeePendingLeaves,
} from "../services/leaveService";

// Get all leave requests
export const getLeaveRequests = createAsyncThunk(
  "leave/getLeaveRequests",
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await fetchAllLeaveRequests(filters);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching leave requests"
      );
    }
  }
);

// Get conflicts for one leave request
export const getOnLeaveEmployees = createAsyncThunk(
  "leave/getOnLeaveEmployees",
  async (leaveId, { rejectWithValue }) => {
    try {
      return await fetchLeaveConflicts(leaveId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get single leave details
export const getLeaveDetails = createAsyncThunk(
  "leave/getLeaveDetails",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchLeaveDetailsById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error fetching leave details"
      );
    }
  }
);

// Patch leave status
export const patchLeaveStatus = createAsyncThunk(
  "leave/patchLeaveStatus",
  async ({ leaveId, status }, { rejectWithValue }) => {
    try {
      return await updateLeaveStatus(leaveId, status);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error updating status");
    }
  }
);

export const getEmployeePendingLeaves = createAsyncThunk(
  "leave/getEmployeePendingLeaves",
  async (employeeId, { rejectWithValue }) => {
    try {
      return await fetchEmployeePendingLeaves(employeeId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching pending leaves"
      );
    }
  }
);

export const getLeaveCounts = createAsyncThunk(
  "leave/getLeaveCounts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchLeaveCounts();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching leave counts"
      );
    }
  }
);



const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    leaves: [],
    onLeaveEmployees: [],
    leaveDetails: null,
    pendingLeaves: 0,
    onLeaveEmployees: [],
    alsoRequestedEmployees: [],
    leaveCounts: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },

    // separate flags so one request doesn't flicker another's UI
    loading: false, // main leave list / details
    countsLoading: false,
    onLeaveLoading: false,

    error: null,
    pagination: {
      total_pages: 0,
      current_page: 1,
      next: null,
      previous: null,
      total_items: 0,
    },
  },
  reducers: {
    clearOnLeaveEmployees: (state) => {
      state.onLeaveEmployees = [];
         state.alsoRequestedEmployees = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Leave Requests
      .addCase(getLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.results;
        state.pagination = {
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
          next: action.payload.next,
          previous: action.payload.previous,
          total_items: action.payload.total_items,
        };
      })
      .addCase(getLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Pending leaves for one employee
      .addCase(getEmployeePendingLeaves.fulfilled, (state, action) => {
        state.pendingLeaves = action.payload;
      })

      // Get Leave Details
      .addCase(getLeaveDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaveDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveDetails = action.payload;
      })
      .addCase(getLeaveDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Leave Status
      .addCase(patchLeaveStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.leaves.findIndex((l) => l.id === updated.id);
        if (index !== -1) {
          state.leaves[index] = updated;
        }
      })

      // Get On-Leave Employees
      .addCase(getOnLeaveEmployees.pending, (state) => {
        state.onLeaveLoading = true;
        state.error = null;
      })
      .addCase(getOnLeaveEmployees.fulfilled, (state, action) => {
  state.onLeaveLoading = false;
  state.onLeaveEmployees = action.payload?.already_on_leave || [];
  state.alsoRequestedEmployees = action.payload?.also_requested || [];
})
      .addCase(getOnLeaveEmployees.rejected, (state, action) => {
        state.onLeaveLoading = false;
        state.error = action.payload;
      })

      // Get Leave Counts
      .addCase(getLeaveCounts.pending, (state) => {
        state.countsLoading = true;
        state.error = null;
      })
      .addCase(getLeaveCounts.fulfilled, (state, action) => {
        state.countsLoading = false;
        state.leaveCounts = {
          total: action.payload?.total ?? 0,
          pending: action.payload?.pending ?? 0,
          approved: action.payload?.approved ?? 0,
          rejected: action.payload?.rejected ?? 0,
        };
      })
      .addCase(getLeaveCounts.rejected, (state, action) => {
        state.countsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOnLeaveEmployees } = leaveSlice.actions;
export default leaveSlice.reducer;