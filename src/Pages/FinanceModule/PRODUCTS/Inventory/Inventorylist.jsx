import React, { useEffect, useMemo, useState } from "react";
import { FiBox, FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";
import { FiDownload } from "react-icons/fi";
import StockAdjustmentModal from "../Inventory/InventoryModal/InventoryModal.jsx";
import StatsCards from "../../../../Components/StatsCards/StatsCards"; 
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
import { inventoryColumns } from "./inventoryColumns.jsx";

const PAGE_SIZE = 20;

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
  } = useSelector((state) => state.inventory || {});

  const categoryOptions = useSelector(
    (state) => state.category?.categories || [],
  );
const kpi = useSelector(
  (state) => state.inventory?.kpi || state.inventory?.kpis || null,
);
const kpiLoading = useSelector((state) => state.inventory?.kpiLoading || false);
  /*
  |--------------------------------------------------------------------------
  | FILTER STATE
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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
  | BUILD QUERY PARAMS (single source of truth for every fetch)
  |--------------------------------------------------------------------------
  */

  const buildParams = (page) => ({
    page,
    page_size: PAGE_SIZE,
    search: debouncedSearch,
    category,
    warehouse,
    stock_status: status,
  });

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD (dropdown options + KPI)
  |--------------------------------------------------------------------------
  | Inventory list itself is loaded by the filter effect below.
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

    dispatch(fetchInventoryKPI());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | DEBOUNCE SEARCH
  |--------------------------------------------------------------------------
  | Wait 400ms after typing stops, then apply the search and go to page 1.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | AUTO FETCH INVENTORY
  |--------------------------------------------------------------------------
  | Runs on first load and whenever a filter or the page changes.
  | No "Apply Filters" button needed.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(
      fetchInventory({
        page: currentPage,
        page_size: PAGE_SIZE,
        search: debouncedSearch,
        category,
        warehouse,
        stock_status: status,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch, category, warehouse, status]);

  /*
  |--------------------------------------------------------------------------
  | FILTER HANDLERS (only set state, the effect above does the fetching)
  |--------------------------------------------------------------------------
  */

  const handleSearch = (value) => {
    setSearch(value || "");
  };

  const handleCategory = (value) => {
    setCategory(value || "");
    setCurrentPage(1);
  };

  const handleWarehouse = (value) => {
    setWarehouse(value || "");
    setCurrentPage(1);
  };

  const handleStatus = (value) => {
    setStatus(value || "");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN / CLOSE MODAL
  |--------------------------------------------------------------------------
  */

  const handleAddInventory = () => {
    setIsEditMode(false);
    setSelectedAdjustmentId(null);
    setInitialFormData(null);

    setIsInventoryModalOpen(true);
  };

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

      // The adjustment API changes actual stock, so reload list + KPI.
      await dispatch(fetchInventory(buildParams(currentPage))).unwrap();

      dispatch(fetchInventoryKPI());

      // Close only after a successful API request
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

      await dispatch(fetchInventory(buildParams(currentPage))).unwrap();

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
  | FILTER / MODAL OPTIONS
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
          unit: item?.unit || "PCS",              // fills the unit label
        }))
      : [],
  [productOptions],
);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */
const statsCards = [
  {
    title: "Total Items",
    count: kpi?.total_stock_items ?? 0,
    icon: <FiBox size={20} />,
    backgroundColor: "#EEF2FF",
    iconColor: "#4F46E5",
    onClick: () => handleStatus(""),
  },
  {
    title: "Total Stock value",
    count: kpi?.total_inventory_value ?? 0,
    icon: <FiCheckCircle size={20} />,
    backgroundColor: "#E6F6EC",
    iconColor: "#1E7A3C",
    onClick: () => handleStatus("In Stock"),
  },
  {
    title: "Low Stock",
    count: kpi?.low_stock ?? 0,
    icon: <FiAlertTriangle size={20} />,
    backgroundColor: "#FFF4E5",
    iconColor: "#B26A00",
    onClick: () => handleStatus("Low Stock"),
  },
  {
    title: "Out of Stock",
    count: kpi?.out_of_stock ?? 0,
    icon: <FiXCircle size={20} />,
    backgroundColor: "#FDE8E8",
    iconColor: "#B42318",
    onClick: () => handleStatus("Out of Stock"),
  },
  {
    title: "In Stock",
    count: kpi?.in_stock ?? 0,
    icon: <FiBox size={20} />,
    backgroundColor: "#fdf3e8",
    iconColor: "#b46318",
    onClick: () => handleStatus("Out of Stock"),
  },
];
  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader title="Inventory" breadcrumbs={["Product","Inventory"]}>
        <HeaderButton $variant="excel" onClick={handleExportExcel}>
          <FiDownload />
          EXPORT EXCEL
        </HeaderButton>

        <HeaderButton onClick={handleAddInventory}>
          + STOCK ADJUSTMENT
        </HeaderButton>
      </ReusableHeader>
<StatsCards cards={statsCards} loading={kpiLoading} />


 <ReusableFilter
  search={search}
  onSearch={handleSearch}
  searchPlaceholder="Search Product"
  status={status}
  statuses={[
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ]}
  onStatus={handleStatus}
  showSearch
  showStatus
  filters={[
    {
      key: "category",
      value: category,
      onChange: handleCategory,
      placeholder: "All Categories",
      options: categoryOptionsForFilter,
    },
    {
      key: "warehouse",
      value: warehouse,
      onChange: handleWarehouse,
      placeholder: "All Warehouses",
      options: warehouseFilterOptions,
    },
  ]}
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