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
import categoryReducer from "./finance/Product/categorySlice";
import productReducer from "./finance/Product/ProductSlice";
import customerReducer from "./finance/Sales/CustomerSlice";
import inventoryReducer from "../Redux/inventorySlice";
import salesOrderReducer from "../Redux/finance/Sales/Salesorderslice";
import invoiceReducer from "../Redux/finance/Sales/InvoiceSlice";
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
    salaryIncrement: salaryIncrementReducer,

    category: categoryReducer,
    product: productReducer,
    customer: customerReducer,
    warehouse: warehouseReducer,
    inventory: inventoryReducer,
       salesOrder: salesOrderReducer,
    invoice: invoiceReducer,
           customerLedger: customerLedgerReducer,
  },
});
