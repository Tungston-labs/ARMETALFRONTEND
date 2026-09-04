import React, { useState, useEffect } from "react";
import { RiHome5Line } from "react-icons/ri";
import { FaUsers, FaSitemap, FaTasks } from "react-icons/fa";
import { MdOutlineLaptopChromebook, MdContentPasteSearch } from "react-icons/md";
import { BsFillBuildingsFill } from "react-icons/bs";
import {
  FaMoneyCheckAlt,
  FaUmbrellaBeach,
  FaReceipt,
} from "react-icons/fa";
import { FaAngleRight, FaAngleUp } from "react-icons/fa6";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  SidebarContainer,
  Logo,
  Nav,
  ToggleButton,
  CustomLink,
  TopSection,
  BottomText,
  SubMenu,
  SubMenuLink,
} from "./Sidebar.styles";

import API from "../../../services/api";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const reduxUser = useSelector((state) => state.auth.user);
  const storedUser = useSelector((state) => state.auth.user);
  const user = reduxUser || storedUser;

  const modules = user?.company_modules || {};

  useEffect(() => {}, [user]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      await API.post("/logout/", { refresh: refreshToken });

      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {}
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/" ? "active" : "";
    return location.pathname.startsWith(path) ? "active" : "";
  };

  const employeeRoutes = [
    "/employee",
    "/employee-leave-request",
    "/employee-attendance",
    "/employee-Contract-Visa-Expiry",
    "/employee-attendance-report",
    "/employee-attendance-request",
  ];

  const employeeOpen = employeeRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (!user) return null;

  return (
    <SidebarContainer className={collapsed ? "collapsed" : ""}>
      <TopSection>
        <ToggleButton onClick={() => setCollapsed(!collapsed)}>☰</ToggleButton>
        <Logo className={collapsed ? "hidden" : ""}>
          {user?.company?.logo ? (
            <img src={user.company.logo} alt="Company Logo" />
          ) : (
            <img
              src="/images/logos.png"
              alt="Default Logo"
              className="default-logo"
            />
          )}
        </Logo>
      </TopSection>

      <Nav>
        {user?.is_superadmin && (
          <CustomLink
            as={NavLink}
            to="/superadmin-dashboard"
            className={`${collapsed ? "collapsed" : ""} ${isActive(
              "/superadmin-dashboard"
            )}`}
          >
            <MdOutlineLaptopChromebook />
            <span>Dashboard</span>
          </CustomLink>
        )}

        {user?.is_superadmin && (
          <CustomLink
            as={NavLink}
            to="/company"
            className={`${collapsed ? "collapsed" : ""} ${isActive(
              "/company"
            )}`}
          >
            <BsFillBuildingsFill />
            <span>Companys</span>
          </CustomLink>
        )}

        {user?.is_superadmin && (
          <CustomLink
            as={NavLink}
            to="/finance"
            className={`${collapsed ? "collapsed" : ""} ${isActive("/finance")}`}
          >
            <FaReceipt />
            <span>Finance</span>
          </CustomLink>
        )}

        {(user?.is_hr_admin || user?.is_hr) && Object.keys(modules).length > 0 && (
          <>
            {modules.dashboard && (
              <CustomLink
                as={NavLink}
                to="/"
                className={`${collapsed ? "collapsed" : ""} ${isActive("/")}`}
              >
                <RiHome5Line />
                <span>Dashboard</span>
              </CustomLink>
            )}

            {modules.employee && (
              <>
                <CustomLink
                  as={NavLink}
                  to="/employee"
                  className={`${collapsed ? "collapsed" : ""} ${
                    employeeOpen ? "active" : ""
                  }`}
                >
                  <FaUsers />
                  <span>Employee</span>
             
                </CustomLink>

             
              </>
            )}

            {modules.department && (
              <CustomLink
                as={NavLink}
                to="/department"
                className={`${collapsed ? "collapsed" : ""} ${isActive(
                  "/department"
                )}`}
              >
                <FaSitemap />
                <span>Department</span>
              </CustomLink>
            )}

            {modules.daily_task && (
              <CustomLink
                as={NavLink}
                to="/daily-task"
                className={`${collapsed ? "collapsed" : ""} ${isActive(
                  "/daily-task"
                )}`}
              >
                <FaTasks />
                <span>Daily Task</span>
              </CustomLink>
            )}

            {modules.finance && (
              <CustomLink
                as={NavLink}
                to="/finance"
                className={`${collapsed ? "collapsed" : ""} ${isActive("/finance")}`}
              >
                <FaReceipt />
                <span>Finance</span>
              </CustomLink>
            )}

            {modules.payroll && (
              <CustomLink
                as={NavLink}
                to="/payrolldetails"
                className={`${collapsed ? "collapsed" : ""} ${isActive(
                  "/payrolldetails"
                )}`}
              >
                <FaMoneyCheckAlt />
                <span>Payroll</span>
              </CustomLink>
            )}

            {modules.holiday && (
              <CustomLink
                as={NavLink}
                to="/holiday"
                className={`${collapsed ? "collapsed" : ""} ${isActive("/holiday")}`}
              >
                <FaUmbrellaBeach />
                <span>Holiday</span>
              </CustomLink>
            )}

            {modules.reimbursement && (
              <CustomLink
                as={NavLink}
                to="/reimbursement"
                className={`${collapsed ? "collapsed" : ""} ${isActive(
                  "/reimbursement"
                )}`}
              >
                <FaReceipt />
                <span>Reimbursement</span>
              </CustomLink>
            )}

            {modules.project && (
              <CustomLink
                as={NavLink}
                to="/project"
                className={`${collapsed ? "collapsed" : ""} ${isActive("/project")}`}
              >
                <MdContentPasteSearch />
                <span>Project</span>
              </CustomLink>
            )}
          </>
        )}
      </Nav>

      <BottomText className={collapsed ? "collapsed" : ""}>
        Powered by <span>REKORY</span>
      </BottomText>
    </SidebarContainer>
  );
}