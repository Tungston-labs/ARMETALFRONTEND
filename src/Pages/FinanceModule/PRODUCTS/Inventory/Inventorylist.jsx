import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";

import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";

import { FiDownload } from "react-icons/fi";

import StockAdjustmentModal from "../Inventory/InventoryModal/InventoryModal.jsx";

import {
  fetchInventory,
  fetchInventoryKPI,
  createInventoryAdjustment,
  updateInventoryAdjustment,
  fetchInventoryAdjustmentById,
  deleteInventoryAdjustment,
} from "../../../../Redux/finance/Product/inventorySlice";

import { getCategories } from "../../../../Redux/finance/Product/categorySlice.js";

import { getWarehouses } from "../../../../services/warehouseService";

import { fetchProducts } from "../../../../services/finance/Product/productServices";

import { inventoryColumns } from "../../../../Components/ReusableTable/inventoryColumns.jsx";

const InventoryList = () => {
  const dispatch = useDispatch();

  /*
  |--------------------------------------------------------------------------
  | REDUX STATE
  |--------------------------------------------------------------------------
  */

  const {
    inventory = [],
    totalPages = 0,
    currentPage: apiCurrentPage = 1,
    loading = false,
    adjustmentLoading = false,
    error = null,
    adjustmentError = null,
    selectedAdjustment = null,
  } = useSelector((state) => state.inventory || {});

  const categoryOptions = useSelector(
    (state) => state.category?.categories || [],
  );

  /*
  |--------------------------------------------------------------------------
  | FILTER STATE
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [status, setStatus] = useState("");

  const [warehouseOptions, setWarehouseOptions] = useState([]);

  const [productOptions, setProductOptions] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const [currentPage, setCurrentPage] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | MODAL
  |--------------------------------------------------------------------------
  */

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState(null);

  const [initialFormData, setInitialFormData] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH INVENTORY
  |--------------------------------------------------------------------------
  */

  const loadInventory = useCallback(
    (page = 1) => {
      dispatch(
        fetchInventory({
          page,
          page_size: 20,
          search: search.trim(),
          category,
          warehouse,
          stock_status: status,
        }),
      );
    },
    [dispatch, search, category, warehouse, status],
  );

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(
      getCategories({
        page: 1,
        page_size: 100,
      }),
    );

    getWarehouses({
      page: 1,
      page_size: 100,
    })
      .then((response) => {
        const rows = Array.isArray(response)
          ? response
          : response?.results ||
            response?.data?.results ||
            response?.data ||
            [];

        setWarehouseOptions(Array.isArray(rows) ? rows : []);
      })
      .catch((warehouseError) => {
        console.error(
          "Failed to load inventory warehouse options:",
          warehouseError,
        );

        setWarehouseOptions([]);
      });

    fetchProducts({
      page: 1,
      page_size: 100,
    })
      .then((response) => {
        const rows = Array.isArray(response)
          ? response
          : response?.results ||
            response?.data?.results ||
            response?.data ||
            [];

        setProductOptions(Array.isArray(rows) ? rows : []);
      })
      .catch((productError) => {
        console.error(
          "Failed to load inventory product options:",
          productError,
        );

        setProductOptions([]);
      });

    dispatch(
      fetchInventory({
        page: 1,
        page_size: 20,
        search: "",
        category: "",
        warehouse: "",
        stock_status: "",
      }),
    );

    dispatch(fetchInventoryKPI());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | APPLY FILTERS
  |--------------------------------------------------------------------------
  */

  const handleApplyFilters = () => {
    setCurrentPage(1);

    dispatch(
      fetchInventory({
        page: 1,
        page_size: 20,
        search: search.trim(),
        category,
        warehouse,
        stock_status: status,
      }),
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearch = (value) => {
    setSearch(value || "");
    setCurrentPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | CATEGORY
  |--------------------------------------------------------------------------
  */

  const handleCategory = (value) => {
    setCategory(value || "");
    setCurrentPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | WAREHOUSE
  |--------------------------------------------------------------------------
  */

  const handleWarehouse = (value) => {
    setWarehouse(value || "");
    setCurrentPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  const handleStatus = (value) => {
    setStatus(value || "");
    setCurrentPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const handlePageChange = (page) => {
    setCurrentPage(page);

    loadInventory(page);
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN CREATE MODAL
  |--------------------------------------------------------------------------
  */

  const handleAddInventory = () => {
    setIsEditMode(false);
    setSelectedAdjustmentId(null);
    setInitialFormData(null);

    setIsInventoryModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE MODAL
  |--------------------------------------------------------------------------
  */

  const handleCloseInventoryModal = () => {
    if (adjustmentLoading) {
      return;
    }

    setIsInventoryModalOpen(false);
    setIsEditMode(false);
    setSelectedAdjustmentId(null);
    setInitialFormData(null);
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE / UPDATE STOCK ADJUSTMENT
  |--------------------------------------------------------------------------
  */

  const handleInventorySubmit = async (formData) => {
    try {
      if (isEditMode && selectedAdjustmentId) {
        await dispatch(
          updateInventoryAdjustment({
            id: selectedAdjustmentId,
            payload: formData,
            partial: false,
          }),
        ).unwrap();
      } else {
        await dispatch(createInventoryAdjustment(formData)).unwrap();
      }

      /*
      |--------------------------------------------------------------------------
      | IMPORTANT
      |--------------------------------------------------------------------------
      | The adjustment API changes the actual inventory.
      | Therefore reload the inventory list after success.
      |--------------------------------------------------------------------------
      */

      await dispatch(
        fetchInventory({
          page: currentPage,
          page_size: 20,
          search: search.trim(),
          category,
          warehouse,
          stock_status: status,
        }),
      ).unwrap();

      /*
      |--------------------------------------------------------------------------
      | Refresh KPI
      |--------------------------------------------------------------------------
      */

      dispatch(fetchInventoryKPI());

      /*
      |--------------------------------------------------------------------------
      | Close only after successful API request
      |--------------------------------------------------------------------------
      */

      setIsInventoryModalOpen(false);
      setIsEditMode(false);
      setSelectedAdjustmentId(null);
      setInitialFormData(null);
    } catch (submitError) {
      console.error("Stock adjustment submit failed:", submitError);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT ADJUSTMENT
  |--------------------------------------------------------------------------
  */

  const handleEditAdjustment = async (row) => {
    const adjustmentId =
      row?.adjustment_id ??
      row?.stock_adjustment_id ??
      row?.latest_adjustment_id;

    if (!adjustmentId) {
      console.warn("No stock adjustment ID found for this inventory row.");

      return;
    }

    try {
      const response = await dispatch(
        fetchInventoryAdjustmentById(adjustmentId),
      ).unwrap();

      const adjustment = response?.data || response || {};

      const warehouseId =
        adjustment?.warehouse ?? adjustment?.warehouse_id ?? "";

      const productId = adjustment?.product ?? adjustment?.product_id ?? "";

      setInitialFormData({
        id: adjustment?.id,

        adjustmentNumber:
          adjustment?.adjustment_number ?? adjustment?.adjustmentNumber ?? "",

        adjustmentDate:
          adjustment?.adjustment_date ?? adjustment?.adjustmentDate ?? "",

        warehouse: warehouseId,

        product: productId,

        adjustmentType:
          adjustment?.adjustment_type ??
          adjustment?.adjustmentType ??
          "Reduce Stock",

        reason: adjustment?.reason ?? "Damaged Goods",

        currentStock:
          adjustment?.current_stock ?? adjustment?.currentStock ?? "",

        adjustmentQuantity:
          adjustment?.adjustment_quantity ??
          adjustment?.adjustmentQuantity ??
          "",

        adjustedStock:
          adjustment?.adjusted_stock ?? adjustment?.adjustedStock ?? "",

        attachment: null,

        attachmentName:
          adjustment?.attachment_name ??
          adjustment?.attachmentName ??
          adjustment?.attachment?.split("/")?.pop() ??
          "",
      });

      setSelectedAdjustmentId(adjustmentId);

      setIsEditMode(true);
      setIsInventoryModalOpen(true);
    } catch (editError) {
      console.error("Failed to load stock adjustment:", editError);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE ADJUSTMENT
  |--------------------------------------------------------------------------
  */

  const handleDeleteAdjustment = async (row) => {
    const adjustmentId =
      row?.adjustment_id ??
      row?.stock_adjustment_id ??
      row?.latest_adjustment_id;

    if (!adjustmentId) {
      console.warn("No stock adjustment ID found for this inventory row.");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this stock adjustment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteInventoryAdjustment(adjustmentId)).unwrap();

      /*
      |--------------------------------------------------------------------------
      | Refresh inventory after deletion
      |--------------------------------------------------------------------------
      */

      await dispatch(
        fetchInventory({
          page: currentPage,
          page_size: 20,
          search: search.trim(),
          category,
          warehouse,
          stock_status: status,
        }),
      ).unwrap();

      dispatch(fetchInventoryKPI());
    } catch (deleteError) {
      console.error("Delete stock adjustment failed:", deleteError);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExportExcel = () => {
    console.log("Export inventory to Excel");
  };

  /*
  |--------------------------------------------------------------------------
  | SAFE TABLE DATA
  |--------------------------------------------------------------------------
  */

  const tableData = Array.isArray(inventory) ? inventory : [];

  /*
  |--------------------------------------------------------------------------
  | CATEGORY FILTER OPTIONS
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | WAREHOUSE FILTER OPTIONS
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | MODAL WAREHOUSE OPTIONS
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | MODAL PRODUCT OPTIONS
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader title="Inventory" breadcrumbs={["Inventory"]}>
        <HeaderButton $variant="excel" onClick={handleExportExcel}>
          <FiDownload />
          EXPORT EXCEL
        </HeaderButton>

        <HeaderButton onClick={handleAddInventory}>
          + STOCK ADJUSTMENT
        </HeaderButton>
      </ReusableHeader>

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        department={category}
        departments={categoryOptionsForFilter}
        onDepartment={handleCategory}
        status={status}
        statuses={[
          {
            label: "In Stock",
            value: "In Stock",
          },
          {
            label: "Low Stock",
            value: "Low Stock",
          },
          {
            label: "Out of Stock",
            value: "Out of Stock",
          },
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

      {adjustmentError && (
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
          {typeof adjustmentError === "string"
            ? adjustmentError
            : "Stock adjustment operation failed."}
        </div>
      )}

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
          <ReusableTable columns={inventoryColumns} data={tableData} />

          {totalPages > 0 && (
            <ReusablePagination
              currentPage={currentPage || apiCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

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

      <StockAdjustmentModal
        isOpen={isInventoryModalOpen}
        onClose={handleCloseInventoryModal}
        onSubmit={handleInventorySubmit}
        initialData={initialFormData}
        isEdit={isEditMode}
        submitting={adjustmentLoading}
        warehouses={modalWarehouseOptions}
        products={modalProductOptions}
      />
    </div>
  );
};

export default InventoryList;
