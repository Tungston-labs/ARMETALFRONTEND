import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAttendanceList,
  fetchAttendanceDetail,
  fetchDepartmentsAttendance,
  fetchAttendanceSummary,
  generateAttendanceExcel,
  generateEmployeeAttendanceExcel,
  updateAttendance,
} from "../services/attendanceService";

export const getAttendanceList = createAsyncThunk(
  "attendance/getList",
  async (params, thunkAPI) => {
    try {
      return await fetchAttendanceList(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "API Error");
    }
  }
);

// Attendance Detail
export const getAttendanceDetail = createAsyncThunk(
  "attendance/getDetail",
  async ({ attendanceId, date }, thunkAPI) => {
    try {
      return await fetchAttendanceDetail(attendanceId, date);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

// Departments Attendance
export const getDepartments = createAsyncThunk(
  "attendance/getDepartments",
  async (params, thunkAPI) => {
    try {
      return await fetchDepartmentsAttendance(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Department fetch failed"
      );
    }
  }
);

export const searchAttendanceEmployees = createAsyncThunk(
  "attendance/searchEmployees",
  async (search, { rejectWithValue }) => {
    try {
      const data = await searchEmployees(search);
      return data;   // must return list of employees with dept
    } catch (error) {
      return rejectWithValue(error.response?.data || "Search failed");
    }
  }
);


export const getAttendanceSummary = createAsyncThunk(
  "attendance/getSummary",
  async (
    { year, month, token, page = 1, search = "" },
    thunkAPI
  ) => {
    try {
      return await fetchAttendanceSummary({
        year,
        month,
        token,
        page,
        search,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data ||
          "Failed to fetch attendance summary"
      );
    }
  }
);

// =========================================================
// COMPANY-WIDE Excel report (all employees for the month)
// =========================================================
export const generateAttendanceExcelReport = createAsyncThunk(
  "attendance/generateAttendanceExcelReport",
  async (
    {
      year,
      month,
      token,
    },
    thunkAPI
  ) => {

    try {

      return await generateAttendanceExcel({
        year,
        month,
        token,
      });

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data ||
        "Failed to generate attendance Excel"
      );
    }
  }
);

// =========================================================
// SINGLE EMPLOYEE Excel report (one employee for the month)
// =========================================================
export const generateEmployeeAttendanceExcelReport = createAsyncThunk(
  "attendance/generateEmployeeAttendanceExcelReport",
  async (
    {
      employee,
      year,
      month,
      token,
    },
    thunkAPI
  ) => {

    try {

      return await generateEmployeeAttendanceExcel({
        employee,
        year,
        month,
        token,
      });

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data ||
        "Failed to generate employee attendance Excel"
      );
    }
  }
);

// Update (mark) a single attendance record
export const updateAttendanceRecord = createAsyncThunk(
  "attendance/updateRecord",
  async (
    {
      employee,
      date,
      attendance_type,
      remark,
      token,
    },
    thunkAPI
  ) => {
    try {
      return await updateAttendance({
        employee,
        date,
        attendance_type,
        remark,
        token,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update attendance"
      );
    }
  }
);

/* Slice */
const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    // Attendance list
    attendanceList: [],
    pagination: {
      total_pages: 1,
      current_page: 1,
      total_items: 0,
      next: null,
      previous: null,
    },
    listLoading: false,

    // Attendance detail
    attendanceDetail: null,
    detailLoading: false,

    // Departments
    departmentsAttendance: [],
    departmentsPagination: {
      total_pages: 1,
      current_page: 1,
      total_items: 0,
      next: null,
      previous: null,
    },
    departmentLoading: false,

    // Monthly summary
    attendanceSummary: null,
    summaryLoading: false,

    // Monthly Excel report (company-wide)
    attendanceExcel: null,
    attendanceExcelLoading: false,
    attendanceExcelError: null,

    // Single-employee Excel report
    employeeAttendanceExcelLoading: false,
    employeeAttendanceExcelError: null,

    // Update (mark) attendance
    updateLoading: false,
    updateError: null,
    lastUpdatedAttendance: null,

    // Generic error holder
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // list
      .addCase(getAttendanceList.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
     .addCase(getAttendanceList.fulfilled, (state, action) => {
  state.listLoading = false;
  state.attendanceList = action.payload.results || [];
  state.pagination = {
    total_pages: action.payload.total_pages || 1,
    current_page: action.payload.current_page || action.meta.arg?.page || 1,
    total_items: action.payload.total_items || 0,
    next: action.payload.next || null,
    previous: action.payload.previous || null,
  };
  state.swipedEmployeeCount = action.payload.swiped_employee_count || 0;
  state.totalEmployeeCount = action.payload.total_employee_count || 0;
})
      .addCase(getAttendanceList.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || "Failed to fetch attendance data";
      })

      // detail
      .addCase(getAttendanceDetail.pending, (state) => {
        state.detailLoading = true;
        state.attendanceDetail = null;
      })
      .addCase(getAttendanceDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.attendanceDetail = action.payload;
      })
      .addCase(getAttendanceDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.attendanceDetail = null;
        state.error = action.payload;
      })

      // departments
      .addCase(getDepartments.pending, (state) => {
        state.departmentLoading = true;
        state.error = null;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.departmentLoading = false;
        state.departmentsAttendance = action.payload.results || [];
        state.departmentsPagination = {
          total_pages: Math.ceil((action.payload.count || 0) / 10),
          current_page: action.meta.arg?.page || 1,
          total_items: action.payload.count || 0,
          next: action.payload.next || null,
          previous: action.payload.previous || null,
        };
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.departmentLoading = false;
        state.error =
          action.payload || "Failed to fetch department attendance data";
      })

      // summary (monthly)
      .addCase(getAttendanceSummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })
      .addCase(getAttendanceSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;

        state.attendanceSummary = {
          results: action.payload.results || [],
          total_pages: action.payload.total_pages || 1,
          current_page: action.payload.current_page || 1,
          total_items: action.payload.total_items || 0,
          next: action.payload.next || null,
          previous: action.payload.previous || null,
        };
      })
      .addCase(getAttendanceSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.attendanceSummary = [];
        state.error = action.payload || "Failed to fetch summary";
      })
      // =========================================================
