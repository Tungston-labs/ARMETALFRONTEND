import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    listSalaryIncrementService,
    addSalaryIncrementService,
} from "../services/salaryIncrementService";


// ================================
// 🔹 LIST INCREMENTS
// ================================
export const fetchSalaryIncrements = createAsyncThunk(
    "salaryIncrement/list",
    async (employeeId, { rejectWithValue }) => {
        try {
            return await listSalaryIncrementService(employeeId);
        } catch (err) {
            return rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);


// ================================
// 🔹 ADD INCREMENT
// ================================
export const addSalaryIncrement = createAsyncThunk(
    "salaryIncrement/add",
    async ({ employeeId, data }, { rejectWithValue }) => {
        try {
            return await addSalaryIncrementService(employeeId, data);
        } catch (err) {
            return rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);


// ================================
// 🔹 SLICE
// ================================
const salaryIncrementSlice = createSlice({
    name: "salaryIncrement",
    initialState: {
        increments: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearIncrementState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder

            // ====================
            // LIST
            // ====================
            .addCase(fetchSalaryIncrements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSalaryIncrements.fulfilled, (state, action) => {
                state.loading = false;
                state.increments = action.payload.results || [];
            })
            .addCase(fetchSalaryIncrements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ====================
            // ADD
            // ====================
            .addCase(addSalaryIncrement.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addSalaryIncrement.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                // add new increment at top
                state.increments.unshift(action.payload);
            })
            .addCase(addSalaryIncrement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearIncrementState } =
    salaryIncrementSlice.actions;

export default salaryIncrementSlice.reducer;