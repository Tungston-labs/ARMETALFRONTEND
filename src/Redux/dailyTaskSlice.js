// redux/slices/dailyTaskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEmployees, fetchTasksByEmployeeAndDate } from '../services/dailyTaskServices';


export const getEmployees = createAsyncThunk(
  'dailyTask/getEmployees',
  async (params = {}, thunkAPI) => {
    try {
      // params can include { department_id: 1 } or any other query params
      return await fetchEmployees(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTasks = createAsyncThunk(
  'dailyTask/getTasks',
  async ({ employeeId, date = null }, thunkAPI) => {
    try {
      return await fetchTasksByEmployeeAndDate(employeeId, date);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);


const dailyTaskSlice = createSlice({
  name: 'dailyTask',
  initialState: {
    employees: [],
    tasks: [],
    loading: false,
    error: null
  },
  reducers: {
    clearTasks(state) {
      state.tasks = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = Array.isArray(action.payload) ? action.payload : [];
      })
      
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearTasks } = dailyTaskSlice.actions;
export default dailyTaskSlice.reducer;
