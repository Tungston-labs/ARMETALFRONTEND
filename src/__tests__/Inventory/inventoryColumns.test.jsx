import { describe, it, expect } from "vitest";
import { inventoryColumns } from "../../Components/ReusableTable/inventoryColumns.jsx";

describe("inventoryColumns", () => {
  it("exposes reusable table metadata for the inventory header and renderer contract", () => {
    expect(inventoryColumns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ accessor: "code", header: "Code" }),
        expect.objectContaining({ accessor: "product_name", header: "Product" }),
        expect.objectContaining({ accessor: "category_name", header: "Category" }),
        expect.objectContaining({ accessor: "warehouse_name", header: "Warehouse" }),
        expect.objectContaining({ accessor: "available_qty", header: "Available Qty" }),
        expect.objectContaining({ accessor: "reserved_qty", header: "Reserved Qty" }),
        expect.objectContaining({ accessor: "unit", header: "Unit" }),
        expect.objectContaining({ accessor: "reorder_level", header: "Reorder Level" }),
        expect.objectContaining({ accessor: "stock_status", header: "Stock Status" }),
        expect.objectContaining({ accessor: "inventory_value", header: "Inventory Value" }),
        expect.objectContaining({ accessor: "updated_at", header: "Last Updated" }),
        expect.objectContaining({ accessor: "action", header: "Action" }),
      ]),
    );
  });
});
