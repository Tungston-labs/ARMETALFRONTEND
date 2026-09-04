import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TopBar from "../../Components/HrDashboard/TopBar/TopBar";
import WelcomeBanner from "../../Components/HrDashboard/WelcomeBanner/WelcomeBanner";
import StatsGrid from "../../Components/HrDashboard/StatCard/StatsGrid";

import {
  DashboardWrapper,
  DashboardContainer,
  DashboardContent,
  StatsSection,
  BottomGrid,
  TopGrid,
} from "./HrDashboard.styles";

import {
  getDashboardStats,
  getPayrollData,
  getReimbursementData,
  getResourceAllocationData,
  gosiData,
  getEngagementData,
} from "./HrDashboardData";

import PayrollChart from "../../Components/HrDashboard/PayrollChart/PayrollChart";
import ReimbursementChart from "../../Components/HrDashboard/ReimbursementChart/ReimbursementChart";
import ResourceAllocation from "../../Components/HrDashboard/ResourceAllocation/ResourceAllocation";
import GosiCard from "../../Components/HrDashboard/GosiCard/GosiCard";
import EngagementCard from "../../Components/HrDashboard/EngagementCard/EngagementCard";
import AttendanceTrend from "../../Components/HrDashboard/AttendanceTrend/AttendanceTrend";

import {
  getDashboardCounts,
  getTodayEmployeeStats,
  getProjectEmployeeCount,
  getWeeklyAttendanceStats,
  getReimbursementCounts,
  getUpcomingHolidaysBirthdays,
  getMonthlyPayrollSummary,
  getHolidays,
} from "../../Redux/dashboardSlice";

