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
  fetchWarehouseById,
  updateWarehouse,
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
 * Convert API date/datetime value
 * to the YYYY-MM-DD format required
 * by an HTML date input.
 */
const formatDateForInput = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  if (text.includes("T")) {
    return text.split("T")[0];
  }

  return text.length >= 10 ? text.substring(0, 10) : "";
};

/**
 * Get manager value from the API.
 *
 * The existing application supports
 * manager_name and manager object values.
 */
const getManagerValue = (warehouse) => {
  if (
    warehouse?.manager_name !== null &&
    warehouse?.manager_name !== undefined &&
    warehouse?.manager_name !== ""
  ) {
    return String(warehouse.manager_name);
  }

  if (typeof warehouse?.manager === "string") {
    return warehouse.manager;
  }

  if (warehouse?.manager?.name) {
    return String(warehouse.manager.name);
  }

  if (warehouse?.manager?.full_name) {
    return String(warehouse.manager.full_name);
  }

  if (warehouse?.manager?.username) {
    return String(warehouse.manager.username);
  }

  return "";
};

/**
 * Convert the actual API warehouse
 * object into the existing modal's
 * form field structure.
 */
const mapWarehouseToForm = (warehouse) => {
  const data = warehouse || {};

  return {
    warehouseName: data.warehouse_name ?? "",

    warehouseCode: data.code ?? "",

    warehouseType: data.warehouse_type ?? "",

    manager: getManagerValue(data),

    status: data.status ?? "",

    operatingSince: formatDateForInput(data.operating_since),

    country: data.country ?? "",

    city: data.city ?? "",

    addressLine1: data.address_line_1 ?? "",

    addressLine2: data.address_line_2 ?? "",

    postalCode: data.postal_code ?? "",

    phoneNumber: data.phone_number ?? "",

    email: data.email ?? "",

    storageCapacity: data.storage_capacity ?? "",

    notes: data.notes ?? "",
  };
};

