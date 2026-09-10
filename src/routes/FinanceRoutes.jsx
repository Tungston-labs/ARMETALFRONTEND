import { Route } from "react-router-dom";
import CategoriesList from "../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList";
import ProductList from "../Pages/FinanceModule/PRODUCTS/ProductList/ProductList";

const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />
      <Route path="Product-List" element={<ProductList />}/>

     
    </>
  );
};

export default FinanceRoutes;