import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getVendorReport } from "../../../../Redux/finance/reports/Vendorreportslice";
import {
    getVendors,
    selectVendors,
} from "../../../../Redux/finance/purchases/vendorsSlice";

export const PAGE_SIZE = 15;

export const STATUS_OPTIONS = ["Paid", "Partially Paid", "Unpaid", "Overdue"];

export const formatSAR = (value) =>
    `SAR ${Number(value || 0).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })}`;

export const normalize = (value) =>
    String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");

const useVendorReport = () => {
    const dispatch = useDispatch();

    const { report, kpis, pagination, loading, error } = useSelector(
        (state) => state.vendorReport
    );

    const vendors = useSelector(selectVendors);
    const [selectedYear, setSelectedYear] = useState(
        String(new Date().getFullYear())
    );
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState("");
    const [vendor, setVendor] = useState("");
    const [paymentTerm, setPaymentTerm] = useState("");
    const [search, setSearch] = useState("");
    const [knownTerms, setKnownTerms] = useState({});

    useEffect(() => {
        const params = {
            date_from: `${selectedYear}-01-01`,
            date_to: `${selectedYear}-12-31`,
            chart_year: selectedYear,
            graph_year: selectedYear,
            graph_month: selectedMonth,
            page: currentPage,
            page_size: PAGE_SIZE,
        };

        if (vendor) params.vendor = vendor;
        if (status) params.payment_status = normalize(status);
        if (paymentTerm) params.payment_term = paymentTerm;

        dispatch(getVendorReport(params));
    }, [
        dispatch,
        selectedYear,
        selectedMonth,
        currentPage,
        vendor,
        status,
        paymentTerm,
    ]);

    useEffect(() => {
        dispatch(getVendors({ page_size: 1000 }));
    }, [dispatch]);

  useEffect(() => {
    if (!report.length) return;

    setKnownTerms((prev) => {
        const next = { ...prev };
        report.forEach((item) => {
            if (item.payment_term) {
                next[item.payment_term] = String(item.payment_term)
                    .replace(/_/g, " ")
                    .replace(/^\w/, (c) => c.toUpperCase()); // "7 days" -> "7 days"
            }
        });
        return next;
    });
}, [report]);

    const vendorOptions = useMemo(
        () =>
            vendors.map((item) => ({
                value: String(item.id),
                label:
                    item.vendor_name ||
                    item.name ||
                    item.company_name ||
                    `Vendor ${item.id}`,
            })),
        [vendors]
    );

  const paymentTermOptions = useMemo(
    () =>
        Object.entries(knownTerms)
            .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
            .map(([value, label]) => ({ value, label })),
    [knownTerms]
);

    const tableData = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return report
            .filter((item) => {
                if (!searchValue) return true;

                return [
                    item.vendor_name,
                    item.vendor_code,
                    item.status,
                    ...(item.purchase_orders || []),
                ].some((value) =>
                    String(value ?? "").toLowerCase().includes(searchValue)
                );
            })
            .map((item) => ({
                ...item,
                id: item.vendor_id,
                po_count: item.purchase_orders?.length || 0,
            }));
    }, [report, search]);

    const summary = {
        totalVendors: kpis.totalVendors,
        totalBills: kpis.totalBills,
        totalPayments: kpis.totalPayments,
        outstandingPayables: kpis.outstandingPayables,
    };

    const totalPages = Math.max(1, pagination.totalPages || 1);
    const handleYearChange = (year) => {
        setSelectedYear(year);
        setCurrentPage(1);
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(Number(month));
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleVendorChange = (value) => {
        setVendor(value);
        setCurrentPage(1);
    };

    const handlePaymentTermChange = (value) => {
        setPaymentTerm(value);
        setCurrentPage(1);
    };

    return {
        summary,
        tableData,
        vendorOptions,
        paymentTermOptions,
        loading,
        error,

        // pagination
        currentPage,
        totalPages,
        setCurrentPage,

        // chart params
        selectedYear,
        selectedMonth,
        handleYearChange,
        handleMonthChange,

        // filters
        search,
        status,
        vendor,
        paymentTerm,
        setSearch,
        handleStatusChange,
        handleVendorChange,
        handlePaymentTermChange,
    };
};

export default useVendorReport;