const HrDashboard = () => {
  const dispatch = useDispatch();
  const [payrollYear, setPayrollYear] = useState(new Date().getFullYear());
  // =====================================================
  // Dashboard Counts
  // =====================================================

  const dashboardCounts = useSelector(
    (state) => state.dashboard.dashboardCounts
  );

  // =====================================================
  // Today's Employee Stats
  // =====================================================

  const todayStats = useSelector(
    (state) => state.dashboard.todayStats
  );

  // =====================================================
  // Project Employee Count
  // =====================================================

  const projectEmployeeCount = useSelector(
    (state) => state.dashboard.projectEmployeeCount
  );

  // =====================================================
  // Weekly Attendance
  // =====================================================

  const weeklyAttendanceStats = useSelector(
    (state) => state.dashboard.weeklyAttendanceStats
  );

  // =====================================================
  // Reimbursement
  // =====================================================

  const reimbursementCounts = useSelector(
    (state) => state.dashboard.reimbursements
  );

  const reimbursementLoading = useSelector(
    (state) => state.dashboard.loading.reimbursements
  );

  // =====================================================
  // Upcoming Holidays & Birthdays
  // =====================================================

  const upcomingHolidaysBirthdays = useSelector(
    (state) => state.dashboard.upcomingHolidaysBirthdays
  );

  const upcomingLoading = useSelector(
    (state) =>
      state.dashboard.loading.upcomingHolidaysBirthdays
  );

  // =====================================================
  // Payroll
  // =====================================================

  const monthlyPayrollSummary = useSelector(
    (state) => state.dashboard.monthlyPayrollSummary
  );

  const payrollLoading = useSelector(
    (state) =>
      state.dashboard.loading.monthlyPayrollSummary
  );

  // =====================================================
  // holiday
  // =====================================================
  const holidays = useSelector(
    (state) => state.dashboard.holidays
  );

  const holidayLoading = useSelector(
    (state) => state.dashboard.loading.holidays
  );

  const holidayCount = useSelector(
    (state) => state.dashboard.holidayCount
  );
  // =====================================================
  // Loading
  // =====================================================

  const loading = useSelector(
    (state) => state.dashboard.loading.dashboardCounts
  );

  const projectLoading = useSelector(
    (state) =>
      state.dashboard.loading.projectEmployeeCount
  );

  const attendanceLoading = useSelector(
    (state) =>
      state.dashboard.loading.weeklyAttendanceStats
  );

  // =====================================================
  // Error
  // =====================================================

  const error = useSelector(
    (state) => state.dashboard.error
  );

  // =====================================================
  // API Calls
  // =====================================================

  useEffect(() => {
    dispatch(getDashboardCounts());
    dispatch(getTodayEmployeeStats());
    dispatch(getProjectEmployeeCount());
    dispatch(getWeeklyAttendanceStats());
    dispatch(getReimbursementCounts());
    dispatch(getUpcomingHolidaysBirthdays());
    dispatch(getMonthlyPayrollSummary(2026));
    dispatch(getHolidays());
  }, [dispatch]);

  
  // =====================================================
  // Dashboard Stats
  // =====================================================

  const dashboardStats = getDashboardStats(
    dashboardCounts
  );

  // =====================================================
  // Payroll Data
  // =====================================================

  const payrollData = getPayrollData(
    monthlyPayrollSummary
  );

  // =====================================================
  // Reimbursement Data
  // =====================================================

  const reimbursementData =
    getReimbursementData(reimbursementCounts);

  // =====================================================
  // Resource Allocation Data
  // =====================================================

  const resourceAllocationData =
    getResourceAllocationData(
      projectEmployeeCount
    );

  // =====================================================
  // Weekly Attendance Data
  // =====================================================

  const attendanceData =
    weeklyAttendanceStats?.data || [];

  // =====================================================
  // Employee Engagement Data
  // =====================================================

  const engagementData =
    getEngagementData(
      upcomingHolidaysBirthdays
    );

  return (
    <DashboardWrapper>

      {/* =================================================
          Top Bar
      ================================================= */}

      <TopBar />

      {/* =================================================
          Welcome Banner
      ================================================= */}

      <WelcomeBanner data={todayStats} />

      <DashboardContainer>
        <DashboardContent>

          {/* =================================================
              Dashboard Statistics
          ================================================= */}

          <StatsSection>
            {loading ? (
              <div>Loading dashboard...</div>
            ) : error ? (
              <div>
                Failed to load dashboard data.
              </div>
            ) : (
              <StatsGrid data={dashboardStats} />
            )}
          </StatsSection>

          {/* =================================================
              First Row
          ================================================= */}

          <TopGrid>

            {/* =================================================
                Payroll
                API Integrated
            ================================================= */}

            {payrollLoading ? (
    <div>Loading payroll...</div>
  ) : (
    <PayrollChart
      apiData={monthlyPayrollSummary}
      selectedYear={payrollYear}
      onYearChange={setPayrollYear}
    />
  )}

            {/* =================================================
                Reimbursement
                API Integrated
            ================================================= */}

            {reimbursementLoading ? (
              <div>
                Loading reimbursement...
              </div>
            ) : (
              <ReimbursementChart
                data={reimbursementData}
              />
            )}

            {/* =================================================
                Resource Allocation
                API Integrated
            ================================================= */}

            {projectLoading ? (
              <div>
                Loading resource allocation...
              </div>
            ) : (
              <ResourceAllocation
                data={resourceAllocationData}
              />
            )}

          </TopGrid>

          {/* =================================================
              Second Row
          ================================================= */}

          <BottomGrid>

            {/* =================================================
                GOSI
                Static
            ================================================= */}

            <GosiCard
              data={gosiData}
            />

            {/* =================================================
                Attendance
                API Integrated
            ================================================= */}

            {attendanceLoading ? (
              <div>
                Loading attendance...
              </div>
            ) : (
              <AttendanceTrend
                data={attendanceData}
              />
            )}

            {/* =================================================
                Employee Engagement
                API Integrated
            ================================================= */}

            {upcomingLoading ? (
              <div>
                Loading employee engagement...
              </div>
            ) : (
              <EngagementCard
                data={engagementData}
                holidays={holidays}
              />
            )}

          </BottomGrid>

        </DashboardContent>
      </DashboardContainer>

    </DashboardWrapper>
  );
};

export default HrDashboard;