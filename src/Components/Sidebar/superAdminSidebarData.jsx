import React from "react";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { BsFillBuildingsFill } from "react-icons/bs";
import { FaReceipt } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";

export const getSuperAdminSidebarData = () => {
  return [
    {
      title: "DASHBOARD",
      icon: <MdOutlineLaptopChromebook />,
      path: "/dashboard",
    },
    {
      title: "COMPANYS",
      icon: <BsFillBuildingsFill />,
      path: "/company",
    },
    {
      title: "TRANSACTIONS",
      icon: <FaReceipt />,
      path: "/finance",
    },
    {
      title: "PLANS & PRICING",
      icon: <LuCircleDollarSign />,
      path: "/PlanAndPricing",
    },
  ];
};

export default getSuperAdminSidebarData;
