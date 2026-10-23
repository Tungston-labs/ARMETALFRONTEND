import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../Redux/authSlice";
import departmentReducer from "../Redux/departmentSlice";
import holidayReducer from "../Redux/holidaySlice";
import superAdminReducer from "../Redux/superAdminSlice";
import employeeReducer from "../Redux/employeeSlice";
import dailyTaskReducer from "../Redux/dailyTaskSlice";
import leaveReducer from "../Redux/leaveSlice";
import attendanceReducer from "../Redux/attendanceSlice";
import dashboardReducer from "../Redux/dashboardSlice";
import payrollReducer from "../Redux/payrollSlice";
import projectReducer from "../Redux/fieldShiftSlice";
import companyReducer from "../Redux/companySlice";
import financeReducer from "./financeSlice";
import salaryIncrementReducer from "../Redux/salaryIncrementSlice";
import warehouseReducer from "../Redux/warehouseSlice";
import quotationReducer from "./quotationSlice";
import deliveryNotesReducer from "../Redux/finance/Sales/deliveryNotesSlice";
import categoryReducer from "./finance/Product/categorySlice";
import productReducer from "./finance/Product/ProductSlice";
import customerReducer from "./finance/Sales/CustomerSlice";
import inventoryReducer from "../Redux/finance/Product/inventorySlice";
import salesOrderReducer from "../Redux/finance/Sales/Salesorderslice";
import invoiceReducer from "../Redux/finance/Sales/InvoiceSlice";
import recurringReducer from "../Redux/finance/Sales/recurringSlice";
import paymentReducer from "../Redux/finance/Sales/paymentSlice";
import creditNotesReducer from "../Redux/finance/Sales/creditNoteSlice";
import salesReturnsReducer from "./finance/Sales/Salesreturnslice";
import customerLedgerReducer from "./finance/Sales/Customerledgerslice";
import vendorReducer from "./finance/purchases/vendorsSlice";
import billReducer from "./finance/purchases/BillSlice";
import purchaseOrderReducer from "./finance/purchases/Purchaseordersslice";
import vendorDetailReducer from "./finance/purchases/Vendordetailslice";
import debitNoteReducer from "./finance/purchases/debitNoteSlice";
import purchasePaymentsReducer from "./finance/purchases/paymentSlice";

import vendorLedgerReducer from "./finance/purchases/vendorLedgerslice";
import accountingReducer from "./finance/accounts/Accountingslice";
import ledgerReducer from "./finance/accounts/Ledgerslice";
import receivableReducer from "./finance/accounts/Receivableslice";
import payableReducer from "./finance/accounts/payableSlice";
import bankingReducer from "./finance/accounts/BankingSlice";

import trialBalanceReducer from "./finance/accounts/TrialBalanceslice";
import journalEntryReducer from "./finance/accounts/Journalslice";
import expensesReducer from "./finance/accounts/Expenseslice";
import salesReportReducer from "./finance/reports/Salesreportslice";
import customerReportReducer from "./finance/reports/Customerreportslice";
import vendorReportReducer from "./finance/reports/Vendorreportslice";
import purchaseReportReducer from "./finance/reports/PurchaseReportSlice";
import paymentReportReducer from "./finance/reports/paymentReportSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    holidays: holidayReducer,
    superAdmin: superAdminReducer,
    employee: employeeReducer,
    dailyTask: dailyTaskReducer,
    leave: leaveReducer,
    attendance: attendanceReducer,
    payroll: payrollReducer,
    employees: employeeReducer,
    dashboard: dashboardReducer,
    projects: projectReducer,
    company: companyReducer,
    finance: financeReducer,
    quotation: quotationReducer,
    salaryIncrement: salaryIncrementReducer,

    category: categoryReducer,
    product: productReducer,
    customer: customerReducer,
    warehouse: warehouseReducer,
    inventory: inventoryReducer,
    salesOrder: salesOrderReducer,
    deliveryNotes: deliveryNotesReducer,
    invoice: invoiceReducer,
    customerLedger: customerLedgerReducer,
    recurring: recurringReducer,
    payments: paymentReducer,
    creditNotes: creditNotesReducer,
    salesReturns: salesReturnsReducer,
    vendor: vendorReducer,
    bill: billReducer,
    purchaseOrder: purchaseOrderReducer,
    debitNote: debitNoteReducer,
    purchasePayments: purchasePaymentsReducer,
    vendorLedger: vendorLedgerReducer,
    vendorDetail: vendorDetailReducer,
    accounting: accountingReducer,
    ledger: ledgerReducer,
    receivable: receivableReducer,
    payable: payableReducer,
    trialBalance: trialBalanceReducer,
    journalEntry: journalEntryReducer,
        expenses: expensesReducer,
    banking: bankingReducer,
    salesReport: salesReportReducer,
    customerReport: customerReportReducer,
    vendorReport: vendorReportReducer,
    purchaseReport: purchaseReportReducer,
    paymentReport: paymentReportReducer,
  },
});
