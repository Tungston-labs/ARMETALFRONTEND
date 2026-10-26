import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getRecurringBilling,
    getRecurringSummary,
    addRecurringService,
    updateRecurringServicePartial,
} from "../../../../Redux/finance/Sales/recurringSlice";
import {
    fetchCustomersList,
    fetchCategoriesList,
    fetchProductsList,
} from "../../../../services/finance/Sales/RecurringService";
import { FiCheckCircle, FiClock, FiDollarSign, FiShoppingCart, FiXCircle } from "react-icons/fi";

const getCurrentMonthRange = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    return {
        start: formatDate(firstDay),
        end: formatDate(lastDay),
    };
};

export const useRecurringBilling = () => {
    const dispatch = useDispatch();
    const currentMonth = getCurrentMonthRange();

    /* ===============================
       FILTER STATES
    =============================== */

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");

    const [billingCycle, setBillingCycle] = useState("");
    const [service, setService] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    /* ===============================
       MODAL STATE
    =============================== */

    const [showProductServiceModal, setShowProductServiceModal] = useState(false);

    /* ===============================
       LOOKUP DATA (for the modal's
       customer + category dropdowns)
    =============================== */

    const [customers, setCustomers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [lookupsLoading, setLookupsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        setLookupsLoading(true);

        Promise.all([
            fetchCustomersList().catch((err) => {
                console.error("Failed to load customers list", err);
                return null;
            }),
            fetchCategoriesList().catch((err) => {
                console.error("Failed to load categories list", err);
                return null;
            }),
            fetchProductsList().catch((err) => {
                console.error("Failed to load products list", err);
                return null;
            }),
        ]).then(([customerRes, categoryRes, productRes]) => {
            if (!isMounted) return;

            console.log("Raw customers response:", customerRes);
            console.log("Raw categories response:", categoryRes);
            console.log("Raw products response:", productRes);

            setCustomers(
                customerRes?.results || customerRes?.data || customerRes || []
            );
            setCategories(
                categoryRes?.results || categoryRes?.data || categoryRes || []
            );
            setProducts(
                productRes?.results || productRes?.data || productRes || []
            );
            setLookupsLoading(false);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    /* ===============================
       REDUX STATE
    =============================== */

    const {
        billing,
        billingTotalPages,
        billingLoading,
        summary,
        summaryLoading,
    } = useSelector((state) => state.recurring);

    /* ===============================
       FETCH BILLING LIST
       renewal_from / renewal_to come straight from the header's
       start/end date picker.
    =============================== */

    useEffect(() => {
        dispatch(
            getRecurringBilling({
                page: currentPage,
                search: search || undefined,
                recurrence_status: status || undefined,
                customer: customer || undefined,
                frequency: billingCycle || undefined,
                renewal_from: startDate || undefined,
                renewal_to: endDate || undefined,
            })
        );
    }, [dispatch, currentPage, search, status, customer, billingCycle, startDate, endDate]);

    /* ===============================
       FETCH SUMMARY
    =============================== */

    useEffect(() => {
        dispatch(getRecurringSummary());
    }, [dispatch]);

    /* ===============================
       STATS
    =============================== */
    const recurringStats = [
        {
            title: "Active Subscriptions",
            count: summary?.active_subscription ?? 0,
            icon: <FiShoppingCart />,
            backgroundColor: "#E8F1FF",
            iconColor: "#3478F6",
        },

        {
            title: "Monthly Revenue",
            count: Number(summary?.total_monthly_revenue_amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2, }),
             icon: <FiDollarSign />, 
             backgroundColor: "#FFF4E5", 
             iconColor: "#F59E0B",
        },
        {
            title: "Upcoming Renewals",
            count: summary?.upcoming_renewal ?? 0,
            icon: <FiCheckCircle />,
            backgroundColor: "#E8F8EF",
            iconColor: "#22A06B",
        },
        {
            title: "Auto Generated Invoices",
            count: summary?.auto_generated_invoice_month ?? 0,
            icon: <FiClock />,
            backgroundColor: "#FFF4E5",
            iconColor: "#F59E0B",
        },
        {
            title: "Expired Contracts",
            count: summary?.expired_contract_count ?? 0,
            icon: <FiXCircle />,
            backgroundColor: "#FDECEC",
            iconColor: "#E5484D",
        },
    ];
    /* ===============================
       FILTER DEFINITIONS
       (renewal date filter removed — now handled by the header's
       start/end date picker instead of a preset dropdown)
    =============================== */

    const filterDefs = [
        {
            key: "customer",
            value: customer,
            onChange: (value) => {
                setCustomer(value);
                setCurrentPage(1);
            },
            options: customers.map((c) => ({
                label: c.customer_name || c.name || `Customer #${c.id}`,
                value: c.id,
            })),
            placeholder: "All Customer",
        },
        {
            key: "billingCycle",
            value: billingCycle,
            onChange: (value) => {
                setBillingCycle(value);
                setCurrentPage(1);
            },
            options: [
                { label: "Monthly", value: "monthly" },
                { label: "Quarterly", value: "quarterly" },
                { label: "Half Yearly", value: "half_yearly" },
                { label: "Yearly", value: "yearly" },
            ],
            placeholder: "All Billing Cycle",
        },
    ];

    /* ===============================
       DATE HANDLERS
       These now double as the renewal date range filter.
    =============================== */

    const handleStartDateChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setStartDate("");
            return;
        }
        setStartDate(value);
        setCurrentPage(1);
        if (endDate && value > endDate) {
            setEndDate(value);
        }
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setEndDate("");
            return;
        }
        if (startDate && value < startDate) {
            return;
        }
        setEndDate(value);
        setCurrentPage(1);
    };

    /* ===============================
       SEARCH / STATUS HANDLERS
    =============================== */

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatus = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    /* ===============================
       EXPORT
    =============================== */

    const handleExport = () => {
        console.log("Export Recurring Billing", {
            startDate,
            endDate,
            search,
            status,
            customer,
            billingCycle,
            service,
        });
    };

    const handleSaveProductService = (data, files = {}) => {
        dispatch(addRecurringService(data))
            .unwrap()
            .then((res) => {
                const createdServiceId = res?.data?.service?.id;

                const hasFiles =
                    (files.product_icon || files.screenshot) &&
                    createdServiceId;

                if (hasFiles) {
                    const formData = new FormData();
                    if (files.product_icon) {
                        formData.append("product_icon", files.product_icon);
                    }
                    if (files.screenshot) {
                        formData.append("screenshot", files.screenshot);
                    }

                    dispatch(
                        updateRecurringServicePartial({
                            id: createdServiceId,
                            payload: formData,
                        })
                    );
                }

                setShowProductServiceModal(false);
                dispatch(
                    getRecurringBilling({
                        page: currentPage,
                        search: search || undefined,
                    })
                );
                dispatch(getRecurringSummary());
            })
            .catch((err) => {
                console.error("Failed to create recurring service", err);
            });
    };

    return {
        // data
        billing,
        billingTotalPages,
        billingLoading,
        recurringStats,
        summaryLoading,

        // lookups for the modal
        customers,
        categories,
        products,
        lookupsLoading,

        // filter state + setters
        search,
        status,
        startDate,
        endDate,
        filterDefs,
        statuses: ["active", "inactive", "expired", "cancelled", "completed"],

        // pagination
        currentPage,
        setCurrentPage,

        // modal
        showProductServiceModal,
        setShowProductServiceModal,

        // handlers
        handleSearch,
        handleStatus,
        handleStartDateChange,
        handleEndDateChange,
        handleExport,
        handleSaveProductService,
    };
};