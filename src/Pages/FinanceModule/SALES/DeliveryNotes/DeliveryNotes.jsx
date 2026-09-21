import React, { useCallback, useEffect, useMemo, useState } from "react";

import { FiDownload } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

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
} from "./DeliveryNotes.style";

import { salesOrderColumns, salesOrderStats } from "./DeliveryNotesColoumns";

import {
  fetchDeliveryNotes,
  fetchDeliveryNoteKpi,
  removeDeliveryNote,
} from "../../../../Redux/finance/deliveryNotesSlice";

/* =========================================================
   DATE HELPERS
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
   AMOUNT HELPER
========================================================= */

const parseAmount = (value) => {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const amount = Number(
    String(value).replace(/SAR/gi, "").replace(/,/g, "").trim(),
  );

  return Number.isNaN(amount) ? 0 : amount;
};

/* =========================================================
   KPI HELPER
========================================================= */

const getKpiValue = (kpi, keys, fallback = 0) => {
  for (const key of keys) {
    if (kpi?.[key] !== undefined && kpi?.[key] !== null) {
      return kpi[key];
    }
  }

  return fallback;
};

/* =========================================================
   STATUS HELPERS
========================================================= */

const normalizeStatus = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
};

/* =========================================================
   COMPONENT
========================================================= */

