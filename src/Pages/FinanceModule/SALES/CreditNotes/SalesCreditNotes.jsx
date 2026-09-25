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
} from "./SalesCreditNotes.style";

import { creditNoteColumns, creditNoteStats } from "./CreditNotesColoumn";

import {
  fetchCreditNotes,
  fetchCreditNoteKpi,
  removeCreditNote,
} from "../../../../Redux/finance/Sales/creditNoteSlice";

/* =========================================================
   DATE
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
   NUMBER
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
   KPI
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
   STATUS
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

const SalesCreditNotes = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { creditNotes, kpi, totalItems, totalPages, loading, error } =
    useSelector((state) => state.creditNotes);

  const currentMonth = useMemo(() => getCurrentMonthRange(), []);

  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");

  const [startDate, setStartDate] = useState(currentMonth.start);

  const [endDate, setEndDate] = useState(currentMonth.end);

  const [dateFilterChanged, setDateFilterChanged] = useState(false);

  const rowsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
       API PARAMS
    ======================================================= */

  const apiParams = useMemo(() => {
    const params = {
      page: currentPage,
      page_size: rowsPerPage,
    };

    if (search.trim()) {
      params.search = search.trim();
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
    customer,
    status,
    reason,
    startDate,
    endDate,
    dateFilterChanged,
  ]);

  /* =======================================================
       LOAD LIST
    ======================================================= */

  const loadCreditNotes = useCallback(() => {
    dispatch(fetchCreditNotes(apiParams));
  }, [dispatch, apiParams]);

  useEffect(() => {
    loadCreditNotes();
  }, [loadCreditNotes]);

  /* =======================================================
       KPI
    ======================================================= */

  useEffect(() => {
    dispatch(fetchCreditNoteKpi());
  }, [dispatch]);

  /* =======================================================
       DELETE
    ======================================================= */

  const handleDelete = useCallback(
    async (row) => {
      const id = row?.id ?? row?.credit_note_id ?? row?.pk;

      if (!id) {
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to delete this credit note?",
      );

      if (!confirmed) {
        return;
      }

      try {
        await dispatch(removeCreditNote(id)).unwrap();

        dispatch(fetchCreditNotes(apiParams));

        dispatch(fetchCreditNoteKpi());
      } catch (deleteError) {
        console.error("Delete credit note failed:", deleteError);
      }
    },
    [dispatch, apiParams],
  );

  /* =======================================================
       ROWS
    ======================================================= */

  const normalizedRows = useMemo(
    () => (Array.isArray(creditNotes) ? creditNotes : []),
    [creditNotes],
  );

  /* =======================================================
       STATUS COUNT
    ======================================================= */

  const getStatusCount = useCallback(
    (targetStatus) => {
      const target = normalizeStatus(targetStatus);

      return normalizedRows.filter((row) => {
        const current = normalizeStatus(
          row?.status || row?.credit_status || row?.creditStatus,
        );

        if (target === "partiallyapplied") {
          return (
            current === "partiallyapplied" ||
            current === "partial" ||
            current === "partially"
          );
        }

        if (target === "cancelled") {
          return current === "cancelled" || current === "canceled";
        }

        if (target === "applied") {
          return current === "applied" || current === "closed";
        }

        return current === target;
      }).length;
    },
    [normalizedRows],
  );

  /* =======================================================
       TOTAL VALUE
    ======================================================= */

  const totalCreditValue = useMemo(() => {
    return normalizedRows.reduce((sum, row) => {
      const value =
        row?.credit_amount ??
        row?.creditAmount ??
        row?.this_credit_note ??
        row?.thisCreditNote ??
        row?.total_credit_amount ??
        0;

      return sum + parseAmount(value);
    }, 0);
  }, [normalizedRows]);

  /* =======================================================
       KPI CARDS
    ======================================================= */

  const totalValue = getKpiValue(
    kpi,
    [
      "total_credit_value",
      "total_credit_amount",
      "credit_value",
      "total_value",
    ],
    totalCreditValue,
  );

  const formattedTotalValue =
    typeof totalValue === "number"
      ? `SAR ${totalValue.toLocaleString("en-US")}`
      : String(totalValue || "SAR 0")
            .toUpperCase()
            .includes("SAR")
        ? totalValue
        : `SAR ${totalValue}`;

  const stats = creditNoteStats({
    totalCreditNotes: getKpiValue(
      kpi,
      ["total_credit_notes", "total_creditnotes", "total"],
      totalItems,
    ),

    totalCreditValue: formattedTotalValue,

    openCredits: getKpiValue(
      kpi,
      ["open_credits", "open_credit_notes", "open"],
      getStatusCount("Open"),
    ),

    appliedCredits: getKpiValue(
      kpi,
      ["applied_credits", "applied_credit_notes", "applied"],
      getStatusCount("Applied"),
    ),

    cancelledCredits: getKpiValue(
      kpi,
      ["cancelled_credits", "cancelled_credit_notes", "cancelled"],
      getStatusCount("Cancelled"),
    ),
  });

  /* =======================================================
       DATE
    ======================================================= */

  const handleStartDateChange = (event) => {
    const value = event.target.value;

    setDateFilterChanged(true);
    setStartDate(value);
    setCurrentPage(1);

    if (value && endDate && value > endDate) {
      setEndDate(value);
    }
  };

  const handleEndDateChange = (event) => {
    const value = event.target.value;

    setDateFilterChanged(true);

    if (startDate && value && value < startDate) {
      return;
    }

    setEndDate(value);
    setCurrentPage(1);
  };

  /* =======================================================
       EXPORT
    ======================================================= */

  const handleExport = () => {
    console.log("Export Credit Notes", {
      startDate,
      endDate,
      search,
      customer,
      status,
      reason,
    });
  };

  /* =======================================================
       COLUMNS
    ======================================================= */

  const tableColumns = useMemo(
    () => creditNoteColumns(handleDelete),
    [handleDelete],
  );

  /* =======================================================
       RENDER
    ======================================================= */

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Credit Notes"
        breadcrumbs={["Sales", "Credit Notes"]}
        buttonText="+ CREATE CREDIT NOTE"
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
        searchPlaceholder="Search Credit Note"
        showSearch
        status={status}
        statuses={["Open", "Partially Applied", "Closed", "Cancelled"]}
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
                label: "Mediora",
                value: "Mediora",
              },
              {
                label: "Chincking",
                value: "Chincking",
              },
              {
                label: "Nexora Tech",
                value: "Nexora Tech",
              },
              {
                label: "CloudSync Systems",
                value: "CloudSync Systems",
              },
              {
                label: "BluePeak Digital",
                value: "BluePeak Digital",
              },
              {
                label: "ElevateX Labs",
                value: "ElevateX Labs",
              },
              {
                label: "NovaSphere Tech",
                value: "NovaSphere Tech",
              },
              {
                label: "LogicBridge Systems",
                value: "LogicBridge Systems",
              },
            ],
            placeholder: "All Customer",
          },
          {
            key: "reason",
            value: reason,
            onChange: (value) => {
              setReason(value);
              setCurrentPage(1);
            },
            options: [
              {
                label: "Sales Return",
                value: "Sales Return",
              },
              {
                label: "Price Adjustment",
                value: "Price Adjustment",
              },
              {
                label: "Damaged Goods",
                value: "Damaged Goods",
              },
              {
                label: "Discount Adjustment",
                value: "Discount Adjustment",
              },
              {
                label: "Pricing Error",
                value: "Pricing Error",
              },
            ],
            placeholder: "Reason",
          },
        ]}
        showFilterButton
        filterButtonText="Filter"
        onFilterClick={() => {
          setCurrentPage(1);
          loadCreditNotes();
        }}
      />

      {loading && <div style={{ padding: 20 }}>Loading credit notes...</div>}

      {error && (
        <div
          style={{
            padding: 20,
            color: "red",
          }}
        >
          {typeof error === "string" ? error : "Failed to load credit notes"}
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

export default SalesCreditNotes;
