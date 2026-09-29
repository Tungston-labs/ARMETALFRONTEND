import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HeaderWrapper, Tabs, Tab } from "./VendorHeader.styles";

const tabs = [
  { label: "Overview", path: "overview" },
  { label: "Quotations", path: "quotations" },
  { label: "Orders", path: "purchase-orders" },
  { label: "Bills", path: "bills" },
  { label: "Payments", path: "payments" },
  { label: "Ledger", path: "ledger" },
  { label: "Debit Notes", path: "debit-notes" },
];

const VendorHeader = () => {
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

export default VendorHeader;