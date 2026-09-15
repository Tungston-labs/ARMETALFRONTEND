import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HeaderWrapper, Tabs, Tab } from "./CompanyHeader.styles";

const tabs = [
  { label: "Overview", path: "overview" },
  { label: "Quotations", path: "quotations" },
  { label: "Orders", path: "orders" },
  { label: "Invoices", path: "invoices" },
  { label: "Payments", path: "payments" },
  { label: "Ledger", path: "ledger" },
  { label: "Credit Notes", path: "credit-notes" },
];

const CompanyHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (path) => navigate(path);
  const isActiveTab = (path) => location.pathname.endsWith(`/${path}`);

  return (
    <HeaderWrapper>
      <Tabs>
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            $active={isActiveTab(tab.path)}
            onClick={() => handleTabClick(tab.path)}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>
    </HeaderWrapper>
  );
};

export default CompanyHeader;