/**
 * Format number values.
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
 * Format currency values.
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
    updating,
    error,
    updateError,
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

  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

  const [selectedWarehouseData, setSelectedWarehouseData] = useState(null);

  const [editLoading, setEditLoading] = useState(false);

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

  const handleEditWarehouse = useCallback(
    async (warehouse) => {
      const warehouseId = warehouse?.id;

      if (
        warehouseId === null ||
        warehouseId === undefined ||
        warehouseId === ""
      ) {
        console.error("Warehouse ID is missing:", warehouse);

        return;
      }

      setIsEditMode(true);

      setSelectedWarehouseId(warehouseId);

      setEditLoading(true);

      setSelectedWarehouseData(null);

      setIsWarehouseModalOpen(true);

      try {
        /*
         * Always fetch the selected
         * warehouse from the API.
         *
         * This guarantees that the
         * Edit modal receives the
         * current complete warehouse
         * object rather than relying
         * on incomplete table data.
         */

        const result = await dispatch(fetchWarehouseById(warehouseId));

        if (fetchWarehouseById.fulfilled.match(result)) {
          const response = result.payload;

          const warehouseData =
            response?.data &&
            typeof response.data === "object" &&
            !Array.isArray(response.data)
              ? response.data
              : response;

          if (warehouseData && typeof warehouseData === "object") {
            setSelectedWarehouseData(mapWarehouseToForm(warehouseData));
          } else {
            console.error("Invalid warehouse detail response:", response);

            setSelectedWarehouseData(mapWarehouseToForm(warehouse));
          }
        } else {
          console.error("Failed to fetch warehouse:", result.payload);

          /*
           * If the GET fails but the
           * row contains data, use the
           * row as a fallback instead
           * of opening an empty modal.
           */

          setSelectedWarehouseData(mapWarehouseToForm(warehouse));
        }
      } catch (error) {
        console.error("Failed to fetch warehouse:", error);

        setSelectedWarehouseData(mapWarehouseToForm(warehouse));
      } finally {
        setEditLoading(false);
      }
    },
    [dispatch],
  );

  /* =======================================================
     DELETE WAREHOUSE
  ======================================================= */

  const handleDeleteWarehouse = useCallback((warehouseId, warehouse) => {
    console.log("Delete warehouse:", warehouseId, warehouse);

    /*
     * Existing delete functionality
     * is intentionally untouched.
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
    setIsEditMode(false);

    setSelectedWarehouseId(null);

    setSelectedWarehouseData(null);

    setIsWarehouseModalOpen(true);
  }, []);

  /* =======================================================
     CLOSE WAREHOUSE MODAL
  ======================================================= */

  const handleCloseWarehouseModal = useCallback(() => {
    if (updating) {
      return;
    }

    setIsWarehouseModalOpen(false);

    setIsEditMode(false);

    setSelectedWarehouseId(null);

    setSelectedWarehouseData(null);

    setEditLoading(false);
  }, [updating]);

  /* =======================================================
     SAVE / UPDATE WAREHOUSE
  ======================================================= */

  const handleSaveWarehouse = async (formData) => {
    /* ---------------------------------------------------
         ADD MODE
      --------------------------------------------------- */

    if (!isEditMode) {
      const rawCode = String(formData?.warehouseCode || "").trim();

      const rawName = String(formData?.warehouseName || "").trim();

      /* -----------------------------------------------
           CHECK EXISTING CODES
        ------------------------------------------------ */

      const existingCodes = new Set(
        Array.isArray(warehouses)
          ? warehouses
              .map((warehouse) => String(warehouse?.code || "").trim())
              .filter(Boolean)
          : [],
      );

      /* -----------------------------------------------
           GENERATE SAFE CODE
        ------------------------------------------------ */

      const safeCode =
        rawCode && !existingCodes.has(rawCode)
          ? rawCode
          : `${rawCode || "WH"}-${Date.now().toString(36)}`;

      /* -----------------------------------------------
           API PAYLOAD
        ------------------------------------------------ */

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

      try {
        const result = await dispatch(addWarehouse(warehousePayload));

        if (addWarehouse.fulfilled.match(result)) {
          setIsWarehouseModalOpen(false);

          setIsEditMode(false);

          setSelectedWarehouseData(null);

          setSelectedWarehouseId(null);

          /*
           * Refresh warehouse list.
           */

          dispatch(
            fetchWarehouses({
              search,
              page: currentPage,
              page_size: rowsPerPage,
            }),
          );

          /*
           * Refresh KPI.
           */

          dispatch(fetchWarehouseKpi());

          return;
        }

        console.error("Warehouse creation failed:", result.payload);
      } catch (submitError) {
        console.error("Warehouse creation failed:", submitError);
      }

      return;
    }

    /* ---------------------------------------------------
         EDIT MODE
      --------------------------------------------------- */

    if (
      selectedWarehouseId === null ||
      selectedWarehouseId === undefined ||
      selectedWarehouseId === ""
    ) {
      console.error("Cannot update warehouse: ID is missing");

      return;
    }

    /*
     * IMPORTANT:
     *
     * Edit uses the same API field names
     * as the existing Add flow.
     */

    const warehousePayload = {
      code: formData?.warehouseCode ?? "",

      warehouse_name: formData?.warehouseName ?? "",

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

    console.log("Warehouse UPDATE payload:", warehousePayload);

    try {
      const result = await dispatch(
        updateWarehouse({
          id: selectedWarehouseId,

          warehouseData: warehousePayload,
        }),
      );

      if (updateWarehouse.fulfilled.match(result)) {
        /*
         * Close modal after
         * successful update.
         */

        setIsWarehouseModalOpen(false);

        setIsEditMode(false);

        setSelectedWarehouseId(null);

        setSelectedWarehouseData(null);

        /*
         * Refresh list so the
         * server's latest data
         * is displayed.
         */

        dispatch(
          fetchWarehouses({
            search,
            page: currentPage,
            page_size: rowsPerPage,
          }),
        );

        /*
         * Refresh KPI.
         */

        dispatch(fetchWarehouseKpi());

        return;
      }

      console.error("Warehouse update failed:", result.payload);
    } catch (submitError) {
      console.error("Warehouse update failed:", submitError);
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
          UPDATE ERROR
      =================================================== */}

      {updateError && (
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
          {typeof updateError === "string"
            ? updateError
            : updateError?.detail ||
              updateError?.message ||
              "Failed to update warehouse"}
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
        loading={loading || creating || updating}
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
        initialData={isEditMode ? selectedWarehouseData : null}
        isEdit={isEditMode}
        submitting={updating || editLoading}
      />

      {/* ===================================================
          EDIT LOADING
      =================================================== */}

      {isWarehouseModalOpen && isEditMode && editLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              padding: "10px 16px",
              borderRadius: 6,
              boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
              fontSize: 13,
            }}
          >
            Loading warehouse...
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouselist;
