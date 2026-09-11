// redux/slices/categorySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchCategories,
  createCategory,
  fetchCategoryById,
  updateCategory,
  patchCategory,
  deleteCategory,
  fetchParentCategories,
  fetchSubCategories,
  fetchCategorySummary,
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
// GET SUBCATEGORIES OF A CATEGORY
// =====================================================

export const getSubCategories = createAsyncThunk(
  "category/getSubCategories",
  async (id, thunkAPI) => {
    try {
      return await fetchSubCategories(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// GET CATEGORY SUMMARY
// =====================================================

export const getCategorySummary = createAsyncThunk(
  "category/getCategorySummary",
  async (_, thunkAPI) => {
    try {
      return await fetchCategorySummary();
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
  subCategories: [],
  summary: null,
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
    // Payload shape: { total_items, total_pages, current_page, next, previous, results }
    // =================================================

    builder

      .addCase(getCategories.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getCategories.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};

        state.categories = data.results || [];
        state.count = data.total_items || 0;
        state.totalPages = data.total_pages || 1;
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
    // Payload shape: {...category} (already unwrapped from "data")
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
    // Payload shape: {...category}
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
    // Payload shape: {...category}
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
    // Payload shape: {...category}
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
    // Payload shape: [...categories] (already unwrapped from "data")
    // =================================================

    builder

      .addCase(getParentCategories.pending, (state) => {

        state.error = null;

      })

      .addCase(getParentCategories.fulfilled, (state, action) => {

        const data = action.payload;

        state.parentCategories = Array.isArray(data)
          ? data
          : [];

      })

      .addCase(getParentCategories.rejected, (state, action) => {

        state.error = action.payload;

      });


    // =================================================
    // GET SUBCATEGORIES
    // Payload shape: [...categories]
    // =================================================

    builder

      .addCase(getSubCategories.pending, (state) => {

        state.error = null;

      })

      .addCase(getSubCategories.fulfilled, (state, action) => {

        const data = action.payload;

        state.subCategories = Array.isArray(data)
          ? data
          : [];

      })

      .addCase(getSubCategories.rejected, (state, action) => {

        state.error = action.payload;

      });


    // =================================================
    // GET SUMMARY
    // Payload shape: { total_categories, active_categories, inactive_categories, parent_categories, sub_categories }
    // =================================================

    builder

      .addCase(getCategorySummary.pending, (state) => {

        state.error = null;

      })

      .addCase(getCategorySummary.fulfilled, (state, action) => {

        state.summary = action.payload || null;

      })

      .addCase(getCategorySummary.rejected, (state, action) => {

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