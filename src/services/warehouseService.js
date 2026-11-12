
import API from "./api";

export const getWarehouses = async ({
  search = "",
  status = "",
  warehouse_type = "",
  near_full = "",
  ordering = "",
  page = 1,
  page_size = 20,
} = {}) => {
  const response = await API.get("/finance/warehouse/", {
    params: {
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      ...(warehouse_type ? { warehouse_type } : {}),
      ...(near_full !== "" && near_full !== undefined && near_full !== null
        ? { near_full }
        : {}),
      ...(ordering ? { ordering } : {}),
      page,
      page_size,
    },
  });

  return response.data;
};

/* =========================================================
   EXPORT WAREHOUSES
========================================================= */

export const exportWarehouses = async ({
  search = "",
  status = "",
  warehouse_type = "",
  near_full = "",
  ordering = "",
  exportFormat = "csv",
} = {}) => {
  const response = await API.get("/finance/warehouse/export/", {
    params: {
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      ...(warehouse_type ? { warehouse_type } : {}),
      ...(near_full !== "" && near_full !== undefined && near_full !== null
        ? { near_full }
        : {}),
      ...(ordering ? { ordering } : {}),
      export: exportFormat,
    },
    responseType: "blob",
  });

  return response.data;
};

/* =========================================================
   CREATE WAREHOUSE
========================================================= */

export const createWarehouse = async (warehouseData) => {
  const response = await API.post(
    "/finance/warehouse/",
    warehouseData,
  );

  return response.data;
};

/* =========================================================
   GET WAREHOUSE BY ID
========================================================= */

export const getWarehouseById = async (id) => {
  if (
    id === null ||
    id === undefined ||
    id === ""
  ) {
    throw new Error("Warehouse ID is required");
  }

  const response = await API.get(
    `/finance/warehouse/${encodeURIComponent(id)}/`,
  );

  return response.data;
};

/* =========================================================
   UPDATE WAREHOUSE
========================================================= */

export const updateWarehouse = async (
  id,
  warehouseData,
) => {
  if (
    id === null ||
    id === undefined ||
    id === ""
  ) {
    throw new Error("Warehouse ID is required");
  }

  const response = await API.put(
    `/finance/warehouse/${encodeURIComponent(id)}/`,
    warehouseData,
  );

  return response.data;
};

/* =========================================================
   GET WAREHOUSE KPI
========================================================= */

export const getWarehouseKpi = async () => {
  const response = await API.get(
    "/finance/warehouse/kpi/",
  );

  return response.data;
};
/* =========================================================
   DELETE WAREHOUSE
========================================================= */

export const deleteWarehouse = async (id) => {
  if (
    id === null ||
    id === undefined ||
    id === ""
  ) {
    throw new Error("Warehouse ID is required");
  }

  const response = await API.delete(
    `/finance/warehouse/${encodeURIComponent(id)}/`,
  );

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export default {
  getWarehouses,
  exportWarehouses,
  createWarehouse,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseKpi,
};

