import { Route } from "react-router-dom";

/* =========================================================
   PRODUCTS
========================================================= */

import Warehouse from "../Pages/FinanceModule/PRODUCTS/Warehouse/Warehouselist.jsx";
import WarehouseDetails from "../Pages/FinanceModule/PRODUCTS/Warehouse/WarehouseDetails.jsx";
import InventoryList from "../Pages/FinanceModule/PRODUCTS/Inventory/Inventorylist.jsx";
import ProductList from "../Pages/FinanceModule/PRODUCTS/ProductList/ProductList";
import CategoriesList from "../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList";

/* =========================================================
   SALES - QUOTATIONS
========================================================= */

import QuotationsList from "../Pages/FinanceModule/SALES/Quotations/QuotationsList.jsx";

/* =========================================================
   SALES - CUSTOMERS
========================================================= */

import CustomerList from "../Pages/FinanceModule/SALES/Customer/CustomerList";
import Overview from "../Pages/FinanceModule/SALES/Customer/Overview/Overview";
import Quotations from "../Pages/FinanceModule/SALES/Customer/Quotations/Quotations";
import Orders from "../Pages/FinanceModule/SALES/Customer/Orders/Orders";
import Payments from "../Pages/FinanceModule/SALES/Customer/Payments/Payments";
import Ledger from "../Pages/FinanceModule/SALES/Customer/Ledger/Ledger";
import CreditNotes from "../Pages/FinanceModule/SALES/Customer/CreditNotes/CreditNotes";
import CompanyLayout from "../Pages/FinanceModule/SALES/Customer/layout/CompanyLayout";
import Invoices from "../Pages/FinanceModule/SALES/Customer/Invoices/Invoices";

/* =========================================================
   SALES - ORDERS
========================================================= */

import SalesOrder from "../Pages/FinanceModule/SALES/SalesOrders/SalesOrder";
import AddingOrder from "../Pages/FinanceModule/SALES/SalesOrders/modal/AddingOrder.jsx";

/* =========================================================
   SALES - INVOICES
========================================================= */

import SalesInvoices from "../Pages/FinanceModule/SALES/Invoices/SalesInvoices";
import AddingInvoice from "../Pages/FinanceModule/SALES/Invoices/AddingInvoice/AddingInvoice.jsx";

/* =========================================================
   SALES - RECURRING BILLING
========================================================= */

import RecurringBilling from "../Pages/FinanceModule/SALES/Recurring Billing/RecurringBilling";

/* =========================================================
   SALES - LEDGER
========================================================= */

import CustomerLedger from "../Pages/FinanceModule/SALES/Ledger/Customerledger.jsx";

/* =========================================================
   SALES - DELIVERY NOTES
========================================================= */

import DeliveryNotes from "../Pages/FinanceModule/SALES/DeliveryNotes/DeliveryNotes.jsx";
import Createdeliverynotes from "../Pages/FinanceModule/SALES/DeliveryNotes/modal/CreatedeliveryNotes.jsx";

/* =========================================================
   SALES - PAYMENTS
========================================================= */

import PaymentPage from "../Pages/FinanceModule/SALES/Payments/Payment.jsx";

/* =========================================================
   SALES - CREDIT NOTES
========================================================= */

import SalesCreditNotes from "../Pages/FinanceModule/SALES/CreditNotes/SalesCreditNotes.jsx";
import CreateCreditNotes from "../Pages/FinanceModule/SALES/CreditNotes/modal/CreateCreditNotes.jsx";
import CreditAction from "../Pages/FinanceModule/SALES/CreditNotes/action/CreditAction.jsx";

/* =========================================================
   SALES - SALES RETURN
========================================================= */

import SalesReturn from "../Pages/FinanceModule/SALES/SalesReturn/SalesReturn.jsx";
import CreateSalesReturnAction from "../Pages/FinanceModule/SALES/SalesReturn/modal/CreateSalesReturnAction.jsx";
import SalesReturnAction from "../Pages/FinanceModule/SALES/SalesReturn/action/SalesReturnAction.jsx";

/* =========================================================
   PURCHASES - PURCHASE ORDERS
========================================================= */

import PurchaseOrders from "../Pages/FinanceModule/PURCHASES/PurchaseOrders/PurchaseOrders.jsx";
import AddingPurchaseOrder from "../Pages/FinanceModule/PURCHASES/PurchaseOrders/modal/Addingpurchaseorder.jsx";

