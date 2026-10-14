import React from "react";

import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiList,
  FiXCircle,
} from "react-icons/fi";

import {
  StatCard,
  StatIcon,
  StatContent,
  StatValue,
  StatLabel,
} from "./JournalEntry.style";

const JournalEntriesStats = () => {
  const stats = [
    {
      value: "1,842",
      label: "Total Entries",
      icon: <FiFileText />,
      background: "#e8f8ef",
      color: "#189447",
    },
    {
      value: "1,798",
      label: "Auto-Posted",
      icon: <FiList />,
      background: "#f1e9ff",
      color: "#934cff",
    },
    {
      value: "44",
      label: "Manual Entries",
      icon: <FiCheckCircle />,
      background: "#e8f8ef",
      color: "#189447",
    },
    {
      value: "03",
      label: "Drafts (Unposted)",
      icon: <FiClock />,
      background: "#fff2df",
      color: "#ff8500",
    },
    {
      value: "02",
      label: "Voided",
      icon: <FiXCircle />,
      background: "#ffe9e9",
      color: "#ff3030",
    },
  ];

  return (
    <>
      {stats.map((item) => (
        <StatCard key={item.label}>
          <StatIcon $background={item.background} $color={item.color}>
            {item.icon}
          </StatIcon>

          <StatContent>
            <StatValue>{item.value}</StatValue>

            <StatLabel>{item.label}</StatLabel>
          </StatContent>
        </StatCard>
      ))}
    </>
  );
};

export default JournalEntriesStats;
