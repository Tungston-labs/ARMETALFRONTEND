import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiBox,
  FiCreditCard,
  FiInfo,
  FiPackage,
  FiUpload,
} from "react-icons/fi";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import WarehouseModal from "./modal/WarehouseModal";
import { buildWarehousePayload, formatApiError } from "./modal/warehouseMapper";
import { exportWarehouses } from "../../../../services/warehouseService";
import {
  fetchWarehouses,
  fetchWarehouseKpi,
  addWarehouse,
  clearWarehouseError,
  clearCreateWarehouseError,
} from "../../../../Redux/finance/Product/warehouseSlice";
import {
  ActionIconButton,
  ExportButton,
  FilterTag,
  FilterTagBar,
  PageContainer,
} from "./WarehouseList.styles";

const PAGE_SIZE = 20;

const formatTwoDigits = (value) => {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num) || num < 0) return "00";
  return num < 10 ? `0${Math.trunc(num)}` : String(Math.trunc(num));
};

const formatUnits = (value) => {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "0";
  if (Number.isInteger(num)) {
    return num > 0 && num < 10 ? `0${num}` : String(num);
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatSarAmount = (value) => {
  const num = Number(value ?? 0);
  const safe = Number.isFinite(num) ? num : 0;
  return `SAR ${safe.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatStatusLabel = (value) => {
  if (!value) return "—";
  const text = String(value).trim();
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

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
  const [nearFull, setNearFull] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, nearFull]);

  const loadWarehouses = useCallback(
    (page = currentPage) => {
      const params = { page, page_size: PAGE_SIZE };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status.toLowerCase();
      if (nearFull) params.near_full = "true";
      return dispatch(fetchWarehouses(params));
    },
    [dispatch, currentPage, debouncedSearch, status, nearFull],
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
      navigate(`/warehouse/${row.id}`);
    },
    [navigate],
  );

  const handleSaveWarehouse = async (formData) => {
    try {
      await dispatch(addWarehouse(buildWarehousePayload(formData))).unwrap();
      setIsModalOpen(false);

      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadWarehouses(1);
      }
      dispatch(fetchWarehouseKpi());
    } catch {
      /* createError is stored in Redux and displayed in the modal */
    }
  };

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await exportWarehouses({
        search: debouncedSearch,
        status: status ? status.toLowerCase() : "",
        near_full: nearFull ? "true" : "",
        exportFormat: "csv",
      });

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "warehouses.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export warehouses:", err);
    } finally {
      setExporting(false);
    }
  };

  const warehouseColumns = useMemo(
    () => [
      { accessor: "code", header: "Code" },
      { accessor: "warehouse_name", header: "Warehouse" },
      {
        accessor: "location",
        header: "Location",
        render: (row) => row.location || row.city || row.country || "—",
      },
      {
        accessor: "manager",
        header: "Manager",
        render: (row) => row.manager || row.manager_name || "—",
      },
      {
        accessor: "total_units",
        header: "Total units",
        render: (row) => formatUnits(row.total_units),
      },
      {
        accessor: "stock_value",
        header: "Stock value",
        render: (row) => formatSarAmount(row.stock_value),
      },
      {
        accessor: "capacity_used",
        header: "Capacity used",
        render: (row) => {
          const text =
            row.capacity_used ||
            (row.storage_capacity ? String(row.storage_capacity) : "—");
          if (row.near_full_capacity) {
            return (
              <span style={{ color: "#dc2626", fontWeight: 500 }}>{text}</span>
            );
          }
          return text;
        },
      },
      {
        accessor: "status",
        header: "Status",
        render: (row) => formatStatusLabel(row.status),
      },
      {
        accessor: "action",
        header: "Action",
        sortable: false,
        render: (row) => (
          <ActionIconButton
            type="button"
            title="View Warehouse Details"
            aria-label={`View ${row.warehouse_name || "warehouse"} details`}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row);
            }}
          >
            <FiInfo size={14} />
          </ActionIconButton>
        ),
      },
    ],
    [handleRowClick],
  );

  const statsCards = useMemo(
    () => [
      {
        title: "Total Warehouses",
        count: formatTwoDigits(kpi?.total_warehouses),
        icon: <FiBox size={22} />,
        backgroundColor: "#eff6ff",
        iconColor: "#2563eb",
        onClick: () => {
          setStatus("");
          setNearFull(false);
        },
      },
      {
        title: "Total stock value",
        count: formatSarAmount(kpi?.total_stock_value),
        icon: <FiPackage size={22} />,
        backgroundColor: "#ecfdf5",
        iconColor: "#16a34a",
      },
      {
        title: "Active Warehouses",
        count: formatTwoDigits(kpi?.active_warehouses),
        icon: <FiCreditCard size={22} />,
        backgroundColor: "#ecfeff",
        iconColor: "#0891b2",
        onClick: () => {
          setNearFull(false);
          setStatus("Active");
        },
      },
      {
        title: "Average capacity used",
        count: `${Math.round(Number(kpi?.average_capacity_used ?? 0))} %`,
        icon: <FiBox size={22} />,
        backgroundColor: "#fff7ed",
        iconColor: "#ea580c",
      },
      {
        title: "Near full capacity",
        count: formatTwoDigits(kpi?.near_full_capacity),
        icon: <FiBox size={22} />,
        backgroundColor: "#fef2f2",
        iconColor: "#dc2626",
        onClick: () => setNearFull((prev) => !prev),
      },
    ],
    [kpi],
  );

  const createErrorMessage = useMemo(
    () => formatApiError(createError),
    [createError],
  );

  return (
    <PageContainer>
      <ReusableHeader
        title="Warehouse"
        breadcrumbs={["Products", "Warehouse"]}
        buttonText="+ ADD WAREHOUSE"
        onButtonClick={openModal}
      >
        <ExportButton
          type="button"
          onClick={handleExport}
          disabled={exporting}
        >
          <FiUpload size={14} />
          {exporting ? "EXPORTING..." : "EXPORT"}
        </ExportButton>
      </ReusableHeader>

      <StatsCards cards={statsCards} loading={kpiLoading} />

      <ReusableFilter
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search Warehouse"
        status={status}
        statuses={["Active", "Inactive"]}
        onStatus={setStatus}
        showSearch
        showStatus
        showDepartment={false}
        showDate={false}
      />

      {nearFull && (
        <FilterTagBar>
          <FilterTag>
            Near full capacity (&ge; 80%)
            <button
              type="button"
              onClick={() => setNearFull(false)}
              aria-label="Clear near full capacity filter"
            >
              ×
            </button>
          </FilterTag>
        </FilterTagBar>
      )}

      {error && (
        <div style={{ color: "#b91c1c", margin: "12px 0", fontSize: 13 }}>
          {typeof error === "string"
            ? error
            : error?.detail || "Something went wrong"}
        </div>
      )}

      <ReusableTable
        columns={warehouseColumns}
        data={warehouses}
        loading={loading}
        loadingMessage="Loading warehouses…"
        emptyMessage="No warehouses found"
        onRowClick={handleRowClick}
        autoLayout
      />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {isModalOpen && (
        <WarehouseModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveWarehouse}
          submitting={creating}
          error={createErrorMessage}
        />
      )}
    </PageContainer>
  );
};

export default WarehouseList;
