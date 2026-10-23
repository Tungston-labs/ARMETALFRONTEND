// redux/dashboardSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchDashboardSummary,
  fetchDashCounts,
  fetchReimbursementCounts,
  fetchReimbursementMonthwise,
  fetchDepartmentDashboard,
  fetchRecentEmployees,
  fetchContractExpiry,
  fetchSimpleNotifications,
  fetchTodayEmployeeStats,
  fetchProjectEmployeeCount,
  fetchDashboardCounts,
  fetchWeeklyAttendanceStats,
  fetchUpcomingHolidaysBirthdays,
  fetchMonthlyPayrollSummary,
  fetchHolidays,
} from "../services/dashboardService";

// =====================================================
// Dashboard Summary
// =====================================================

export const getDashboardSummary = createAsyncThunk(
  "dashboard/getSummary",

  async (_, thunkAPI) => {
    try {
      return await fetchDashboardSummary();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch dashboard summary"
      );
    }
  }
);

// =====================================================
// Dashboard Counts
// =====================================================

export const getDashCounts = createAsyncThunk(
  "dashboard/getDashCounts",

  async (_, thunkAPI) => {
    try {
      return await fetchDashCounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch dashboard counts"
      );
    }
  }
);

// =====================================================
// Reimbursement Monthwise
// =====================================================

export const getReimbursementMonthwise = createAsyncThunk(
  "dashboard/getReimbursementMonthwise",

  async (_, thunkAPI) => {
    try {
      return await fetchReimbursementMonthwise();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch reimbursement monthwise data"
      );
    }
  }
);

// =====================================================
// Department Dashboard
// =====================================================

export const getDepartmentDashboard = createAsyncThunk(
  "dashboard/getDepartmentDashboard",

  async (_, thunkAPI) => {
    try {
      return await fetchDepartmentDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch department dashboard"
      );
    }
  }
);

// =====================================================
// Recent Employees
// =====================================================

export const getRecentEmployees = createAsyncThunk(
  "dashboard/getRecentEmployees",

  async (_, thunkAPI) => {
    try {
      return await fetchRecentEmployees();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch recent employees"
      );
    }
  }
);

// =====================================================
// Contract Expiry
// =====================================================

export const getContractExpiry = createAsyncThunk(
  "dashboard/getContractExpiry",

  async (_, thunkAPI) => {
    try {
      return await fetchContractExpiry();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch contract expiry"
      );
    }
  }
);

// =====================================================
// Notifications
// =====================================================

export const getSimpleNotifications = createAsyncThunk(
  "dashboard/getSimpleNotifications",

  async (_, thunkAPI) => {
    try {
      return await fetchSimpleNotifications();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch notifications"
      );
    }
  }
);

// =====================================================
// Today's Employee Stats
// =====================================================

export const getTodayEmployeeStats = createAsyncThunk(
  "dashboard/getTodayEmployeeStats",

  async (_, thunkAPI) => {
    try {
      return await fetchTodayEmployeeStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch today's employee stats"
      );
    }
  }
);

// =====================================================
// Holiday Summary
// =====================================================

export const getHolidaySummary = createAsyncThunk(
  "dashboard/getHolidaySummary",

  async (_, thunkAPI) => {
    try {
      return await fetchHolidaySummary();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch holiday summary"
      );
    }
  }
);

// =====================================================
// Dashboard Counts
// =====================================================

export const getDashboardCounts = createAsyncThunk(
  "dashboard/getDashboardCounts",

  async (_, thunkAPI) => {
    try {
      return await fetchDashboardCounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch dashboard counts"
      );
    }
  }
);

// =====================================================
// Project Employee Count
// =====================================================

export const getProjectEmployeeCount = createAsyncThunk(
  "dashboard/getProjectEmployeeCount",

  async (_, thunkAPI) => {
    try {
      return await fetchProjectEmployeeCount();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch project employee count"
      );
    }
  }
);

// =====================================================
// Weekly Attendance
// =====================================================

export const getWeeklyAttendanceStats = createAsyncThunk(
  "dashboard/getWeeklyAttendanceStats",

  async (_, thunkAPI) => {
    try {
      return await fetchWeeklyAttendanceStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch weekly attendance stats"
      );
    }
  }
);

// =====================================================
// Reimbursement Counts
// =====================================================

export const getReimbursementCounts = createAsyncThunk(
  "dashboard/getReimbursementCounts",

  async (_, thunkAPI) => {
    try {
      return await fetchReimbursementCounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch reimbursement counts"
      );
    }
  }
);

// =====================================================
// Upcoming Holidays & Birthdays
// =====================================================

export const getUpcomingHolidaysBirthdays = createAsyncThunk(
  "dashboard/getUpcomingHolidaysBirthdays",

  async (_, thunkAPI) => {
    try {
      return await fetchUpcomingHolidaysBirthdays();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch upcoming holidays and birthdays"
      );
    }
  }
);

// =====================================================
// ALL HOLIDAYS
// GET /api/holidays/
// =====================================================

export const getHolidays = createAsyncThunk(
  "dashboard/getHolidays",

  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchHolidays();

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Failed to fetch holidays"
      );
    }
  }
);

// =====================================================
// Monthly Payroll Summary
// GET /api/payroll/monthly-summary/?year=2026
// =====================================================

