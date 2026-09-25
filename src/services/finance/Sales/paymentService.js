import axios from "axios";
import { BASE_URL } from "../../api";

const API_ROOT = `${String(BASE_URL).replace(/\/$/, "")}/api/finance/payments`;

const getAuthConfig = () => {
    const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

    return {
        headers: {
            "Content-Type": "application/json",
            ...(accessToken
                ? {
                    Authorization: `Bearer ${accessToken}`,
                }
                : {}),
        },
    };
};

/* =========================================================
   GET PAYMENTS
========================================================= */
export const getPayments = async (params = {}) => {
    const response = await axios.get(`${API_ROOT}/`, {
        ...getAuthConfig(),
        params,
    });

    return response.data;
};

/* =========================================================
   GET PAYMENT BY ID
========================================================= */
export const getPaymentById = async (id) => {
    const response = await axios.get(`${API_ROOT}/${id}/`, getAuthConfig());

    return response.data;
};

/* =========================================================
   CREATE PAYMENT
========================================================= */
export const createPayment = async (payload) => {
    const response = await axios.post(
        `${API_ROOT}/`,
        payload,
        getAuthConfig(),
    );

    return response.data;
};

/* =========================================================
   UPDATE PAYMENT - PUT
========================================================= */
export const updatePayment = async ({ id, data }) => {
    const response = await axios.put(
        `${API_ROOT}/${id}/`,
        data,
        getAuthConfig(),
    );

    return response.data;
};

/* =========================================================
   PARTIAL UPDATE PAYMENT - PATCH
========================================================= */
export const patchPayment = async ({ id, data }) => {
    const response = await axios.patch(
        `${API_ROOT}/${id}/`,
        data,
        getAuthConfig(),
    );

    return response.data;
};

/* =========================================================
   DELETE PAYMENT
========================================================= */
export const deletePayment = async (id) => {
    const response = await axios.delete(
        `${API_ROOT}/${id}/`,
        getAuthConfig(),
    );

    return {
        id,
        data: response.data,
    };
};

/* =========================================================
   PAYMENT KPI
========================================================= */
export const getPaymentKPI = async () => {
    const response = await axios.get(
        `${API_ROOT}/kpi/`,
        getAuthConfig(),
    );

    return response.data;
};

/* =========================================================
   EXPORT PAYMENTS
========================================================= */
export const exportPayments = async (params = {}) => {
    const response = await axios.get(
        `${API_ROOT}/export/`,
        {
            ...getAuthConfig(),
            params,
            responseType: "blob",
        },
    );

    return response;
};