/* =========================================================
   PURCHASES - VENDORS
========================================================= */

import Vendors from "../Pages/FinanceModule/PURCHASES/Vendors/Vendors.jsx";
import VendorOverview from "../Pages/FinanceModule/PURCHASES/Vendors/Overview/VendorOverview.jsx";
import VendorPurchaseOrders from "../Pages/FinanceModule/PURCHASES/Vendors/Orders/VendorPurchaseOrders.jsx";
import VendorPayments from "../Pages/FinanceModule/PURCHASES/Vendors/Payments/VendorPayments.jsx";
import VendorLedgerTab from "../Pages/FinanceModule/PURCHASES/Vendors/Ledger/VendorLedgerTab.jsx";
import VendorLayout from "../Pages/FinanceModule/PURCHASES/Vendors/layout/Vendorlayout.jsx";
import VendorDebitNotes from "../Pages/FinanceModule/PURCHASES/Vendors/DebitNotes/Debitnotes.jsx";
import VendorBills from "../Pages/FinanceModule/PURCHASES/Vendors/Bills/VendorBills.jsx";

/* =========================================================
   PURCHASES - VENDOR LEDGER
========================================================= */

import VendorLedger from "../Pages/FinanceModule/PURCHASES/VendorLedger/VendorLedger.jsx";

/* =========================================================
   PURCHASES - BILLS
========================================================= */

import Bill from "../Pages/FinanceModule/PURCHASES/Bill/Bill.jsx";
import CreateBill from "../Pages/FinanceModule/PURCHASES/Bill/modal/CreateBill.jsx";

/* =========================================================
   PURCHASES - PAYMENTS
========================================================= */

import PurchasePaymentPage from "../Pages/FinanceModule/PURCHASES/Payments/Payment.jsx";

/* =========================================================
   PURCHASES - DEBIT NOTES
========================================================= */

import PurchaseDebitNotes from "../Pages/FinanceModule/PURCHASES/DebitNotes/DebitNotes.jsx";
import CreateDebitNote from "../Pages/FinanceModule/PURCHASES/DebitNotes/modal/CreateDebitNote.jsx";

/* =========================================================
   ACCOUNTS
========================================================= */

import ChartOfAccounts from "../Pages/FinanceModule/ACCOUNTS/Chart of Accounts/ChartOfAccounts.jsx";
import GeneralLedger from "../Pages/FinanceModule/ACCOUNTS/General Ledger/GeneralLedger.jsx";
import Expenses from "../Pages/FinanceModule/ACCOUNTS/Expenses/Expenses.jsx";
import Payables from "../Pages/FinanceModule/ACCOUNTS/Payables/Payables.jsx";
import Recievables from "../Pages/FinanceModule/ACCOUNTS/Recievables/Recievables.jsx";
import SalesReports from "../Pages/FinanceModule/REPORTS/Sales-Reports/SalesReports.jsx";

/* =========================================================
   ACCOUNTS - JOURNAL ENTRIES
========================================================= */

