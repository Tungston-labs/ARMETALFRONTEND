import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  FiDownload,
  FiHome,
  FiCheckCircle,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";

/* =========================================================
   WAREHOUSE COLUMNS
========================================================= */

import getWarehouseColumns from "../../../../Components/WarehouseDetails/warehouseColumns";

/* =========================================================
   REDUX
========================================================= */

import {
  fetchWarehouses,
  addWarehouse,
  fetchWarehouseKpi,
} from "../../../../Redux/warehouseSlice";

/* =========================================================
   COMMON COMPONENTS
========================================================= */

import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";

import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";

import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";

import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";

import StatsCards from "../../../../Components/StatsCards/StatsCards";

import WarehouseModal from "../../../../Components/WarehouseModal/WarehouseModal";

/* =========================================================
   HELPERS
========================================================= */

/**
 * Format number values
 */
const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toLocaleString("en-US");
};

/**
 * Format currency values
 */
const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (trimmedValue.toUpperCase().includes("SAR")) {
      return trimmedValue;
    }
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return `SAR ${number.toLocaleString("en-US")}`;
};

/* =========================================================
   COMPONENT
========================================================= */

const Warehouselist = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  /* =======================================================
     REDUX STATE
  ======================================================= */

  const {
    warehouses,
    total,
    activeCount,
    inactiveCount,
    kpi,
    loading,
    creating,
    error,
    totalPages,
  } = useSelector((state) => state.warehouse);

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [search, setSearch] = useState("");

  const [department, setDepartment] = useState("");

  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);

  const rowsPerPage = 20;

  /* =======================================================
     GET WAREHOUSES
  ======================================================= */

  useEffect(() => {
    dispatch(
      fetchWarehouses({
        search,
        page: currentPage,
        page_size: rowsPerPage,
      }),
    );

    dispatch(fetchWarehouseKpi());
  }, [dispatch, search, currentPage]);

  /* =======================================================
     EDIT WAREHOUSE
  ======================================================= */

  const handleEditWarehouse = useCallback((warehouse) => {
    console.log("Edit warehouse:", warehouse);

    /*
     * Add your edit modal/API logic here
     * when the edit functionality is ready.
     */
  }, []);

  /* =======================================================
     DELETE WAREHOUSE
  ======================================================= */

  const handleDeleteWarehouse = useCallback((warehouseId, warehouse) => {
    console.log("Delete warehouse:", warehouseId, warehouse);

    /*
     * Add your delete API logic here
     * when the delete functionality is ready.
     */
  }, []);

  /* =======================================================
     TABLE COLUMNS
  ======================================================= */

  const columns = useMemo(
    () =>
      getWarehouseColumns({
        navigate,
        onEdit: handleEditWarehouse,
        onDelete: handleDeleteWarehouse,
      }),
    [navigate, handleEditWarehouse, handleDeleteWarehouse],
  );

  /* =======================================================
     STATISTICS
  ======================================================= */

  const warehouseCards = useMemo(
    () => [
      {
        count: String(kpi?.total_warehouses ?? total ?? 0).padStart(2, "0"),

        title: "Total Warehouses",

        icon: <FiHome size={20} />,

        backgroundColor: "#E8EDFF",

        iconColor: "#3454B9",
      },

      {
        count: String(kpi?.active_warehouses ?? activeCount ?? 0).padStart(
          2,
          "0",
        ),

        title: "Active Warehouses",

        icon: <FiCheckCircle size={20} />,

        backgroundColor: "#E8F7EE",

        iconColor: "#2E9B5B",
      },

      {
        count: "SAR 18.5M",

        title: "Total Stock Value",

        icon: <FiPackage size={20} />,

        backgroundColor: "#E9F8ED",

        iconColor: "#16A34A",
      },

      {
        count: "45,280 Units",

        title: "Total Stock Quantity",

        icon: <FiPackage size={20} />,

        backgroundColor: "#FFF0E5",

        iconColor: "#E67E22",
      },

      {
        count: String(kpi?.inactive_warehouses ?? inactiveCount ?? 0).padStart(
          2,
          "0",
        ),

        title: "Low Stock Warehouses",

        icon: <FiAlertCircle size={20} />,

        backgroundColor: "#FDEAEA",

        iconColor: "#D64545",
      },
    ],
    [total, activeCount, inactiveCount, kpi],
  );

  /* =======================================================
     ADD WAREHOUSE
  ======================================================= */

  const handleAddWarehouse = useCallback(() => {
    setIsWarehouseModalOpen(true);
  }, []);

  /* =======================================================
     CLOSE WAREHOUSE MODAL
  ======================================================= */

  const handleCloseWarehouseModal = useCallback(() => {
    setIsWarehouseModalOpen(false);
  }, []);

  /* =======================================================
     SAVE WAREHOUSE
  ======================================================= */

  const handleSaveWarehouse = async (formData) => {
    const rawCode = String(formData?.warehouseCode || "").trim();

    const rawName = String(formData?.warehouseName || "").trim();

    /* -----------------------------------------------------
         CHECK EXISTING CODES
      ----------------------------------------------------- */

    const existingCodes = new Set(
      Array.isArray(warehouses)
        ? warehouses
            .map((warehouse) => String(warehouse?.code || "").trim())
            .filter(Boolean)
        : [],
    );

    /* -----------------------------------------------------
         GENERATE SAFE CODE
      ----------------------------------------------------- */

    const safeCode =
      rawCode && !existingCodes.has(rawCode)
        ? rawCode
        : `${rawCode || "WH"}-${Date.now().toString(36)}`;

    /* -----------------------------------------------------
         API PAYLOAD
      ----------------------------------------------------- */

    const warehousePayload = {
      code: safeCode,

      warehouse_name: rawName || "",

      warehouse_type: formData?.warehouseType || null,

      manager_name:
        formData?.manager !== null &&
        formData?.manager !== undefined &&
        String(formData.manager).trim() !== ""
          ? String(formData.manager).trim()
          : null,

      status: formData?.status || null,

      operating_since: formData?.operatingSince || null,

      country: formData?.country || "",

      city: formData?.city || "",

      address_line_1: formData?.addressLine1 || "",

      address_line_2: formData?.addressLine2 || "",

      postal_code: formData?.postalCode || "",

      phone_number: formData?.phoneNumber || "",

      email: formData?.email || "",

      storage_capacity: formData?.storageCapacity || "",

      notes: formData?.notes || "",
    };

    console.log("Warehouse API Payload:", warehousePayload);

    /* -----------------------------------------------------
         CREATE WAREHOUSE
      ----------------------------------------------------- */

    try {
      const result = await dispatch(addWarehouse(warehousePayload));

      if (addWarehouse.fulfilled.match(result)) {
        setIsWarehouseModalOpen(false);

        /* Refresh warehouse list */

        dispatch(
          fetchWarehouses({
            search,
            page: currentPage,
            page_size: rowsPerPage,
          }),
        );

        /* Refresh KPI */

        dispatch(fetchWarehouseKpi());

        return;
      }

      console.error("Warehouse creation failed:", result.payload);
    } catch (submitError) {
      console.error("Warehouse creation failed:", submitError);
    }
  };

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch = (value) => {
    setSearch(value);

    setCurrentPage(1);
  };

  /* =======================================================
     DEPARTMENT
  ======================================================= */

  const handleDepartment = (value) => {
    setDepartment(value);

    setCurrentPage(1);
  };

  /* =======================================================
     STATUS
  ======================================================= */

  const handleStatus = (value) => {
    setStatus(value);

    setCurrentPage(1);
  };

  /* =======================================================
     PAGINATION
  ======================================================= */

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      {/* ===================================================
          HEADER
      =================================================== */}

      <ReusableHeader title="Warehouse" breadcrumbs={["Warehouse"]}>
        <HeaderButton $variant="excel">
          <FiDownload />
          EXPORT EXCEL
        </HeaderButton>

        <HeaderButton onClick={handleAddWarehouse}>
          + ADD WAREHOUSE
        </HeaderButton>
      </ReusableHeader>

      {/* ===================================================
          STATISTICS
      =================================================== */}

      <StatsCards cards={warehouseCards} loading={loading} />

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div
          style={{
            marginTop: 15,
            marginBottom: 15,
            padding: 12,
            borderRadius: 6,
            background: "#FDEAEA",
            color: "#D64545",
            fontSize: 13,
          }}
        >
          {typeof error === "string"
            ? error
            : error?.detail || error?.message || "Failed to fetch warehouses"}
        </div>
      )}

      {/* ===================================================
          FILTER
      =================================================== */}

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        department={department}
        departments={["HR", "Finance", "Development", "Marketing"]}
        onDepartment={handleDepartment}
        status={status}
        statuses={["Present", "Absent", "On Leave"]}
        onStatus={handleStatus}
        showSearch
        showDepartment
        showStatus
        rightButton={
          <HeaderButton $variant="orange">Apply Filters</HeaderButton>
        }
      />

      {/* ===================================================
          TABLE
      =================================================== */}

      <ReusableTable
        columns={columns}
        data={Array.isArray(warehouses) ? warehouses : []}
        loading={loading || creating}
      />

      {/* ===================================================
          PAGINATION
      =================================================== */}

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={handlePageChange}
      />

      {/* ===================================================
          WAREHOUSE MODAL
      =================================================== */}

      <WarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={handleCloseWarehouseModal}
        onSubmit={handleSaveWarehouse}
      />
    </div>
  );
};

export default Warehouselist;
