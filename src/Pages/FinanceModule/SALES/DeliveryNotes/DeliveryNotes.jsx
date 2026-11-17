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
  CompactTableWrapper,
} from "./DeliveryNotes.style";

import {
  deliveryNoteColumns,
  deliveryNoteStats,
} from "./DeliveryNotesColoumns";
import {
  fetchDeliveryNotes,
  fetchDeliveryNoteKpi,
  removeDeliveryNote,
  patchExistingDeliveryNote,
} from "../../../../Redux/finance/Sales/deliveryNotesSlice";
import { fetchWarehouses } from "../../../../Redux/finance/Product/warehouseSlice";
import { getCustomers as getCustomerList } from "../../../../Redux/finance/Sales/CustomerSlice";

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

  const { warehouses = [] } = useSelector((state) => state.warehouse || {});
  const customerState = useSelector((state) => state?.customer?.customers ?? []);

  const currentMonth = useMemo(getCurrentMonthRange, []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [customer, setCustomer] = useState("");
  const [warehouse, setWarehouse] = useState("");
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
    if (warehouse) params.warehouse = warehouse;
    if (dateFilterChanged && startDate) params.start_date = startDate;
    if (dateFilterChanged && endDate) params.end_date = endDate;
    return params;
  }, [
    currentPage,
    search,
    status,
    customer,
    warehouse,
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

  useEffect(() => {
    dispatch(fetchWarehouses({ page: 1, page_size: 100 }));
    dispatch(getCustomerList());
  }, [dispatch]);

  const warehouseOptions = useMemo(
    () =>
      (Array.isArray(warehouses) ? warehouses : []).map((w) => ({
        label: w.warehouse_name || w.name || `Warehouse ${w.id}`,
        value: w.id,
      })),
    [warehouses],
  );

  const customerList = useMemo(() => {
    const list =
      customerState?.results ??
      customerState?.data ??
      customerState?.customers ??
      customerState;
    return Array.isArray(list) ? list : [];
  }, [customerState]);

  const customerOptions = useMemo(
    () =>
      customerList.map((c) => ({
        label: c.customer_name || c.name || `Customer #${c.id}`,
        value: c.id,
      })),
    [customerList],
  );

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

  const handleOrderRefClick = useCallback(
    (row) => {
      const soId = row?.sales_order || row?.sales_order_id;
      if (soId) {
        navigate(`/sales/orders/edit/${soId}`);
      } else {
        navigate("/sales/orders");
      }
    },
    [navigate],
  );

  // eslint-disable-next-line no-unused-vars
  const handleStatusChange = useCallback(
    async (row, nextStatus) => {
      const id = row?.id ?? row?.pk;
      if (!id || !nextStatus) return;
      try {
        await dispatch(
          patchExistingDeliveryNote({
            id,
            payload: { delivery_status: nextStatus, status: nextStatus },
          }),
        ).unwrap();
        dispatch(fetchDeliveryNotes(apiParams));
        dispatch(fetchDeliveryNoteKpi());
      } catch (statusError) {
        console.error("Update delivery note status failed:", statusError);
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
      totalItems || rows.length,
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
      read(row, "delivery_note_number", "deliveryNoteNumber", "dn_number"),
      typeof row.customer === "object"
        ? read(row.customer, "name", "customer_name")
        : read(row, "customer", "customer_name"),
      read(
        row,
        "sales_order_reference",
        "salesOrderReference",
        "order_reference",
        "so_ref",
      ),
      read(row, "dispatch_date", "dispatchDate"),
      read(
        row,
        "expected_delivery_date",
        "expectedDeliveryDate",
        "delivery_date",
      ),
      read(row, "warehouse_name", "warehouse", "dispatch_location"),
      read(row, "items_delivered_ordered", "items_summary"),
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
    () => deliveryNoteColumns(handleDelete, handleOrderRefClick),
    [handleDelete, handleOrderRefClick],
  );

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Delivery Notes"
        breadcrumbs={["Sales", "Delivery Notes"]}
        buttonText="+ Create Delivery Note"
        onButtonClick={() => navigate("/delivery/notes/add")}
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
        statusPlaceholder="Delivery Status"
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
            options: customerOptions,
            placeholder: "All Customer",
          },
          {
            key: "warehouse",
            value: warehouse,
            onChange: (value) => {
              setWarehouse(value);
              setCurrentPage(1);
            },
            options: warehouseOptions,
            placeholder: "Warehouse",
          },
        ]}
      />

      {loading && <div style={{ padding: 20 }}>Loading delivery notes...</div>}
      {error && (
        <div style={{ padding: 20, color: "red" }}>
          {typeof error === "string" ? error : "Failed to load delivery notes"}
        </div>
      )}
      {!loading && (
        <CompactTableWrapper>
          <ReusableTable
            columns={columns}
            data={rows}
            autoLayout
            emptyMessage="No delivery notes found"
          />
        </CompactTableWrapper>
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