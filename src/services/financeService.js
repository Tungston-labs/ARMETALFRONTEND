import API from "./api";

export const createFinanceService = async (data) => {
  const response = await API.post("/finance/", data);
  return response.data;
};

export const listFinanceService = async (
  page = 1,
  pageSize = 20,
  search = "",
  payment_type = "",
  month = ""
) => {
  let url = `/finance/?page=${page}&page_size=${pageSize}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  if (payment_type) {
    url += `&payment_type=${payment_type}`;
  }

  if (month) {
    url += `&month=${month}`;
  }

  const response = await API.get(url);

  return response.data;
};
export const deleteFinanceService = async (id) => {
  const response = await API.delete(`/finance/${id}/`);
  return response.data;
};


export const createFinanceCategoryService = async (data) => {
  const response = await API.post("/finance/categories/", data);
  return response.data;
};

export const listFinanceCategoryService = async (payment_type = "") => {
  const response = await API.get("/finance/categories/", {
    params: payment_type ? { payment_type } : {},
  });

  return response.data;
};