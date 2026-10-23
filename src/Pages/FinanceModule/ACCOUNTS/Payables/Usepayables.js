import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getPayables } from "../../../../Redux/finance/accounts/payableSlice";
import {
    getVendors,
    selectVendors,
} from "../../../../Redux/finance/purchases/vendorsSlice";

export const ROWS_PER_PAGE = 10;

// UI label -> API value
export const STATUS_MAP = {
    Unpaid: "unpaid",
    "Partially Paid": "partially_paid",
    Paid: "paid",
    Overdue: "overdue",
};

// Adjust the name fields to match your vendor API response
const getVendorName = (v) =>
    v.name || v.vendor_name || v.company_name || `Vendor #${v.id}`;

const usePayables = () => {
    const dispatch = useDispatch();

    const { payables, dashboard, pagination, loading, error } = useSelector(
        (state) => state.payable
    );
    const vendors = useSelector(selectVendors);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [vendor, setVendor] = useState("all");
    const [status, setStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Load vendors for the dropdown
    useEffect(() => {
        dispatch(getVendors({ page: 1, page_size: 100 }));
    }, [dispatch]);

    const vendorOptions = useMemo(
        () => [
            { label: "All Vendors", value: "all" },
            ...vendors.map((v) => ({
                label: getVendorName(v),
                value: String(v.id),
            })),
        ],
        [vendors]
    );

    // Debounce search (400ms)
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    // Fetch whenever any filter or the page changes
    useEffect(() => {
        dispatch(
            getPayables({
                page: currentPage,
                page_size: ROWS_PER_PAGE,
                search: debouncedSearch,
                vendor_id: vendor === "all" ? "" : vendor,
                status: STATUS_MAP[status] || "",
                date_from: dateFrom,
                date_to: dateTo,
            })
        );
    }, [dispatch, currentPage, debouncedSearch, vendor, status, dateFrom, dateTo]);

    const handleVendorChange = (value) => {
        setVendor(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
        setCurrentPage(1);
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
        setCurrentPage(1);
    };

    const handleExportExcel = () => {
        console.log("Export Payables to Excel");
    };

    return {
        // data
        payables,
        dashboard,
        pagination,
        loading,
        error,
        vendorOptions,
        statuses: Object.keys(STATUS_MAP),

        // filter values
        search,
        vendor,
        status,
        dateFrom,
        dateTo,

        // handlers
        onSearch: setSearch,
        onVendorChange: handleVendorChange,
        onStatusChange: handleStatusChange,
        onDateFromChange: handleDateFromChange,
        onDateToChange: handleDateToChange,
        onPageChange: setCurrentPage,
        onExport: handleExportExcel,
    };
};

export default usePayables;