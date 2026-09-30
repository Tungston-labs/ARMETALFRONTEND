import axios from "axios";

import { BASE_URL } from "../../../services/api";

const BILL_URL = `${BASE_URL}/api/finance/bill/`;

/* =========================================================
   AUTH HEADERS
========================================================= */

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");

    return token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};
};

/* =========================================================
   ERROR HELPER
========================================================= */

export const getBillError = (error, fallbackMessage) =>
    error?.response?.data ||
    error?.message ||
    fallbackMessage;

/* =========================================================
   LIST HELPERS
========================================================= */

const getListRows = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.results)) {
        return payload.results;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.data?.results)) {
        return payload.data.results;
    }

    return [];
};

/* =========================================================
   CSV HELPERS

   There is no export endpoint in the supplied Bill API.
   Therefore the existing EXPORT button uses the Bill list API
   and creates the CSV on the frontend.
========================================================= */

const escapeCsvValue = (value) => {
    const stringValue =
        value === null || value === undefined ? "" : String(value);

    return `"${stringValue.replace(/"/g, '""')}"`;
};

const buildBillsCsv = (payload) => {
    const rows = getListRows(payload);

    const headers = [
        "Invoice No",
        "PO Ref",
        "Vendor",
        "Bill Date",
        "Due Date",
        "Amount",
        "Paid",
        "Balance",
        "Payment Status",
    ];

    const csvRows = rows.map((row) => [
        row?.invoice_number ??
        row?.invoice_no ??
        row?.bill_number ??
        row?.bill_no ??
        "",

        row?.po_reference ??
        row?.po_ref ??
        row?.purchase_order_reference ??
        row?.purchase_order?.reference ??
        row?.purchase_order?.po_number ??
        "",

        row?.vendor_name ??
        row?.vendor?.name ??
        row?.vendor?.vendor_name ??
        row?.vendor ??
        "",

        row?.bill_date ?? row?.invoice_date ?? row?.date ?? "",

        row?.due_date ?? "",

        row?.amount ??
        row?.total_amount ??
        row?.bill_amount ??
        row?.total ??
        row?.invoice_value ??
        "",

        row?.paid ??
        row?.paid_amount ??
        row?.amount_paid ??
        row?.total_paid ??
        "",

        row?.balance ??
        row?.balance_amount ??
        row?.outstanding_amount ??
        row?.amount_due ??
        "",

        row?.payment_status ??
        row?.paymentStatus ??
        row?.status ??
        "",
    ]);

    return [headers, ...csvRows]
        .map((row) => row.map(escapeCsvValue).join(","))
        .join("\r\n");
};

/* =========================================================
   GET BILLS
   GET /api/finance/bill/
========================================================= */

export const getBills = async (params = {}) => {
    const response = await axios.get(BILL_URL, {
        params,
        headers: getAuthHeaders(),
    });

    return response.data;
};

/* =========================================================
   GET BILL BY ID
   GET /api/finance/bill/{id}/
========================================================= */

export const getBillById = async (id) => {
    const response = await axios.get(`${BILL_URL}${id}/`, {
        headers: getAuthHeaders(),
    });

    return response.data;
};

/* =========================================================
   CREATE BILL
   POST /api/finance/bill/
========================================================= */

export const createBill = async (payload) => {
    const response = await axios.post(BILL_URL, payload, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

/* =========================================================
   FULL UPDATE
   PUT /api/finance/bill/{id}/
========================================================= */

export const updateBill = async (id, payload) => {
    const response = await axios.put(`${BILL_URL}${id}/`, payload, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

/* =========================================================
   PARTIAL UPDATE
   PATCH /api/finance/bill/{id}/
========================================================= */

export const patchBill = async (id, payload) => {
    const response = await axios.patch(`${BILL_URL}${id}/`, payload, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

/* =========================================================
   DELETE BILL
   DELETE /api/finance/bill/{id}/
========================================================= */

export const deleteBill = async (id) => {
    const response = await axios.delete(`${BILL_URL}${id}/`, {
        headers: getAuthHeaders(),
    });

    return response.data;
};

/* =========================================================
   BILL KPI
   GET /api/finance/bill/kpi/
========================================================= */

export const getBillKPI = async (params = {}) => {
    const response = await axios.get(`${BILL_URL}kpi/`, {
        params,
        headers: getAuthHeaders(),
    });

    return response.data;
};

/*
 * Keep this name because your existing Bill.jsx already calls
 * getBillSummary().
 */
export const getBillSummary = getBillKPI;

/* =========================================================
   EXPORT BILLS
========================================================= */

export const exportBills = async (params = {}) => {
    const response = await axios.get(BILL_URL, {
        params: {
            ...params,
            page: 1,
            page_size: 1000,
        },
        headers: getAuthHeaders(),
    });

    return buildBillsCsv(response.data);
};