import { Route } from "react-router-dom";

import HrDashboard from "../Pages/HrModule/HrDashboard/HrDashboard.jsx";

import EmployeeList from "../Pages/employee/EmployeeList.jsx";
import BasicLevel from "../Pages/employee/Form/BasicLevel.jsx";
import BankPayment from "../Pages/employee/Form/BankPayment.jsx";
import Documents from "../Pages/employee/Form/Documents.jsx";

import ViewBasic from "../Pages/employee/ViewForm/ViewBasic.jsx";
import ViewBankpayment from "../Pages/employee/ViewForm/ViewBankpayment.jsx";
import ViewDocument from "../Pages/employee/ViewForm/ViewDocument.jsx";

import Holiday from "../Pages/HrModule/holiday/Holiday.jsx";
import LeaveRequestList from "../Pages/HrModule/LeaveRequest/LeaveRequestList.jsx";

import AttendanceList from "../Pages/HrModule/Attendance/AttendanceList.jsx";
import TrackingList from "../Pages/HrModule/Attendance/TrackingList.jsx";

import AttendanceReport from "../Pages/HrModule/attendanceReport/AttendanceReport.jsx";
import AttendanceSummary from "../Pages/HrModule/attendanceReport/AttendanceSummary/AttendanceSummary.jsx";

import ContractAndVisaExpiry from "../Pages/HrModule/visa/ContractAndVisaExpiry.jsx";
import ArchivedStaff from "../Pages/HrModule/ArchivedStaff/ArchivedStaff.jsx";

import Daily from "../Pages/HrModule/dailytask/DailyTask.jsx";

import Projects from "../Pages/HrModule/Project/Projects.jsx";
import ProjectDetails from "../Pages/HrModule/Project/ProjectDetails.jsx";

import DepartmentCard from "../Pages/HrModule/department/Department/DepartmentCard.jsx";
import DepartmentDetails from "../Pages/HrModule/department/Department/DepartmentDetails.jsx";

import ReimbursementCards from "../Pages/HrModule/reimbursement/ReimbursementCards.jsx";
import ReimbursementDetails from "../Pages/HrModule/reimbursement/ReimbursementDetails.jsx";

import FinancePage from "../Pages/HrModule/finance/FinancePage.jsx";
import PayrollList from "../Pages/HrModule/payroll/NewPayroll/PayrollList.jsx";

import ViewLayout from "../Pages/employee/layout/ViewLayout.jsx";

const HRRoutes = () => {
  return (
    <>
      {/* Dashboard */}
      <Route index element={<HrDashboard />} />

      {/* Department */}
      <Route path="department" element={<DepartmentCard />} />
      <Route path="department/:id" element={<DepartmentDetails />} />

      {/* Employee */}
      <Route path="employee" element={<EmployeeList />} />
      <Route path="basic-details" element={<BasicLevel />} />
      <Route path="bank-payment" element={<BankPayment />} />
      <Route path="documents" element={<Documents />} />

      <Route path="ViewBasic/:id" element={<ViewBasic />} />
      <Route path="ViewBasic/:id/bank" element={<ViewBankpayment />} />
      <Route path="ViewBasic/:id/documents" element={<ViewDocument />} />

      {/* Holiday */}
      <Route path="holiday" element={<Holiday />} />

      {/* Leave */}
      <Route path="employee-leaveRequestList" element={<LeaveRequestList />} />

      {/* Attendance */}
      <Route path="employee-attendance" element={<AttendanceList />}/>

      <Route path="employee-attendance-tracking/:id"element={<TrackingList />}/>

      <Route path="employee-attendance-report" element={<AttendanceReport />}/>

      <Route path="employee-attendance-summary" element={<AttendanceSummary />}/>

      {/* Visa */}
      <Route path="employee-ContractAndVisaExpiry" element={<ContractAndVisaExpiry />} />

      {/* Archived Staff */}
      <Route path="employee-archived-staff" element={<ArchivedStaff />}/>

      {/* Daily Task */}
      <Route path="daily-task" element={<Daily />}/>

      {/* Projects */}
      <Route path="projects" element={<Projects />} />

      <Route path="projects/:id" element={<ProjectDetails />} />

      {/* Reimbursement */}
      <Route path="ReimbursementCards" element={<ReimbursementCards />} />

      <Route path="reimbursements/:id" element={<ReimbursementDetails />}/>

      {/* Finance - currently part of HR */}
      <Route path="finance" element={<FinancePage />}/>

      {/* Payroll */}
      <Route path="PayrollList"  element={<PayrollList />} />

      <Route path="layout"element={<ViewLayout />}
      />
    </>
  );
};

export default HRRoutes;