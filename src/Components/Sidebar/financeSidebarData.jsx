import React from "react";
import { GoHome } from "react-icons/go";
import { RiBarChart2Line, RiExchangeLine, RiFileChartLine } from "react-icons/ri";
import { FiCodesandbox } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";

export const getFinanceSidebarData = () => {
  return [
    {
      title: "DASHBOARD",
      icon: <GoHome />,
      path: "/finance",
    },
    {
      title: "SALES",
      icon: <RiBarChart2Line />,
      children: [
        { title: "CUSTOMERS", path: "/sales/customers" },
        { title: "QUOTATIONS", path: "/sales/Quotationlist" },
        { title: "SALES ORDERS", path: "/sales/orders" },
        { title: "DELIVERY NOTES", path: "/delivery/notes" },
        { title: "INVOICES", path: "/sales/invoices" },
        { title: "PAYMENTS", path: "/sales/payments" },
        { title: "CUSTOMER LEDGER", path: "/sales/customer-ledger" },
        { title: "CREDIT NOTES", path: "/credit-notes" },
        { title: "SALES RETURNS", path: "/sales-return" },
        { title: "RECURRING BILLING", path: "/sales/recurring-billing" },
      ],
    },
    {
      title: "PURCHASES",
      icon: <RiExchangeLine />,
      children: [
        { title: "VENDORS", path: "/purchase/vendors" },
        { title: "PURCHASE ORDER", path: "/purchase/purchaseorder" },
        { title: "BILLS", path: "/purchases/bill" },
        { title: "PAYMENTS", path: "/purchases/payments" },
        { title: "DEBIT NOTES", path: "/purchases/debit-notes" },
        { title: "VENDOR LEDGER", path: "/purchases/vendor-ledger" },
      ],
    },
    {
      title: "PRODUCTS",
      icon: <FiCodesandbox />,
      children: [
        { title: "PRODUCT LIST", path: "/product/Product-List" },
        { title: "CATEGORIES", path: "/product/Categories-List" },
        { title: "INVENTORY", path: "/product/Inventory-List" },
        { title: "WAREHOUSES", path: "/product/Warehouse" },
      ],
    },
    {
      title: "ACCOUNTING",
      icon: <LuWallet />,
      children: [
        { title: "CHART OF ACCOUNTS", path: "/accounts/chartofaccounts" },
        { title: "JOURNAL ENTRIES", path: "/accounts/journal-entries" },
        { title: "GENERAL LEDGER", path: "/accounts/generalledger" },
        { title: "TRIAL BALANCE", path: "/accounts/trialbalance" },
        { title: "A/C RECEIVABLE", path: "/accounts/recievables" },
        { title: "A/C PAYABLE", path: "/accounts/payables" },
        { title: "BANKING", path: "/accounts/banking" },
        { title: "EXPENSES", path: "/accounts/expenses" },
      ],
    },
    {
      title: "REPORTS",
      icon: <RiFileChartLine />,
      children: [
        { title: "SALES REPORTS", path: "/reports/sales-report" },
        { title: "PURCHASE REPORTS", path: "/reports/purchase-report" },
        { title: "CUSTOMER REPORTS", path: "/reports/customer-report" },
        { title: "VENDOR REPORTS", path: "/reports/vendor-report" },
        { title: "PAYMENT REPORTS", path: "/reports/payment-report" },
        { title: "INVENTORY REPORTS", path: "/reports/inventory-report" },
        { title: "EXPENSE REPORTS", path: "/reports/expense-report" },
        { title: "TAX REPORTS", path: "/reports/tax-report" },
        { title: "PROFIT & LOSS", path: "/reports/profit-loss" },
        { title: "BALANCE SHEET", path: "/reports/balance-sheet" },
        { title: "CASH FLOW", path: "/reports/cash-flow" },
        { title: "CHANGES IN EQUITY", path: "/reports/changes-in-equity" },
      ],
    },
  ];
};

export default getFinanceSidebarData;
