import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  selectPurchasePayments,
  selectPurchasePaymentPagination,
  selectPurchasePaymentKPI,
  selectPurchasePaymentLoading,
  selectPurchasePaymentCreateLoading,
  selectPurchasePaymentError,
} from "../../../../Redux/finance/Purchases/paymentSlice";

import {
  getVendors,
} from "../../../../Redux/finance/purchases/vendorsSlice";

import {
  getBills,
} from "../../../../Redux/finance/Purchases/BillSlice";

import {
  normalizePurchasePaymentPayload,
} from "./paymentPayload";

/* =========================================================
   CURRENT MONTH
========================================================= */

const getCurrentMonthRange = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(
    year,
    month,
    1,
  );

  const lastDay = new Date(
    year,
    month + 1,
    0,
  );

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(
      date.getMonth() + 1,
    ).padStart(2, "0");
    const d = String(
      date.getDate(),
    ).padStart(2, "0");

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

const useDebouncedValue = (
  value,
  delay = 400,
) => {
  const [debounced, setDebounced] =
    useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () =>
      clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

/* =========================================================
   PAGE
========================================================= */

const PurchasePayment = () => {
  const dispatch = useDispatch();

  const currentMonth = useMemo(
    () => getCurrentMonthRange(),
    [],
  );

  const payments = useSelector(
    selectPurchasePayments,
  );

  const pagination = useSelector(
    selectPurchasePaymentPagination,
  );

  const kpi = useSelector(
    selectPurchasePaymentKPI,
  );

  const loading = useSelector(
    selectPurchasePaymentLoading,
  );

  const createLoading = useSelector(
    selectPurchasePaymentCreateLoading,
  );

  const error = useSelector(
    selectPurchasePaymentError,
  );

  const vendors = useSelector(
    (state) =>
      state.vendor?.vendors ||
      state.vendors?.vendors ||
      [],
  );

  const bills = useSelector(
    (state) =>
      state.bill?.bills ||
      state.bills?.bills ||
      [],
  );

  /* =====================================================
     FILTERS
  ===================================================== */

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [vendor, setVendor] =
    useState("");

  const [paymentType, setPaymentType] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [startDate, setStartDate] =
    useState(currentMonth.start);

  const [endDate, setEndDate] =
    useState(currentMonth.end);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [
    isPaymentModalOpen,
    setIsPaymentModalOpen,
  ] = useState(false);

  const debouncedSearch =
    useDebouncedValue(search);

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
    dispatch(
      getVendors({
        page_size: 100,
      }),
    );

    dispatch(
      getBills({
        page_size: 100,
      }),
    );
  }, [dispatch]);

  /* =====================================================
     PAYMENT LIST
  ===================================================== */

  useEffect(() => {
    const params = {
      page: currentPage,
      page_size: 10,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (status) {
      params.status = status;
    }

    if (vendor) {
      params.vendor = vendor;
    }

    if (paymentType) {
      params.payment_type = paymentType;
    }

    if (paymentMethod) {
      params.payment_method =
        paymentMethod;
    }

    if (startDate) {
      params.payment_date_after =
        startDate;
    }

    if (endDate) {
      params.payment_date_before =
        endDate;
    }

    dispatch(
      fetchPurchasePayments(params),
    );
  }, [
    dispatch,
    debouncedSearch,
    status,
    vendor,
    paymentType,
    paymentMethod,
    startDate,
    endDate,
    currentPage,
  ]);

  /* =====================================================
     KPI
  ===================================================== */

  useEffect(() => {
    dispatch(
      fetchPurchasePaymentKPI(),
    );
  }, [dispatch]);

  const stats = useMemo(
    () =>
      buildPurchasePaymentStats(kpi),
    [kpi],
  );

  /* =====================================================
     DATE HANDLERS
  ===================================================== */

  const handleStartDateChange = (
    e,
  ) => {
    const value = e.target.value;

    setCurrentPage(1);

    if (!value) {
      setStartDate("");
      return;
    }

    setStartDate(value);

    if (
      endDate &&
      value > endDate
    ) {
      setEndDate(value);
    }
  };

  const handleEndDateChange = (
    e,
  ) => {
    const value = e.target.value;

    if (!value) {
      setEndDate("");
      setCurrentPage(1);
      return;
    }

    if (
      startDate &&
      value < startDate
    ) {
      return;
    }

    setEndDate(value);
    setCurrentPage(1);
  };

  /* =====================================================
     RECORD PAYMENT
  ===================================================== */

  const handleRecordPayment = () => {
    setIsPaymentModalOpen(true);
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSavePayment = async (
    formData,
  ) => {
    const payload =
      normalizePurchasePaymentPayload(
        formData,
      );

    try {
      await dispatch(
        createPurchasePaymentThunk(
          payload,
        ),
      ).unwrap();

      setIsPaymentModalOpen(false);

      setCurrentPage(1);

      dispatch(
        fetchPurchasePayments({
          page: 1,
          page_size: 10,
        }),
      );

      dispatch(
        fetchPurchasePaymentKPI(),
      );
    } catch (err) {
      console.error(
        "Purchase payment creation failed:",
        err,
      );
    }
  };

  /* =====================================================
     EXPORT
  ===================================================== */

  const handleExport = () => {
    const params = {};

    if (search) {
      params.search = search;
    }

    if (status) {
      params.status = status;
    }

    if (vendor) {
      params.vendor = vendor;
    }

    if (paymentType) {
      params.payment_type =
        paymentType;
    }

    if (paymentMethod) {
      params.payment_method =
        paymentMethod;
    }

    if (startDate) {
      params.payment_date_after =
        startDate;
    }

    if (endDate) {
      params.payment_date_before =
        endDate;
    }

    dispatch(
      exportPurchasePaymentsThunk(
        params,
      ),
    );
  };

  /* =====================================================
     VIEW
  ===================================================== */

  const handlePaymentInfo = (
    payment,
  ) => {
    if (!payment?.id) {
      return;
    }

    dispatch(
      fetchPurchasePaymentById(
        payment.id,
      ),
    );
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (
    payment,
  ) => {
    if (!payment?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete payment ${
        payment.payment_no ||
        payment.receipt_no ||
        payment.id
      }?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deletePurchasePaymentThunk(
          payment.id,
        ),
      ).unwrap();

      dispatch(
        fetchPurchasePayments({
          page: currentPage,
          page_size: 10,
        }),
      );

      dispatch(
        fetchPurchasePaymentKPI(),
      );
    } catch (err) {
      console.error(
        "Delete payment failed:",
        err,
      );
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (
    payment,
  ) => {
    console.log(
      "Edit purchase payment:",
      payment,
    );

    // Use your existing purchase-payment
    // edit route here when that page is created.
  };

  /* =====================================================
     DOWNLOAD ROW
  ===================================================== */

  const handleDownload = (
    payment,
  ) => {
    if (!payment) {
      return;
    }

    handleExport();
  };

  /* =====================================================
     COLUMNS
  ===================================================== */

  const columns = useMemo(
    () =>
      getPurchasePaymentColumns({
        onView:
          handlePaymentInfo,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onDownload:
          handleDownload,
      }),
    [],
  );

  /* =====================================================
     FILTER HANDLERS
  ===================================================== */

  const handleSearch = (
    value,
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatus = (
    value,
  ) => {
    const match =
      PAYMENT_STATUS_OPTIONS.find(
        (item) =>
          item.label === value,
      );

    setStatus(match?.value || "");
    setCurrentPage(1);
  };

  const handleVendor = (
    value,
  ) => {
    setVendor(value);
    setCurrentPage(1);
  };

  const handlePaymentType = (
    value,
  ) => {
    setPaymentType(value);
    setCurrentPage(1);
  };

  const handlePaymentMethod = (
    value,
  ) => {
    setPaymentMethod(value);
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Payments"
        breadcrumbs={[
          "Purchases",
          "Payments",
        ]}
        buttonText="+ RECORD PAYMENT"
        onButtonClick={
          handleRecordPayment
        }
      >
        <ExportButton
          type="button"
          onClick={handleExport}
        >
          <FiDownload />
          <span>Export</span>
        </ExportButton>

        <DateRangeWrapper>
          <DatePickerContainer>
            <DateInput
              type="date"
              value={startDate}
              onChange={
                handleStartDateChange
              }
              max={
                endDate || undefined
              }
              aria-label="Start date"
            />

            <DateSeparator>
              -
            </DateSeparator>

            <DateInput
              type="date"
              value={endDate}
              onChange={
                handleEndDateChange
              }
              min={
                startDate || undefined
              }
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
        statuses={PAYMENT_STATUS_OPTIONS.map(
          (item) => item.label,
        )}
        onStatus={handleStatus}
        showStatus
        filters={[
          {
            key: "vendor",
            value: vendor,
            onChange:
              handleVendor,
            options:
              vendorOptions,
            placeholder:
              "All Vendor",
          },

          {
            key: "paymentType",
            value:
              paymentType,
            onChange:
              handlePaymentType,
            options:
              PAYMENT_TYPE_OPTIONS.map(
                (item) => ({
                  label:
                    item.label,
                  value:
                    item.value,
                }),
              ),
            placeholder:
              "Payment Type",
          },

          {
            key: "paymentMethod",
            value:
              paymentMethod,
            onChange:
              handlePaymentMethod,
            options:
              PAYMENT_METHOD_OPTIONS.map(
                (item) => ({
                  label:
                    item.label,
                  value:
                    item.value,
                }),
              ),
            placeholder:
              "Payment Method",
          },
        ]}
      />

      <ReusableTable
        columns={columns}
        data={payments}
        loading={loading}
      />

      <ReusablePagination
        currentPage={
          pagination.currentPage ||
          currentPage
        }
        totalPages={
          pagination.totalPages ||
          1
        }
        onPageChange={
          setCurrentPage
        }
      />

      <PaymentModal
        isOpen={
          isPaymentModalOpen
        }
        onClose={() =>
          setIsPaymentModalOpen(false)
        }
        onSave={
          handleSavePayment
        }
        submitting={
          createLoading
        }
        error={error}
        vendors={vendors}
        bills={bills}
      />
    </div>
  );
};

export default PurchasePayment;