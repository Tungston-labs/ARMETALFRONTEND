import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const PAYMENT_URL = `${API_BASE_URL}/api/finance/payments/`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

/* =========================================================
   LIST PAYMENTS
========================================================= */

export const getPurchasePayments = async (params = {}) => {
  const response = await axios.get(PAYMENT_URL, {
    params,
    headers: getAuthHeaders(),
  });

  return response.data;
};

/* =========================================================
   GET PAYMENT BY ID
========================================================= */

export const getPurchasePaymentById = async (id) => {
  const response = await axios.get(`${PAYMENT_URL}${id}/`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

/* =========================================================
   CREATE PAYMENT
========================================================= */

export const createPurchasePayment = async (payload) => {
  const response = await axios.post(PAYMENT_URL, payload, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   UPDATE PAYMENT
========================================================= */

export const updatePurchasePayment = async ({ id, payload }) => {
  const response = await axios.put(`${PAYMENT_URL}${id}/`, payload, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   PATCH PAYMENT
========================================================= */

export const patchPurchasePayment = async ({ id, payload }) => {
  const response = await axios.patch(`${PAYMENT_URL}${id}/`, payload, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   DELETE PAYMENT
========================================================= */

export const deletePurchasePayment = async (id) => {
  const response = await axios.delete(`${PAYMENT_URL}${id}/`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

/* =========================================================
   EXPORT PAYMENTS
========================================================= */

export const exportPurchasePayments = async (params = {}) => {
  const response = await axios.get(`${PAYMENT_URL}export/`, {
    params,
    headers: getAuthHeaders(),
    responseType: "blob",
  });

  return response;
};

/* =========================================================
   KPI
========================================================= */

export const getPurchasePaymentKPI = async () => {
  const response = await axios.get(`${PAYMENT_URL}kpi/`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};