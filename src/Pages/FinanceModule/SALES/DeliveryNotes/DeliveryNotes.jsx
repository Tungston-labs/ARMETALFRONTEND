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

import {
  deliveryNoteColumns,
  deliveryNoteStats,
} from "./DeliveryNotesColoumns";
import {
  fetchDeliveryNotes,
  fetchDeliveryNoteKpi,
  removeDeliveryNote,
} from "../../../../Redux/finance/Sales/deliveryNotesSlice";

const getCurrentMonthRange = () => {
  const now = new Date();
  const format = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return {
    start: format(new Date(now.getFullYear(), now.getMonth(), 1)),
    end: format(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
};

const read = (row, ...keys) => {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== "") {
      return row[key];
    }
  }
  return "";
};

const getCount = (kpi, keys, fallback = 0) => {
  for (const key of keys) {
    if (kpi?.[key] !== undefined && kpi?.[key] !== null) return kpi[key];
  }
  return fallback;
};

const DeliveryNotes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    deliveryNotes = [],
    kpi = {},
    totalItems = 0,
    totalPages = 1,
    loading,
    error,
  } = useSelector((state) => state.deliveryNotes || {});

  const currentMonth = useMemo(getCurrentMonthRange, []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [customer, setCustomer] = useState("");
  const [startDate, setStartDate] = useState(currentMonth.start);
  const [endDate, setEndDate] = useState(currentMonth.end);
  const [dateFilterChanged, setDateFilterChanged] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const apiParams = useMemo(() => {
    const params = { page: currentPage, page_size: rowsPerPage };
    if (search.trim()) params.search = search.trim();
    if (status) params.status = status;
    if (customer) params.customer = customer;
    if (dateFilterChanged && startDate) params.start_date = startDate;
    if (dateFilterChanged && endDate) params.end_date = endDate;
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

  const loadDeliveryNotes = useCallback(() => {
    dispatch(fetchDeliveryNotes(apiParams));
  }, [dispatch, apiParams]);

  useEffect(() => {
    loadDeliveryNotes();
  }, [loadDeliveryNotes]);

  useEffect(() => {
    dispatch(fetchDeliveryNoteKpi());
  }, [dispatch]);

  const handleDelete = useCallback(
    async (row) => {
      const id = row?.id ?? row?.pk;
      if (!id) return;
      if (
        !window.confirm("Are you sure you want to delete this delivery note?")
      )
        return;

      try {
        await dispatch(removeDeliveryNote(id)).unwrap();
        dispatch(fetchDeliveryNotes(apiParams));
        dispatch(fetchDeliveryNoteKpi());
      } catch (deleteError) {
        console.error("Delete delivery note failed:", deleteError);
      }
    },
    [dispatch, apiParams],
  );

  const rows = useMemo(
    () => (Array.isArray(deliveryNotes) ? deliveryNotes : []),
    [deliveryNotes],
  );

  const fallbackCount = useCallback(
    (predicate) => rows.filter(predicate).length,
    [rows],
  );

  const stats = deliveryNoteStats({
    total: getCount(
      kpi,
      ["total_delivery_notes", "total_deliveries", "total"],
      totalItems,
    ),
    inTransit: getCount(
      kpi,
      ["in_transit", "in_transit_count", "dispatched"],
      fallbackCount((row) => {
        const value = String(
          read(row, "status", "delivery_status"),
        ).toLowerCase();
        return value.includes("transit") || value.includes("dispatch");
      }),
    ),
    delivered: getCount(
      kpi,
      ["delivered", "delivered_count"],
      fallbackCount(
        (row) =>
          String(read(row, "status", "delivery_status"))
            .toLowerCase()
            .includes("deliver") &&
          !String(read(row, "status", "delivery_status"))
            .toLowerCase()
            .includes("partial"),
      ),
    ),
    partiallyDelivered: getCount(
      kpi,
      ["partially_delivered", "partial_deliveries", "partial"],
      fallbackCount((row) =>
        String(read(row, "status", "delivery_status"))
          .toLowerCase()
          .includes("partial"),
      ),
    ),
    cancelled: getCount(
      kpi,
      ["cancelled", "cancelled_count"],
      fallbackCount((row) =>
        String(read(row, "status", "delivery_status"))
          .toLowerCase()
          .includes("cancel"),
      ),
    ),
  });

  const handleExport = () => {
    const headers = [
      "DN No",
      "Customer",
      "Order Ref",
      "Dispatch Date",
      "Delivery Date",
      "Warehouse",
      "Items",
      "Delivery Type",
      "Status",
    ];
    const csvRows = rows.map((row) => [
      read(row, "delivery_note_number", "deliveryNoteNumber"),
      typeof row.customer === "object"
        ? read(row.customer, "name", "customer_name")
        : read(row, "customer", "customer_name"),
      read(
        row,
        "sales_order_reference",
        "salesOrderReference",
        "order_reference",
      ),
      read(row, "dispatch_date", "dispatchDate"),
      read(
        row,
        "expected_delivery_date",
        "expectedDeliveryDate",
        "delivery_date",
      ),
      read(row, "warehouse_name", "warehouse", "dispatch_location"),
      `${read(row, "delivered_quantity", "total_delivered", "already_delivered") || 0}/${read(row, "ordered_quantity", "total_ordered", "ordered_qty") || 0}`,
      read(row, "delivery_type", "deliveryType"),
      read(row, "status", "delivery_status"),
    ]);
    const csv = [headers, ...csvRows]
      .map((line) =>
        line
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "delivery-notes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = useMemo(
    () => deliveryNoteColumns(handleDelete),
    [handleDelete],
  );

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setCustomer("");
    setDateFilterChanged(false);
    setStartDate(currentMonth.start);
    setEndDate(currentMonth.end);
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Delivery Notes"
        breadcrumbs={["Sales", "Delivery Notes"]}
        buttonText="+ Create Delivery Note"
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
              max={endDate || undefined}
              onChange={(event) => {
                setStartDate(event.target.value);
                setDateFilterChanged(true);
                setCurrentPage(1);
              }}
              aria-label="Start date"
            />
            <DateSeparator>-</DateSeparator>
            <DateInput
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => {
                setEndDate(event.target.value);
                setDateFilterChanged(true);
                setCurrentPage(1);
              }}
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
        statuses={[
          "Draft",
          "In Transit",
          "Dispatched",
          "Delivered",
          "Partially Delivered",
          "Cancelled",
        ]}
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
              { label: "ABC Trading", value: "ABC Trading" },
              { label: "Riyadh Tech", value: "Riyadh Tech" },
              { label: "Al Noor Company", value: "Al Noor Company" },
              { label: "Saudi Solutions", value: "Saudi Solutions" },
            ],
            placeholder: "All Customer",
          },
        ]}
        showFilterButton
        filterButtonText="Clear Filter"
        onFilterClick={clearFilters}
      />

      {loading && <div style={{ padding: 20 }}>Loading delivery notes...</div>}
      {error && (
        <div style={{ padding: 20, color: "red" }}>
          {typeof error === "string" ? error : "Failed to load delivery notes"}
        </div>
      )}
      {!loading && <ReusableTable columns={columns} data={rows} />}
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
