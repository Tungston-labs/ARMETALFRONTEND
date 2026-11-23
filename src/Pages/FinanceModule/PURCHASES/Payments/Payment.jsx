import React, { useEffect, useMemo, useState } from "react";

import { FiDownload } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import {
  DateRangeWrapper,
  DatePickerContainer,
  DateInput,
  DateSeparator,
  ExportButton,
} from "./Payment.style";

import {
  getPurchasePaymentColumns,
  buildPurchasePaymentStats,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "./PaymentColoumn";

import PaymentModal from "./modal/Recordpayment";

import {
  fetchPurchasePayments,
  fetchPurchasePaymentKPI,
  fetchPurchasePaymentById,
  createPurchasePaymentThunk,
  deletePurchasePaymentThunk,
  exportPurchasePaymentsThunk,
  clearPurchasePaymentError,
  selectPurchasePayments,
  selectPurchasePaymentPagination,
  selectPurchasePaymentKPI,
  selectPurchasePaymentLoading,
  selectPurchasePaymentCreateLoading,
  selectPurchasePaymentError,
} from "../../../../Redux/finance/purchases/paymentSlice";

import { getVendors } from "../../../../Redux/finance/purchases/vendorsSlice";

import { getBills } from "../../../../Redux/finance/purchases/BillSlice";

import { normalizePurchasePaymentPayload } from "./paymentPayload";

const PAGE_SIZE = 10;

/* =========================================================
   DEBOUNCE
========================================================= */

const useDebouncedValue = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

/* =========================================================
   PAGE
========================================================= */

const PurchasePayment = () => {
  const dispatch = useDispatch();

  const payments = useSelector(selectPurchasePayments);
  const pagination = useSelector(selectPurchasePaymentPagination);
  const kpi = useSelector(selectPurchasePaymentKPI);
  const loading = useSelector(selectPurchasePaymentLoading);
  const createLoading = useSelector(selectPurchasePaymentCreateLoading);
  const error = useSelector(selectPurchasePaymentError);

  const vendors = useSelector(
    (state) => state.vendor?.vendors || state.vendors?.vendors || [],
  );

  const bills = useSelector(
    (state) => state.bill?.bills || state.bills?.bills || [],
  );

  /* =====================================================
     FILTERS
  ===================================================== */

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [vendor, setVendor] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "view"
  const [viewPayment, setViewPayment] = useState(null);

  const debouncedSearch = useDebouncedValue(search);

  // filter params shared by list + refresh (uses debounced search)
  const filterParams = useMemo(() => {
    const params = {};

    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status;
    if (vendor) params.vendor = vendor;
    if (paymentType) params.payment_type = paymentType;
    if (paymentMethod) params.payment_method = paymentMethod;
    if (startDate) params.payment_date_after = startDate;
    if (endDate) params.payment_date_before = endDate;

    return params;
  }, [
    debouncedSearch,
    status,
    vendor,
    paymentType,
    paymentMethod,
    startDate,
    endDate,
  ]);

  /* =====================================================
     VENDOR OPTIONS
  ===================================================== */

  const vendorOptions = useMemo(
    () =>
      vendors.map((item) => ({
        label:
          item.name ||
          item.vendor_name ||
          item.company_name ||
          `Vendor #${item.id}`,
        value: String(item.id),
      })),
    [vendors],
  );

  /* =====================================================
     LOAD VENDORS + BILLS
  ===================================================== */

  useEffect(() => {
    dispatch(getVendors({ page_size: 100 }));
    dispatch(getBills({ page_size: 100 }));
  }, [dispatch]);

  /* =====================================================
     PAYMENT LIST
  ===================================================== */

  useEffect(() => {
    dispatch(
      fetchPurchasePayments({
        page: currentPage,
        page_size: PAGE_SIZE,
        ...filterParams,
      }),
    );
  }, [dispatch, currentPage, filterParams]);

  /* =====================================================
     KPI
  ===================================================== */

  useEffect(() => {
    dispatch(fetchPurchasePaymentKPI());
  }, [dispatch]);

  const stats = useMemo(() => buildPurchasePaymentStats(kpi), [kpi]);

  /* =====================================================
     DATE HANDLERS
  ===================================================== */

  const handleStartDateChange = (e) => {
    const value = e.target.value;

    setCurrentPage(1);

    if (!value) {
      setStartDate("");
      return;
    }

    setStartDate(value);

    if (endDate && value > endDate) {
      setEndDate(value);
    }
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setEndDate("");
      setCurrentPage(1);
      return;
    }

    if (startDate && value < startDate) {
      return;
    }

    setEndDate(value);
    setCurrentPage(1);
  };

  /* =====================================================
     MODAL
  ===================================================== */

  const handleRecordPayment = () => {
    dispatch(clearPurchasePaymentError());

    // make sure balances in the dropdown are current
    dispatch(getBills({ page_size: 100 }));

    setModalMode("create");
    setViewPayment(null);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModal = () => {
    dispatch(clearPurchasePaymentError());
    setIsPaymentModalOpen(false);
    setViewPayment(null);
    setModalMode("create");
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSavePayment = async (formData) => {
    const payload = normalizePurchasePaymentPayload(formData);

    try {
      await dispatch(createPurchasePaymentThunk(payload)).unwrap();

      setIsPaymentModalOpen(false);
      setCurrentPage(1);

      // explicit refresh (the page effect will not run if we were already on page 1)
      dispatch(
        fetchPurchasePayments({
          page: 1,
          page_size: PAGE_SIZE,
          ...filterParams,
        }),
      );

      dispatch(fetchPurchasePaymentKPI());

      // bills now have new paid / balance values
      dispatch(getBills({ page_size: 100 }));
    } catch (err) {
      // error is stored in redux and shown inside the modal
      console.error("Purchase payment creation failed:", err);
    }
  };

  /* =====================================================
     EXPORT
  ===================================================== */

  const handleExport = () => {
    const params = { ...filterParams };

    // use the live (non-debounced) search text
    if (search) {
      params.search = search;
    } else {
      delete params.search;
    }

    dispatch(exportPurchasePaymentsThunk(params));
  };

  /* =====================================================
     ROW ACTIONS
  ===================================================== */

  // eye icon: open the modal in view mode
  const handlePaymentInfo = async (payment) => {
    if (!payment?.id) return;

    dispatch(clearPurchasePaymentError());

    setModalMode("view");
    setViewPayment(payment); // show the row data immediately
    setIsPaymentModalOpen(true);

    try {
      // then replace it with the full record from the backend
      const response = await dispatch(
        fetchPurchasePaymentById(payment.id),
      ).unwrap();

      setViewPayment(response?.data ?? response);
    } catch (err) {
      console.error("Fetch payment failed:", err);
    }
  };

  const handleDelete = async (payment) => {
    if (!payment?.id) return;

    const confirmed = window.confirm(
      `Delete payment ${payment.payment_no || payment.receipt_no || payment.id}?`,
    );

    if (!confirmed) return;

    try {
      await dispatch(deletePurchasePaymentThunk(payment.id)).unwrap();

      dispatch(
        fetchPurchasePayments({
          page: currentPage,
          page_size: PAGE_SIZE,
          ...filterParams,
        }),
      );

      dispatch(fetchPurchasePaymentKPI());
      dispatch(getBills({ page_size: 100 }));
    } catch (err) {
      console.error("Delete payment failed:", err);
    }
  };

  const handleEdit = (payment) => {
    console.log("Edit purchase payment:", payment);
    // Wire this to your edit route / modal when it exists.
  };

  const handleDownload = (payment) => {
    if (!payment) return;

    handleExport();
  };

  /* =====================================================
     COLUMNS
     (not memoised, so handlers always see the latest state)
  ===================================================== */

  const columns = getPurchasePaymentColumns({
    onView: handlePaymentInfo,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onDownload: handleDownload,
  });

  /* =====================================================
     FILTER HANDLERS
  ===================================================== */

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatus = (value) => {
    const match = PAYMENT_STATUS_OPTIONS.find((item) => item.label === value);

    setStatus(match?.value || "");
    setCurrentPage(1);
  };

  const handleVendor = (value) => {
    setVendor(value);
    setCurrentPage(1);
  };

  const handlePaymentType = (value) => {
    setPaymentType(value);
    setCurrentPage(1);
  };

  const handlePaymentMethod = (value) => {
    setPaymentMethod(value);
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Payments"
        breadcrumbs={["Purchases", "Payments"]}
        buttonText="+ RECORD PAYMENT"
        onButtonClick={handleRecordPayment}
      >
        <ExportButton type="button" onClick={handleExport}>
          <FiDownload />
          <span>Export</span>
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

      <StatsCards cards={stats} />

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        searchPlaceholder="Search Payment No or Vendor"
        showSearch
        status={status}
        statuses={PAYMENT_STATUS_OPTIONS.map((item) => item.label)}
        onStatus={handleStatus}
        showStatus
        filters={[
          {
            key: "vendor",
            value: vendor,
            onChange: handleVendor,
            options: vendorOptions,
            placeholder: "All Vendor",
          },
          {
            key: "paymentType",
            value: paymentType,
            onChange: handlePaymentType,
            options: PAYMENT_TYPE_OPTIONS.map((item) => ({
              label: item.label,
              value: item.value,
            })),
            placeholder: "Payment Type",
          },
          {
            key: "paymentMethod",
            value: paymentMethod,
            onChange: handlePaymentMethod,
            options: PAYMENT_METHOD_OPTIONS.map((item) => ({
              label: item.label,
              value: item.value,
            })),
            placeholder: "Payment Method",
          },
        ]}
      />

      <ReusableTable columns={columns} data={payments} loading={loading} />

      <ReusablePagination
        currentPage={pagination.currentPage || currentPage}
        totalPages={pagination.totalPages || 1}
        onPageChange={setCurrentPage}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePayment}
        submitting={createLoading}
        error={error}
        vendors={vendors}
        bills={bills}
        mode={modalMode}
        initialData={modalMode === "view" ? viewPayment : null}
      />
    </div>
  );
};

export default PurchasePayment;