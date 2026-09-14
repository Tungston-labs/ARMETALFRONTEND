import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";

import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../Components/ReusableTable/ReusableHeader.styles";

import { FiDownload } from "react-icons/fi";

import StockAdjustmentModal from "../../../Components/InventoryModal/InventoryModal";

import { fetchInventory } from "../../../Redux/inventorySlice";
import { getCategories } from "../../../Redux/finance/categorySlice";
import { getWarehouses } from "../../../services/warehouseService";
import { fetchProducts } from "../../../services/finance/productServices";

import { inventoryColumns } from "../../../Components/ReusableTable/inventoryColumns.jsx";

const InventoryList = () => {
  const dispatch = useDispatch();

  // =====================================================
  // REDUX STATE
  // =====================================================

  const {
    inventory = [],
    totalPages = 0,
    currentPage: apiCurrentPage = 1,
    loading = false,
    error = null,
  } = useSelector((state) => state.inventory || {});

  const categoryOptions = useSelector((state) => state.category?.categories || []);

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [status, setStatus] = useState("");
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);

  // =====================================================
  // INVENTORY MODAL
  // =====================================================

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  // =====================================================
  // FETCH INVENTORY
  // =====================================================

  const loadInventory = useCallback(
    (page = 1) => {
      dispatch(
        fetchInventory({
          page,
          search: search.trim(),
          category,
          warehouse,
          stock_status: status,
        }),
      );
    },
    [dispatch, search, category, warehouse, status],
  );

  // =====================================================
  // INITIAL API LOAD
  // =====================================================

  useEffect(() => {
    dispatch(getCategories({ page: 1, page_size: 100 }));

    getWarehouses({ page: 1, page_size: 100 })
      .then((response) => {
        const rows = Array.isArray(response)
          ? response
          : response?.results || response?.data?.results || response?.data || [];

        setWarehouseOptions(Array.isArray(rows) ? rows : []);
      })
      .catch((error) => {
        console.error("Failed to load inventory warehouse options:", error);
        setWarehouseOptions([]);
      });

    fetchProducts({ page: 1, page_size: 100 })
      .then((response) => {
        const rows = Array.isArray(response)
          ? response
          : response?.results || response?.data?.results || response?.data || [];

        setProductOptions(Array.isArray(rows) ? rows : []);
      })
      .catch((error) => {
        console.error("Failed to load inventory product options:", error);
        setProductOptions([]);
      });

    dispatch(
      fetchInventory({
        page: 1,
        search: "",
        category: "",
        warehouse: "",
        stock_status: "",
      }),
    );
  }, [dispatch]);

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const handleApplyFilters = () => {
    setCurrentPage(1);

    dispatch(
      fetchInventory({
        page: 1,
        search: search.trim(),
        category,
        warehouse,
        stock_status: status,
      }),
    );
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (value) => {
    setSearch(value || "");
    setCurrentPage(1);
  };

  // =====================================================
  // CATEGORY
  // =====================================================

  const handleCategory = (value) => {
    setCategory(value || "");
    setCurrentPage(1);
  };

  // =====================================================
  // WAREHOUSE
  // =====================================================

  const handleWarehouse = (value) => {
    setWarehouse(value || "");
    setCurrentPage(1);
  };

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatus = (value) => {
    setStatus(value || "");
    setCurrentPage(1);
  };

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (page) => {
    setCurrentPage(page);

    loadInventory(page);
  };

  // =====================================================
  // OPEN STOCK ADJUSTMENT
  // =====================================================

  const handleAddInventory = () => {
    setIsInventoryModalOpen(true);
  };

  // =====================================================
  // CLOSE STOCK ADJUSTMENT
  // =====================================================

  const handleCloseInventoryModal = () => {
    setIsInventoryModalOpen(false);
  };

  // =====================================================
  // STOCK ADJUSTMENT SUBMIT
  // =====================================================

  const handleInventorySubmit = (formData) => {
    console.log("Inventory Adjustment Data:", formData);

    setIsInventoryModalOpen(false);

    // Refresh current page
    loadInventory(currentPage);
  };

  // =====================================================
  // EXPORT
  // =====================================================

  const handleExportExcel = () => {
    console.log("Export inventory to Excel");
  };

  // =====================================================
  // SAFE TABLE DATA
  // =====================================================

  const tableData = Array.isArray(inventory) ? inventory : [];

  const categoryOptionsForFilter = useMemo(
    () =>
      Array.isArray(categoryOptions)
        ? categoryOptions.map((item) => ({
            label: item?.category_name || item?.name || "Category",
            value: item?.id ?? item?.category_id ?? item?.category ?? "",
          }))
        : [],
    [categoryOptions],
  );

  const warehouseFilterOptions = useMemo(
    () =>
      Array.isArray(warehouseOptions)
        ? warehouseOptions.map((item) => ({
            label: item?.warehouse_name || item?.name || "Warehouse",
            value: item?.id ?? item?.warehouse_id ?? item?.warehouse ?? "",
          }))
        : [],
    [warehouseOptions],
  );

  const modalWarehouseOptions = useMemo(
    () =>
      Array.isArray(warehouseOptions)
        ? warehouseOptions.map((item) => ({
            id: item?.id ?? item?.warehouse_id ?? item?.warehouse,
            value: item?.id ?? item?.warehouse_id ?? item?.warehouse,
            name: item?.warehouse_name || item?.name || "Warehouse",
            label: item?.warehouse_name || item?.name || "Warehouse",
          }))
        : [],
    [warehouseOptions],
  );

  const modalProductOptions = useMemo(
    () =>
      Array.isArray(productOptions)
        ? productOptions.map((item) => ({
            id: item?.id ?? item?.product_id,
            value: item?.id ?? item?.product_id,
            name: item?.product_name || item?.name || "Product",
            label: item?.product_name || item?.name || "Product",
          }))
        : [],
    [productOptions],
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={{ padding: 20 }}>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <ReusableHeader title="Inventory" breadcrumbs={["Inventory"]}>
        <HeaderButton $variant="excel" onClick={handleExportExcel}>
          <FiDownload />
          EXPORT EXCEL
        </HeaderButton>

        <HeaderButton onClick={handleAddInventory}>
          + STOCK ADJUSTMENT
        </HeaderButton>
      </ReusableHeader>

      {/* =====================================================
          FILTER
      ===================================================== */}

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        department={category}
        departments={categoryOptionsForFilter}
        onDepartment={handleCategory}
        status={status}
        statuses={[
          { label: "In Stock", value: "In Stock" },
          { label: "Low Stock", value: "Low Stock" },
          { label: "Out of Stock", value: "Out of Stock" },
        ]}
        onStatus={handleStatus}
        showSearch
        showDepartment
        showStatus
        filters={[
          {
            key: "warehouse",
            value: warehouse,
            onChange: handleWarehouse,
            placeholder: "All Warehouses",
            options: warehouseFilterOptions,
          },
        ]}
        rightButton={
          <HeaderButton $variant="orange" onClick={handleApplyFilters}>
            Apply Filters
          </HeaderButton>
        }
      />

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: 15,
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 6,
          }}
        >
          {typeof error === "string" ? error : "Failed to load inventory."}
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
          }}
        >
          Loading inventory...
        </div>
      ) : (
        <>
          {/* =================================================
              TABLE
          ================================================= */}

          <ReusableTable columns={inventoryColumns} data={tableData} />

          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 0 && (
            <ReusablePagination
              currentPage={currentPage || apiCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* =====================================================
          OPTIONAL EMPTY STATE
      ===================================================== */}

      {!loading && !error && tableData.length === 0 && (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: "#666",
          }}
        >
          No inventory records found.
        </div>
      )}

      {/* =====================================================
          STOCK ADJUSTMENT MODAL
      ===================================================== */}

      <StockAdjustmentModal
        isOpen={isInventoryModalOpen}
        onClose={handleCloseInventoryModal}
        onSubmit={handleInventorySubmit}
        warehouses={modalWarehouseOptions}
        products={modalProductOptions}
      />
    </div>
  );
};

export default InventoryList;
