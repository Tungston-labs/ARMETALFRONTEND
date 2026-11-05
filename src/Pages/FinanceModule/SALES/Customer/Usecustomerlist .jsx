import { useEffect, useRef, useState } from "react";
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
    getCustomerSummary,
    addCustomer,
    editCustomer,
    updateCustomerPartial,
    uploadCustomerDocumentThunk,
    removeCustomer,
} from "../../../../Redux/finance/Sales/CustomerSlice";

// Pulls a readable message out of whatever the backend / thunk returned
const getErrorMessage = (payload, fallback) => {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    if (payload.message) return payload.message;
    if (payload.detail) return payload.detail;

    // DRF validation errors: { errors: { field: ["msg"] } } or { field: ["msg"] }
    const errors = payload.errors || payload;
    const first = Object.values(errors)[0];
    if (Array.isArray(first) && first[0]) return String(first[0]);

    return fallback;
};

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
        summary,
        summaryLoading,
    } = useSelector((state) => state.customer);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [status, setStatus] = useState("");
    const [notification, setNotification] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    
    const notificationTimer = useRef(null);
    const rowsPerPage = 10;

    // ==========================================================
    // TOP NOTIFICATION
    // ==========================================================

    const dismissNotification = () => {
        clearTimeout(notificationTimer.current);
        setNotification(null);
    };

    const notify = (type, message, title) => {
        clearTimeout(notificationTimer.current);
        setNotification({ type, message, title });
        notificationTimer.current = setTimeout(
            () => setNotification(null),
            type === "error" ? 6000 : 4000
        );
    };

    useEffect(() => () => clearTimeout(notificationTimer.current), []);

    // ==========================================================
    // CLOSE ACTION MENU WHEN CLICKING OUTSIDE
    // ==========================================================

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

    // ==========================================================
    // FETCH HELPERS
    // ==========================================================

    // Single place that builds the list query so every call stays in sync.
    const buildListParams = () => ({
        search: search.trim(),
        page,
        page_size: rowsPerPage,
        client_status: status || undefined,
    });

    const refreshList = () => dispatch(getCustomers(buildListParams()));

    const fetchSummary = () =>
        dispatch(
            getCustomerSummary({
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            })
        );

    // ==========================================================
    // LOAD LIST (debounced on search / page / status)
    // ==========================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(getCustomers(buildListParams()));
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, search, page, status]);

    useEffect(() => {
        fetchSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, startDate, endDate]);

    // ==========================================================
    // SUMMARY CARDS
    // ==========================================================

    const formatCurrency = (value) =>
        `SAR ${Number(value || 0).toLocaleString()}`;

    const monthLabel = new Date()
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();

    const cards = [
        {
            title: "Total Customers",
            count: summary?.total_customers ?? 0,
            icon: <FiUsers />,
            backgroundColor: "#E8F7EE",
            iconColor: "#127923",
        },
        {
            title: "Active Customers",
            count: summary?.active_customers ?? 0,
            icon: <FiCheckCircle />,
            backgroundColor: "#e3e7ff",
            iconColor: "#3250B5",
        },
        {
            title: `New Customers (${monthLabel})`,
            count: summary?.new_customers ?? 0,
            icon: <FiFileText />,
            backgroundColor: "#fff2e8",
            iconColor: "#F48211",
        },
        {
            title: "Inactive Customers",
            count: summary?.inactive_customers ?? 0,
            icon: <FiAlertCircle />,
            backgroundColor: "#fff3f3",
            iconColor: "#DB0F12",
        },
        {
            title: "Payments Received",
            count: formatCurrency(summary?.payments_received),
            icon: <FiDollarSign />,
            backgroundColor: "#f4fff2",
            iconColor: "#21C034",
        },
    ];

    // ==========================================================
    // MODAL HANDLERS
    // ==========================================================

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

    const handleCloseCustomerModal = () => {
        setIsCustomerModalOpen(false);
        setEditingCustomer(null);
    };

    // ==========================================================
    // ARCHIVE / RESTORE (runs immediately, result shown at the top)
    // ==========================================================

    const changeCustomerStatus = async (
        customer,
        newStatus,
        successText,
        successTitle
    ) => {
        if (!customer?.id) return;

        setOpenMenuId(null);

        const result = await dispatch(
            updateCustomerPartial({
                id: customer.id,
                customerData: { client_status: newStatus },
            })
        );

        if (result.error) {
            notify(
                "error",
                getErrorMessage(result.payload, "Could not update this customer.")
            );
            return;
        }

        notify("success", successText, successTitle);
        // The reducer only updates the row in place, so refetch to drop it
        // from the current filtered view.
        refreshList();
        fetchSummary();
    };

    const handleArchiveCustomer = (customer) =>
        changeCustomerStatus(
            customer,
            "archived",
            `${customer?.customer_name} has been archived. Restore it from the Archived filter.`,
            "Customer archived!"
        );

    const handleRestoreCustomer = (customer) =>
        changeCustomerStatus(
            customer,
            "active",
            `${customer?.customer_name} is active again.`,
            "Customer restored!"
        );

       // ==========================================================
    // PERMANENT DELETE (archived customers only)
    // ==========================================================

    // Row button: only opens the confirm modal
    const handleDeleteCustomerPermanently = (customer) => {
        if (!customer?.id) return;
        setOpenMenuId(null);
        setDeleteTarget(customer);
    };

    const cancelDeleteCustomer = () => setDeleteTarget(null);

    // Modal "Delete" button. The modal awaits this and shows its loading text.
    const confirmDeleteCustomer = async () => {
        const customer = deleteTarget;
        if (!customer?.id) return;

        const result = await dispatch(removeCustomer(customer.id));
        setDeleteTarget(null);

        if (result.error) {
            notify(
                "error",
                getErrorMessage(result.payload, "Could not delete this customer."),
                "Delete failed"
            );
            return;
        }

        notify(
            "success",
            `${customer.customer_name} was deleted permanently.`,
            "Customer deleted!"
        );

        // If that was the last row on this page, step back one page
        // (the page change triggers the debounced reload by itself).
        if (customers.length === 1 && page > 1) {
            setPage(page - 1);
        } else {
            refreshList();
        }
        fetchSummary();
    };
    // ==========================================================
    // SAVE (ADD / EDIT)
    // ==========================================================

    const handleSaveCustomer = async (customerData, documentFile) => {
        const isEditMode = modalMode === "edit" && editingCustomer?.id;

        const result = isEditMode
            ? await dispatch(
                editCustomer({ id: editingCustomer.id, customerData })
            )
            : await dispatch(addCustomer(customerData));

        if (result.error) {
            notify(
                "error",
                getErrorMessage(
                    result.payload,
                    isEditMode
                        ? "Could not update the customer."
                        : "Could not create the customer."
                )
            );
            return;
        }

        const customerId = isEditMode
            ? editingCustomer.id
            : result.payload?.data?.id;

        let uploadFailed = false;

        if (documentFile && customerId) {
            const uploadResult = await dispatch(
                uploadCustomerDocumentThunk({
                    id: customerId,
                    documentName: documentFile.name,
                    file: documentFile,
                })
            );

            uploadFailed = Boolean(uploadResult.error);
        }

        setIsCustomerModalOpen(false);

        if (uploadFailed) {
            notify(
                "error",
                "The customer was saved, but the document upload failed. Upload it again from the customer's overview.",
                "Document upload failed"
            );
        } else {
            notify(
                "success",
                isEditMode
                    ? "The customer details were updated."
                    : "The new customer was added to your list.",
                isEditMode ? "Customer updated!" : "Customer created!"
            );
        }

        refreshList();
        fetchSummary();
    };

    // ==========================================================
    // NAVIGATION
    // ==========================================================

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

    // ==========================================================
    // MISC
    // ==========================================================

    const handleExport = () => {
        console.log("Export Customer List", {
            startDate,
            endDate,
            search,
            status,
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
        summaryLoading,
        selectedCustomer,
        cards,

        // top notification
        notification,
        dismissNotification,

        // table actions menu
        openMenuId,
        toggleActionsMenu,
        handleCreateInvoice,
        handleViewLedger,
        handleViewOverview,

        // filters
        search,
        setSearch,
        status,
        setStatus,
        page,
        setPage,
        startDate,
        endDate,
        deleteTarget,
        // customer form modal
        isCustomerModalOpen,
        modalMode,
        editingCustomer,

        // handlers
        handleAddCustomer,
        handleViewCustomer,
        handleEditCustomer,
        handleArchiveCustomer,
        handleDeleteCustomerPermanently,
        cancelDeleteCustomer,
        confirmDeleteCustomer,
        handleRestoreCustomer,
        handleSaveCustomer,
        handleCloseCustomerModal,
        handleExport,
        handleStartDateChange,
        handleEndDateChange,
    };
};