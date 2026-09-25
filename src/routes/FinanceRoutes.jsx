import { Route } from "react-router-dom";

import Warehouse from "../Pages/FinanceModule/PRODUCTS/Warehouse/Warehouselist.jsx";
import WarehouseDetails from "../Pages/FinanceModule/PRODUCTS/Warehouse/WarehouseDetails.jsx";
import InventoryList from "../Pages/FinanceModule/PRODUCTS/Inventory/Inventorylist.jsx";
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
import SalesOrder from "../Pages/FinanceModule/SALES/SalesOrders/SalesOrder";
import SalesInvoices from "../Pages/FinanceModule/SALES/Invoices/SalesInvoices";
import RecurringBilling from "../Pages/FinanceModule/SALES/Recurring Billing/RecurringBilling";
import CategoriesList from "../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList";
import AddingInvoice from "../Pages/FinanceModule/SALES/Invoices/AddingInvoice/AddingInvoice.jsx";
import AddingOrder from "../Pages/FinanceModule/SALES/SalesOrders/modal/AddingOrder.jsx";
import CustomerLedger from "../Pages/FinanceModule/SALES/Ledger/Customerledger.jsx";


const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />
      <Route path="Product-List" element={<ProductList />} />
      <Route path="Warehouse-List" element={<Warehouse />} />
      <Route path="warehouse/:id" element={<WarehouseDetails />} />
      <Route path="Inventory-List" element={<InventoryList />} />
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
      <Route path="sales/recurring-billing" element={<RecurringBilling />} />
      <Route path="sales/customer-ledger" element={<CustomerLedger />} />
       <Route path="sales/invoices/add" element={<AddingInvoice />} />
       <Route path="sales/invoices/edit/:id" element={<AddingInvoice />} />
      <Route path="sales/orders/add" element={<AddingOrder />} />
      <Route path="sales/orders/edit/:id" element={<AddingOrder />} />



    </>
  );
};

export default FinanceRoutes;
