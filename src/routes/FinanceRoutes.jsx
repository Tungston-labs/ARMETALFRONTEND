import { Route } from "react-router-dom";

import Warehouse from "../Pages/FinanceModule/PRODUCTS/Warehouse/Warehouselist.jsx";
import WarehouseDetails from "../Pages/FinanceModule/PRODUCTS/Warehouse/WarehouseDetails.jsx";
import InventoryList from "../Pages/FinanceModule/PRODUCTS/Inventory/Inventorylist.jsx";
import ProductList from "../Pages/FinanceModule/PRODUCTS/ProductList/ProductList";
import CategoriesList from "../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList";

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
import AddingOrder from "../Pages/FinanceModule/SALES/SalesOrders/modal/AddingOrder.jsx";

import SalesInvoices from "../Pages/FinanceModule/SALES/Invoices/SalesInvoices";
import AddingInvoice from "../Pages/FinanceModule/SALES/Invoices/AddingInvoice/AddingInvoice.jsx";

import RecurringBilling from "../Pages/FinanceModule/SALES/Recurring Billing/RecurringBilling";

import CustomerLedger from "../Pages/FinanceModule/SALES/Ledger/Customerledger.jsx";

import DeliveryNotes from "../Pages/FinanceModule/SALES/DeliveryNotes/DeliveryNotes.jsx";
import Createdeliverynotes from "../Pages/FinanceModule/SALES/DeliveryNotes/modal/CreatedeliveryNotes.jsx";

import PaymentPage from "../Pages/FinanceModule/SALES/Payments/Payment.jsx";

import SalesCreditNotes from "../Pages/FinanceModule/SALES/CreditNotes/SalesCreditNotes.jsx";
import CreateCreditNotes from "../Pages/FinanceModule/SALES/CreditNotes/modal/CreateCreditNotes.jsx";

import SalesReturn from "../Pages/FinanceModule/SALES/SalesReturn/SalesReturn.jsx";
import CreateSalesReturnAction from "../Pages/FinanceModule/SALES/SalesReturn/modal/CreateSalesReturnAction.jsx";
import SalesReturnAction from "../Pages/FinanceModule/SALES/SalesReturn/action/SalesReturnAction.jsx";

import CreditAction from "../Pages/FinanceModule/SALES/CreditNotes/action/CreditAction.jsx";

/* =========================================================
   PURCHASES - BILL
========================================================= */

import Bill from "../Pages/FinanceModule/PURCHASES/Bill/Bill.jsx";
import CreateBill from "../Pages/FinanceModule/PURCHASES/Bill/modal/CreateBill.jsx";

const FinanceRoutes = () => {
  return (
    <>
      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <Route path="Categories-List" element={<CategoriesList />} />

      <Route path="Product-List" element={<ProductList />} />

      <Route path="Warehouse-List" element={<Warehouse />} />

      <Route path="warehouse/:id" element={<WarehouseDetails />} />

      <Route path="Inventory-List" element={<InventoryList />} />

      {/* =====================================================
          PURCHASES
      ===================================================== */}

      <Route path="purchases/bill" element={<Bill />} />

      <Route path="purchases/bill/add" element={<CreateBill />} />

      <Route path="purchases/bill/edit/:id" element={<CreateBill />} />

      {/* =====================================================
          CUSTOMER
      ===================================================== */}

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

      {/* =====================================================
          SALES ORDERS
      ===================================================== */}

      <Route path="sales/orders" element={<SalesOrder />} />

      <Route path="sales/orders/add" element={<AddingOrder />} />

      <Route path="sales/orders/edit/:id" element={<AddingOrder />} />

      {/* =====================================================
          SALES INVOICES
      ===================================================== */}

      <Route path="sales/invoices" element={<SalesInvoices />} />

      <Route path="sales/invoices/add" element={<AddingInvoice />} />

      <Route path="sales/invoices/edit/:id" element={<AddingInvoice />} />

      {/* =====================================================
          RECURRING BILLING
      ===================================================== */}

      <Route path="sales/recurring-billing" element={<RecurringBilling />} />

      {/* =====================================================
          CUSTOMER LEDGER
      ===================================================== */}

      <Route path="sales/customer-ledger" element={<CustomerLedger />} />

      {/* =====================================================
          QUOTATIONS
      ===================================================== */}

      <Route path="Quotation-List" element={<QuotationsList />} />

      {/* =====================================================
          DELIVERY NOTES
      ===================================================== */}

      <Route path="delivery/notes" element={<DeliveryNotes />} />

      <Route path="delivery/notes/add" element={<Createdeliverynotes />} />

      <Route path="delivery/notes/edit/:id" element={<CreditAction />} />

      {/* =====================================================
          PAYMENTS
      ===================================================== */}

      <Route path="sales/payments" element={<PaymentPage />} />

      {/* =====================================================
          CREDIT NOTES
      ===================================================== */}

      <Route path="credit-notes" element={<SalesCreditNotes />} />

      <Route path="credit-notes/add" element={<CreateCreditNotes />} />

      <Route path="credit-notes/edit/:id" element={<CreateCreditNotes />} />

      {/* =====================================================
          SALES RETURN
      ===================================================== */}

      <Route path="sales-return" element={<SalesReturn />} />

      <Route path="sales-return/add" element={<CreateSalesReturnAction />} />

      <Route path="sales-return/edit/:id" element={<SalesReturnAction />} />
    </>
  );
};

export default FinanceRoutes;
