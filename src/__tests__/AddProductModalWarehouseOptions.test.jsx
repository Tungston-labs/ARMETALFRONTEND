import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetWarehouses = vi.fn();

vi.mock("../services/warehouseService", () => ({
  getWarehouses: mockGetWarehouses,
}));

import AddProductModal from "../Pages/FinanceModule/PRODUCTS/ProductList/modal/AddProductModal";

describe("AddProductModal warehouse dropdown", () => {
  beforeEach(() => {
    mockGetWarehouses.mockReset();
  });

  it("loads warehouse options from the warehouse list API and shows warehouse names", async () => {
    mockGetWarehouses.mockResolvedValue({
      results: [
        { id: 12, warehouse_name: "Main Warehouse" },
        { id: 20, name: "Riyadh Branch" },
      ],
    });

    render(
      <AddProductModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        loading={false}
        warehouses={[]}
        initialData={null}
        mode="add"
      />
    );

    await waitFor(() => {
      expect(mockGetWarehouses).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Main Warehouse" })).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Riyadh Branch" })).toBeTruthy();
    });
  });
});
