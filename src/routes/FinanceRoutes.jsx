import { Route } from "react-router-dom";
import CategoriesList from "../Pages/FinanceModule/Categories/CategoriesList";

const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />

     
    </>
  );
};

export default FinanceRoutes;