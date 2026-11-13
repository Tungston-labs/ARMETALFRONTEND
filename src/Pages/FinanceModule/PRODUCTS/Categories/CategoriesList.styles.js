import styled from "styled-components";

const STATUS_COLORS = {
  active: {
    color: "#059669",
    background: "#ecfdf5",
    border: "#a7f3d0",
  },
  inactive: {
    color: "#dc2626",
    background: "#fef2f2",
    border: "#fecaca",
  },
};

const getColors = (status) =>
  STATUS_COLORS[String(status || "").toLowerCase()] || {
    color: "#6b7280",
    background: "#f3f4f6",
    border: "#e5e7eb",
  };

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 3px 10px;

  border-radius: 999px;
  border: 1px solid ${({ $status }) => getColors($status).border};

  background: ${({ $status }) => getColors($status).background};
  color: ${({ $status }) => getColors($status).color};

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $status }) => getColors($status).color};
  }
`;