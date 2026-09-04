import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPayrollData,
  createOrUpdatePayroll,
  updateEmployeePayrollStatus,
  getPayrollDetailById,
  verifyPayroll,
    updateEmployeeIncentive,
      updateEmployeeDeduction,
      fetchPayrollCounts
} from "../services/payrollService";

export const getPayrollData = createAsyncThunk(
  "payroll/getPayrollData",
  async ({ month, year, search = "", page = 1, department = "" }, { rejectWithValue }) => {
    try {
      // normalize department ID if it comes like "17:1"
      const deptId = department ? String(department).split(":")[0] : "";
      const data = await fetchPayrollData(month, year, search, page, deptId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch payroll data");
    }
  }
);



// 2. Create or update payroll for selected employees
export const submitPayrollRecords = createAsyncThunk(
  "payroll/submitPayrollRecords",
  async ({ month, year, employee_ids, status }, { rejectWithValue }) => {
    try {
      const data = await createOrUpdatePayroll({ month, year, employee_ids, status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit payroll records");
    }
  }
);

// 3. Update payroll status for a single employee
export const updatePayrollStatus = createAsyncThunk(
  "payroll/updatePayrollStatus",
  async ({ employeeId, month, year, status }, { rejectWithValue }) => {
    try {
      const data = await updateEmployeePayrollStatus({ employeeId, month, year, status });
      return { employeeId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update payroll status");
    }
  }
);

// ✅ 4. Get payroll detail by record ID (for payslip)
export const getPayrollDetail = createAsyncThunk(
  "payroll/getPayrollDetail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getPayrollDetailById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch payroll detail");
    }
  }
);
// ✅ 5. Verify payroll for employee
export const verifyEmployeePayroll = createAsyncThunk(
  "payroll/verifyEmployeePayroll",
  async ({ employeeId, month, year }, { rejectWithValue }) => {
    try {
      const data = await verifyPayroll({ employeeId, month, year });
      return { employeeId, data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to verify payroll"
      );
    }
  }
);

export const updatePayrollIncentive = createAsyncThunk(
  "payroll/updatePayrollIncentive",
  async ({ employeeId, month, year, incentive_amount, incentive_type, incentive_reason }, { rejectWithValue }) => {
    try {
      const data = await updateEmployeeIncentive({
        employeeId, month, year,
        incentive_amount, incentive_type, incentive_reason,
      });
      return { employeeId, data };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update incentive");
    }
  }
);

export const getPayrollCounts = createAsyncThunk(
  "payrollCounts/getPayrollCounts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPayrollCounts();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching payroll counts"
      );
    }
  }
);
export const updatePayrollDeduction = createAsyncThunk(
  "payroll/updatePayrollDeduction",
  async (
    {
      employeeId,
      month,
      year,
      deduction_amount,
      deduction_type,
      deduction_reason,
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateEmployeeDeduction({
        employeeId,
        month,
        year,
        deduction_amount,
        deduction_type,
        deduction_reason,
      });

      return { employeeId, data };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update deduction"
      );
    }
  }
);
const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    data: [],
    loading: false,
    error: null,
    totalPages: 1,
    submitSuccess: false,
    updateStatusSuccess: false,
    verifySuccess: false,
    payrollDetail: null,
    incentiveUpdateSuccess: false,
    incentiveError: null,
    totalPayroll: 0,
    pendingPayrollCount: 0,
    totalIncentiveAmount: 0,
    totalDeductionAmount: 0,
    countsLoading: false,
    countsError: null,
  },
  reducers: {
    resetPayrollState: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.totalPages = 1;
      state.submitSuccess = false;
      state.updateStatusSuccess = false;
      state.verifySuccess = false;
      state.payrollDetail = null;
    },
    resetSubmitSuccess: (state) => {
      state.submitSuccess = false;
    },
    resetUpdateStatusSuccess: (state) => {
      state.updateStatusSuccess = false;
    },
    resetVerifySuccess: (state) => {
      state.verifySuccess = false;
    },
    resetIncentiveSuccess: (state) => {
  state.incentiveUpdateSuccess = false;
  state.incentiveError = null;
},
  },
  extraReducers: (builder) => {
    builder
      // GET all payrolls
      .addCase(getPayrollData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitSuccess = false;
        state.updateStatusSuccess = false;
      })
      .addCase(getPayrollData.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.data = payload;
          state.totalPages = 1;
        } else {
          state.data = payload.results || payload.data || [];
          state.totalPages = payload.total_pages || 1;
        }
      })
      .addCase(getPayrollData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // POST payroll
      .addCase(submitPayrollRecords.pending, (state) => {
        state.loading = true;
        state.submitSuccess = false;
      })
      .addCase(submitPayrollRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.submitSuccess = true;

        // Update the status of selected employees in state.data
        if (action.meta.arg.employee_ids && action.meta.arg.status) {
          const { employee_ids, status } = action.meta.arg;
          state.data = state.data.map(emp =>
            employee_ids.includes(emp.employee)
              ? { ...emp, status }  // update status locally
              : emp
          );
        }
      })

      .addCase(submitPayrollRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.submitSuccess = false;
      })

      // PATCH payroll status
      .addCase(updatePayrollStatus.pending, (state) => {
        state.loading = true;
        state.updateStatusSuccess = false;
      })
      .addCase(updatePayrollStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatusSuccess = true;
        state.data = state.data.map(emp =>
          emp.id === action.payload.employeeId
            ? { ...emp, status: action.payload.data.status }
            : emp
        );
      })

      .addCase(updatePayrollStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateStatusSuccess = false;
      })

      // ✅ GET single payroll detail
      .addCase(getPayrollDetail.pending, (state) => {
        state.loading = true;
        state.payrollDetail = null;
        state.error = null;
      })
      .addCase(getPayrollDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollDetail = action.payload;
      })
      .addCase(getPayrollDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.payrollDetail = null;
      })

      .addCase(verifyEmployeePayroll.pending, (state) => {
        state.loading = true;
        state.verifySuccess = false;
      })
      .addCase(verifyEmployeePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.verifySuccess = true;
        state.data = state.data.map((emp) =>
          emp.id === action.payload.employeeId
            ? action.payload.data
            : emp
        );

      })

      .addCase(verifyEmployeePayroll.rejected, (state, action) => {
        state.loading = false;
        state.verifySuccess = false;
        state.error = action.payload;  // ✅ capture backend error
      })
      .addCase(updatePayrollIncentive.pending, (state) => {
        state.loading = true;
        state.incentiveUpdateSuccess = false;
        state.incentiveError = null;
      })
      .addCase(updatePayrollIncentive.fulfilled, (state, action) => {
        state.loading = false;
        state.incentiveUpdateSuccess = true;
        state.data = state.data.map((emp) =>
          emp.id === action.payload.employeeId
            ? action.payload.data
            : emp
        );
      })
      .addCase(updatePayrollIncentive.rejected, (state, action) => {
        state.loading = false;
        state.incentiveUpdateSuccess = false;
        state.incentiveError = action.payload;
      })
      
      .addCase(updatePayrollDeduction.pending, (state) => {
  state.loading = true;
})

