import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

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

    const response = await axios.get(
      `${BASE_URL}/api/finance/inventory/`,
      {
        params,
      },
    );

    return response.data;
  },
};

export default inventoryService;