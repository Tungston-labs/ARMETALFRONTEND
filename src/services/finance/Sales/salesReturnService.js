import axios from "axios";

const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const SALES_RETURN_URL = `${BASE_URL}/api/finance/sales-return`;

const getStoredToken = () => {
    const directToken =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("jwt");

    if (directToken) {
        return directToken;
    }

    const authTokens = localStorage.getItem("authTokens");

    if (authTokens) {
        try {
            const parsed = JSON.parse(authTokens);
            return parsed?.access || parsed?.access_token || parsed?.token || null;
        } catch {
            return null;
        }
    }

    return null;
};

const getHeaders = () => {
    const token = getStoredToken();

    return {
        "Content-Type": "application/json",
        ...(token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : {}),
    };
};

const normalizeResponse = (response) => {
    if (!response) {
        return null;
    }

    return response.data;
};

const getErrorData = (error) => {
    if (error?.response?.data) {
        return error.response.data;
    }

    return {
        detail:
            error?.message || "Something went wrong while processing Sales Return.",
    };
};

export const fetchSalesReturnsApi = async (params = {}) => {
    try {
        const response = await axios.get(`${SALES_RETURN_URL}/`, {
            headers: getHeaders(),
            params,
        });

        return normalizeResponse(response);
    } catch (error) {
        throw getErrorData(error);
    }
};

export const fetchSalesReturnByIdApi = async (id) => {
    try {
        const response = await axios.get(`${SALES_RETURN_URL}/${id}/`, {
            headers: getHeaders(),
        });

        return normalizeResponse(response);
    } catch (error) {
        throw getErrorData(error);
    }
};

export const createSalesReturnApi = async (payload) => {
    try {
        const response = await axios.post(`${SALES_RETURN_URL}/`, payload, {
            headers: getHeaders(),
        });

        return normalizeResponse(response);
    } catch (error) {
        throw getErrorData(error);
    }
};

export const updateSalesReturnApi = async ({ id, payload }) => {
    try {
        const response = await axios.put(`${SALES_RETURN_URL}/${id}/`, payload, {
            headers: getHeaders(),
        });

        return normalizeResponse(response);
    } catch (error) {
        throw getErrorData(error);
    }
};

export const patchSalesReturnApi = async ({ id, payload }) => {
    try {
        const response = await axios.patch(`${SALES_RETURN_URL}/${id}/`, payload, {
            headers: getHeaders(),
        });

        return normalizeResponse(response);
    } catch (error) {
        throw getErrorData(error);
    }
};

export const deleteSalesReturnApi = async (id) => {
    try {
        const response = await axios.delete(`${SALES_RETURN_URL}/${id}/`, {
            headers: getHeaders(),
        });

        return response.status === 204 ? true : normalizeResponse(response);
    } catch (error) {
        throw getErrorData(error);
    }
};

export const exportSalesReturnsApi = async (params = {}) => {
    try {
        const response = await axios.get(`${SALES_RETURN_URL}/export/`, {
            headers: getHeaders(),
            params,
            responseType: "blob",
        });

        return response.data;
    } catch (error) {
        throw getErrorData(error);
    }
};

export const fetchEligibleInvoicesApi = async (params = {}) => {
    try {
        const response = await axios.get(`${SALES_RETURN_URL}/invoices/`, {
            headers: getHeaders(),
            params,
        });

        return normalizeResponse(response);
    } catch (error) {
        throw getErrorData(error);
    }
};

export const fetchInvoiceForReturnApi = async (invoiceId) => {
    try {
        const response = await axios.get(
            `${SALES_RETURN_URL}/invoices/${invoiceId}/`,
            {
                headers: getHeaders(),
            },
        );

        return normalizeResponse(response);
    } catch (error) {
        throw getErrorData(error);
    }
};

export const fetchSalesReturnKpiApi = async (params = {}) => {
    try {
        const response = await axios.get(`${SALES_RETURN_URL}/kpi/`, {
            headers: getHeaders(),
            params,
        });

        return normalizeResponse(response);
    } catch (error) {
        throw getErrorData(error);
    }
};