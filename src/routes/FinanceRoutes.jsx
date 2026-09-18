import { Route } from "react-router-dom";

import CategoriesList from "../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList.jsx";
import Warehouse from "../Pages/FinanceModule/PRODUCTS/Warehouse/Warehouselist.jsx";
import WarehouseDetails from "../Pages/FinanceModule/PRODUCTS/Warehouse/WarehouseDetails.jsx";
import InventoryList from "../Pages/FinanceModule/PRODUCTS/Inventory/Inventorylist.jsx";
import ProductList from "../Pages/FinanceModule/PRODUCTS/ProductList/ProductList";
import QuotationsList from "../Pages/FinanceModule/SALES/Quotations/QuotationsList.jsx";
import CustomerList from "../Pages/FinanceModule/SALES/Customer/CustomerList";
import Overview from "../Pages/FinanceModule/SALES/Customer/Overview/Overview";
import Quotations from "../Pages/FinanceModule/SALES/Customer/Quotations/Quotations";
import Orders from "../Pages/FinanceModule/SALES/Customer/Orders/Orders";
import Payments from "../Pages/FinanceModule/SALES/Customer/Payments/Payments";
import Ledger from "../Pages/FinanceModule/SALES/Customer/Ledger/Ledger";
import CreditNotes from "../Pages/FinanceModule/SALES/Customer/CreditNotes/CreditNotes";
import CompanyLayout from "../Pages/FinanceModule/SALES/Customer/layout/CompanyLayout";
import Invoices from "../Pages/FinanceModule/SALES/Customer/Invoices/Invoices";
import SalesOrder from "../Pages/FinanceModule/SALES/SalesOrders/SalesOrder";
import SalesInvoices from "../Pages/FinanceModule/SALES/Invoices/SalesInvoices";
import AddingInvoice from '../Pages/FinanceModule/SALES/Invoices/AddingInvoice/AddingInvoice'


const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />
      <Route path="Product-List" element={<ProductList />} />

      {/* customer list (table of all customers) */}
      <Route path="sales/customers" element={<CustomerList />} />


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

            <Route path="sales/orders" element={<SalesOrder />} />
            <Route path="sales/invoices" element={<SalesInvoices />} />
             <Route path="sales/invoices/adding" element={<AddingInvoice />} />
      <Route path="Warehouse-List" element={<Warehouse />} />

      <Route path="warehouse/:id" element={<WarehouseDetails />} />

      <Route path="Inventory-List" element={<InventoryList />} />
      <Route path="Quotation-List" element={<QuotationsList />} />
    </>
  );
};

export default FinanceRoutes;
