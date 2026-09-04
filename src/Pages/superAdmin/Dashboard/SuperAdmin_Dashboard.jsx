import React from "react";
import { DashboardContainer, ChartsSection } from "./SuperAdmin_Dashboard.Styles";
import DashboardStats from "../../../Components/superadmin/Dashboard/DashboardStats";
import RecentlyAddedCompanies from "../../../Components/superadmin/Dashboard/RecentCompanies";
import PendingPayments from "../../../Components/superadmin/Dashboard/PendingPayments";
import TopPlan from "../../../Components/superadmin/Dashboard/TopPlan";
import RevenueOverview from "../../../Components/superadmin/Dashboard/RevenueOverview";
import TopBar from "../../../Components/HrDashboard/TopBar/TopBar";
const Dashboard = () => {
  return (
    <>
            <TopBar />
    <DashboardContainer>
      <DashboardStats />

      <RecentlyAddedCompanies />

      <PendingPayments />

      <ChartsSection>
        <TopPlan />

        <RevenueOverview />
      </ChartsSection>
    </DashboardContainer>
    </>
  );
};

export default Dashboard;