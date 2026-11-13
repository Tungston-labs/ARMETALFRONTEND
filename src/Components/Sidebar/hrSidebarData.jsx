import React from "react";
import { FaTasks, FaCalendarAlt } from "react-icons/fa";
import { RiBarChartLine } from "react-icons/ri";
import { LuCircleDollarSign, LuWallet } from "react-icons/lu";
import { PiNetworkLight, PiUsersThreeLight } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { FiCodesandbox } from "react-icons/fi";

export const getHrSidebarData = (user) => {
  if (!user) return [];

  const modules = user?.company_modules || {};
  const items = [];

  if (modules.dashboard) {
    items.push({ title: "DASHBOARD", icon: <GoHome />, path: "/" });
  }

  if (modules.department) {
    items.push({ title: "DEPARTMENT", icon: <PiNetworkLight />, path: "/department" });
  }

  if (modules.employee) {
    items.push({
      title: "EMPLOYEE",
      icon: <PiUsersThreeLight />,
      children: [
        { title: "EMPLOYEE LIST", path: "/employee" },
        { title: "LEAVE REQUEST", path: "/employee-leaveRequestList" },
        { title: "ATTENDANCE", path: "/employee-attendance" },
        { title: "ATTEND. REPORT", path: "/employee-attendance-report" },
        { title: "VISA & CONTRACT", path: "/employee-ContractAndVisaExpiry" },
        { title: "ARCHIVED STAFF", path: "/employee-archived-staff" },
      ],
    });
  }

  if (modules.daily_task) {
    items.push({ title: "DAILY TASK", icon: <FaTasks />, path: "/daily-task" });
  }

  if (modules.finance) {
    items.push({ title: "FINANCE", icon: <RiBarChartLine />, path: "/finance" });
  }

  if (modules.payroll) {
    items.push({ title: "PAYROLL", icon: <LuWallet />, path: "/PayrollList" });
  }

  if (modules.holiday) {
    items.push({ title: "HOLIDAY", icon: <FaCalendarAlt />, path: "/holiday" });
  }

  if (modules.reimbursement) {
    items.push({ title: "REIMBURSEMENT", icon: <LuCircleDollarSign />, path: "/ReimbursementCards" });
  }

  if (modules.project) {
    items.push({ title: "PROJECT", icon: <FiCodesandbox />, path: "/projects" });
  }

  return items;
};

export default getHrSidebarData;
