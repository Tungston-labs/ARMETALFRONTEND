import React from "react";
import {
  NotiWrapper,
  NotiBox,
  Title,
  Sub,
} from "./ProgressModal.Styles";

const steps = [
  {
    key: "on_hold",
    title: "On-Hold",
    sub: "Project is waiting for approval",
    color: "#f4c542",
    bg: "rgba(244, 197, 66, 0.15)", 
  },
  {
    key: "in_progress",
    title: "Pending",
    sub: "Project is currently in progress",
    color: "#5a66ff",
    bg: "rgba(90, 102, 255, 0.15)",
  },
  {
    key: "completed",
    title: "Completed",
    sub: "Project has been successfully completed",
    color: "#2ecc71",
    bg: "rgba(46, 204, 113, 0.15)",
  },
];

const ProgressModal = ({ isOpen, status }) => {
  if (!isOpen || !status) return null;


  const step = steps.find((s) => s.key === status) || steps[0];

  return (
    <NotiWrapper>
      <NotiBox
        style={{
          borderLeft: `4px solid ${step.color}`,
          background: step.bg,
        }}
      >
        <Title>{step.title}</Title>
        <Sub>{step.sub}</Sub>
      </NotiBox>
    </NotiWrapper>
  );
};

export default ProgressModal;
