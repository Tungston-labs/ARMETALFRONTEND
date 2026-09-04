import React from "react";
import { Grid } from "./StatsGrid.Styles";
import StatsCard from "./StatCard";
import { FaUsers, FaFileContract, FaPassport } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";

const StatsGrid = ({ counts, todayStats }) => {
  if (!counts) return <p style={{ textAlign: "center" }}>Loading Dashboard...</p>;

  return (
    <Grid>
      <StatsCard
        number={counts.total_employees || 0}
        label="Total Employees"
        icon={FaUsers}
        route="/employee"
      />

      <StatsCard
        number={counts.pending_leave_requests || 0}
        label="Leave Requests"
        icon={MdPendingActions}
        route="/employee-leave-request"
      />

      <StatsCard
        number={
          (counts.upcoming_visa_expiry || 0) +
          (counts.upcoming_contract_expiry || 0)
        }
        label="Visa Expiring / Contract Expiring"
        icon={FaPassport}
        route="/employee-Contract-Visa-Expiry"
      />

      <StatsCard
        number={counts.todays_attendance_count || 0}
        label="Attendance"
        icon={FaFileContract}
        route="/employee-attendance"
      />
    </Grid>
  );
};

export default StatsGrid;
