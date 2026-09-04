import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Redux/authSlice';
import departmentReducer from "../Redux/departmentSlice";
import holidayReducer from "../Redux/holidaySlice";
import superAdminReducer from '../Redux/superAdminSlice';
import employeeReducer from '../Redux/employeeSlice';
import dailyTaskReducer from '../Redux/dailyTaskSlice';
import employeesReducer from '../Redux/employeeSlice';
import leaveReducer from '../Redux/leaveSlice';
import attendanceReducer from '../Redux/attendanceSlice';
import dashboardReducer from '../Redux/dashboardSlice';
import payrollReducer from '../Redux/payrollSlice';
import projectReducer from '../Redux/fieldShiftSlice'; 
import companyReducer from "../Redux/companySlice";
import financeReducer from "../Redux/financeSlice"; 
import salaryIncrementReducer from "../Redux/salaryIncrementSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    holidays: holidayReducer,
    superAdmin: superAdminReducer,
    employee: employeeReducer,
    dailyTask: dailyTaskReducer,
    employees: employeesReducer,
    leave: leaveReducer,
    attendance: attendanceReducer,
    dashboard: dashboardReducer,
    payroll: payrollReducer,
    projects: projectReducer,
    company: companyReducer,
     finance: financeReducer,  
     salaryIncrement: salaryIncrementReducer,
  },
});