const DeliveryNotes = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { deliveryNotes, kpi, totalItems, totalPages, loading, error } =
    useSelector((state) => state.deliveryNotes);

  const currentMonth = useMemo(() => getCurrentMonthRange(), []);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [customer, setCustomer] = useState("");

  const [startDate, setStartDate] = useState(currentMonth.start);

  const [endDate, setEndDate] = useState(currentMonth.end);

  const [dateFilterChanged, setDateFilterChanged] = useState(false);

  const rowsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     API PARAMETERS
  ======================================================= */

  const apiParams = useMemo(() => {
    const params = {
      page: currentPage,
      page_size: rowsPerPage,
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (status) {
      params.status = status;
    }

    if (customer) {
      params.customer = customer;
    }

    /*
     * Warehouse intentionally removed.
     */

    if (dateFilterChanged && startDate) {
      params.start_date = startDate;
    }

    if (dateFilterChanged && endDate) {
      params.end_date = endDate;
    }

    return params;
  }, [
    currentPage,
    search,
    status,
    customer,
    startDate,
    endDate,
    dateFilterChanged,
  ]);

  /* =======================================================
     FETCH LIST
  ======================================================= */

  const loadDeliveryNotes = useCallback(() => {
    dispatch(fetchDeliveryNotes(apiParams));
  }, [dispatch, apiParams]);

  useEffect(() => {
    loadDeliveryNotes();
  }, [loadDeliveryNotes]);

  /* =======================================================
     FETCH KPI
  ======================================================= */

  useEffect(() => {
    dispatch(fetchDeliveryNoteKpi());
  }, [dispatch]);

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = useCallback(
    async (row) => {
      if (!row?.id) {
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to delete this delivery note?",
      );

      if (!confirmed) {
        return;
      }

      try {
        await dispatch(removeDeliveryNote(row.id)).unwrap();

        dispatch(fetchDeliveryNotes(apiParams));

        dispatch(fetchDeliveryNoteKpi());
      } catch (deleteError) {
        console.error("Delete delivery note failed:", deleteError);
      }
    },
    [dispatch, apiParams],
  );

  /* =======================================================
     TABLE DATA
  ======================================================= */

  const normalizedRows = useMemo(() => {
    if (!Array.isArray(deliveryNotes)) {
      return [];
    }

    return deliveryNotes;
  }, [deliveryNotes]);

  /* =======================================================
     STATUS FALLBACK COUNTS
  ======================================================= */

  const getStatusCount = useCallback(
    (targetStatus) => {
      const normalizedTarget = normalizeStatus(targetStatus);

      return normalizedRows.filter((row) => {
        const rowStatus = normalizeStatus(
          row?.deliveryStatus || row?.delivery_status || row?.status,
        );

        if (normalizedTarget === "partially") {
          return (
            rowStatus === "partially" ||
            rowStatus === "partial" ||
            rowStatus === "partiallydelivered"
          );
        }

        if (normalizedTarget === "delivered") {
          return rowStatus === "delivered" || rowStatus === "fullydelivered";
        }

        return rowStatus === normalizedTarget;
      }).length;
    },
    [normalizedRows],
  );

  /* =======================================================
     AMOUNT FALLBACK
  ======================================================= */

  const totalAmount = useMemo(() => {
    return normalizedRows.reduce((sum, row) => {
      const value =
        row.deliveryValue ??
        row.delivery_value ??
        row.amount ??
        row.total_amount ??
        row.thisDelivery ??
        row.this_delivery ??
        row.orderedValue ??
        0;

      return sum + parseAmount(value);
    }, 0);
  }, [normalizedRows]);

  /* =======================================================
     KPI CARDS
  ======================================================= */

  const deliveryValue = getKpiValue(
    kpi,
    ["delivery_value", "total_delivery_value", "total_value"],
    totalAmount,
  );

  const formattedDeliveryValue =
    typeof deliveryValue === "number"
      ? `SAR ${deliveryValue.toLocaleString("en-US")}`
      : String(deliveryValue || "SAR 0")
            .toUpperCase()
            .includes("SAR")
        ? deliveryValue
        : `SAR ${deliveryValue}`;

  const stats = salesOrderStats({
    totalDeliveries: getKpiValue(
      kpi,
      ["total_deliveries", "total_delivery_notes", "total"],
      totalItems,
    ),

    pendingDeliveries: getKpiValue(
      kpi,
      ["pending_deliveries", "pending"],
      getStatusCount("Pending"),
    ),

    partiallyDelivered: getKpiValue(
      kpi,
      ["partially_delivered", "partial_deliveries", "partial"],
      getStatusCount("Partially"),
    ),

    delivered: getKpiValue(
      kpi,
      ["delivered", "delivered_deliveries"],
      getStatusCount("Delivered"),
    ),

    deliveryValue: formattedDeliveryValue,
  });

  /* =======================================================
     DATE HANDLERS
  ======================================================= */

  const handleStartDateChange = (e) => {
    const value = e.target.value;

    setDateFilterChanged(true);

    if (!value) {
      setStartDate("");
      setCurrentPage(1);
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

    setDateFilterChanged(true);

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
     EXPORT
  ======================================================= */

  const handleExport = () => {
    console.log("Export Delivery Notes", {
      startDate,
      endDate,
      search,
      status,
      customer,
    });
  };

  /* =======================================================
     TABLE COLUMNS
  ======================================================= */

  const tableColumns = useMemo(
    () => salesOrderColumns(handleDelete),
    [handleDelete],
  );

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
        title="Delivery Notes"
        breadcrumbs={["Sales", "Delivery Notes"]}
        buttonText="+ CREATE DELIVERY NOTE"
        onButtonClick={() => navigate("add")}
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
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search Delivery Note"
        showSearch
        status={status}
        statuses={["Delivered", "Partially", "Pending", "Dispatched"]}
        onStatus={(value) => {
          setStatus(value);
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

            options: [
              {
                label: "ABC Trading",
                value: "ABC Trading",
              },
              {
                label: "Riyadh Tech",
                value: "Riyadh Tech",
              },
              {
                label: "Al Noor Company",
                value: "Al Noor Company",
              },
              {
                label: "Saudi Solutions",
                value: "Saudi Solutions",
              },
            ],

            placeholder: "All Customer",
          },
        ]}
        showFilterButton
        filterButtonText="Filter"
        onFilterClick={() => {
          setCurrentPage(1);
          loadDeliveryNotes();
        }}
      />

      {loading && (
        <div
          style={{
            padding: 20,
          }}
        >
          Loading delivery notes...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: 20,
            color: "red",
          }}
        >
          {typeof error === "string" ? error : "Failed to load delivery notes"}
        </div>
      )}

      {!loading && (
        <ReusableTable columns={tableColumns} data={normalizedRows} />
      )}

      <ReusablePagination
        currentPage={currentPage}
        totalPages={Math.max(
          1,
          totalPages || Math.ceil(totalItems / rowsPerPage),
        )}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DeliveryNotes;
