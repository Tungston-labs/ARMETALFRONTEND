import { Route, Routes } from "react-router-dom";
import "./index.css";
import LoginForm from "./Pages/login/Loginscreen.jsx";
import Layout from "./Components/layout/Layout.jsx";
import EmployeeList from "./Pages/employee/EmployeeList.jsx";
import Holiday from "./Pages/HrModule/holiday/Holiday.jsx";
import BasicLevel from "./Pages/employee/Form/BasicLevel.jsx";
import BankPayment from "./Pages/employee/Form/BankPayment.jsx";
import Documents from "./Pages/employee/Form/Documents.jsx";
import ViewBasic from "./Pages/employee/ViewForm/ViewBasic.jsx"
import ViewBankpayment from "./Pages/employee/ViewForm/ViewBankpayment.jsx"
import ViewDocument from "./Pages/employee/ViewForm/ViewDocument.jsx"
import Payroll1 from "./Pages/HrModule/payroll/PaymentOverview.jsx";
import RequireAuth from "./Components/RequireAuth.jsx";
import Viewpage from "./Pages/superAdmin/Infopage/Viewpage.jsx";
import Loder from "./Components/Loader/Loder.jsx";
import LeaveList from "./Pages/HrModule/LeaveRequest/LeaveRequestList.jsx";
import DashboardNew from "./Pages/dashboard/DashboardNew.jsx";
import FinancePage from "./Pages/HrModule/finance/FinancePage.jsx"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./Redux/authSlice";
import AttendanceList from "./Pages/HrModule/Attendance/AttendanceList.jsx"
import Daily from "./Pages/HrModule/dailytask/DailyTask.jsx";
import ViewLayout from "./Pages/employee/layout/ViewLayout.jsx";
import ErrorSomething from "./Pages/error/ErrorSomething.jsx";
import ErrorBoundary from "./Components/ErrorBoundary.jsx";
import AttendanceReport from "./Pages/HrModule/attendanceReport/AttendanceReport.jsx";
import LeaveRequestList from "./Pages/HrModule/LeaveRequest/LeaveRequestList.jsx";
import ContractAndVisaExpiry from "./Pages/HrModule/visa/ContractAndVisaExpiry.jsx";
import PayrollList from "./Pages/HrModule/payroll/NewPayroll/PayrollList.jsx";
import PlanAndPricing from "./Pages/superAdmin/PlanAndPricing/PlanAndPricing.jsx";
import ArchivedStaff from "./Pages/HrModule/ArchivedStaff/ArchivedStaff.jsx";
import HrDashboard from "./Pages/HrModule/HrDashboard/HrDashboard.jsx";
import Projects from "./Pages/HrModule/Project/Projects.jsx";
import ProjectDetails from "./Pages/HrModule/Project/ProjectDetails.jsx";
import SuperAdmin_Dashboard from "./Pages/superAdmin/Dashboard/SuperAdmin_Dashboard.jsx";
import AddCompany from "./Pages/superAdmin/AddCompany/AddCompany.jsx"
import Company from "./Pages/superAdmin/Company/Company.jsx"
import DepartmentCard from "./Pages/HrModule/department/Department/DepartmentCard.jsx";
import DepartmentDetails from "./Pages/HrModule/department/Department/DepartmentDetails.jsx";
import ReimbursementCards from "./Pages/HrModule/reimbursement/ReimbursementCards.jsx";
import ReimbursementDetails from "./Pages/HrModule/reimbursement/ReimbursementDetails.jsx";
import TrackingList from "./Pages/HrModule/Attendance/TrackingList.jsx";
import ForgetPasswordScreen from "./Pages/login/Login/Forgetpasswordscreen.jsx";
import OtpScreen from "./Pages/login/Login/Otpscreen.jsx";
import CreateNewPasswordScreen from "./Pages/login/Login/Createnewpasswordscreen.jsx";
import AttendanceSummary from "./Pages/HrModule/attendanceReport/AttendanceSummary/AttendanceSummary.jsx";
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
          <Route path="/forget-screen" element={<ForgetPasswordScreen />} />
          <Route path="/otp" element={<OtpScreen />} />
          <Route path="/create-password" element={<CreateNewPasswordScreen />} />
          <Route path="/payrolls" element={<Payroll1 />} />

          <Route element={<RequireAuth />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<HrDashboard />} />

              <Route path="/department" element={<DepartmentCard />} />
              <Route path="/department/:id" element={<DepartmentDetails />} />

              <Route path="/holiday" element={<Holiday />} />

              <Route path="/employee" element={<EmployeeList />} />
              <Route path="superadmin/view/:id" element={<Viewpage />} />

              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />

              <Route path="/finance" element={<FinancePage />} />

              <Route path="/daily-task" element={<Daily />} />

              <Route path="/ReimbursementCards" element={<ReimbursementCards />} />
              <Route path="/reimbursements/:id" element={<ReimbursementDetails />} />

              <Route path="/PayrollList" element={<PayrollList />} />

              <Route path="/basic-details" element={<BasicLevel />} />
              <Route path="/bank-payment" element={<BankPayment />} />
              <Route path="/documents" element={<Documents />} />

              <Route path="/ViewBasic/:id" element={<ViewBasic />} />
              <Route path="/ViewBasic/:id/bank" element={<ViewBankpayment />} />
              <Route path="/ViewBasic/:id/documents" element={<ViewDocument />} />

              <Route path="/employee-ContractAndVisaExpiry" element={<ContractAndVisaExpiry />} />

              <Route path="/employee-leaveRequestList" element={<LeaveRequestList />} />

              <Route path="/employee-archived-staff" element={<ArchivedStaff />} />


              <Route path="/employee-attendance" element={<AttendanceList />} />
              <Route path="/employee-attendance-tracking/:id" element={<TrackingList />} />


              <Route path="/employee-attendance-report" element={< AttendanceReport />} />
              <Route path="/employee-attendance-summary" element={< AttendanceSummary />} />

              <Route path="/dashboard" element={<SuperAdmin_Dashboard />} />
              <Route path="/company" element={<Company />} />



              <Route path="/add-company" element={<AddCompany />} />
              <Route path="/add-company/:id" element={<AddCompany />} />

              <Route path="/layout" element={<ViewLayout />} />

              <Route path="/PlanAndPricing" element={<PlanAndPricing />} />


              {/* <Route path="/leave" element={<LeaveList />} />
              <Route path="/employee-on-leave" element={<LeaveList />} /> */}
              {/* <Route path="/addcompany" element={<AddCompany />} />
              <Route path="/addcompany/:id" element={<AddCompany />} /> */}

              <Route path="*" element={<ErrorSomething />} />
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
