// services/finance/categoryServices.js
import API from "../api";

// =====================================================
// GET ALL (paginated)
// Backend returns: { total_items, total_pages, current_page, next, previous, results }
// This shape is already flat (no "message"/"data" wrapper), so return as-is.
// =====================================================
export const fetchCategories = async (params = {}) => {
  const response = await API.get("/finance/category/", { params });
  return response.data;
};

// =====================================================
// CREATE
// Backend returns: { message, data: {...category} }
// =====================================================
export const createCategory = async (categoryData) => {
  const response = await API.post(
    "/finance/category/",
    categoryData
  );

  return response.data.data;
};

// =====================================================
// GET BY ID
// Backend returns: { message, data: {...category} }
// =====================================================
export const fetchCategoryById = async (id) => {
  const response = await API.get(
    `/finance/category/${id}/`
  );

  return response.data.data;
};

// =====================================================
// PUT
// Backend returns: { message, data: {...category} }
// =====================================================
export const updateCategory = async (id, categoryData) => {
  const response = await API.put(
    `/finance/category/${id}/`,
    categoryData
  );

  return response.data.data;
};

// =====================================================
// PATCH
// Backend returns: { message, data: {...category} }
// =====================================================
export const patchCategory = async (id, categoryData) => {
  const response = await API.patch(
    `/finance/category/${id}/`,
    categoryData
  );

  return response.data.data;
};

// =====================================================
// DELETE
// Backend returns: { message } only — no "data" key
// =====================================================
export const deleteCategory = async (id) => {
  const response = await API.delete(
    `/finance/category/${id}/`
  );

  return response.data;
};

// =====================================================
// GET PARENT CATEGORIES
// Backend returns: { message, data: [...categories] }
// =====================================================
export const fetchParentCategories = async (params = {}) => {
  const response = await API.get(
    "/finance/category/parents/",
    { params }
  );

  return response.data.data;
};

// =====================================================
// GET SUBCATEGORIES OF A CATEGORY
// Backend returns: { message, data: [...categories] }
// =====================================================
export const fetchSubCategories = async (id) => {
  const response = await API.get(
    `/finance/category/${id}/subcategories/`
  );

  return response.data.data;
};

// =====================================================
// GET CATEGORY SUMMARY (counts)
// Backend returns: { message, data: { total_categories, active_categories, ... } }
// =====================================================
export const fetchCategorySummary = async () => {
  const response = await API.get(
    "/finance/category/summary/"
  );

  return response.data.data;
};