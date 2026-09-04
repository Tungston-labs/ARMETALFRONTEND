import { Route, Routes } from "react-router-dom";
import "./index.css";
import LoginForm from "./Pages/login/Loginscreen.jsx";
import Layout from "./Components/layout/Layout.jsx";
import DepartmentList from "./Pages/department/DepartmentList";
import EmployeeList from "./Pages/employee/EmployeeList.jsx";
import Holiday from "./Pages/holiday/Holiday.jsx";
// import SuperAdmin from "./Pages/superAdmin/SuperAdmin.jsx";
// import AddCompany from "./Pages/superAdmin/AddCompany.jsx";
import Visa from "./Pages/visa/Visa.jsx";
import BasicLevel from "./Pages/employee/Form/BasicLevel.jsx";
import BankPayment from "./Pages/employee/Form/BankPayment.jsx";
import Documents from "./Pages/employee/Form/Documents.jsx";
// import LeaveRequest from "./Pages/leaveDetails/LeaveRequest.jsx";
// import EmployeeLeaveDetails from "./Pages/leaveDetails/EmployeeLeaveDetails.jsx";
import Attendance from "./Pages/attendance/Attendance.jsx";
import EmployeesOnLeave from "./Pages/onLeave/EmployeesOnLeave.jsx";
import ViewBasic from "./Pages/employee/ViewForm/ViewBasic.jsx"
import ViewBankpayment from "./Pages/employee/ViewForm/ViewBankpayment.jsx"
import ViewDocument from "./Pages/employee/ViewForm/ViewDocument.jsx"
import Payroll1 from "./Pages/payroll/PaymentOverview.jsx";
import RequireAuth from "./Components/RequireAuth.jsx";
import Viewpage from "./Pages/superAdmin/Viewpage.jsx";
// import ForgetPassword from "./Pages/login/ForgetPassword.jsx";
// import Verification from "./Pages/login/Verification.jsx";
// import NewPassword from "./Pages/login/NewPassword.jsx";
import Loder from "./Components/Loader/Loder.jsx";
import LeaveList from "./Pages/onLeave/LeaveList.jsx";
import DetailOnleave from "./Pages/onLeave/DetailOnleave.jsx"
import DashboardNew from "./Pages/dashboard/DashboardNew.jsx";
import Reimb_info from "./Pages/reimbursement/Reimb_info.jsx"
import FinancePage from "./Pages/finance/FinancePage.jsx"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./Redux/authSlice";
import Superadmin_Dashboard from "./Pages/superAdmin/Superadmin_Dashboard.jsx"
import FieldShift from "./Pages/Project/Project.jsx"
// import FieldDepartment from "./Pages/Project/ProjectInfo.jsx"
import AttendanceList from "./Pages/Attendance/AttendanceList.jsx"
import ReimbursementList from "./Pages/reimbursement/ReimbursementList.jsx";
import Daily from "./Pages/dailytask/DailyTask.jsx"
import ViewLayout from "./Pages/employee/layout/ViewLayout.jsx";
import HomeDashboard from "./Pages/dashboard/HomeDashboard.jsx"
import ErrorSomething from "./Pages/error/ErrorSomething.jsx";
import ErrorBoundary from "./Components/ErrorBoundary.jsx";
import AttendanceReport from "./Pages/attendanceReport/AttendanceReport.jsx";
import PayrollDetailsContainer from "./Pages/payroll/PayrollDetailsContainer.jsx";
import PayrollTable from "./Pages/payroll/PayrollTable.jsx";
import AttendanceRequestScreen from "./Pages/attendanceRequest/AttendanceRequest.jsx";
import Table from "./Pages/Table.jsx";
import LeaveRequestList from "./Pages/employee/LeaveRequest/LeaveRequestList.jsx";
import ContractAndVisaExpiry from "./Pages/visa/ContractAndVisaExpiry.jsx";
import PayrollList from "./Pages/payroll/NewPayroll/PayrollList.jsx";
import PlanAndPricing from "./Pages/superAdmin/PlanAndPricing/PlanAndPricing.jsx";
import ArchivedStaff from "./Pages/employee/ArchivedStaff/ArchivedStaff.jsx";
import HrDashboard from "./Pages/HrDashboard/HrDashboard.jsx";
import Projects from "./Pages/Project/Projects.jsx";
import ProjectDetails from "./Pages/Project/ProjectDetails.jsx";
// import LoginScreen from "./Pages/login/Login/Loginscreen.jsx";
// import AuthLayout from "./Pages/login/Login/AuthLayout.jsx";
import SuperAdmin_Dashboard from "./Pages/superAdmin/Dashboard/SuperAdmin_Dashboard.jsx";
import AddCompany from "./Pages/superAdmin/AddCompany/AddCompany.jsx"
import Company from "./Pages/superAdmin/Company/Company.jsx"
import DepartmentCard from "./Pages/department/Department/DepartmentCard.jsx";
import DepartmentDetails from "./Pages/department/Department/DepartmentDetails.jsx";
import ReimbursementCards from "./Pages/reimbursement/ReimbursementCards.jsx";
import ReimbursementDetails from "./Pages/reimbursement/ReimbursementDetails.jsx";
import TrackingList from "./Pages/Attendance/TrackingList.jsx";
import ForgetPasswordScreen from "./Pages/login/Login/Forgetpasswordscreen.jsx";
import OtpScreen from "./Pages/login/Login/Otpscreen.jsx";
import CreateNewPasswordScreen from "./Pages/login/Login/Createnewpasswordscreen.jsx";
import AttendanceSummary from "./Pages/attendanceReport/AttendanceSummary/AttendanceSummary.jsx";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (user && accessToken) {
      dispatch(login({
        userName: user.username,
        accessToken,
        user,
      }));
    }
  }, [dispatch]);

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/loader" element={<Loder />} />
          <Route path="/login" element={<LoginForm />} />


          {/* <Route element={<AuthLayout />}> */}
          {/* <Route path="/log" element={<LoginScreen />} /> */}
          <Route path="/forget-screen" element={<ForgetPasswordScreen />} />
          <Route path="/otp" element={<OtpScreen />} />
          <Route path="/create-password" element={<CreateNewPasswordScreen />} />
          {/* </Route> */}
          {/* <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/new-password" element={<NewPassword />} /> */}
          <Route path="/payrolls" element={<Payroll1 />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<HrDashboard />} />
              {/* <Route path="/department" element={<DepartmentList />} /> */}

              <Route path="/department" element={<DepartmentCard />} />
              <Route path="/department/:id" element={<DepartmentDetails />} />
              <Route path="/employee" element={<EmployeeList />} />
              <Route path="superadmin/view/:id" element={<Viewpage />} />
              <Route path="/holiday" element={<Holiday />} />
              <Route path="/payrolldetails/:id" element={< PayrollDetailsContainer />} />
              <Route path="/payrolldetails" element={<PayrollTable />} />
              <Route path="/company" element={<Company />} />
              <Route path="/superadmin-dashboard" element={<Superadmin_Dashboard />} />

              <Route path="/dashboard" element={<SuperAdmin_Dashboard />} />
              <Route path="/addcompany" element={<AddCompany />} />
              <Route path="/addcompany/:id" element={<AddCompany />} />
              <Route path="/add-company" element={<AddCompany />} />
              <Route path="/add-company/:id" element={<AddCompany />} />
              <Route path="/employee-Contract-Visa-Expiry" element={<Visa />} />
              <Route path="/daily-task" element={<Daily />} />
              <Route path="/basic-details" element={<BasicLevel />} />
              <Route path="/bank-payment" element={<BankPayment />} />
              <Route path="/documents" element={<Documents />} />
              {/* <Route path="/employee-leave-request" element={<LeaveRequest />} /> */}
              {/* <Route path="/employee-leave-details/:id" element={<EmployeeLeaveDetails />} /> */}
              <Route path="/employee-attendance/detail/:id" element={<Attendance />} />
              <Route path="/leave" element={<LeaveList />} />
              <Route path="/employee-on-leave" element={<LeaveList />} />

              <Route path="/employee-attendance" element={<AttendanceList />} />
              <Route
                path="/employee-attendance-tracking/:id"
                element={<TrackingList />}
              />
              <Route path="/employee-leave" element={<DetailOnleave />} />
              <Route path="/ViewBasic/:id" element={<ViewBasic />} />
              <Route path="/ViewBasic/:id/bank" element={<ViewBankpayment />} />
              <Route path="/ViewBasic/:id/documents" element={<ViewDocument />} />

              <Route path="/ReimbursementCards" element={<ReimbursementCards />} />
              <Route path="/reimbursements/:id" element={<ReimbursementDetails />} />
              <Route path="/reimbursement" element={<ReimbursementList />} />
              <Route path="/reimbursement_info/:id" element={<Reimb_info />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/project" element={<FieldShift />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />

              {/* <Route path="/project-department/:id/" element={<FieldDepartment />} /> */}
              <Route path="/layout" element={<ViewLayout />} />
              <Route path="/employee-attendance-report" element={< AttendanceReport />} />
              <Route path="/employee-attendance-summary" element={< AttendanceSummary />} />


              <Route path="/employee-attendance-request" element={<AttendanceRequestScreen />} />


              {/* <Route path="/Dashboard" element={<HrDashboard />} /> */}
              <Route path="/PlanAndPricing" element={<PlanAndPricing />} />
              <Route path="/PayrollList" element={<PayrollList />} />
              <Route path="/employee-ContractAndVisaExpiry" element={<ContractAndVisaExpiry />} />
              <Route path="/employee-leaveRequestList" element={<LeaveRequestList />} />
              <Route path="/employee-archived-staff" element={<ArchivedStaff />} />
              <Route path="/table" element={<Table />} />

              <Route path="*" element={<ErrorSomething />} />
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
