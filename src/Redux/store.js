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
import categoryReducer from "./finance/categorySlice";
import productReducer from "./finance/ProductSlice";

// =====================================================
// INVENTORY
// =====================================================

import inventoryReducer from "../Redux/inventorySlice";

export const store = configureStore({
  reducer: {
    // =================================================
    // AUTH
    // =================================================

    auth: authReducer,

    // =================================================
    // HR
    // =================================================

    departments: departmentReducer,
    holidays: holidayReducer,
    superAdmin: superAdminReducer,
    employee: employeeReducer,
    dailyTask: dailyTaskReducer,
    leave: leaveReducer,
    attendance: attendanceReducer,
    payroll: payrollReducer,

    // =================================================
    // EMPLOYEES
    // =================================================

    employees: employeeReducer,

    // =================================================
    // DASHBOARD
    // =================================================

    dashboard: dashboardReducer,

    // =================================================
    // PROJECTS / FIELD SHIFT
    // =================================================

    projects: projectReducer,

    // =================================================
    // COMPANY
    // =================================================

    company: companyReducer,

    // =================================================
    // FINANCE
    // =================================================

    finance: financeReducer,
    salaryIncrement: salaryIncrementReducer,

    // =================================================
    // WAREHOUSE
    // =================================================

    warehouse: warehouseReducer,

    // =================================================
    // CATEGORY
    // =================================================

    category: categoryReducer,

    // =================================================
    // PRODUCT
    // =================================================

    product: productReducer,

    // =================================================
    // INVENTORY
    // =================================================

    inventory: inventoryReducer,
  },
});