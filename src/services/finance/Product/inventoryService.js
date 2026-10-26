import API from "../../api";

/*
|--------------------------------------------------------------------------
| ERROR MESSAGE HELPER
|--------------------------------------------------------------------------
*/

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || "Something went wrong";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.message) {
    return data.message;
  }

  if (data.error) {
    return data.error;
  }

  // Django REST Framework field errors
  if (typeof data === "object") {
    const messages = [];

    Object.entries(data).forEach(([field, value]) => {
      if (Array.isArray(value)) {
        value.forEach((message) => {
          if (typeof message === "string") {
            messages.push(`${field}: ${message}`);
          }
        });
      } else if (typeof value === "string") {
        messages.push(`${field}: ${value}`);
      }
    });

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  return "Something went wrong";
};

/*
|--------------------------------------------------------------------------
| NORMALIZE WAREHOUSE ID
|--------------------------------------------------------------------------
| Warehouse value can be:
|   12
|   "12"
|   { id: 12 }
|   { value: 12 }
|   { warehouse_id: 12 }
|--------------------------------------------------------------------------
*/

const toPkValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed === "") {
      return "";
    }

    if (/^-?\d+$/.test(trimmed)) {
      return Number(trimmed);
    }

    return trimmed;
  }

  if (typeof value === "object") {
    return toPkValue(
      value.warehouse_id ??
      value.product_id ??
      value.warehouseId ??
      value.productId ??
      value.id ??
      value.value ??
      value.pk ??
      "",
    );
  }

  return value;
};

const normalizeWarehouseId = (value) => {
  if (Array.isArray(value)) {
    return normalizeWarehouseId(value[0]);
  }

  if (value && typeof value === "object") {
    return toPkValue(
      value.warehouse_id ??
      value.warehouseId ??
      value.id ??
      value.value ??
      value.pk ??
      "",
    );
  }

  return toPkValue(value);
};

/*
|--------------------------------------------------------------------------
| NORMALIZE PRODUCT ID
|--------------------------------------------------------------------------
| IMPORTANT:
|
| Inventory API returns:
|
| {
|   id: 15,          <-- inventory record ID
|   product: 8,      <-- actual product ID
|   warehouse: 12
| }
|
| Adjustment API expects:
|
| {
|   "product": 8
| }
|
| Therefore product MUST prefer:
| product_id -> productId -> product -> pk -> id
|--------------------------------------------------------------------------
*/

const normalizeProductId = (value) => {
  if (Array.isArray(value)) {
    return normalizeProductId(value[0]);
  }

  if (value && typeof value === "object") {
    return toPkValue(
      value.product_id ??
      value.productId ??
      value.product ??
      value.pk ??
      value.id ??
      value.value ??
      "",
    );
  }

  return toPkValue(value);
};

/*
|--------------------------------------------------------------------------
| NORMALIZE SIMPLE VALUE
|--------------------------------------------------------------------------
*/

const normalizeValue = (value) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  if (value && typeof value === "object") {
    return value.value ?? value.id ?? value.pk ?? "";
  }

  return value ?? "";
};

/*
|--------------------------------------------------------------------------
| BUILD STOCK ADJUSTMENT PAYLOAD
|--------------------------------------------------------------------------
*/

