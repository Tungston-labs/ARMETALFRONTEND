import api from "../../api";

const BASE_URL = "/api/finance/banking";

const createCrudService = (resource) => {
  const url = `${BASE_URL}/${resource}/`;

  return {
    getAll: (params = {}) => api.get(url, { params }),

    getById: (id) => api.get(`${url}${id}/`),

    create: (data) => api.post(url, data),

    update: (id, data) => api.put(`${url}${id}/`, data),

    patch: (id, data) => api.patch(`${url}${id}/`, data),

    remove: (id) => api.delete(`${url}${id}/`),
  };
};

export const bankAccountService = createCrudService("accounts");

export const loanService = createCrudService("loans");

export const transactionService = createCrudService("transactions");
