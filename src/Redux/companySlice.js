import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCompanySelf,
  updateCompanySelf,
  createCompany,
  fetchCompanyById,
  updateCompany,
} from "../services/companyService";

export const getCompanySelf = createAsyncThunk(
  "company/getSelf",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCompanySelf();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// PATCH
export const patchCompanySelf = createAsyncThunk(
  "company/updateSelf",
  async (data, { rejectWithValue }) => {
    try {
      return await updateCompanySelf(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create company
export const addCompany = createAsyncThunk(
  "company/addCompany",
  async (data, { rejectWithValue }) => {
    try {
      return await createCompany(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get company by ID
export const getCompanyById = createAsyncThunk(
  "company/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchCompanyById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Edit company
export const editCompany = createAsyncThunk(
  "company/editCompany",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateCompany(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    company: null,
    selectedCompany: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetCompanyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET SELF
      .addCase(getCompanySelf.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompanySelf.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(getCompanySelf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PATCH SELF
      .addCase(patchCompanySelf.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(patchCompanySelf.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
        state.success = true;
      })
      .addCase(patchCompanySelf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompany = action.payload;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD COMPANY
      .addCase(addCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompany = action.payload;
        state.success = true;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // EDIT COMPANY
      .addCase(editCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompany = action.payload;
        state.success = true;
      })
      .addCase(editCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE COMPANY STATUS (from superAdminSlice)
      .addCase("superAdmin/updateCompanyStatus/fulfilled", (state, action) => {
        const isNowActive = action.payload.action !== "freeze";
        if (state.selectedCompany && state.selectedCompany.id === action.payload.companyId) {
          state.selectedCompany.is_active = isNowActive;
        }
      });
  },
});

export const { resetCompanyState, clearSelectedCompany } = companySlice.actions;
export default companySlice.reducer;

