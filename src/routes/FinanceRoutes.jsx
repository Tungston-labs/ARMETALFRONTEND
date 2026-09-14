import { Route } from "react-router-dom";
import CategoriesList from "../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList";
import ProductList from "../Pages/FinanceModule/PRODUCTS/ProductList/ProductList";
import CustomerList from "../Pages/FinanceModule/SALES/Customer/CustomerList";
import Overview from "../Pages/FinanceModule/SALES/Customer/Overview/Overview";
import Quotations from "../Pages/FinanceModule/SALES/Customer/Quotations/Quotations";
import Orders from "../Pages/FinanceModule/SALES/Customer/Orders/Orders";
import Payments from "../Pages/FinanceModule/SALES/Customer/Payments/Payments";
import Ledger from "../Pages/FinanceModule/SALES/Customer/Ledger/Ledger";
import CreditNotes from "../Pages/FinanceModule/SALES/Customer/CreditNotes/CreditNotes";
import CompanyLayout from "../Pages/FinanceModule/SALES/Customer/layout/CompanyLayout";
import Invoices from "../Pages/FinanceModule/SALES/Customer/Invoices/Invoices";

const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />
      <Route path="Product-List" element={<ProductList />} />

      {/* customer list (table of all customers) */}
      <Route path="sales/customers" element={<CustomerList />} />

      {/* customer detail shell — nested under the customer's own id */}
      <Route path="sales/customers/:customerId" element={<CompanyLayout />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="orders" element={<Orders />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="payments" element={<Payments />} />
        <Route path="ledger" element={<Ledger />} />
        <Route path="credit-notes" element={<CreditNotes />} />
      </Route>
    </>
  );
};

export default FinanceRoutes;