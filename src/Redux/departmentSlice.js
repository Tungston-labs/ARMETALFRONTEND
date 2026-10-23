import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchEmployeesByDepartment,
  fetchDepartmentMin,
  fetchEmployeesByDepartmentMini,
} from "../services/departmentServices";


export const getDepartmentsMin = createAsyncThunk(
  "departments/getMin",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDepartmentMin();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getDepartments = createAsyncThunk(
  "departments/getAll",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      return await fetchDepartments({ page, search });
    } catch (error) {
      console.error("Error fetching departments:", error.response);
      return rejectWithValue(error.response);
    }
  }
);

// -------------------------------------------------------------
// 3️⃣ Department Detail
// -------------------------------------------------------------
export const getDepartmentById = createAsyncThunk(
  "departments/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchDepartmentById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// 4️⃣ Create Department
// -------------------------------------------------------------
export const createNewDepartment = createAsyncThunk(
  "departments/create",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await createDepartment(data);
      dispatch(getDepartments({ page: 1, search: "" }));
      return result;
    } catch (error) {
      dispatch(getDepartments({ page: 1, search: "" }));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// 5️⃣ Update Department
// -------------------------------------------------------------
export const updateDepartmentById = createAsyncThunk(
  "departments/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateDepartment(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// 6️⃣ Delete Department
// -------------------------------------------------------------
export const deleteDepartmentById = createAsyncThunk(
  "departments/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteDepartment(id);
      dispatch(getDepartments({ page: 1, search: "" }));
      return id;
    } catch (error) {
      dispatch(getDepartments({ page: 1, search: "" }));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// 7️⃣ Get Employees By Department (Full)
// -------------------------------------------------------------
export const getEmployeesByDepartment =
  createAsyncThunk(
    "departments/getEmployeesByDepartment",
    async (
      departmentId,
      { rejectWithValue }
    ) => {
      try {
        console.log(
          "Redux employee request:",
          departmentId
        );

        const response =
          await fetchEmployeesByDepartment(
            departmentId
          );

        console.log(
          "Redux employee response:",
          response
        );

        return response;
      } catch (error) {
        console.error(
          "Employee API error:",
          error.response?.data || error.message
        );

        return rejectWithValue(
          error.response?.data ||
            error.message
        );
      }
    }
  );

// -------------------------------------------------------------
// 8️⃣ Get Employees By Department Mini (id + name + profile_pic)
// -------------------------------------------------------------
export const getEmployeesByDepartmentMini = createAsyncThunk(
  "departments/getEmployeesByDepartmentMini",
  async (departmentId, { rejectWithValue }) => {
    try {
      return await fetchEmployeesByDepartmentMini(departmentId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// Slice
// -------------------------------------------------------------
const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    list: [],
    minList: [],
    current: null,
    loading: false,
    loadingEmployees: false,
    error: null,

    departmentEmployees: [],
    departmentEmployeesMini: [],
    pagination: {
      total_pages: 0,
      current_page: 1,
      next: null,
      previous: null,
      total_items: 0,
    },
  },
  reducers: {
    clearCurrentDepartment(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Minimal Departments
      .addCase(getDepartmentsMin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartmentsMin.fulfilled, (state, action) => {
        state.loading = false;
        state.minList = action.payload.results || [];
        state.error = null;
      })
      .addCase(getDepartmentsMin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Full Departments
      .addCase(getDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results || [];
        state.pagination = {
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
          next: action.payload.next,
          previous: action.payload.previous,
          total_items: action.payload.total_items,
        };
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Department Detail
      .addCase(getDepartmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createNewDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewDepartment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createNewDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateDepartmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteDepartmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Employees
      .addCase(getEmployeesByDepartment.pending, (state) => {
        state.loadingEmployees = true;
      })
      .addCase(getEmployeesByDepartment.fulfilled, (state, action) => {
        state.loadingEmployees = false;
        state.departmentEmployees = action.payload || [];
      })
      .addCase(getEmployeesByDepartment.rejected, (state, action) => {
        state.loadingEmployees = false;
        state.error = action.payload;
      })

      .addCase(getEmployeesByDepartmentMini.pending, (state) => {
        state.loadingEmployees = true;
      })
      .addCase(getEmployeesByDepartmentMini.fulfilled, (state, action) => {
        state.loadingEmployees = false;
        state.departmentEmployeesMini = action.payload || [];
      })
      .addCase(getEmployeesByDepartmentMini.rejected, (state, action) => {
        state.loadingEmployees = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentDepartment } = departmentSlice.actions;



export default departmentSlice.reducer;
