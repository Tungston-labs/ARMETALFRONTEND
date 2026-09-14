import { Route } from "react-router-dom";

import CategoriesList from "../Pages/FinanceModule/Categories/CategoriesList";
import Warehouse from "../Pages/FinanceModule/Categories/Warehouse/Warehouselist.jsx";
import WarehouseDetails from "../Pages/FinanceModule/Categories/Warehouse/WarehouseDetails.jsx";
import InventoryList from "../Pages/FinanceModule/Inventory/Inventorylist.jsx";
import CategorieList from "../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList";
import ProductList from "../Pages/FinanceModule/PRODUCTS/ProductList/ProductList";

const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />
      <Route path="Product-List" element={<ProductList />}/>

      <Route path="Warehouse-List" element={<Warehouse />} />

      <Route path="warehouse/:id" element={<WarehouseDetails />} />

      <Route path="Inventory-List" element={<InventoryList />} />
    </>
  );
};

export default FinanceRoutes;
