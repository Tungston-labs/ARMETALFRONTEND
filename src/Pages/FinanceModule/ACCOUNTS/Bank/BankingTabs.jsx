import React from "react";
import { BankingTabs as TabsContainer, BankingTab } from "./Banking.styles";

const TABS = [
  { label: "Bank Transaction", value: "transactions" },
  { label: "All Banks", value: "banks" },
  { label: "Loan Accounts", value: "loans" },
];

export default function BankingTabs({ activeTab, onChange }) {
  return (
    <TabsContainer role="tablist" aria-label="Banking sections">
      {TABS.map((tab) => (
        <BankingTab
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.value}
          $active={activeTab === tab.value} 
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </BankingTab>
      ))}
    </TabsContainer>
  );
}
