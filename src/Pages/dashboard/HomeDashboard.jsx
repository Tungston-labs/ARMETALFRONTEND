import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Container,
  ContentWrapper,
  TwoColumn,
  LeftBox,
  RightBox,
  ThreeBox,
  ThreeColumnRow,
  TopCard
} from "./HomeDashboard.Styles";

import HeaderBar from "../../Components/homepage/HeaderBar";
import StatsGrid from "../../Components/homepage/StatsGrid";
import RightModal from "../../Components/homepage/RightModal";
import ProjectChart from "../../Components/homepage/ProjectChart";
import ReimbursementSummary from "../../Components/homepage/ReimbursementSummary";
import DepartmentSummary from "../../Components/homepage/DepartmentSummary";
import UpcomingHolidays from "../../Components/homepage/UpcomingHolidays";
import EmployeeContractExpiry from "../../Components/homepage/EmployeeContractExpiry";
import RecentlyAddedEmployees from "../../Components/homepage/RecentlyAddedEmployees";

import {
  getDashCounts,
  getReimbursementCounts,
  getReimbursementMonthwise,
  getDepartmentDashboard,
  getRecentEmployees,
  getContractExpiry,
  getHolidaySummary,
  getProjectEmployeeCount,
  getTodayEmployeeStats,
} from "../../Redux/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const counts = useSelector((state) => state.dashboard.counts);
  const reimbursements = useSelector((state) => state.dashboard.reimbursements);
  const reimbursementMonthwise = useSelector(
    (state) => state.dashboard.reimbursementMonthwise
  );
  const departmentSummary = useSelector(
    (state) => state.dashboard.departmentSummary
  );
  const recentEmployees = useSelector(
    (state) => state.dashboard.recentEmployees
  );
  const contractExpiry = useSelector((state) => state.dashboard.contractExpiry);
  const holidaySummary = useSelector(
    (state) => state.dashboard.holidaySummary
  );
  const projectEmployeeCount = useSelector(
    (state) => state.dashboard.projectEmployeeCount
  );
  const todayStats = useSelector((state) => state.dashboard.todayStats);
console.log("contractExpiry", contractExpiry);
console.log("contract_expiry", contractExpiry?.contract_expiry);
  useEffect(() => {
    dispatch(getDashCounts());
    dispatch(getReimbursementCounts());
    dispatch(getReimbursementMonthwise());
    dispatch(getDepartmentDashboard());
    dispatch(getRecentEmployees());
    dispatch(getContractExpiry());
    dispatch(getHolidaySummary());
    dispatch(getProjectEmployeeCount());
    dispatch(getTodayEmployeeStats());
  }, []); // ← IMPORTANT FIX

  const employeesList =
    recentEmployees?.recent_employees?.map((emp) => ({
      ...emp,
      avatar: emp.profile_pic,
      empId: emp.employee_id,
      joiningDate: emp.added_date,
    })) || [];

  return (
    <Container>
      <ContentWrapper className={open ? "shrink" : ""}>
        <HeaderBar onOpen={() => setOpen(true)} />

        <TopCard>
          <StatsGrid counts={counts} todayStats={todayStats} />
        </TopCard>
        <TwoColumn>
          <LeftBox>
            <ReimbursementSummary
              reimbursements={reimbursements}
              reimbursementMonthwise={reimbursementMonthwise}
            />
          </LeftBox>

          <RightBox>
            <ProjectChart projectEmployeeCount={projectEmployeeCount} />
          </RightBox>
        </TwoColumn>

        <ThreeColumnRow>
          <ThreeBox>
            <DepartmentSummary
              departments={departmentSummary?.recent_departments || []}
            />
          </ThreeBox>
          <ThreeBox>
            <RecentlyAddedEmployees employees={employeesList} showCount={3} />
          </ThreeBox>

          <ThreeBox>
   <EmployeeContractExpiry
  employees={contractExpiry || []}
  showCount={3}
/>

          </ThreeBox>
          <ThreeBox>
            <UpcomingHolidays
              holidays={
                (holidaySummary?.upcoming_holidays || []).map((h) => ({
                  name: h.description,
                  date: h.date,
                  type: h.holiday_type,
                }))
              }
              showCount={3}
              onViewAll={() => console.log("open holidays page")}
            />
          </ThreeBox>
        </ThreeColumnRow>
      </ContentWrapper>

      {/* RIGHT SIDE SLIDE MODAL */}
      {open && <RightModal open={open} onClose={() => setOpen(false)} />}
    </Container>
  );
};

export default Dashboard;
