import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    FiUsers,
    FiDollarSign,
    FiFileText,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";

import {
    getCustomers,
    getCustomerById,
    addCustomer,
    editCustomer,
    removeCustomer,
} from "../../../../Redux/finance/CustomerSlice";

// ============================================================
// All state, effects, and handlers for the Customer List page.
// The component only renders — it doesn't own any logic.
// ============================================================
export const useCustomerList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        customers,
        totalPages,
            totalItems,  
        currentPage,
        loading,
        selectedCustomer,
    } = useSelector((state) => state.customer);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const rowsPerPage = 10;

    // ============================================================
    // CLOSE ACTION MENU WHEN CLICKING OUTSIDE
    // ============================================================
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest("[data-menu-root]")) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleActionsMenu = (rowId) => {
        setOpenMenuId((prev) => (prev === rowId ? null : rowId));
    };

    // ============================================================
    // FETCH CUSTOMERS
    // ============================================================
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                getCustomers({
                    search: search.trim(),
                    page,
                    page_size: rowsPerPage,
                })
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [dispatch, search, page]);

    // ============================================================
    // STATS
    // ============================================================
    const formatCurrency = (value) =>
        `SAR ${Number(value || 0).toLocaleString()}`;

    const totalCustomers = customers?.length || 0;

    const totalCreditLimit = customers?.reduce(
        (total, customer) => total + Number(customer.credit_limit || 0),
        0
    );

    const totalInvoices = customers?.reduce(
        (total, customer) => total + Number(customer.total_invoices || 0),
        0
    );

    const totalPaymentsReceived = customers?.reduce(
        (total, customer) =>
            total + Number(customer.payments_received || 0),
        0
    );

    const totalOutstanding = customers?.reduce(
        (total, customer) => total + Number(customer.balance || 0),
        0
    );

    const cards = [
        {
            title: "Total Customers",
            count: totalCustomers,
            icon: <FiUsers />,
            backgroundColor: "#E8F7EE",
            iconColor: "#127923",
        },
        {
            title: "Active Customers",
            count: formatCurrency(totalCreditLimit),
            icon: <FiDollarSign />,
            backgroundColor: "#e3e7ff",
            iconColor: "#3250B5",
        },
        {
            title: "New Customers (MAY)",
            count: totalInvoices,
            icon: <FiFileText />,
            backgroundColor: "#fff2e8",
            iconColor: "#F48211",
        },
        {
            title: "Inactive Customers",
            count: formatCurrency(totalPaymentsReceived),
            icon: <FiCheckCircle />,
            backgroundColor: "#fff3f3",
            iconColor: "#DB0F12",
        },
        {
            title: "Payments Received",
            count: formatCurrency(totalOutstanding),
            icon: <FiAlertCircle />,
            backgroundColor: "#f4fff2",
            iconColor: "#21C034",
        },
    ];

    // ============================================================
    // CUSTOMER ACTIONS
    // ============================================================
    const handleAddCustomer = () => {
        setModalMode("add");
        setEditingCustomer(null);
        setIsCustomerModalOpen(true);
    };

    const handleViewCustomer = (customer) => {
        dispatch(getCustomerById(customer.id));
        setModalMode("view");
        setEditingCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    const handleEditCustomer = (customer) => {
        dispatch(getCustomerById(customer.id));
        setModalMode("edit");
        setEditingCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    const handleDeleteCustomer = (customer) => {
        if (!customer?.id) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${customer.customer_name}?`
        );

        if (!confirmed) return;

        dispatch(removeCustomer(customer.id));
    };

    const handleSaveCustomer = async (customerData) => {
        if (modalMode === "edit" && editingCustomer?.id) {
            const result = await dispatch(
                editCustomer({ id: editingCustomer.id, customerData })
            );

            if (!result.error) {
                setIsCustomerModalOpen(false);
                dispatch(
                    getCustomers({
                        search: search.trim(),
                        page,
                        page_size: rowsPerPage,
                    })
                );
            }
            return;
        }

        const result = await dispatch(addCustomer(customerData));

        if (!result.error) {
            setIsCustomerModalOpen(false);
            dispatch(
                getCustomers({
                    search: search.trim(),
                    page,
                    page_size: rowsPerPage,
                })
            );
        }
    };

    const handleCloseCustomerModal = () => {
        setIsCustomerModalOpen(false);
        setEditingCustomer(null);
    };

    const handleCreateInvoice = (customer) => {
        if (!customer?.id) return;
        navigate(`${customer.id}/invoices`);
    };

    const handleViewLedger = (customer) => {
        if (!customer?.id) return;
        navigate(`${customer.id}/ledger`);
    };

    const handleViewOverview = (customer) => {
        if (!customer?.id) return;
        navigate(`${customer.id}/overview`);
    };

    // ============================================================
    // EXPORT / DATE RANGE
    // NOTE: previously called setCurrentPage, which doesn't exist
    // on this page — fixed to setPage(1), matching the rest of the
    // filters (search/status resets also go back to page 1).
    // ============================================================
    const handleExport = () => {
        console.log("Export Customer List", {
            startDate,
            endDate,
            search,
        });
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        setPage(1);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        setPage(1);
    };

    return {
        // data
        customers,
        totalPages,
          totalRecords: totalItems,  
        currentPage,
        loading,
        selectedCustomer,
        cards,

        // row action handlers (used by the UI file to build columns)
        openMenuId,
        toggleActionsMenu,
        handleCreateInvoice,
        handleViewLedger,
        handleViewOverview,

        // filter state
        search,
        setSearch,
        page,
        setPage,
        startDate,
        endDate,

        // modal state
        isCustomerModalOpen,
        modalMode,
        editingCustomer,

        // handlers
        handleAddCustomer,
        handleViewCustomer,
        handleEditCustomer,
        handleDeleteCustomer,
        handleSaveCustomer,
        handleCloseCustomerModal,
        handleExport,
        handleStartDateChange,
        handleEndDateChange,
    };
};