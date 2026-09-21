import React from "react";
import { FiEye, FiDownload, FiXCircle } from "react-icons/fi";

const getStatusStyle = (status = "") => {
    const clean = String(status).toLowerCase();

    if (clean === "approved") {
        return {
            background: "#e8f7ee",
            color: "#1f9d61",
            border: "1px solid #aee7c2",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "74px",
        };
    }

    if (clean === "pending") {
        return {
            background: "#fff0ec",
            color: "#cf6a43",
            border: "1px solid #f7c7b4",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "74px",
        };
    }

    if (clean === "rejected") {
        return {
            background: "#fdebea",
            color: "#d9534f",
            border: "1px solid #f4b7b2",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "74px",
        };
    }

    return {
        background: "#f5f7fb",
        color: "#4b5563",
        border: "1px solid #dfe3ea",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "74px",
    };
};

export const quotationColumns = ({
    dispatch,
    currentPage,
    rowsPerPage,
    convertQuotation,
    fetchQuotationList,
    fetchQuotationKpi,
    fetchQuotationDetails,
    showQuotation,
    formatCurrency,
}) => [
    {
        header: "Quote No.",
        accessor: "quoteNumber",
        render: (row) => (
            <span style={{ fontWeight: 600, color: "#1e2f68" }}>
                {row.quoteNumber}
            </span>
        ),
        width: "12%",
    },
    {
        header: "Customer",
        accessor: "customer",
        width: "14%",
    },
    {
        header: "Issue Date",
        accessor: "issueDate",
        width: "13%",
    },
    {
        header: "Valid Till",
        accessor: "validTill",
        width: "13%",
    },
    {
        header: "Quote Amount",
        accessor: "quoteAmount",
        render: (row) => formatCurrency(row.quoteAmount),
        width: "13%",
    },
    {
        header: "Negotiation Amount",
        accessor: "negotiationAmount",
        render: (row) => formatCurrency(row.negotiationAmount),
        width: "14%",
    },
    {
        header: "Status",
        accessor: "status",
        render: (row) => (
            <span style={getStatusStyle(row.status)}>
                {row.status}
            </span>
        ),
        width: "12%",
    },
    {
        header: "Action",
        accessor: "action",
        render: (row) => (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    flexWrap: "wrap",
                }}
            >
                <button
                    type="button"
                    onClick={() =>
                        dispatch(convertQuotation(row.id))
                            .unwrap()
                            .then(() => {
                                dispatch(
                                    fetchQuotationList({
                                        page: currentPage,
                                        page_size: rowsPerPage,
                                    })
                                );
                                dispatch(fetchQuotationKpi());
                            })
                            .catch(() => undefined)
                    }
                    style={{
                        border: "1px solid #dfe3ea",
                        background: "#fff",
                        color: "#253b8c",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                    }}
                >
                    Convert SO
                </button>

                <button
                    type="button"
                    title="View quotation"
                    onClick={() =>
                        dispatch(fetchQuotationDetails(row.id))
                            .unwrap()
                            .then(showQuotation)
                            .catch(() => undefined)
                    }
                    style={{
                        border: "1px solid #dfe3ea",
                        background: "#fff",
                        borderRadius: 6,
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <FiEye size={14} />
                </button>

                <button
                    type="button"
                    title="Download quotation"
                    style={{
                        border: "1px solid #dfe3ea",
                        background: "#fff",
                        borderRadius: 6,
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <FiDownload size={14} />
                </button>

                <button
                    type="button"
                    title="Delete quotation"
                    style={{
                        border: "1px solid #dfe3ea",
                        background: "#fff",
                        borderRadius: 6,
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <FiXCircle size={14} />
                </button>
            </div>
        ),
        width: "18%",
    },
];