const buildAdjustmentPayload = (payload = {}) => {
  const productValue =
    payload.product ??
    payload.product_id ??
    payload.productId ??
    "";

  const warehouseValue =
    payload.warehouse ??
    payload.warehouse_id ??
    payload.warehouseId ??
    "";

  const mappedPayload = {
    adjustment_number:
      payload.adjustmentNumber ??
      payload.adjustment_number ??
      "",

    adjustment_date:
      payload.adjustmentDate ??
      payload.adjustment_date ??
      "",

    warehouse: normalizeWarehouseId(warehouseValue),

    product: normalizeProductId(productValue),

    adjustment_type:
      payload.adjustmentType ??
      payload.adjustment_type ??
      "",

    reason:
      payload.reason ??
      "",

    current_stock:
      payload.currentStock !== undefined &&
        payload.currentStock !== null
        ? payload.currentStock
        : payload.current_stock ?? "",

    adjustment_quantity:
      payload.adjustmentQuantity !== undefined &&
        payload.adjustmentQuantity !== null
        ? payload.adjustmentQuantity
        : payload.adjustment_quantity ?? "",

    adjusted_stock:
      payload.adjustedStock !== undefined &&
        payload.adjustedStock !== null
        ? payload.adjustedStock
        : payload.adjusted_stock ?? "",
  };

  /*
  |--------------------------------------------------------------------------
  | Remove undefined/null values
  |--------------------------------------------------------------------------
  */

  Object.keys(mappedPayload).forEach((key) => {
    if (
      mappedPayload[key] === undefined ||
      mappedPayload[key] === null
    ) {
      delete mappedPayload[key];
    }
  });

  return mappedPayload;
};

/*
|--------------------------------------------------------------------------
| BUILD FORM DATA
|--------------------------------------------------------------------------
*/

const buildAdjustmentFormData = (payload = {}) => {
  const mappedPayload = buildAdjustmentPayload(payload);

  const formData = new FormData();

  Object.entries(mappedPayload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });

  if (payload.attachment instanceof File) {
    formData.append("attachment", payload.attachment);
  }

  return formData;
};

/*
|--------------------------------------------------------------------------
| INVENTORY SERVICE
|--------------------------------------------------------------------------
*/

