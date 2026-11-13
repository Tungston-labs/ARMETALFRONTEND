import styled from "styled-components";

export const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 280px;
  height: 38px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  box-sizing: border-box;
`;

export const DateInput = styled.input`
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #374151;
  font-size: 13px;
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

export const DateSeparator = styled.span`
  flex-shrink: 0;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
`;

export const ExportButton = styled.button`
  height: 38px;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    border-color: #f78926;
    color: #f78926;
    background: #fff8f2;
  }
  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 900px) {
    min-width: 38px;
    width: 38px;
    padding: 0;
    span {
      display: none;
    }
  }
`;

export const CompactTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    min-width: 100% !important;
  }

  th,
  td {
    padding-left: 8px;
    padding-right: 8px;
    font-size: 13px;
  }
`;

const deliveryStatusColors = {
  draft: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  pending: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  in_transit: { bg: "#faf5ff", color: "#9333ea", border: "#e9d5ff" },
  dispatched: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  delivered: { bg: "#ecfdf5", color: "#16a34a", border: "#a7f3d0" },
  partially_delivered: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  cancelled: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

export const getDeliveryStatusColor = (status) => {
  const key = String(status || "draft").toLowerCase().replace(/[\s-]/g, "_");
  if (key === "partial") return deliveryStatusColors.partially_delivered;
  if (key === "transit") return deliveryStatusColors.in_transit;
  if (key === "canceled") return deliveryStatusColors.cancelled;
  return deliveryStatusColors[key] || deliveryStatusColors.draft;
};

export const InlineStatusSelect = styled.select`
  height: 28px;
  padding: 0 8px;
  border: 1px solid ${({ $status }) => getDeliveryStatusColor($status).border};
  border-radius: 999px;
  outline: none;
  background: ${({ $status }) => getDeliveryStatusColor($status).bg};
  color: ${({ $status }) => getDeliveryStatusColor($status).color};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:focus {
    border-color: #f78926;
  }
`;
