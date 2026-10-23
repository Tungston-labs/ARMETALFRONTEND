import { beforeEach, describe, expect, it, vi } from "vitest";

const apiGet = vi.fn();
const apiPost = vi.fn();

vi.mock("../services/api", () => ({
  default: {
    get: apiGet,
    post: apiPost,
  },
}));

describe("warehouseService", () => {
  beforeEach(() => {
    apiGet.mockReset();
    apiPost.mockReset();
  });

  it("uses the shared API client for warehouse list and create endpoints", async () => {
    apiGet.mockResolvedValue({ data: { results: [] } });
    apiPost.mockResolvedValue({ data: { id: 1 } });

    const { getWarehouses, createWarehouse } = await import("../services/warehouseService");

    await getWarehouses({ search: "Riyadh", ordering: "-name", page: 1, page_size: 20 });
    await createWarehouse({ warehouse_name: "Riyadh Central Warehouse" });

    expect(apiGet).toHaveBeenCalledWith("/finance/warehouse/", {
      params: {
        search: "Riyadh",
        ordering: "-name",
        page: 1,
        page_size: 20,
      },
    });

    expect(apiPost).toHaveBeenCalledWith("/finance/warehouse/", {
      warehouse_name: "Riyadh Central Warehouse",
    });
  });

  it("uses the shared API client for the warehouse KPI endpoint", async () => {
    apiGet.mockResolvedValue({ data: { total_warehouses: 5, active_warehouses: 4, inactive_warehouses: 1 } });

    const { getWarehouseKpi } = await import("../services/warehouseService");

    await getWarehouseKpi();

    expect(apiGet).toHaveBeenCalledWith("/finance/warehouse/kpi/");
  });
});
