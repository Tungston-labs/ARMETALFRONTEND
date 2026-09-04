import React from "react";
import { useSelector } from "react-redux";
import { BsBuildings } from "react-icons/bs";

import {
  StatsContainer,
  StatItem,
  StatIcon,
  StatValue,
  StatLabel,
} from "./DashboardStats.Styles";

const DashboardStats = () => {
  const { overview } = useSelector((state) => state.superAdmin);

  const formattedRevenue =
    overview?.total_revenue !== undefined
      ? `₹${Number(overview.total_revenue).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "₹0.00";

  const stats = [
    {
      value: overview?.total_companies ?? 0,
      label: "Total Companies",
    },
    {
      value: formattedRevenue,
      label: "Total Revenue",
    },
    {
      value: overview?.unpaid_companies_count ?? 0,
      label: "Pending Payments",
    },
    {
      value: overview?.most_ordered_plan ?? "No Plan",
      label: "Most Ordered Plan",
    },
    {
      value: overview?.active_subscriptions ?? 0,
      label: "Active Subscriptions",
    },
  ];

  return (
    <StatsContainer>
      {stats.map((stat) => (
        <StatItem key={stat.label}>
          <StatIcon>
            <BsBuildings />
          </StatIcon>

          <StatValue title={stat.value}>
            {stat.value}
          </StatValue>

          <StatLabel>{stat.label}</StatLabel>
        </StatItem>
      ))}
    </StatsContainer>
  );
};

export default DashboardStats;