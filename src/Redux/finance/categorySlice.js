// redux/slices/categorySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchCategories,
  createCategory,
  fetchCategoryById,
  updateCategory,
  patchCategory,
  deleteCategory,
  fetchParentCategories
} from "../../services/finance/categoryServices";


// =====================================================
// GET ALL CATEGORIES
// =====================================================

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchCategories(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// CREATE CATEGORY
// =====================================================

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (categoryData, thunkAPI) => {
    try {
      return await createCategory(categoryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// GET CATEGORY BY ID
// =====================================================

export const getCategoryById = createAsyncThunk(
  "category/getCategoryById",
  async (id, thunkAPI) => {
    try {
      return await fetchCategoryById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// PUT
// =====================================================

export const editCategory = createAsyncThunk(
  "category/editCategory",
  async ({ id, categoryData }, thunkAPI) => {
    try {
      return await updateCategory(id, categoryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// PATCH
// =====================================================

export const updateCategoryPartially = createAsyncThunk(
  "category/updateCategoryPartially",
  async ({ id, categoryData }, thunkAPI) => {
    try {
      return await patchCategory(id, categoryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// DELETE
// =====================================================

export const removeCategory = createAsyncThunk(
  "category/removeCategory",
  async (id, thunkAPI) => {
    try {
      await deleteCategory(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// =====================================================
// GET PARENT CATEGORIES
// =====================================================

export const getParentCategories = createAsyncThunk(
  "category/getParentCategories",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchParentCategories(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);
// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  categories: [],
 parentCategories: [],  
  selectedCategory: null,

  // API pagination
  count: 0,
  totalPages: 1,
  currentPage: 1,

  next: null,
  previous: null,

  loading: false,
  error: null,
};


// =====================================================
// SLICE
// =====================================================

const categorySlice = createSlice({
  name: "category",

  initialState,

  reducers: {

    clearCategories(state) {
      state.categories = [];
      state.count = 0;
      state.totalPages = 1;
      state.currentPage = 1;
    },

    clearSelectedCategory(state) {
      state.selectedCategory = null;
    },

    clearCategoryError(state) {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    // =================================================
    // GET ALL
    // =================================================

    builder

      .addCase(getCategories.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getCategories.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};

        console.log("CATEGORY API RESPONSE:", data);

        // IMPORTANT
        // API returns results
        state.categories = data.results || [];

        // API returns total_items
        state.count = data.total_items || 0;

        // API returns total_pages
        state.totalPages = data.total_pages || 1;

        // API returns current_page
        state.currentPage = data.current_page || 1;

        state.next = data.next || null;

        state.previous = data.previous || null;

      })


      .addCase(getCategories.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load categories";

      });


    // =================================================
    // CREATE
    // =================================================

    builder

      .addCase(addCategory.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(addCategory.fulfilled, (state, action) => {

        state.loading = false;

        if (action.payload) {

          state.categories.unshift(action.payload);

          state.count += 1;

        }

      })


      .addCase(addCategory.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });


    // =================================================
    // GET BY ID
    // =================================================

    builder

      .addCase(getCategoryById.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getCategoryById.fulfilled, (state, action) => {

        state.loading = false;

        state.selectedCategory = action.payload;

      })


      .addCase(getCategoryById.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });


    // =================================================
    // PUT
    // =================================================

    builder

      .addCase(editCategory.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(editCategory.fulfilled, (state, action) => {

        state.loading = false;

        const updatedCategory = action.payload;

        const index = state.categories.findIndex(
          (category) =>
            category.id === updatedCategory.id
        );

        if (index !== -1) {

          state.categories[index] = updatedCategory;

        }

        state.selectedCategory = updatedCategory;

      })


      .addCase(editCategory.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });


    // =================================================
    // PATCH
    // =================================================

    builder

      .addCase(
        updateCategoryPartially.pending,
        (state) => {

          state.loading = true;
          state.error = null;

        }
      )


      .addCase(
        updateCategoryPartially.fulfilled,
        (state, action) => {

          state.loading = false;

          const updatedCategory = action.payload;

          const index = state.categories.findIndex(
            (category) =>
              category.id === updatedCategory.id
          );

          if (index !== -1) {

            state.categories[index] =
              updatedCategory;

          }

          state.selectedCategory =
            updatedCategory;

        }
      )


      .addCase(
        updateCategoryPartially.rejected,
        (state, action) => {

          state.loading = false;

          state.error = action.payload;

        }
      );


    // =================================================
    // DELETE
    // =================================================

    builder

      .addCase(removeCategory.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(removeCategory.fulfilled, (state, action) => {

        state.loading = false;

        state.categories =
          state.categories.filter(
            (category) =>
              category.id !== action.payload
          );

        state.count = Math.max(
          0,
          state.count - 1
        );

        if (
          state.selectedCategory?.id ===
          action.payload
        ) {

          state.selectedCategory = null;

        }

      })


      .addCase(removeCategory.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });

      // =================================================
      // GET PARENT CATEGORIES
      // =================================================

   builder
  .addCase(getParentCategories.pending, (state) => {
    state.error = null;
    })
  .addCase(getParentCategories.fulfilled, (state, action) => {
    const data = action.payload;
    // Handle either a raw array or a paginated { results: [...] } shape
    state.parentCategories = Array.isArray(data)
      ? data
      : data?.results || [];
  })
  .addCase(getParentCategories.rejected, (state, action) => {
    state.error = action.payload;
  });

  },
});


export const {
  clearCategories,
  clearSelectedCategory,
  clearCategoryError,
} = categorySlice.actions;


export default categorySlice.reducer;