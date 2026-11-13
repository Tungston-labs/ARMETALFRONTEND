import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";

import getFinanceSidebarData from "./financeSidebarData";
import FinanceSidebarItem from "./FinanceSidebarItem";
import { useLogout } from "../../services/logout";

import {
  SidebarContainer,
  LogoSection,
  LogoImage,
  BrandContainer,
  BrandIcon,
  BrandText,
  Menu,
  SidebarFooter,
  LogoutButton,
  PoweredBy,
  MobileOverlay,
  MobileButton,
} from "./FinanceSidebar.styles";

const FinanceSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const handleLogout = useLogout();

  const sidebarItems = getFinanceSidebarData();

  const companyLogo = user?.company?.logo;
  const companyName = user?.company?.name || "Tungston";

  return (
    <>
      <MobileButton $open={mobileOpen} onClick={() => setMobileOpen(true)}>
        <FaBars />
      </MobileButton>

      <MobileOverlay $open={mobileOpen} onClick={() => setMobileOpen(false)} />

      <SidebarContainer $open={mobileOpen}>
        <LogoSection>
          {companyLogo ? (
            <LogoImage src={companyLogo} alt={companyName} />
          ) : (
            <BrandContainer>
              <BrandIcon>
                <span style={{ color: "#F58220", fontSize: "20px", fontWeight: "bold" }}>★</span>
              </BrandIcon>
              <BrandText>
                <span className="brand-name">{companyName}</span>
                <span className="brand-sub">Labs.</span>
              </BrandText>
            </BrandContainer>
          )}
        </LogoSection>

        <Menu>
          {sidebarItems.map((item) => (
            <FinanceSidebarItem
              key={item.title}
              item={item}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </Menu>

        <SidebarFooter>
          <LogoutButton type="button" onClick={handleLogout}>
            <FiLogOut />
            <span>LOGOUT</span>
          </LogoutButton>

          <PoweredBy>
            <span>Powered by</span>
            <strong>REKORY</strong>
          </PoweredBy>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default FinanceSidebar;
