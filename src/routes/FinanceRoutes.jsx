import { Route } from "react-router-dom";

import CategoriesList from "../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList.jsx";
import Warehouse from "../Pages/FinanceModule/PRODUCTS/Warehouse/Warehouselist.jsx";
import WarehouseDetails from "../Pages/FinanceModule/PRODUCTS/Warehouse/WarehouseDetails.jsx";
import InventoryList from "../Pages/FinanceModule/PRODUCTS/Inventory/Inventorylist.jsx";
import ProductList from "../Pages/FinanceModule/PRODUCTS/ProductList/ProductList";
import QuotationsList from "../Pages/FinanceModule/Quotations/QuotationsList.jsx";

const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />
      <Route path="Product-List" element={<ProductList />}/>

      <Route path="Warehouse-List" element={<Warehouse />} />

      <Route path="warehouse/:id" element={<WarehouseDetails />} />

      <Route path="Inventory-List" element={<InventoryList />} />
      <Route path="Quotation-List" element={<QuotationsList />} />
    </>
  );
};

export default FinanceRoutes;
