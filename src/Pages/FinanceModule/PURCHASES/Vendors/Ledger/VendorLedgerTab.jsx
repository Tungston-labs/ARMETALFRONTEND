import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    FiDollarSign,
    FiFileText,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";

import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";
import { vendorLedgerColumns } from "./dummydata";
import {
    getVendorLedger,
    clearVendorLedger,
    selectVendorDetail,
} from "../../../../../Redux/finance/purchases/Vendordetailslice";

const LEDGER_TYPES = ["Manual Entry", "Credit Note", "Debit Note"];
const ROWS_PER_PAGE = 10;

const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatError = (error) => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error.detail) return error.detail;
    return Object.entries(error)
        .map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(", ") : m}`)
        .join(" | ");
};

// vendorId can come from the parent as a prop, or from the route
const VendorLedgerTab = ({ vendorId: vendorIdProp }) => {
    const dispatch = useDispatch();
    const params = useParams();
    // Same lookup as the Overview and Purchase Orders tabs
    const vendorId = vendorIdProp ?? params.id ?? params.vendorId;

    const {
        ledger = [],
        ledgerCards = null,
        ledgerLoading = false,
        ledgerError = null,
    } = useSelector(selectVendorDetail) || {};

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Temporary: remove once the API call shows up in the Network tab
    console.log("VendorLedgerTab", { vendorId, params, vendorIdProp });

    // Debounce search so we don't call the API on every keystroke
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    // Fetch whenever vendor or filters change
    useEffect(() => {
        if (!vendorId) return;
        dispatch(
            getVendorLedger({
                vendorId,
                params: {
                    search: debouncedSearch,
                    type: type === "All" ? "" : type,
                },
            })
        );
        setCurrentPage(1);
    }, [dispatch, vendorId, debouncedSearch, type]);

    // Clear stale data when leaving the tab or switching vendors
    useEffect(() => {
        return () => {
            dispatch(clearVendorLedger());
        };
    }, [dispatch, vendorId]);

    // Map API fields to the keys vendorLedgerColumns uses
    const rows = useMemo(
        () =>
            ledger.map((r) => ({
                id: r.id,
                date: r.entry_date,
                reference: r.reference_number,
                description: r.description,
                type: r.type,
                debit: formatAmount(r.debit_amount),
                credit: formatAmount(r.credit_amount),
                balance: formatAmount(r.running_balance),
            })),
        [ledger]
    );

    // Client-side pagination (the endpoint returns all rows)
    const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        return rows.slice(start, start + ROWS_PER_PAGE);
    }, [rows, currentPage]);

    // Totals across ALL filtered rows; balance is the closing balance
    const totalRow = useMemo(() => {
        const debit = ledger.reduce((s, r) => s + Number(r.debit_amount || 0), 0);
        const credit = ledger.reduce((s, r) => s + Number(r.credit_amount || 0), 0);
        const closing = ledger.length
            ? ledger[ledger.length - 1].running_balance
            : 0;
        return {
            debit: formatAmount(debit),
            credit: formatAmount(credit),
            balance: formatAmount(closing),
        };
    }, [ledger]);

    const statsCards = [
        {
            title: "Opening Balance",
            count: formatAmount(ledgerCards?.total_opening_balance),
            icon: <FiDollarSign />,
            backgroundColor: "#EEF2FF",
            iconColor: "#4F46E5",
        },
        {
            title: "Total Billed",
            count: formatAmount(ledgerCards?.total_billed),
            icon: <FiFileText />,
            backgroundColor: "#FFF7ED",
            iconColor: "#F59E0B",
        },
        {
            title: "Paid & Debit Note",
            count: formatAmount(ledgerCards?.total_paid_and_debit_note),
            icon: <FiCheckCircle />,
            backgroundColor: "#ECFDF5",
            iconColor: "#10B981",
        },
        {
            title: "Outstanding Payable",
            count: formatAmount(ledgerCards?.outstanding_payable),
            icon: <FiAlertCircle />,
            backgroundColor: "#FEF2F2",
            iconColor: "#EF4444",
        },
    ];

    if (!vendorId) {
        return (
            <p style={{ padding: 24, color: "#B00020" }}>
                No vendor id found. Route params: {Object.keys(params).join(", ") || "none"}.
            </p>
        );
    }

    const errorMessage = formatError(ledgerError);

    return (
        <>
            <StatsCards cards={statsCards} />

            <ReusableFilter
                search={search}
                onSearch={setSearch}
                status={type}
                statuses={LEDGER_TYPES}
                onStatus={setType}
                showSearch
                showStatus
            />

            {errorMessage && (
                <div style={{ color: "#EF4444", padding: "8px 0" }}>
                    {errorMessage}
                </div>
            )}

            {ledgerLoading ? (
                <div style={{ padding: "24px", textAlign: "center" }}>
                    Loading ledger...
                </div>
            ) : (
                <ReusableTable
                    columns={vendorLedgerColumns}
                    data={paginatedData}
                    totalRow={totalRow}
                    totalRowLabel="TOTAL"
                />
            )}

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={rows.length}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default VendorLedgerTab;