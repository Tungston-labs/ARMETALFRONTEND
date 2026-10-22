import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getSalesReport,
    exportSalesReport,
} from "../../../../Redux/finance/reports/Salesreportslice";
import {
    getCustomers,
    selectCustomers,
} from "../../../../Redux/finance/Sales/CustomerSlice";
import { buildCustomerOptions } from "./Salesreportconfig";

const useSalesReport = () => {
    const dispatch = useDispatch();
    const customerList = useSelector(selectCustomers);

    const customerOptions = useMemo(
        () => buildCustomerOptions(customerList),
        [customerList]
    );

    useEffect(() => {
        dispatch(getCustomers({ page: 1, page_size: 1000 }));
    }, [dispatch]);
    const {
        invoices,
        summary,
        chart,
        pagination,
        loading,
        error,
        exporting,
        exportError,
    } = useSelector((state) => state.salesReport);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("all");
    const [category, setCategory] = useState("all");
    const [year, setYear] = useState(new Date().getFullYear());
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filters = useMemo(
        () => ({
            status: status.toLowerCase(),
            customer,
            category,
            year,
            date_from: dateFrom,
            date_to: dateTo,
        }),
        [status, customer, category, year, dateFrom, dateTo]);

    useEffect(() => {
        dispatch(getSalesReport({ ...filters, page: currentPage }));
    }, [dispatch, filters, currentPage]);

    const rows = useMemo(() => {
        const term = search.trim().toLowerCase();

        return invoices
            .filter(
                (inv) =>
                    !term ||
                    inv.invoice_number?.toLowerCase().includes(term) ||
                    inv.customer?.toLowerCase().includes(term)
            )
            .map((inv) => ({
                id: inv.invoice_id,
                invoice_number: inv.invoice_number,
                date: inv.date,
                customer: inv.customer,
                amount: Number(inv.amount),
                tax_amount: Number(inv.tax_amount),
                discount: Number(inv.discount),
                net_amount: Number(inv.net_amount),
                paid: Number(inv.paid),
                credited: Number(inv.credited),
                products_sold: Number(inv.products_sold),
                status: inv.status,
            }));
    }, [invoices, search]);

    // Handlers (every table filter change resets to page 1)
    const handleSearch = (value) => setSearch(value);

    const handleStatus = (value) => {
        setStatus(value || "");
        setCurrentPage(1);
    };

    const handleCustomerChange = (value) => {
        setCustomer(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
        setCurrentPage(1);
    };

    const handleDateFromChange = (event) => {
        setDateFrom(event.target.value);
        setCurrentPage(1);
    };

    const handleDateToChange = (event) => {
        setDateTo(event.target.value);
        setCurrentPage(1);
    };
    // Year only changes the chart, so the table page is kept
    const handleYearChange = (value) => setYear(Number(value));

    const handleExport = () => dispatch(exportSalesReport(filters));

    return {
        // filters
        search,
        status,
        customer,
        category,
        year,
        dateFrom,
        dateTo,

        // data
        rows,
        customerOptions,
        summary,
        chart,

        // pagination
        currentPage,
        totalPages: pagination.totalPages,
        setCurrentPage,

        // request state
        loading,
        error,
        exporting,
        exportError,

        // handlers
        handleSearch,
        handleStatus,
        handleCustomerChange,
        handleCategoryChange,
        handleYearChange,
        handleExport,
        handleDateFromChange,
        handleDateToChange,
    };
};

export default useSalesReport;