import API from "./api";

const inventoryService = {
  getInventory: async ({
    page = 1,
    search = "",
    category = "",
    warehouse = "",
    stock_status = "",
  } = {}) => {
    const params = {
      page,
    };

    if (search?.trim()) {
      params.search = search.trim();
    }

    if (category) {
      params.category = category;
    }

    if (warehouse) {
      params.warehouse = warehouse;
    }

    if (stock_status) {
      params.stock_status = stock_status;
    }

    const response = await API.get(
      "/finance/inventory/",
      { params },
    );

    return response.data;
  },

  getInventoryKPI: async () => {
    const response = await API.get(
      "/finance/inventory/kpi/",
    );

    return response.data;
  },

  listAdjustments: async ({
    page = 1,
    page_size = 20,
    search = "",
  } = {}) => {
    const params = { page, page_size };

    if (search?.trim()) {
      params.search = search.trim();
    }

    const response = await API.get(
      "/finance/inventory/adjustments/",
      { params },
    );

    return response.data;
  },

  createAdjustment: async (payload = {}) => {
    const response = await API.post(
      "/finance/inventory/adjustments/",
      payload,
    );

    return response.data;
  },

  getAdjustmentById: async (id) => {
    const response = await API.get(
      `/finance/inventory/adjustments/${encodeURIComponent(id)}/`,
    );

    return response.data;
  },

  updateAdjustment: async (id, payload = {}) => {
    const response = await API.put(
      `/finance/inventory/adjustments/${encodeURIComponent(id)}/`,
      payload,
    );

    return response.data;
  },

  patchAdjustment: async (id, payload = {}) => {
    const response = await API.patch(
      `/finance/inventory/adjustments/${encodeURIComponent(id)}/`,
      payload,
    );

    return response.data;
  },

  deleteAdjustment: async (id) => {
    const response = await API.delete(
      `/finance/inventory/adjustments/${encodeURIComponent(id)}/`,
    );

    return response.data;
  },
};

export default inventoryService;