export const getMonthlyPayrollSummary = createAsyncThunk(
  "dashboard/getMonthlyPayrollSummary",

  async (year, { rejectWithValue }) => {
    try {
      const response =
        await fetchMonthlyPayrollSummary(year);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to fetch monthly payroll summary"
      );
    }
  }
);

// =====================================================
// Initial State
// =====================================================

const initialState = {
  summary: {},

  counts: {},

  dashboardCounts: {},

  reimbursements: {},

  reimbursementMonthwise: {},

  departmentSummary: {},

  recentEmployees: [],

  contractExpiry: [],

  notifications: [],

  todayStats: {},

  holidaySummary: {},

  projectEmployeeCount: {},

  // ===================================================
  // Weekly Attendance
  // ===================================================

  weeklyAttendanceStats: {
    week_start: "",
    week_end: "",
    total_employees: 0,
    data: [],
  },

  // ===================================================
  // Upcoming Holidays & Birthdays
  // ===================================================

  upcomingHolidaysBirthdays: {
    upcoming_holidays: [],
    upcoming_birthdays: [],
  },

  // ===================================================
  // All Holidays
  // ===================================================

  holidays: [],

  holidayCount: 0,

  // ===================================================
  // Monthly Payroll Summary
  // ===================================================

  monthlyPayrollSummary: {
    year: null,

    year_total: {
      paid_salary: 0,
      salary_increment: 0,
      incentive: 0,
      deduction: 0,
    },

    monthly_data: [],
  },

  // ===================================================
  // Loading
  // ===================================================

  loading: {
    summary: false,

    counts: false,

    dashboardCounts: false,

    reimbursements: false,

    reimbursementMonthwise: false,

    departmentSummary: false,

    recentEmployees: false,

    contractExpiry: false,

    notifications: false,

    todayStats: false,

    holidaySummary: false,

    projectEmployeeCount: false,

    weeklyAttendanceStats: false,

    upcomingHolidaysBirthdays: false,

    holidays: false,

    monthlyPayrollSummary: false,
  },

  // ===================================================
  // Error
  // ===================================================

  error: null,
};

// =====================================================
// Slice
// =====================================================

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // ===================================================
    // Dashboard Summary
    // ===================================================

    builder
      .addCase(
        getDashboardSummary.pending,
        (state) => {
          state.loading.summary = true;
          state.error = null;
        }
      )

      .addCase(
        getDashboardSummary.fulfilled,
        (state, action) => {
          state.loading.summary = false;
          state.summary = action.payload;
        }
      )

      .addCase(
        getDashboardSummary.rejected,
        (state, action) => {
          state.loading.summary = false;
          state.error = action.payload;
        }
      );

    // ===================================================
    // Common Async APIs
    // ===================================================

    addAsync(
      builder,
      getDashCounts,
      "counts"
    );

    addAsync(
      builder,
      getDashboardCounts,
      "dashboardCounts"
    );

    addAsync(
      builder,
      getReimbursementCounts,
      "reimbursements"
    );

    addAsync(
      builder,
      getReimbursementMonthwise,
      "reimbursementMonthwise"
    );

    addAsync(
      builder,
      getDepartmentDashboard,
      "departmentSummary"
    );

    addAsync(
      builder,
      getRecentEmployees,
      "recentEmployees"
    );

    addAsync(
      builder,
      getContractExpiry,
      "contractExpiry"
    );

    addAsync(
      builder,
      getSimpleNotifications,
      "notifications"
    );

    addAsync(
      builder,
      getTodayEmployeeStats,
      "todayStats"
    );

    addAsync(
      builder,
      getHolidaySummary,
      "holidaySummary"
    );

    addAsync(
      builder,
      getWeeklyAttendanceStats,
      "weeklyAttendanceStats"
    );

    addAsync(
      builder,
      getProjectEmployeeCount,
      "projectEmployeeCount"
    );

    addAsync(
      builder,
      getUpcomingHolidaysBirthdays,
      "upcomingHolidaysBirthdays"
    );

    // ===================================================
    // ALL HOLIDAYS
    // ===================================================

    builder
      .addCase(
        getHolidays.pending,
        (state) => {
          state.loading.holidays = true;
          state.error = null;
        }
      )

      .addCase(
        getHolidays.fulfilled,
        (state, action) => {
          state.loading.holidays = false;

          state.holidays =
            action.payload?.results || [];

          state.holidayCount =
            action.payload?.count || 0;
        }
      )

      .addCase(
        getHolidays.rejected,
        (state, action) => {
          state.loading.holidays = false;

          state.error =
            action.payload ||
            "Failed to fetch holidays";
        }
      );

    // ===================================================
    // Monthly Payroll
    // ===================================================

    addAsync(
      builder,
      getMonthlyPayrollSummary,
      "monthlyPayrollSummary"
    );
  },
});

// =====================================================
// Reusable Async Handler
// =====================================================

function addAsync(builder, thunk, key) {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading[key] = true;
      state.error = null;
    })

    .addCase(thunk.fulfilled, (state, action) => {
      state.loading[key] = false;
      state[key] = action.payload;
    })

    .addCase(thunk.rejected, (state, action) => {
      state.loading[key] = false;
      state.error = action.payload;
    });
}

export default dashboardSlice.reducer;