const inventoryService = {
  /*
  |--------------------------------------------------------------------------
  | GET INVENTORY
  |--------------------------------------------------------------------------
  */

  getInventory: async ({
    page = 1,
    page_size = 20,
    search = "",
    category = "",
    warehouse = "",
    stock_status = "",
  } = {}) => {
    const params = {
      page,
      page_size,
    };

    if (search?.trim()) {
      params.search = search.trim();
    }

    if (
      category !== "" &&
      category !== null &&
      category !== undefined
    ) {
      params.category = category;
    }

    if (
      warehouse !== "" &&
      warehouse !== null &&
      warehouse !== undefined
    ) {
      params.warehouse = warehouse;
    }

    if (
      stock_status !== "" &&
      stock_status !== null &&
      stock_status !== undefined
    ) {
      params.stock_status = stock_status;
    }

    try {
      const response = await API.get(
        "/finance/inventory/",
        {
          params,
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get inventory API error:",
        error?.response?.data || error,
      );

      throw error;
    }
  },

  /*
  |--------------------------------------------------------------------------
  | GET INVENTORY KPI
  |--------------------------------------------------------------------------
  */

  getInventoryKPI: async () => {
    try {
      const response = await API.get(
        "/finance/inventory/kpi/",
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get inventory KPI API error:",
        error?.response?.data || error,
      );

      throw error;
    }
  },

  /*
  |--------------------------------------------------------------------------
  | LIST STOCK ADJUSTMENTS
  |--------------------------------------------------------------------------
  */

  listAdjustments: async ({
    page = 1,
    page_size = 20,
    search = "",
  } = {}) => {
    const params = {
      page,
      page_size,
    };

    if (search?.trim()) {
      params.search = search.trim();
    }

    try {
      const response = await API.get(
        "/finance/inventory/adjustments/",
        {
          params,
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        "List stock adjustments API error:",
        error?.response?.data || error,
      );

      throw error;
    }
  },

  /*
  |--------------------------------------------------------------------------
  | CREATE STOCK ADJUSTMENT
  |--------------------------------------------------------------------------
  */

  createAdjustment: async (payload = {}) => {
    try {
      const hasFile =
        payload?.attachment instanceof File;

      const requestData = hasFile
        ? buildAdjustmentFormData(payload)
        : buildAdjustmentPayload(payload);

      /*
      |--------------------------------------------------------------------------
      | DEBUG PAYLOAD
      |--------------------------------------------------------------------------
      */

      if (hasFile) {
        console.log(
          "Create Adjustment FormData:",
          Object.fromEntries(requestData.entries()),
        );
      } else {
        console.log(
          "Create Adjustment Payload:",
          requestData,
        );
      }

      const response = await API.post(
        "/finance/inventory/adjustments/",
        requestData,
        hasFile
          ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
          : undefined,
      );

      return response.data;
    } catch (error) {
      console.error(
        "Create stock adjustment API error:",
        error?.response?.data || error,
      );

      throw error;
    }
  },

  /*
  |--------------------------------------------------------------------------
  | GET STOCK ADJUSTMENT DETAILS
  |--------------------------------------------------------------------------
  */

  getAdjustmentById: async (id) => {
    if (!id) {
      throw new Error(
        "Stock adjustment ID is required",
      );
    }

    try {
      const response = await API.get(
        `/finance/inventory/adjustments/${encodeURIComponent(
          id,
        )}/`,
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get stock adjustment API error:",
        error?.response?.data || error,
      );

      throw error;
    }
  },

  /*
  |--------------------------------------------------------------------------
  | UPDATE STOCK ADJUSTMENT - PUT
  |--------------------------------------------------------------------------
  */

  updateAdjustment: async (id, payload = {}) => {
    if (!id) {
      throw new Error(
        "Stock adjustment ID is required",
      );
    }

    try {
      const hasFile =
        payload?.attachment instanceof File;

      const requestData = hasFile
        ? buildAdjustmentFormData(payload)
        : buildAdjustmentPayload(payload);

      const response = await API.put(
        `/finance/inventory/adjustments/${encodeURIComponent(
          id,
        )}/`,
        requestData,
        hasFile
          ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
          : undefined,
      );

      return response.data;
    } catch (error) {
      console.error(
        "Update stock adjustment API error:",
        error?.response?.data || error,
      );

      throw error;
    }
  },

  /*
  |--------------------------------------------------------------------------
  | UPDATE STOCK ADJUSTMENT - PATCH
  |--------------------------------------------------------------------------
  */

  patchAdjustment: async (id, payload = {}) => {
    if (!id) {
      throw new Error(
        "Stock adjustment ID is required",
      );
    }

    try {
      const hasFile =
        payload?.attachment instanceof File;

      const requestData = hasFile
        ? buildAdjustmentFormData(payload)
        : buildAdjustmentPayload(payload);

      const response = await API.patch(
        `/finance/inventory/adjustments/${encodeURIComponent(
          id,
        )}/`,
        requestData,
        hasFile
          ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
          : undefined,
      );

      return response.data;
    } catch (error) {
      console.error(
        "Patch stock adjustment API error:",
        error?.response?.data || error,
      );

      throw error;
    }
  },

  /*
  |--------------------------------------------------------------------------
  | DELETE STOCK ADJUSTMENT
  |--------------------------------------------------------------------------
  */

  deleteAdjustment: async (id) => {
    if (!id) {
      throw new Error(
        "Stock adjustment ID is required",
      );
    }

    try {
      const response = await API.delete(
        `/finance/inventory/adjustments/${encodeURIComponent(
          id,
        )}/`,
      );

      return response.data;
    } catch (error) {
      console.error(
        "Delete stock adjustment API error:",
        error?.response?.data || error,
      );

      throw error;
    }
  },

  /*
  |--------------------------------------------------------------------------
  | ERROR HELPER
  |--------------------------------------------------------------------------
  */

  getErrorMessage,

  /*
  |--------------------------------------------------------------------------
  | EXPORT BUILDERS FOR DEBUGGING / TESTING
  |--------------------------------------------------------------------------
  */

  buildAdjustmentPayload,
  buildAdjustmentFormData,
};

export default inventoryService;