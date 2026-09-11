import { Route } from "react-router-dom";

import CategoriesList from "../Pages/FinanceModule/Categories/CategoriesList";
import Warehouse from "../Pages/FinanceModule/Categories/Warehouse/Warehouselist.jsx";
import WarehouseDetails from "../Pages/FinanceModule/Categories/Warehouse/WarehouseDetails.jsx";
import InventoryList from "../Pages/FinanceModule/Categories/Inventory/Inventorylist.jsx";

const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />

      <Route path="Warehouse-List" element={<Warehouse />} />

      <Route path="warehouse/:id" element={<WarehouseDetails />} />

      <Route path="Inventory-List" element={<InventoryList />} />
    </>
  );
};

export default FinanceRoutes;
