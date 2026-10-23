// import API from "./api";

// /* =========================================================
//    GET WAREHOUSES
// ========================================================= */

// export const getWarehouses = async ({
//   search = "",
//   ordering = "",
//   page = 1,
//   page_size = 20,
// } = {}) => {
//   const response = await API.get("/finance/warehouse/", {
//     params: {
//       ...(search ? { search } : {}),
//       ...(ordering ? { ordering } : {}),
//       page,
//       page_size,
//     },
//   });

//   return response.data;
// };

// /* =========================================================
//    CREATE WAREHOUSE
// ========================================================= */

// export const createWarehouse = async (warehouseData) => {
//   const response = await API.post(
//     "/finance/warehouse/",
//     warehouseData,
//   );

//   return response.data;
// };

// /* =========================================================
//    GET WAREHOUSE BY ID
// ========================================================= */

// export const getWarehouseById = async (id) => {
//   if (!id) {
//     throw new Error("Warehouse ID is required");
//   }

//   const response = await API.get(
//     `/finance/warehouse/${encodeURIComponent(id)}/`,
//   );

//   return response.data;
// };

// /* =========================================================
//    GET WAREHOUSE KPI
// ========================================================= */

// export const getWarehouseKpi = async () => {
//   const response = await API.get(
//     "/finance/warehouse/kpi/",
//   );

//   return response.data;
// };

// /* =========================================================
//    EXPORT
// ========================================================= */

// export default {
//   getWarehouses,
//   createWarehouse,
//   getWarehouseById,
//   getWarehouseKpi,
// };


import API from "./api";

/* =========================================================
   GET WAREHOUSES
========================================================= */

export const getWarehouses = async ({
  search = "",
  ordering = "",
  page = 1,
  page_size = 20,
} = {}) => {
  const response = await API.get("/finance/warehouse/", {
    params: {
      ...(search ? { search } : {}),
      ...(ordering ? { ordering } : {}),
      page,
      page_size,
    },
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
   EXPORT
========================================================= */

export default {
  getWarehouses,
  createWarehouse,
  getWarehouseById,
  updateWarehouse,
  getWarehouseKpi,
};

