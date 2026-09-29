import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    getVendors,
    getVendorDashboard,
    addVendor,
    editVendor,
    removeVendor,
    uploadVendorDocumentsThunk,
    clearVendorError,
    clearVendorMessage,
} from "../../../../Redux/finance/purchases/vendorsSlice";

import { vendorStats, getVendorColumns } from "./Vendorstats";
import {
    STATUS_OPTIONS,
    VENDOR_TYPE_OPTIONS,
    PAYMENT_TERM_OPTIONS,
} from "./modal/Vendoroptions";
import { buildVendorPayload } from "./Vendorpayload";

const ROWS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const useVendors = () => {
    const dispatch = useDispatch();
const navigate = useNavigate();
    const {
        vendors = [],
        totalItems = 0,
        loading = false,
        createLoading = false,
        updateLoading = false,
        deleteLoading = false,
        uploadLoading = false,
        dashboard = null,
        dashboardLoading = false,
        error = null,
        successMessage = null,
    } = useSelector((state) => state.vendor) || {};

    // Filters
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");
    const [vendorType, setVendorType] = useState("");
    const [paymentTerm, setPaymentTerm] = useState("");

    // Date range
    // NOTE: your vendor API docs don't list date params. from_date / to_date
    // are sent below; if the backend ignores them the range has no effect.
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Modal + pagination
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null); // null = add mode
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE) || 1;

    // ---- Fetch helpers ----

    const fetchVendorList = useCallback(() => {
        dispatch(
            getVendors({
                search: debouncedSearch || undefined,
                client_status: status ? status.toLowerCase() : undefined,
                vendor_type: vendorType || undefined,
                payment_term: paymentTerm || undefined,
                from_date: startDate || undefined,
                to_date: endDate || undefined,
                ordering: "-created_at",
                page: currentPage,
                page_size: ROWS_PER_PAGE,
            })
        );
    }, [
        dispatch,
        debouncedSearch,
        status,
        vendorType,
        paymentTerm,
        startDate,
        endDate,
        currentPage,
    ]);

    const fetchDashboard = useCallback(() => {
        dispatch(getVendorDashboard());
    }, [dispatch]);

    // ---- Effects ----

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchVendorList();
    }, [fetchVendorList]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    useEffect(() => {
        return () => {
            dispatch(clearVendorError());
            dispatch(clearVendorMessage());
        };
    }, [dispatch]);

    // ---- Filter handlers ----

    const handleSearch = (value) => setSearch(value);

    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleVendorType = (value) => {
        setVendorType(value);
        setCurrentPage(1);
    };

    const handlePaymentTerm = (value) => {
        setPaymentTerm(value);
        setCurrentPage(1);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        setCurrentPage(1);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        setCurrentPage(1);
    };
const handleViewVendor = useCallback(
    (row) => navigate(`/purchase/vendors/${row.id}`),
    [navigate]
);
    // ---- Modal handlers ----

    const handleAddVendor = () => {
        dispatch(clearVendorError()); // don't show a stale error in the modal
        setEditingVendor(null);
        setIsVendorModalOpen(true);
    };

    const handleEditVendor = useCallback(
        (row) => {
            dispatch(clearVendorError());
            setEditingVendor(row);
            setIsVendorModalOpen(true);
        },
        [dispatch]
    );

    const handleCloseVendor = () => {
        setIsVendorModalOpen(false);
        setEditingVendor(null);
    };

    // ---- Save (create or update) ----
    // formData comes from AddVendorModal; isEdit is its 2nd argument.
    const handleSaveVendor = async (formData, isEdit) => {
        const payload = buildVendorPayload(formData, isEdit);

        // POST /finance/vendor/vendors/  or  PATCH /finance/vendor/vendors/:id/
        const result = isEdit
            ? await dispatch(editVendor({ id: editingVendor.id, data: payload }))
            : await dispatch(addVendor(payload));

        const succeeded = isEdit
            ? editVendor.fulfilled.match(result)
            : addVendor.fulfilled.match(result);

        // Keep the modal open on failure so the error shows inside it
        if (!succeeded) return;

        // Documents go through their own endpoint and need the vendor's id
        const vendorId = isEdit ? editingVendor.id : result.payload?.data?.id;
        if (formData.documents && vendorId) {
            await dispatch(
                uploadVendorDocumentsThunk({
                    id: vendorId,
                    files: [formData.documents],
                })
            );
        }

        handleCloseVendor();

        if (!isEdit && currentPage !== 1) {
            setCurrentPage(1); // effect refetches
        } else {
            fetchVendorList();
        }
        fetchDashboard();
    };

    // ---- Delete ----
    // DELETE /finance/vendor/vendors/:id/
    const handleDeleteVendor = useCallback(
        async (row) => {
            const confirmed = window.confirm(
                `Delete vendor "${row.name}"? This cannot be undone.`
            );
            if (!confirmed) return;

            const result = await dispatch(removeVendor(row.id));
            if (!removeVendor.fulfilled.match(result)) return; // error shows in banner

            // If that was the last row on this page, step back one page
            if (vendors.length === 1 && currentPage > 1) {
                setCurrentPage((p) => p - 1); // effect refetches
            } else {
                fetchVendorList();
            }
            fetchDashboard();
        },
        [dispatch, vendors.length, currentPage, fetchVendorList, fetchDashboard]
    );

    // ---- Derived data ----

    const cards = useMemo(
        () => vendorStats(dashboard, totalItems),
        [dashboard, totalItems]
    );

    const columns = useMemo(
    () =>
        getVendorColumns({
            onView: handleViewVendor,
            onEdit: handleEditVendor,
            onDelete: handleDeleteVendor,
        }),
    [handleViewVendor, handleEditVendor, handleDeleteVendor]
);

    return {
        // filters
        search,
        status,
        vendorType,
        paymentTerm,
        startDate,
        endDate,

        // modal
        isVendorModalOpen,
        editingVendor,

        // pagination
        currentPage,
        totalPages,
        totalItems,
        setCurrentPage,

        // data
        cards,
        columns,
        paginatedData: vendors,

        // loading / error / message
        loading,
        createLoading,
        updateLoading,
        deleteLoading,
        uploadLoading,
        isSaving: createLoading || updateLoading || uploadLoading,
        dashboardLoading,
        error,
        successMessage,

        // options
        statusOptions: STATUS_OPTIONS,
        vendorTypeOptions: VENDOR_TYPE_OPTIONS,
        paymentTermOptions: PAYMENT_TERM_OPTIONS,

        // handlers
        handleSearch,
        handleStatusChange,
        handleVendorType,
        handlePaymentTerm,
        handleStartDateChange,
        handleEndDateChange,
        handleAddVendor,
        handleEditVendor,
        handleDeleteVendor,
        handleCloseVendor,
        handleSaveVendor,
            handleViewVendor,
    };
};

export default useVendors;