// Generate Attendance Excel (company-wide)
// =========================================================

.addCase(
  generateAttendanceExcelReport.pending,
  (state) => {

    state.attendanceExcelLoading = true;
    state.attendanceExcelError = null;
  }
)

.addCase(
  generateAttendanceExcelReport.fulfilled,
  (state, action) => {

    state.attendanceExcelLoading = false;

    state.attendanceExcel = action.payload;
  }
)

.addCase(
  generateAttendanceExcelReport.rejected,
  (state, action) => {

    state.attendanceExcelLoading = false;

    state.attendanceExcelError =
      action.payload ||
      "Failed to generate attendance Excel";

    state.error =
      action.payload ||
      "Failed to generate attendance Excel";
  }
)

// =========================================================
// Generate Attendance Excel (single employee)
// NOTE: payload here is a raw Blob (the .xlsx file), not JSON,
// so it is intentionally NOT stored in state — the component
// handles the blob directly to trigger a browser download.
// =========================================================

.addCase(
  generateEmployeeAttendanceExcelReport.pending,
  (state) => {

    state.employeeAttendanceExcelLoading = true;
    state.employeeAttendanceExcelError = null;
  }
)

.addCase(
  generateEmployeeAttendanceExcelReport.fulfilled,
  (state) => {

    state.employeeAttendanceExcelLoading = false;
  }
)

.addCase(
  generateEmployeeAttendanceExcelReport.rejected,
  (state, action) => {

    state.employeeAttendanceExcelLoading = false;

    state.employeeAttendanceExcelError =
      action.payload ||
      "Failed to generate employee attendance Excel";

    state.error =
      action.payload ||
      "Failed to generate employee attendance Excel";
  }
)

// =========================================================
// Update (mark) Attendance
// =========================================================

.addCase(updateAttendanceRecord.pending, (state) => {
  state.updateLoading = true;
  state.updateError = null;
})

.addCase(updateAttendanceRecord.fulfilled, (state, action) => {
  state.updateLoading = false;
  state.lastUpdatedAttendance = action.payload?.data || action.payload;

  // NOTE: the update response identifies the employee by numeric FK id
  // (e.g. "employee": 4), while attendanceSummary.results rows are keyed
  // by employee_id (email) with no numeric id of their own. There isn't
  // enough info here to safely patch the matching daily_records entry
  // in place, so the recommended approach is to re-dispatch
  // getAttendanceSummary({ year, month, token, page }) after a
  // successful update to refresh the table with the latest data.
})

.addCase(updateAttendanceRecord.rejected, (state, action) => {
  state.updateLoading = false;
  state.updateError =
    action.payload || "Failed to update attendance";
  state.error =
    action.payload || "Failed to update attendance";
});

  },
});

export default attendanceSlice.reducer;