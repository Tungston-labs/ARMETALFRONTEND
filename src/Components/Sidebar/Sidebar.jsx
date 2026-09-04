import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import getSidebarData from "./SidebarData";
import SidebarItem from "./SidebarItem";
import {
  SidebarContainer,
  LogoSection,
  Logo,
  Menu,
  Footer,
  MobileOverlay,
  MobileButton,
} from "./Sidebar.styles";

import API from "../../services/api";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  if (!user) return null;

  const sidebarItems = getSidebarData(user);

  return (
    <>
      <MobileButton onClick={() => setMobileOpen(true)}>
        <FaBars />
      </MobileButton>

      <MobileOverlay $open={mobileOpen} onClick={() => setMobileOpen(false)} />

      <SidebarContainer $collapsed={collapsed} $open={mobileOpen}>
        <LogoSection onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer" }}>
          <Logo src={user?.company?.logo || "/logo.png"} alt="logo" />
        </LogoSection>

        <Menu>
          {sidebarItems.map((item) => (
            <SidebarItem key={item.title} item={item} collapsed={collapsed} />
          ))}
        </Menu>

       <Footer>
  <span>POWERED BY</span>
  <strong>REKORY</strong>
</Footer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;