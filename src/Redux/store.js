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
import inventoryReducer from "../Redux/inventorySlice";
import salesOrderReducer from "../Redux/finance/Sales/Salesorderslice";
import invoiceReducer from "../Redux/finance/Sales/InvoiceSlice";

import recurringReducer from "../Redux/finance/Sales/recurringSlice";

import paymentReducer from "../Redux/finance/Sales/paymentSlice";
import creditNotesReducer from "../Redux/finance/Sales/creditNoteSlice";
import salesReturnsReducer from "./finance/Sales/Salesreturnslice";


import customerLedgerReducer from "./finance/Sales/Customerledgerslice"
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

  },
});
