import axios from "axios";

import { BASE_URL } from "../../api";

const CREDIT_NOTE_URL = `${BASE_URL}/api/finance/credit-notes`;

const getAuthConfig = () => {
    const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

    return token
        ? {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        : {};
};

const creditNoteService = {
    // GET /api/finance/credit-notes/
    getAll: async (params = {}) => {
        const response = await axios.get(CREDIT_NOTE_URL, {
            ...getAuthConfig(),
            params,
        });

        return response.data;
    },

    // POST /api/finance/credit-notes/
    create: async (payload) => {
        const response = await axios.post(
            `${CREDIT_NOTE_URL}/`,
            payload,
            getAuthConfig(),
        );

        return response.data;
    },

    // GET /api/finance/credit-notes/{id}/
    getById: async (id) => {
        const response = await axios.get(
            `${CREDIT_NOTE_URL}/${id}/`,
            getAuthConfig(),
        );

        return response.data;
    },

    // PUT /api/finance/credit-notes/{id}/
    update: async (id, payload) => {
        const response = await axios.put(
            `${CREDIT_NOTE_URL}/${id}/`,
            payload,
            getAuthConfig(),
        );

        return response.data;
    },

    // PATCH /api/finance/credit-notes/{id}/
    patch: async (id, payload) => {
        const response = await axios.patch(
            `${CREDIT_NOTE_URL}/${id}/`,
            payload,
            getAuthConfig(),
        );

        return response.data;
    },

    // DELETE /api/finance/credit-notes/{id}/
    remove: async (id) => {
        const response = await axios.delete(
            `${CREDIT_NOTE_URL}/${id}/`,
            getAuthConfig(),
        );

        return response.data;
    },

    // GET /api/finance/credit-notes/invoice-details/
    getInvoiceDetails: async (params = {}) => {
        const response = await axios.get(
            `${CREDIT_NOTE_URL}/invoice-details/`,
            {
                ...getAuthConfig(),
                params,
            },
        );

        return response.data;
    },

    // GET /api/finance/credit-notes/kpi/
    getKpi: async () => {
        const response = await axios.get(
            `${CREDIT_NOTE_URL}/kpi/`,
            getAuthConfig(),
        );

        return response.data;
    },
};

export default creditNoteService;