import React, { useEffect, useMemo, useState } from "react";

import { FiDownload } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import ReusableConfirmModal from "../../../../Components/modals/ReusableConfirmModal";

import {
  DateRangeWrapper,
  DatePickerContainer,
  DateInput,
  DateSeparator,
  ExportButton,
} from "./Bill.style";

import {
  getBillColumns,
  buildBillStats,
  BILL_STATUS_OPTIONS,
} from "./BillColoumn";

import {
  getBills,
  getBillSummary,
  exportBills,
  removeBill,
  selectBills,
  selectBillPagination,
  selectBillKPI,
  selectBillLoading,
  selectBillDeleteLoading,
  selectBillExportLoading,
} from "../../../../Redux/finance/purchases/BillSlice";

import {
  getVendors,
  selectVendors,
} from "../../../../Redux/finance/purchases/vendorsSlice";

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

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced;
};

/* =========================================================
   COMPONENT
========================================================= */

const Bill = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const currentMonth = useMemo(() => getCurrentMonthRange(), []);

  /* =======================================================
     REDUX
  ======================================================= */

  const bills = useSelector(selectBills);

  const pagination = useSelector(selectBillPagination);

  const kpi = useSelector(selectBillKPI);

  const loading = useSelector(selectBillLoading);

  const deleteLoading = useSelector(selectBillDeleteLoading);

  const exportLoading = useSelector(selectBillExportLoading);

  const vendors = useSelector(selectVendors);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [vendor, setVendor] = useState("");

  const [dueDate, setDueDate] = useState("");

  const [startDate, setStartDate] = useState(currentMonth.start);

  const [endDate, setEndDate] = useState(currentMonth.end);

  const [currentPage, setCurrentPage] = useState(1);

  const [billToDelete, setBillToDelete] = useState(null);

  const [deleteError, setDeleteError] = useState("");

  const debouncedSearch = useDebouncedValue(search);

  /* =======================================================
     VENDORS
  ======================================================= */

  useEffect(() => {
    dispatch(getVendors());
  }, [dispatch]);

  const vendorOptions = useMemo(
    () =>
      vendors.map((vendorItem) => ({
        label:
          vendorItem.name ||
          vendorItem.vendor_name ||
          vendorItem.company_name ||
          `Vendor #${vendorItem.id}`,

        value: String(vendorItem.id),
      })),
    [vendors],
  );

  /* =======================================================
     BILL LIST
  ======================================================= */

  useEffect(() => {
    const params = {
      page: currentPage,
      page_size: 10,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (vendor) {
      params.vendor = vendor;
    }

    if (status) {
      params.payment_status = status;
    }

    if (dueDate) {
      params.due_date = dueDate;
    }

    if (startDate) {
      params.bill_date_after = startDate;
    }

    if (endDate) {
      params.bill_date_before = endDate;
    }

    dispatch(getBills(params));
  }, [
    dispatch,
    debouncedSearch,
    vendor,
    status,
    dueDate,
    startDate,
    endDate,
    currentPage,
  ]);

  /* =======================================================
     KPI
  ======================================================= */

  useEffect(() => {
    dispatch(
      getBillSummary({
        bill_date_after: startDate,

        bill_date_before: endDate,
      }),
    );
  }, [dispatch, startDate, endDate]);

  const stats = useMemo(() => buildBillStats(kpi), [kpi]);

  /* =======================================================
     DATE
  ======================================================= */

  const handleStartDateChange = (event) => {
    const value = event.target.value;

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

  const handleEndDateChange = (event) => {
    const value = event.target.value;

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

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = (bill) => {
    setDeleteError("");

    setBillToDelete(bill);
  };

  const handleCloseDeleteModal = () => {
    setBillToDelete(null);

    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!billToDelete?.id) {
      return;
    }

    setDeleteError("");

    const result = await dispatch(removeBill(billToDelete.id));

    if (!result.error) {
      setBillToDelete(null);

      dispatch(
        getBillSummary({
          bill_date_after: startDate,

          bill_date_before: endDate,
        }),
      );

      dispatch(
        getBills({
          page: currentPage,
          page_size: 10,

          ...(startDate && {
            bill_date_after: startDate,
          }),

          ...(endDate && {
            bill_date_before: endDate,
          }),
        }),
      );

      return;
    }

    const errorMessage =
      result.payload?.detail ||
      result.payload?.message ||
      result.payload ||
      "This Bill cannot be deleted.";

    setDeleteError(
      typeof errorMessage === "string"
        ? errorMessage
        : "This Bill cannot be deleted.",
    );
  };

  /* =======================================================
     COLUMNS
  ======================================================= */

  const columns = useMemo(
    () =>
      getBillColumns({
        onDelete: handleDelete,
      }),
    [handleDelete],
  );

  /* =======================================================
     EXPORT
  ======================================================= */

  const handleExport = async () => {
    const params = {};

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (vendor) {
      params.vendor = vendor;
    }

    if (status) {
      params.payment_status = status;
    }

    if (dueDate) {
      params.due_date = dueDate;
    }

    if (startDate) {
      params.bill_date_after = startDate;
    }

    if (endDate) {
      params.bill_date_before = endDate;
    }

    const result = await dispatch(exportBills(params));

    if (result.error || !result.payload) {
      return;
    }

    const blob = new Blob([result.payload], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "bills.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <ReusableHeader
        title="Bill"
        breadcrumbs={["Purchases", "Bill"]}
        buttonText="+ CREATE BILL"
        onButtonClick={() => navigate("/purchases/bill/add")}
      >
        <ExportButton onClick={handleExport} disabled={exportLoading}>
          <FiDownload />

          <span>{exportLoading ? "EXPORTING..." : "EXPORT"}</span>
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
        onSearch={(value) => {
          setSearch(value);

          setCurrentPage(1);
        }}
        searchPlaceholder="Search"
        showSearch
        status={status}
        statuses={BILL_STATUS_OPTIONS.map((item) => item.label)}
        onStatus={(value) => {
          const selectedStatus = BILL_STATUS_OPTIONS.find(
            (item) => item.label === value,
          );

          setStatus(selectedStatus ? selectedStatus.value : "");

          setCurrentPage(1);
        }}
        showStatus
        filters={[
          {
            key: "vendor",

            value: vendor,

            onChange: (value) => {
              setVendor(value);

              setCurrentPage(1);
            },

            options: vendorOptions,

            placeholder: "All Customer",
          },

          {
            key: "dueDate",

            value: dueDate,

            onChange: (value) => {
              setDueDate(value);

              setCurrentPage(1);
            },

            options: [
              {
                label: "Overdue",

                value: "overdue",
              },

              {
                label: "Due Today",

                value: "today",
              },

              {
                label: "Due This Week",

                value: "this_week",
              },
            ],

            placeholder: "Due Date",
          },
        ]}
      />

      <ReusableTable columns={columns} data={bills} loading={loading} />

      <ReusablePagination
        currentPage={pagination.currentPage || currentPage}
        totalPages={pagination.totalPages || 1}
        onPageChange={setCurrentPage}
      />

      <ReusableConfirmModal
        show={!!billToDelete}
        title={deleteError ? "Unable to Delete Bill" : "Delete Bill"}
        message={
          deleteError ||
          (billToDelete
            ? `Are you sure you want to delete bill ${
                billToDelete.invoice_number || billToDelete.bill_number || ""
              }?`
            : "")
        }
        confirmText={deleteError ? "Close" : "Delete"}
        confirmVariant={deleteError ? "secondary" : "danger"}
        loadingText="Deleting..."
        loading={deleteLoading}
        onConfirm={deleteError ? handleCloseDeleteModal : handleConfirmDelete}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
};

export default Bill;
