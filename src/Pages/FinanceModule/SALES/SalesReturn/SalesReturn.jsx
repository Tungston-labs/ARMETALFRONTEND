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
} from "./SalesReturn.style";

import {
  getSalesReturnColumns,
  buildSalesReturnStats,
  SALES_RETURN_STATUS_OPTIONS,
  SALES_RETURN_REASON_OPTIONS,
} from "./salesReturnColoumn";

import {
  getSalesReturns,
  getSalesReturnSummary,
  exportSalesReturns,
  removeSalesReturn,
  selectSalesReturns,
  selectSalesReturnPagination,
  selectSalesReturnKPI,
  selectSalesReturnLoading,
  selectSalesReturnDeleteLoading,
  selectSalesReturnExportLoading,
} from "../../../../Redux/finance/Sales/Salesreturnslice";

import {
  getCustomers,
  selectCustomers,
} from "../../../../Redux/finance/Sales/CustomerSlice";

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

const SalesReturn = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const currentMonth = useMemo(() => getCurrentMonthRange(), []);

  const salesReturns = useSelector(selectSalesReturns);

  const pagination = useSelector(selectSalesReturnPagination);

  const kpi = useSelector(selectSalesReturnKPI);

  const loading = useSelector(selectSalesReturnLoading);

  const deleteLoading = useSelector(selectSalesReturnDeleteLoading);

  const exportLoading = useSelector(selectSalesReturnExportLoading);

  const customers = useSelector(selectCustomers);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [customer, setCustomer] = useState("");

  const [reason, setReason] = useState("");

  const [startDate, setStartDate] = useState(currentMonth.start);

  const [endDate, setEndDate] = useState(currentMonth.end);

  const [currentPage, setCurrentPage] = useState(1);

  const [returnToDelete, setReturnToDelete] = useState(null);

  const [deleteError, setDeleteError] = useState("");

  const debouncedSearch = useDebouncedValue(search);

  /* -----------------------------------------------
     Customers
  ------------------------------------------------ */

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const customerOptions = useMemo(
    () =>
      customers.map((customerItem) => ({
        label:
          customerItem.name ||
          customerItem.customer_name ||
          customerItem.company_name ||
          `Customer #${customerItem.id}`,

        value: String(customerItem.id),
      })),
    [customers],
  );

  /* -----------------------------------------------
     Sales Return List
  ------------------------------------------------ */

  useEffect(() => {
    const params = {
      page: currentPage,
      page_size: 10,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (customer) {
      params.customer = customer;
    }

    if (status) {
      params.status = status;
    }

    if (reason) {
      params.reason = reason;
    }

    if (startDate) {
      params.return_date_after = startDate;
    }

    if (endDate) {
      params.return_date_before = endDate;
    }

    dispatch(getSalesReturns(params));
  }, [
    dispatch,
    debouncedSearch,
    customer,
    status,
    reason,
    startDate,
    endDate,
    currentPage,
  ]);

  /* -----------------------------------------------
     KPI
  ------------------------------------------------ */

  useEffect(() => {
    dispatch(
      getSalesReturnSummary({
        return_date_after: startDate,
        return_date_before: endDate,
      }),
    );
  }, [dispatch, startDate, endDate]);

  const stats = useMemo(() => buildSalesReturnStats(kpi), [kpi]);

  /* -----------------------------------------------
     Date
  ------------------------------------------------ */

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

  /* -----------------------------------------------
     Delete
  ------------------------------------------------ */

  const handleDelete = (salesReturn) => {
    setDeleteError("");
    setReturnToDelete(salesReturn);
  };

  const handleCloseDeleteModal = () => {
    setReturnToDelete(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!returnToDelete?.id) {
      return;
    }

    setDeleteError("");

    const result = await dispatch(removeSalesReturn(returnToDelete.id));

    if (!result.error) {
      setReturnToDelete(null);

      dispatch(
        getSalesReturnSummary({
          return_date_after: startDate,
          return_date_before: endDate,
        }),
      );

      dispatch(
        getSalesReturns({
          page: currentPage,
          page_size: 10,
        }),
      );

      return;
    }

    const errorMessage =
      result.payload?.detail ||
      result.payload?.message ||
      result.payload ||
      "This Sales Return cannot be deleted.";

    setDeleteError(
      typeof errorMessage === "string"
        ? errorMessage
        : "This Sales Return cannot be deleted.",
    );
  };

  /* -----------------------------------------------
     Columns
  ------------------------------------------------ */

  const columns = useMemo(
    () =>
      getSalesReturnColumns({
        onDelete: handleDelete,
      }),
    [],
  );

  /* -----------------------------------------------
     Export
  ------------------------------------------------ */

  const handleExport = async () => {
    const params = {};

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (customer) {
      params.customer = customer;
    }

    if (status) {
      params.status = status;
    }

    if (reason) {
      params.reason = reason;
    }

    if (startDate) {
      params.return_date_after = startDate;
    }

    if (endDate) {
      params.return_date_before = endDate;
    }

    const result = await dispatch(exportSalesReturns(params));

    if (result.error || !result.payload) {
      return;
    }

    const blob = new Blob([result.payload], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "sales-returns.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <ReusableHeader
        title="Sales Return"
        breadcrumbs={["Sales", "Sales Return"]}
        buttonText="+ CREATE SALES RETURN"
        onButtonClick={() => navigate("/sales-return/add")}
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
        statuses={SALES_RETURN_STATUS_OPTIONS.map((item) => item.label)}
        onStatus={(value) => {
          const selectedStatus = SALES_RETURN_STATUS_OPTIONS.find(
            (item) => item.label === value,
          );

          setStatus(selectedStatus ? selectedStatus.value : "");

          setCurrentPage(1);
        }}
        showStatus
        filters={[
          {
            key: "customer",
            value: customer,
            onChange: (value) => {
              setCustomer(value);
              setCurrentPage(1);
            },
            options: customerOptions,
            placeholder: "All Customer",
          },

          {
            key: "reason",
            value: reason,
            onChange: (value) => {
              setReason(value);
              setCurrentPage(1);
            },
            options: SALES_RETURN_REASON_OPTIONS,
            placeholder: "Reason",
          },
        ]}
      />

      <ReusableTable columns={columns} data={salesReturns} loading={loading} />

      <ReusablePagination
        currentPage={pagination.currentPage || currentPage}
        totalPages={pagination.totalPages || 1}
        onPageChange={setCurrentPage}
      />

      <ReusableConfirmModal
        show={!!returnToDelete}
        title={
          deleteError ? "Unable to Delete Sales Return" : "Delete Sales Return"
        }
        message={
          deleteError ||
          (returnToDelete
            ? `Are you sure you want to delete sales return ${
                returnToDelete.return_number || returnToDelete.return_no || ""
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

export default SalesReturn;