import JournalEntries from "../Pages/FinanceModule/ACCOUNTS/JournalEntries/JournalEntries.jsx";
import NewJournalentry from "../Pages/FinanceModule/ACCOUNTS/JournalEntries/modal/NewJournalentry.jsx";

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
          PURCHASES - BILLS
      ===================================================== */}

      <Route path="purchases/bill" element={<Bill />} />

      <Route path="purchases/bill/add" element={<CreateBill />} />

      <Route path="purchases/bill/edit/:id" element={<CreateBill />} />

      {/* =====================================================
          PURCHASES - PAYMENTS
      ===================================================== */}

      <Route path="purchases/payments" element={<PurchasePaymentPage />} />

      {/* =====================================================
          PURCHASES - DEBIT NOTES
      ===================================================== */}

      <Route path="purchases/debit-notes" element={<PurchaseDebitNotes />} />

      <Route path="purchases/debit-notes/add" element={<CreateDebitNote />} />

      <Route
        path="purchases/debit-notes/edit/:id"
        element={<CreateDebitNote />}
      />

      {/* =====================================================
          SALES - CUSTOMERS
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
          SALES - ORDERS
      ===================================================== */}

      <Route path="sales/orders" element={<SalesOrder />} />

      <Route path="sales/orders/add" element={<AddingOrder />} />

      <Route path="sales/orders/edit/:id" element={<AddingOrder />} />

      {/* =====================================================
          SALES - INVOICES
      ===================================================== */}

      <Route path="sales/invoices" element={<SalesInvoices />} />

      <Route path="sales/invoices/add" element={<AddingInvoice />} />

      <Route path="sales/invoices/edit/:id" element={<AddingInvoice />} />

      {/* =====================================================
          SALES - RECURRING BILLING
      ===================================================== */}

      <Route path="sales/recurring-billing" element={<RecurringBilling />} />

      {/* =====================================================
          SALES - CUSTOMER LEDGER
      ===================================================== */}

      <Route path="sales/customer-ledger" element={<CustomerLedger />} />

      {/* =====================================================
          SALES - QUOTATIONS
      ===================================================== */}

      <Route path="Quotation-List" element={<QuotationsList />} />

      {/* =====================================================
          SALES - DELIVERY NOTES
      ===================================================== */}

      <Route path="delivery/notes" element={<DeliveryNotes />} />

      <Route path="delivery/notes/add" element={<Createdeliverynotes />} />

      <Route path="delivery/notes/edit/:id" element={<Createdeliverynotes />} />

      {/* =====================================================
          SALES - PAYMENTS
      ===================================================== */}

      <Route path="sales/payments" element={<PaymentPage />} />

      {/* =====================================================
          SALES - CREDIT NOTES
      ===================================================== */}

      <Route path="credit-notes" element={<SalesCreditNotes />} />

      <Route path="credit-notes/add" element={<CreateCreditNotes />} />

      <Route path="credit-notes/edit/:id" element={<CreateCreditNotes />} />

      {/* =====================================================
          SALES - CREDIT NOTE ACTION
      ===================================================== */}

      <Route path="credit-notes/action/:id" element={<CreditAction />} />

      {/* =====================================================
          SALES - SALES RETURN
      ===================================================== */}

      <Route path="sales-return" element={<SalesReturn />} />

      <Route path="sales-return/add" element={<CreateSalesReturnAction />} />

      <Route path="sales-return/edit/:id" element={<SalesReturnAction />} />

      {/* =====================================================
          PURCHASES - VENDORS
      ===================================================== */}

      <Route path="purchase/vendors" element={<Vendors />} />

      {/* =====================================================
          PURCHASES - PURCHASE ORDERS
      ===================================================== */}

      <Route path="purchase/purchaseorder" element={<PurchaseOrders />} />

      <Route
        path="purchases/purchase-orders/add"
        element={<AddingPurchaseOrder />}
      />

      <Route
        path="purchases/purchase-orders/edit/:id"
        element={<AddingPurchaseOrder />}
      />

      {/* =====================================================
          PURCHASES - VENDOR LEDGER
      ===================================================== */}

      <Route path="purchases/vendor-ledger" element={<VendorLedger />} />

      {/* =====================================================
          PURCHASES - VENDOR DETAILS
      ===================================================== */}

      <Route path="purchase/vendors/:vendorId" element={<VendorLayout />}>
        <Route index element={<VendorOverview />} />

        <Route path="overview" element={<VendorOverview />} />

        <Route path="purchase-orders" element={<VendorPurchaseOrders />} />

        <Route path="bills" element={<VendorBills />} />

        <Route path="payments" element={<VendorPayments />} />

        <Route path="ledger" element={<VendorLedgerTab />} />

        <Route path="debit-notes" element={<VendorDebitNotes />} />
      </Route>

      {/* =====================================================
          ACCOUNTS - CHART OF ACCOUNTS
      ===================================================== */}

      <Route path="accounts/chartofaccounts" element={<ChartOfAccounts />} />

      {/* =====================================================
          ACCOUNTS - JOURNAL ENTRIES
      ===================================================== */}

      <Route path="accounts/journal-entries" element={<JournalEntries />} />

      <Route
        path="accounts/journal-entries/add"
        element={<NewJournalentry />}
      />

      <Route
        path="accounts/journal-entries/edit/:id"
        element={<NewJournalentry />}
      />
      <Route path="accounts/generalledger" element={<GeneralLedger />} />
      <Route path="accounts/expenses" element={<Expenses />} />
      <Route path="accounts/payables" element={<Payables />} />
      <Route path="accounts/recievables" element={<Recievables />} />

      {/* Report Section */}
      <Route path="reports/sales-report" element={<SalesReports />} />
    </>
  );
};

export default FinanceRoutes;
