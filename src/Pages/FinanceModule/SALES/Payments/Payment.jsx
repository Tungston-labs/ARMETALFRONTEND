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

/* =========================================================
   CURRENT MONTH
========================================================= */

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

/* =========================================================
   DEBOUNCE
========================================================= */

const useDebouncedValue = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

/* =========================================================
   PAGE
========================================================= */

const Payment = () => {
  const dispatch = useDispatch();

  const currentMonth = useMemo(() => getCurrentMonthRange(), []);

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

  const [startDate, setStartDate] = useState(currentMonth.start);

  const [endDate, setEndDate] = useState(currentMonth.end);

  const [currentPage, setCurrentPage] = useState(1);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search);

  /* =====================================================
       CUSTOMER OPTIONS
       Uses customers already returned by the payment
       listing because the payment API does not expose
       a separate customer lookup endpoint.
    ===================================================== */

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        label:
          customer.name ||
          customer.customer_name ||
          `Customer #${customer.id}`,
        value: String(customer.id),
      })),
    [customers],
  );

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  /* =====================================================
       FETCH PAYMENT LIST
    ===================================================== */

  useEffect(() => {
    const params = {
      page: currentPage,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (status) {
      params.status = status;
    }

    if (customer) {
      params.customer = customer;
    }

    if (paymentType) {
      params.payment_type = paymentType;
    }

    if (paymentMethod) {
      params.payment_method = paymentMethod;
    }

    if (startDate) {
      params.payment_date_after = startDate;
    }

    if (endDate) {
      params.payment_date_before = endDate;
    }

    dispatch(fetchPayments(params));
  }, [
    dispatch,
    debouncedSearch,
    status,
    customer,
    paymentType,
    paymentMethod,
    startDate,
    endDate,
    currentPage,
  ]);

  /* =====================================================
       FETCH KPI
    ===================================================== */

  useEffect(() => {
    dispatch(fetchPaymentKPI());
  }, [dispatch]);

  /* =====================================================
       KPI CARDS
    ===================================================== */

  const stats = useMemo(() => buildPaymentStats(kpi), [kpi]);

  /* =====================================================
       START DATE
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

  /* =====================================================
       END DATE
    ===================================================== */

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
       RECORD PAYMENT BUTTON
    ===================================================== */

  const handleRecordPayment = () => {
    setIsPaymentModalOpen(true);
  };

  /* =====================================================
       SAVE PAYMENT
    ===================================================== */

  const handleSavePayment = async (formData) => {
    const payload = normalizePaymentPayload(formData);

    try {
      const result = await dispatch(createPayment(payload)).unwrap();

      if (result) {
        setIsPaymentModalOpen(false);
      }

      setCurrentPage(1);

      dispatch(
        fetchPayments({
          page: 1,
          ...(debouncedSearch
            ? {
                search: debouncedSearch,
              }
            : {}),
          ...(status
            ? {
                status,
              }
            : {}),
          ...(customer
            ? {
                customer,
              }
            : {}),
          ...(paymentType
            ? {
                payment_type: paymentType,
              }
            : {}),
          ...(paymentMethod
            ? {
                payment_method: paymentMethod,
              }
            : {}),
          ...(startDate
            ? {
                payment_date_after: startDate,
              }
            : {}),
          ...(endDate
            ? {
                payment_date_before: endDate,
              }
            : {}),
        }),
      );

      dispatch(fetchPaymentKPI());
    } catch (err) {
      console.error("Payment creation failed:", err);
    }
  };

  /* =====================================================
       EXPORT
    ===================================================== */

  const handleExport = () => {
    dispatch(
      exportPayments({
        ...(search
          ? {
              search,
            }
          : {}),
        ...(status
          ? {
              status,
            }
          : {}),
        ...(customer
          ? {
              customer,
            }
          : {}),
        ...(paymentType
          ? {
              payment_type: paymentType,
            }
          : {}),
        ...(paymentMethod
          ? {
              payment_method: paymentMethod,
            }
          : {}),
        ...(startDate
          ? {
              payment_date_after: startDate,
            }
          : {}),
        ...(endDate
          ? {
              payment_date_before: endDate,
            }
          : {}),
      }),
    );
  };

  /* =====================================================
       VIEW PAYMENT
    ===================================================== */

  const handlePaymentInfo = (payment) => {
    if (!payment?.id) {
      return;
    }

    dispatch(fetchPaymentById(payment.id));
  };

  /* =====================================================
       TABLE COLUMNS
    ===================================================== */

  const columns = useMemo(
    () =>
      getPaymentColumns({
        onInfo: handlePaymentInfo,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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

  const handleCustomer = (value) => {
    setCustomer(value);
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
            key: "customer",
            value: customer,
            onChange: handleCustomer,
            options: customerOptions,
            placeholder: "All Customer",
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
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePayment}
        submitting={createLoading}
        error={error}
        customers={customers}
      />
    </div>
  );
};

export default Payment;
