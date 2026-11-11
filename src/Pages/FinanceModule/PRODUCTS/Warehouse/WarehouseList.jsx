
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdCheckCircle,
  MdWarehouse,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FiBox } from "react-icons/fi";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import WarehouseModal from "./modal/WarehouseModal";

import {
  fetchWarehouses,
  fetchWarehouseKpi,
  addWarehouse,
  clearWarehouseError,
  clearCreateWarehouseError,
} from "../../../../Redux/finance/Product/warehouseSlice";

import { StatusBadge } from "./WarehouseList.style";

const PAGE_SIZE = 20;

// Warehouse table columns
const warehouseColumns = [
  { accessor: "code", header: "Code" },
  { accessor: "warehouse_name", header: "Warehouse Name" },
  { accessor: "city", header: "Location" },
  { accessor: "manager_name", header: "Manager" },
  { accessor: "total_units", header: "Total Units" },
  { accessor: "stock_value", header: "Stock Value" },
  { accessor: "storage_capacity", header: "Capacity Used" },
  {
    accessor: "status",
    header: "Status",
    render: (row) => {
      const status = String(row?.status || "").toLowerCase();

      return status ? (
        <StatusBadge $status={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </StatusBadge>
      ) : (
        "-"
      );
    },
  },
];

// Modal form values -> API payload
const buildPayload = (form) => ({
  warehouse_code: form.warehouseCode,
  warehouse_name: form.warehouseName,
  warehouse_type: form.warehouseType,
  manager_name: form.manager,
  status: String(form.status || "").toLowerCase(),
  operating_since: form.operatingSince || null,
  country: form.country,
  city: form.city,
  address_line1: form.addressLine1,
  address_line2: form.addressLine2,
  postal_code: form.postalCode,
  phone_number: form.phoneNumber,
  email: form.email,
  storage_capacity:
    form.storageCapacity === "" ? null : Number(form.storageCapacity),
  notes: form.notes,
});

const WarehouseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    warehouses,
    totalPages,
    loading,
    error,
    kpi,
    kpiLoading,
    creating,
    createError,
  } = useSelector((state) => state.warehouse);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [warehouseType, setWarehouseType] = useState("");

  // Pagination and modal
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, warehouseType]);

  // Fetch warehouses with all filters
  const loadWarehouses = useCallback(
    (page = currentPage) => {
      const params = {
        page,
        page_size: PAGE_SIZE,
      };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      if (status) {
        params.status = status.toLowerCase();
      }

      if (warehouseType) {
        params.warehouse_type = warehouseType.toLowerCase();
      }

      return dispatch(fetchWarehouses(params));
    },
    [dispatch, currentPage, debouncedSearch, status, warehouseType]
  );

  // Fetch list whenever filters or page changes
  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  // Fetch KPI
  useEffect(() => {
    dispatch(fetchWarehouseKpi());
  }, [dispatch]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearWarehouseError());
      dispatch(clearCreateWarehouseError());
    };
  }, [dispatch]);

  // Modal handlers
  const openModal = () => {
    dispatch(clearCreateWarehouseError());
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (creating) return;

    setIsModalOpen(false);
    dispatch(clearCreateWarehouseError());
  };

  // Navigate to warehouse details
  const handleRowClick = useCallback(
    (row) => {
      if (row?.id === undefined || row?.id === null) return;

      navigate(`/warehouse/${row.id}`);
    },
    [navigate]
  );

  // Create warehouse
  const handleSaveWarehouse = async (formData) => {
    try {
      await dispatch(addWarehouse(buildPayload(formData))).unwrap();

      setIsModalOpen(false);

      // Refresh list on page 1
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadWarehouses(1);
      }

      // Refresh KPI
      dispatch(fetchWarehouseKpi());
    } catch (err) {
      // Error is handled by Redux and displayed in modal
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setWarehouseType("");
    setCurrentPage(1);
  };

  // KPI cards
  const statsCards = useMemo(
    () => [
      {
        title: "Total Warehouses",
        count: kpi.total_warehouses,
        icon: <MdWarehouse size={22} />,
        backgroundColor: "#eff6ff",
        iconColor: "#2563eb",
        onClick: clearFilters,
      },
      {
        title: "Active Warehouses",
        count: kpi.active_warehouses,
        icon: <MdCheckCircle size={22} />,
        backgroundColor: "#ecfdf5",
        iconColor: "#059669",
        onClick: () => {
          setStatus("Active");
          setWarehouseType("");
        },
      },
      {
        title: "Inactive Warehouses",
        count: kpi.inactive_warehouses,
        icon: <FiBox size={22} />,
        backgroundColor: "#fef2f2",
        iconColor: "#dc2626",
        onClick: () => {
          setStatus("Inactive");
          setWarehouseType("");
        },
      },
    ],
    [kpi]
  );

  // Table data
  const tableData = useMemo(
    () =>
      warehouses.map((warehouse) => ({
        ...warehouse,
        status: warehouse?.status
          ? warehouse.status.charAt(0).toUpperCase() +
            warehouse.status.slice(1)
          : "-",
      })),
    [warehouses]
  );

  // Format API error
  const createErrorMessage = useMemo(() => {
    if (!createError) return "";

    if (typeof createError === "string") {
      return createError;
    }

    if (createError.detail) {
      return createError.detail;
    }

    return Object.entries(createError)
      .map(([key, value]) => {
        return `${key}: ${
          Array.isArray(value) ? value.join(", ") : value
        }`;
      })
      .join(" | ");
  }, [createError]);

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Warehouses"
        breadcrumbs={["Dashboard", "Warehouses"]}
        buttonText="ADD NEW WAREHOUSE"
        onButtonClick={openModal}
      />

      <StatsCards cards={statsCards} loading={kpiLoading} />

      {/* Search and status filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 250 }}>
          <ReusableFilter
            search={search}
            onSearch={setSearch}
            status={status}
            statuses={["Active", "Inactive"]}
            onStatus={setStatus}
            showSearch
            showStatus
            showDepartment={false}
            showDate={false}
          />
        </div>

        {/* Warehouse type filter */}
        <select
          value={warehouseType}
          onChange={(e) => setWarehouseType(e.target.value)}
          style={{
            padding: "10px 14px",
            border: "1px solid #ddd",
            borderRadius: 6,
            minWidth: 180,
            height: 42,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <option value="">All Warehouse Types</option>
          <option value="main">Main</option>
          <option value="branch">Branch</option>
        </select>

        {/* Clear filters */}
        {(status || warehouseType || search) && (
          <button
            type="button"
            onClick={clearFilters}
            style={{
              padding: "10px 14px",
              border: "1px solid #ddd",
              borderRadius: 6,
              background: "#fff",
              cursor: "pointer",
              height: 42,
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* API error */}
      {error && (
        <div style={{ color: "#b91c1c", margin: "12px 0" }}>
          {typeof error === "string"
            ? error
            : error?.detail || "Something went wrong"}
        </div>
      )}

      {/* Warehouse table */}
      {loading ? (
        <div style={{ padding: 24 }}>Loading warehouses…</div>
      ) : (
        <ReusableTable
          columns={warehouseColumns}
          data={tableData}
          onRowClick={handleRowClick}
        />
      )}

      {/* Pagination */}
      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add warehouse modal */}
      {isModalOpen && (
        <WarehouseModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveWarehouse}
          submitting={creating}
          error={createErrorMessage}
        />
      )}
    </div>
  );
};

export default WarehouseList;
