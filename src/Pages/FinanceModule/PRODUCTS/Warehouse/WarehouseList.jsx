import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdWarehouse, MdCheckCircle, MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
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
import { FiBox } from "react-icons/fi";
import { StatusBadge } from "./WarehouseList.style";

const PAGE_SIZE = 20;

/* Each column needs a unique accessor. Adjust the field names to your API. */
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

/* Modal form (camelCase) -> API payload (snake_case) */
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

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status]);

  const loadWarehouses = useCallback(
    (page = currentPage) => {
      const params = { page, page_size: PAGE_SIZE };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status.toLowerCase();
      return dispatch(fetchWarehouses(params));
    },
    [dispatch, currentPage, debouncedSearch, status],
  );

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  useEffect(() => {
    dispatch(fetchWarehouseKpi());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearWarehouseError());
      dispatch(clearCreateWarehouseError());
    };
  }, [dispatch]);

  /* Modal handlers */
  const openModal = () => {
    dispatch(clearCreateWarehouseError());
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (creating) return;
    setIsModalOpen(false);
    dispatch(clearCreateWarehouseError());
  };
const handleRowClick = useCallback(
  (row) => {
    if (row?.id === undefined || row?.id === null) return;
    navigate(`/warehouse/${row.id}`); // adjust to the full path of your route
  },
  [navigate],
);
  const handleSaveWarehouse = async (formData) => {
    try {
      await dispatch(addWarehouse(buildPayload(formData))).unwrap();

      setIsModalOpen(false);

      /* Show the new record on page 1 and refresh the KPI cards */
      if (currentPage !== 1) {
        setCurrentPage(1); // the effect reloads the list
      } else {
        loadWarehouses(1);
      }
      dispatch(fetchWarehouseKpi());
    } catch (err) {
      /* createError is already in the store; the modal shows it */
    }
  };

  const statsCards = useMemo(
    () => [
      {
        title: "Total Warehouses",
        count: kpi.total_warehouses,
        icon: <FiBox size={22} />,
        backgroundColor: "#eff6ff",
        iconColor: "#2563eb",
        onClick: () => setStatus(""),
      },
       {
        title: "Total Stock value",
        count: kpi.total_warehouses,
        icon: <FiBox size={22} />,
        backgroundColor: "#eff6ff",
        iconColor: "#2563eb",
        onClick: () => setStatus(""),
      },
      {
        title: "Active Warehouses",
        count: kpi.active_warehouses,
        icon: <MdCheckCircle size={22} />,
        backgroundColor: "#ecfdf5",
        iconColor: "#059669",
        onClick: () => setStatus("Active"),
      },
      {
        title: "Average capacity used",
        count: kpi.active_warehouses,
        icon: <FiBox size={22} />,
        backgroundColor: "#fdfaec",
        iconColor: "#e0c217",
        onClick: () => setStatus("Active"),
      },
      {
        title: "Near full capacity",
        count: kpi.inactive_warehouses,
        icon: <FiBox size={22} />,
        backgroundColor: "#fef2f2",
        iconColor: "#dc2626",
        onClick: () => setStatus("Inactive"),
      },
    ],
    [kpi],
  );

  const tableData = useMemo(
    () =>
      warehouses.map((w) => ({
        ...w,
        status: w?.status
          ? w.status.charAt(0).toUpperCase() + w.status.slice(1)
          : "-",
      })),
    [warehouses],
  );

  /* Turn the API error (string or DRF object) into one readable string */
  const createErrorMessage = useMemo(() => {
    if (!createError) return "";
    if (typeof createError === "string") return createError;
    if (createError.detail) return createError.detail;
    return Object.entries(createError)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
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

      {error && (
        <div style={{ color: "#b91c1c", margin: "12px 0" }}>
          {typeof error === "string"
            ? error
            : error?.detail || "Something went wrong"}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 24 }}>Loading warehouses…</div>
      ) : (
        <ReusableTable columns={warehouseColumns} data={tableData}   onRowClick={handleRowClick}/>
      )}

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Rendered only while open, so the form resets every time */}
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