.addCase(updatePayrollDeduction.fulfilled, (state, action) => {
  state.loading = false;

  state.data = state.data.map((emp) =>
    emp.id === action.payload.employeeId
      ? action.payload.data
      : emp
  );
})

.addCase(updatePayrollDeduction.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

      // ✅ GET payroll summary counts - this case was missing entirely,
      // so getPayrollCounts() was dispatched and resolved but the
      // response never reached the store.
      .addCase(getPayrollCounts.pending, (state) => {
        state.countsLoading = true;
        state.countsError = null;
      })
      .addCase(getPayrollCounts.fulfilled, (state, action) => {
        state.countsLoading = false;

        // Keys match the exact response shape from /payroll-counts/:
        // { total_payroll, pending_payroll_count,
        //   total_incentive_amount, total_deduction_amount }
        state.totalPayroll = action.payload?.total_payroll ?? 0;
        state.pendingPayrollCount =
          action.payload?.pending_payroll_count ?? 0;
        state.totalIncentiveAmount =
          action.payload?.total_incentive_amount ?? 0;
        state.totalDeductionAmount =
          action.payload?.total_deduction_amount ?? 0;
      })
      .addCase(getPayrollCounts.rejected, (state, action) => {
        state.countsLoading = false;
        state.countsError = action.payload;
      });
  },
});

export const { resetPayrollState,
  resetSubmitSuccess,
  resetUpdateStatusSuccess,
  resetIncentiveSuccess ,
  resetVerifySuccess } = payrollSlice.actions;

export default payrollSlice.reducer;