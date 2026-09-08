import { Route } from "react-router-dom";
import CategoriesList from "../Pages/FinanceModule/Categories/CategoriesList";
import Warehouse from "../Pages/FinanceModule/Categories/Warehouse/Warehouselist.jsx";
import EmployeeDetails from "../Pages/FinanceModule/Categories/Warehouse/WarehouseDetails.jsx";

const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />
      <Route path="Warehouse-List" element={<Warehouse />} />
      <Route path="/employee/:id" element={<EmployeeDetails />} />
    </>
  );
};

export default FinanceRoutes;
