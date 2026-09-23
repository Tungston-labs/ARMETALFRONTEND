import { Route } from "react-router-dom";

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

import CategoriesList from "../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList";
import CustomerLedger from "../Pages/FinanceModule/SALES/CustomerLedger/CustomerLedger.jsx";

import AddingInvoice from "../Pages/FinanceModule/SALES/Invoices/AddingInvoice/AddingInvoice.jsx";
import AddingOrder from "../Pages/FinanceModule/SALES/SalesOrders/modal/AddingOrder.jsx";
import SalesInvoices from "../Pages/FinanceModule/SALES/Invoices/SalesInvoices.jsx";

import DeliveryNotes from "../Pages/FinanceModule/SALES/DeliveryNotes/DeliveryNotes.jsx";
import Createdeliverynotes from "../Pages/FinanceModule/SALES/DeliveryNotes/modal/CreatedeliveryNotes.jsx";

import PaymentPage from "../Pages/FinanceModule/SALES/Payments/Payment.jsx";

const FinanceRoutes = () => {
  return (
    <>
      <Route path="Categories-List" element={<CategoriesList />} />

      <Route path="Product-List" element={<ProductList />} />

      <Route path="Warehouse-List" element={<Warehouse />} />

      <Route path="warehouse/:id" element={<WarehouseDetails />} />

      <Route path="Inventory-List" element={<InventoryList />} />

      {/* Customer list */}
      <Route path="sales/customers" element={<CustomerList />} />

      {/* Customer details */}
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

      {/* Sales Orders */}
      <Route path="sales/orders" element={<SalesOrder />} />
      <Route path="sales/invoices" element={<SalesInvoices />} />
      <Route path="sales/invoices/add" element={<AddingInvoice />} />
      <Route path="sales/invoices/edit/:id" element={<AddingInvoice />} />
      <Route path="sales/orders/add" element={<AddingOrder />} />
      <Route path="sales/orders/edit/:id" element={<AddingOrder />} />

      {/* Customer Ledger */}
      <Route path="sales/customer-ledger" element={<CustomerLedger />} />

      {/* Inventory */}
      <Route path="Inventory-List" element={<InventoryList />} />

      {/* Quotations */}
      <Route path="Quotation-List" element={<QuotationsList />} />

      {/* Delivery Notes */}
      <Route path="delivery/notes" element={<DeliveryNotes />} />
      <Route path="delivery/notes/add" element={<Createdeliverynotes />} />
      <Route path="delivery/notes/edit/:id" element={<Createdeliverynotes />} />

      {/* Main Payments Page */}
      <Route path="sales/payments" element={<PaymentPage />} />
    </>
  );
};

export default FinanceRoutes;
