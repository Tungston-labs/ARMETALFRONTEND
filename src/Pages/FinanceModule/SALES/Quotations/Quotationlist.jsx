import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiDownload, FiEye } from "react-icons/fi";
import { LuEraser } from "react-icons/lu"; // if this fails, use FiSlash from "react-icons/fi"

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
    ExportButton,
} from "./QuotationsList.styles";
import {
    getQuotations,
    selectQuotations,
    selectQuotationLoading,
} from "../../../../Redux/finance/Sales/Quotationslice";

const EMPTY = "------";

const formatAmount = (value) => {
    if (value === null || value === undefined || value === "" || Number(value) === 0) {
        return EMPTY;
    }
    return `SAR ${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

// "April 1, 2026" (local to this page, other pages using formatDate are untouched)
const formatLongDate = (value) => {
    if (!value) return EMPTY;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
};

const STATUS_COLORS = {
    pending: "#F5820D",
    approved: "#1E7A3C",
    rejected: "#D92D20",
    converted: "#1D4ED8",
};

const convertBtnStyle = {
    background: "#fff",
    color: "#101828",
    border: "1px solid #D0D5DD",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
};

const iconBtnStyle = {
    background: "#fff",
    border: "1px solid #D0D5DD",
    borderRadius: 6,
    width: 28,
    height: 28,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#344054",
    padding: 0,
};

const getQuotationColumns = ({ onConvert, onView, onDownload, onClear }) => [
    { accessor: "quote_number", header: "Quote No.", width: "110px" },
    { accessor: "customer_name", header: "Customer" },
    {
        accessor: "issue_date",
        header: "Issue Date",
        render: (row) => formatLongDate(row.issue_date),
    },
    {
        accessor: "valid_till",
        header: "Valid Till",
        render: (row) => formatLongDate(row.valid_till),
    },
    {
        accessor: "sub_total",
        header: "Old Quote Amt",
        render: (row) => formatAmount(row.sub_total),
    },
    {
        accessor: "negotiation_amount",
        header: "Negotiation Amount",
        render: (row) => formatAmount(row.negotiation_amount),
    },
    {
        accessor: "quote_amount",
        header: "Quote Value",
        render: (row) => formatAmount(row.quote_amount),
    },
    {
        accessor: "status",
        header: "Status",
        render: (row) => {
            const key = String(row.status || "").toLowerCase();
            return (
                <span
                    style={{
                        color: STATUS_COLORS[key] || "#344054",
                        fontSize: 13,
                        fontWeight: 500,
                        textTransform: "capitalize",
                    }}
                >
                    {row.status}
                </span>
            );
        },
    },
    {
        accessor: "action",
        header: "Action",
        render: (row) => {
            const key = String(row.status || "").toLowerCase();
            return (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {key === "approved" && (
                        <button
                            type="button"
                            style={convertBtnStyle}
                            onClick={() => onConvert(row)}
                        >
                            Convert SO
                        </button>
                    )}
                    <button
                        type="button"
                        title="View"
                        style={iconBtnStyle}
                        onClick={() => onView(row)}
                    >
                        <FiEye size={14} />
                    </button>
                    <button
                        type="button"
                        title="Download"
                        style={iconBtnStyle}
                        onClick={() => onDownload(row)}
                    >
                        <FiDownload size={14} />
                    </button>
                    {key === "rejected" && (
                        <button
                            type="button"
                            title="Clear"
                            style={iconBtnStyle}
                            onClick={() => onClear(row)}
                        >
                            <LuEraser size={14} />
                        </button>
                    )}
                </div>
            );
        },
    },
];

const EMPTY_LIST = [];

const Quotationlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quotations = useSelector(selectQuotations) ?? EMPTY_LIST;
    const loading = useSelector(selectQuotationLoading);
    const totalPages = useSelector((s) => s.quotation?.totalPages || 1);
    const currentPage = useSelector((s) => s.quotation?.currentPage || 1);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setPage(1);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setPage(1);
    };

    // Row actions (routes are placeholders: adjust to your app)
    const handleConvert = (row) => navigate(`/sales/add-sales-order?quotation=${row.id}`);
    const handleView = (row) => navigate(`/sales/quotations/${row.id}`);
    const handleDownload = (row) => {
        // call your PDF/download endpoint for row.id
    };
    const handleClear = (row) => {
        // your clear/delete action for row.id
    };

    const columns = useMemo(
        () =>
            getQuotationColumns({
                onConvert: handleConvert,
                onView: handleView,
                onDownload: handleDownload,
                onClear: handleClear,
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [navigate]
    );

    // Reset to page 1 when search/status change
    useEffect(() => {
        setPage(1);
    }, [search, status]);

    // Fetch from API whenever filters or page change
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                getQuotations({
                    page,
                    search: search || undefined,
                    status: status || undefined,
                    ordering: "-created_at",
                    // Date range: enable once your backend supports range filters
                    // issue_date_after: startDate || undefined,
                    // issue_date_before: endDate || undefined,
                })
            );
        }, 400); // debounce typing in search

        return () => clearTimeout(timer);
    }, [dispatch, page, search, status, startDate, endDate]);

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Quotations"
                breadcrumbs={["Sales", "Quotations"]}
                buttonText="+ ADD NEW QUOTATION"
                onButtonClick={() => navigate("/sales/add-Quotation")}
            >
                <ExportButton type="button">
                    <FiDownload />
                    Export
                </ExportButton>

                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            max={endDate || undefined}
                            aria-label="Start date"
                        />
                        <DateSeparator>-</DateSeparator>
                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            min={startDate || undefined}
                            aria-label="End date"
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>
            </ReusableHeader>

            <ReusableFilter
                search={search}
                onSearch={setSearch}
                status={status}
                statuses={["pending", "approved", "rejected", "converted"]}
                onStatus={setStatus}
                showSearch
                showStatus
            />

            <ReusableTable columns={columns} data={quotations} loading={loading} />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
};

export default Quotationlist;