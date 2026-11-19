import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import API from "../../../../services/api";

import {
  DateRangeWrapper,
  DatePickerContainer,
  DateInput,
  DateSeparator,
  ExportButton,
} from "./Payment.style";

import {
  getPaymentColumns,
  buildPaymentStats,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "./PaymentColoumn";

import PaymentModal from "./modal/Recordpayment";

import {
  fetchPayments,
  fetchPaymentKPI,
  fetchPaymentById,
  createPayment,
  updatePayment, // ← must exist in paymentSlice (PATCH/PUT /payments/:id)
  exportPayments,
  selectPayments,
  selectPaymentPagination,
  selectPaymentKPI,
  selectPaymentLoading,
  selectPaymentCreateLoading,
  selectPaymentError,
} from "../../../../Redux/finance/Sales/paymentSlice";
import { getCustomers } from "../../../../Redux/finance/Sales/CustomerSlice";
import { normalizePaymentPayload } from "./paymentPayload";

/* DEBOUNCE */
const useDebouncedValue = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

/* PAGE */
const Payment = () => {
  const dispatch = useDispatch();

  const payments = useSelector(selectPayments);
  const pagination = useSelector(selectPaymentPagination);
  const kpi = useSelector(selectPaymentKPI);
  const loading = useSelector(selectPaymentLoading);
  const createLoading = useSelector(selectPaymentCreateLoading);
  const error = useSelector(selectPaymentError);
  const customers = useSelector((state) => state.customer?.customers || []);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [customer, setCustomer] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // One modal for create / edit / view
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    mode: "create", // "create" | "edit" | "view"
    payment: null,
  });
  const [invoices, setInvoices] = useState([]);

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  /* SHARED FILTER PARAMS */
  const buildFilterParams = useCallback(
    () => ({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(status && { status }),
      ...(customer && { customer }),
      ...(paymentType && { payment_type: paymentType }),
      ...(paymentMethod && { payment_method: paymentMethod }),
      ...(startDate && { payment_date_after: startDate }),
      ...(endDate && { payment_date_before: endDate }),
    }),
    [debouncedSearch, status, customer, paymentType, paymentMethod, startDate, endDate]
  );

  /* FETCH LIST */
  useEffect(() => {
    dispatch(fetchPayments({ page: currentPage, ...buildFilterParams() }));
  }, [dispatch, currentPage, buildFilterParams]);

  /* FETCH KPI */
  useEffect(() => {
    dispatch(fetchPaymentKPI());
  }, [dispatch]);

  const stats = useMemo(() => buildPaymentStats(kpi), [kpi]);
  const totalRecords =
    pagination.totalItems ?? pagination.total ?? payments.length;

  /* DATE HANDLERS */
  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setCurrentPage(1);

    if (!value) {
      setStartDate("");
      return;
    }
    setStartDate(value);
    if (endDate && value > endDate) setEndDate(value);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setEndDate("");
      setCurrentPage(1);
      return;
    }
    if (startDate && value < startDate) return;

    setEndDate(value);
    setCurrentPage(1);
  };

  /* MODAL OPEN / CLOSE */
  const closeModal = () => {
    setPaymentModal({ isOpen: false, mode: "create", payment: null });
    setInvoices([]);
  };

  const handleRecordPayment = () =>
    setPaymentModal({ isOpen: true, mode: "create", payment: null });

  // Fetch the full record when possible; fall back to the table row
  const openExisting = useCallback(
    async (row, mode) => {
      if (!row?.id) return;

      let payment = row;
      try {
        const full = await dispatch(fetchPaymentById(row.id)).unwrap();
        payment = full?.data ?? full ?? row;
      } catch (err) {
        console.error("Could not load payment details, using row data", err);
      }

      setPaymentModal({ isOpen: true, mode, payment });
    },
    [dispatch]
  );

  const handleView = useCallback((row) => openExisting(row, "view"), [openExisting]);
  const handleEdit = useCallback((row) => openExisting(row, "edit"), [openExisting]);

  // The modal calls this when a customer is chosen or an existing payment opens
  const handleCustomerChange = useCallback(async (customerId) => {
    if (!customerId) {
      setInvoices([]);
      return;
    }
    try {
      const res = await API.get("/finance/invoice/", {
        // ← adjust to your invoice endpoint
        params: { customer: customerId, page_size: 100 },
      });
      const rows = res.data?.results || res.data || [];
      setInvoices(Array.isArray(rows) ? rows : []);
    } catch {
      setInvoices([]);
    }
  }, []);

  /* SAVE (create or update) */
  const handleSavePayment = async (formData) => {
    const payload = normalizePaymentPayload(formData);
    const isEdit = paymentModal.mode === "edit";

    try {
      if (isEdit) {
        await dispatch(
          updatePayment({ id: paymentModal.payment.id, data: payload })
        ).unwrap();
      } else {
        await dispatch(createPayment(payload)).unwrap();
        setCurrentPage(1);
      }

      closeModal();
      dispatch(
        fetchPayments({
          page: isEdit ? currentPage : 1,
          ...buildFilterParams(),
        })
      );
      dispatch(fetchPaymentKPI());
    } catch (err) {
      console.error("Saving payment failed:", err);
    }
  };

  /* EXPORT */
  const handleExport = () => {
    dispatch(
      exportPayments({
        ...buildFilterParams(),
        ...(search && { search }), // export uses the raw (non-debounced) search
      })
    );
  };

  /* TABLE COLUMNS */
  const columns = useMemo(
    () => getPaymentColumns({ onView: handleView, onEdit: handleEdit }),
    [handleView, handleEdit]
  );

  /* FILTER HANDLERS */
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatus = (value) => {
    const match = PAYMENT_STATUS_OPTIONS.find((item) => item.label === value);
    setStatus(match?.value || "");
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
        breadcrumbs={["Sales", "Payments"]}
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
        searchPlaceholder="Search Receipt No or Customer"
        showSearch
        status={status}
        statuses={PAYMENT_STATUS_OPTIONS.map((item) => item.label)}
        onStatus={handleStatus}
        showStatus
        filters={[
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
        totalRecords={totalRecords}
      />

      <PaymentModal
        isOpen={paymentModal.isOpen}
        mode={paymentModal.mode}
        initialData={paymentModal.payment}
        onClose={closeModal}
        onSave={handleSavePayment}
        submitting={createLoading}
        error={error}
        customers={customers}
        invoices={invoices}
        onCustomerChange={handleCustomerChange}
      />
    </div>
  );
};

export default Payment;