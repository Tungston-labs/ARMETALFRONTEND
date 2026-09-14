import React from "react";
import { Outlet } from "react-router-dom";

import CompanyHeader from "../../../../../Components/Finance/sales/customer/CompanyHeader";

import {
  LayoutWrapper,
  HeaderSection,
  ContentSection,
} from "./CompanyLayout.styles";

const CompanyLayout = () => {
  return (
    <LayoutWrapper>

      {/* SAME ON EVERY PAGE */}
      <HeaderSection>
        <CompanyHeader />
      </HeaderSection>

      {/* ONLY THIS CHANGES */}
      <ContentSection>
        <Outlet />
      </ContentSection>

    </LayoutWrapper>
  );
};

export default CompanyLayout;