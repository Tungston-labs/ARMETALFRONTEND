import API from "../../api";

export const fetchCategories = async (params = {}) => {
  const response = await API.get("/finance/category/", { params });
  return response.data;
};

// =====================================================
// CREATE
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
// =====================================================
export const fetchCategoryById = async (id) => {
  const response = await API.get(
    `/finance/category/${id}/`
  );

  return response.data.data;
};

// =====================================================
// PUT
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
// =====================================================
export const deleteCategory = async (id) => {
  const response = await API.delete(
    `/finance/category/${id}/`
  );

  return response.data;
};

// =====================================================
// GET PARENT CATEGORIES
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