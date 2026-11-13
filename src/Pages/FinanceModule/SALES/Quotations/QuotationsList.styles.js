import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  background: #f5f6fa;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 14px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const HeaderActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ExportOutlineButton = styled.button`
  height: 38px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ffffff;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const GenerateQuoteButton = styled.button`
  height: 38px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #3857b9;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #2e49a5;
  }
`;

export const DateRangeGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 10px;
  background: #ffffff;
  border: 1px solid #dfe3ea;
  border-radius: 6px;
  font-size: 12px;
  color: #374151;

  input[type="date"] {
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 12px;
    color: #374151;
    width: 112px;
    cursor: pointer;
  }

  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }
`;

/* Compact KPI cards wrapper so currency totals don't truncate on laptop screens */
export const CompactStatsWrapper = styled.div`
  width: 100%;
  margin-bottom: 4px;

  & > div {
    gap: 12px;
  }

  & > div > div {
    padding: 14px 12px;
    gap: 10px;
  }

  & > div > div > div:last-child > div:first-child {
    font-size: clamp(13px, 1.15vw, 16px);
  }
`;

export const InlineStatusSelect = styled.select`
  height: 28px;
  padding: 0 6px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #ffffff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  color: ${({ $status }) => {
    const s = String($status || "").toLowerCase();
    if (s === "approved" || s === "converted") return "#16a34a";
    if (s === "pending") return "#f59e0b";
    if (s === "rejected") return "#ef4444";
    if (s === "sent" || s === "draft") return "#3b82f6";
    return "#6b7280";
  }};

  &:focus {
    border-color: #3857b9;
  }
`;

/* Compact table wrapper: eliminates horizontal scroll on laptop screens */
export const CompactTableWrapper = styled.div`
  width: 100%;
  max-width: 100%;

  table {
    min-width: 100% !important;
    table-layout: auto !important;
  }

  th {
    font-size: 12.5px !important;
    padding: 11px 8px !important;
  }

  td {
    font-size: 12.5px !important;
    padding: 10px 8px !important;
  }

  @media (max-width: 1320px) {
    th,
    td {
      font-size: 12px !important;
      padding: 9px 6px !important;
    }
  }
`;

export const StatusText = styled.span`
  font-size: 12.5px;
  font-weight: 500;
  text-transform: capitalize;
  color: ${({ $status }) => {
    const s = String($status || "").toLowerCase();
    if (s === "approved" || s === "converted") return "#16a34a";
    if (s === "pending") return "#f59e0b";
    if (s === "rejected") return "#ef4444";
    if (s === "sent" || s === "draft") return "#3b82f6";
    return "#6b7280";
  }};
`;

export const ActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;

export const ConvertSOButton = styled.button`
  height: 28px;
  padding: 0 10px;
  border: 1px solid #dfe3ea;
  background: #ffffff;
  color: #1f2937;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    border-color: #3857b9;
    color: #3857b9;
    background: #eff6ff;
  }
`;

export const SmallIconButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: ${({ $danger }) => ($danger ? "#ef4444" : "#374151")};
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  &:hover {
    border-color: ${({ $danger }) => ($danger ? "#ef4444" : "#3857b9")};
    background: ${({ $danger }) => ($danger ? "#fef2f2" : "#eff6ff")};
  }
`;
