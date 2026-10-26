import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerReport } from "../../../../Redux/finance/reports/Customerreportslice";
import {
    getCustomers,
    selectCustomers,
} from "../../../../Redux/finance/Sales/CustomerSlice";
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

const useCustomerReport = () => {
    const dispatch = useDispatch();

    const { report, summary, pagination, loading, error } = useSelector(
        (state) => state.customerReport
    );

    const customers = useSelector(selectCustomers);

    // Server-side params
    const [selectedYear, setSelectedYear] = useState(
        String(new Date().getFullYear())
    );
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [currentPage, setCurrentPage] = useState(1);

    // Client-side filters (applied to the loaded page)
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");

    // Fetch report whenever year, month or page changes
    useEffect(() => {
        dispatch(
            getCustomerReport({
                date_from: `${selectedYear}-01-01`,
                date_to: `${selectedYear}-12-31`,
                chart_year: selectedYear,
                graph_year: selectedYear,
                graph_month: selectedMonth,
                page: currentPage,
            })
        );
    }, [dispatch, selectedYear, selectedMonth, currentPage]);

    // Load customer list for the dropdown
    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    // Customer dropdown options from the customer slice
    const customerOptions = useMemo(
        () =>
            customers.map((item) => ({
                value: String(item.id),
                label:
                    item.name ||
                    item.customer_name ||
                    item.company_name ||
                    `Customer ${item.id}`,
            })),
        [customers]
    );

    // Filtered rows (amounts stay numeric so sorting works)
    const tableData = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return report
            .filter((item) => {
                const matchesSearch =
                    !searchValue ||
                    [item.customer_name, item.invoice, item.status].some(
                        (value) =>
                            String(value ?? "")
                                .toLowerCase()
                                .includes(searchValue)
                    );

                const matchesStatus =
                    !status || normalize(item.status) === normalize(status);

                const matchesCustomer =
                    !customer || String(item.customer_id) === customer;

                return matchesSearch && matchesStatus && matchesCustomer;
            })
            .map((item) => ({ ...item, id: item.invoice }));
    }, [report, search, status, customer]);

    const totalPages = Math.max(1, Math.ceil(pagination.count / PAGE_SIZE));

    // Year / month come from the charts, reset to first page
    const handleYearChange = (year) => {
        setSelectedYear(year);
        setCurrentPage(1);
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(Number(month));
        setCurrentPage(1);
    };

    return {
        // data
        summary,
        tableData,
        customerOptions,
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
        customer,
        setSearch,
        setStatus,
        setCustomer,
    };
};

export default useCustomerReport;