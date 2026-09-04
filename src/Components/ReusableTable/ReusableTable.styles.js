import styled, { css } from "styled-components";

const colors = {
  primary: "#F78926",
  primaryHover: "#e87814",
  border: "#ECECEC",
  text: "#2D2D2D",
  secondaryText: "#7B7B7B",
  background: "#FFFFFF",
  hover: "#FFF8F1",
  success: "#16A34A",
  danger: "#EF4444",
  warning: "#F59E0B",
};

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: ${colors.background};
`;

/* =========================================================
   TABLE HEADER
========================================================= */

export const TableHeaderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: ${colors.background};
  border-radius: 5px 5px 0 0;
`;

/* =========================================================
   TABLE BODY
========================================================= */

export const TableBodyContainer = styled.div`
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: auto;

  border-radius: 0 0 5px 5px;
  background: ${colors.background};

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #d7d7d7 transparent;

  /* Chrome / Edge / Safari */
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d7d7d7;
    border-radius: 10px;
  }
`;

/* =========================================================
   TABLE
========================================================= */

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  min-width: 1200px;
`;

/* =========================================================
   HEADER
========================================================= */

export const Thead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Tbody = styled.tbody``;

/* =========================================================
   ROW
========================================================= */

export const Tr = styled.tr`
  transition: 0.3s;

  &:hover {
    background: ${colors.hover};
  }
`;

/* =========================================================
   HEADER CELL
========================================================= */

export const Th = styled.th`
  background: #f78926;
  color: white;

  padding: 14px;

  text-align: left;

  font-size: 14px;
  font-weight: 600;

  white-space: nowrap;

  position: sticky;
  top: 0;
  z-index: 10;

  &:first-child {
    border-radius: 5px 0 0 5px;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
  }
`;

/* =========================================================
   TABLE CELL
========================================================= */

export const Td = styled.td`
  padding: 10px 15px;

  border-bottom: 1px solid ${colors.border};

  white-space: nowrap;

  font-size: 14px;
  color: ${colors.text};

  font-weight: 400;

  overflow: hidden;
  text-overflow: ellipsis;
`;

/* =========================================================
   EMPTY STATE
========================================================= */

export const EmptyState = styled.div`
  width: 100%;
  text-align: center;
  padding: 50px;
  color: #888;
`;

/* =========================================================
   EMPLOYEE
========================================================= */

export const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EmployeeName = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.text};
`;

export const EmployeeEmail = styled.div`
  font-size: 12px;
  color: ${colors.secondaryText};
  margin-top: 3px;
`;

/* =========================================================
   STATUS
========================================================= */

export const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 80px;

  padding: 6px 12px;

  border-radius: 20px;

  font-size: 12px;
  font-weight: 600;

  white-space: nowrap;

  ${({ $status }) =>
    $status === "Present" &&
    css`
      color: #15803d;
      background: #dcfce7;
    `}

  ${({ $status }) =>
    $status === "Absent" &&
    css`
      color: #dc2626;
      background: #fee2e2;
    `}

  ${({ $status }) =>
    $status === "On Leave" &&
    css`
      color: #d97706;
      background: #fef3c7;
    `}

  ${({ $status }) =>
    $status === "Half Day" &&
    css`
      color: #2563eb;
      background: #dbeafe;
    `}

  ${({ $status }) =>
    $status === "N/A" &&
    css`
      color: #6b7280;
      background: #f3f4f6;
    `}
`;

/* =========================================================
   ACTIONS
========================================================= */

export const ActionWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export const IconButton = styled.button`
  width: 34px;
  height: 34px;

  border-radius: 8px;
  border: 1px solid ${colors.border};

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.25s;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    font-size: 15px;
  }
`;

export const LoadingState = styled.div`
  min-height: 180px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
`;

export const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #6b7280;

  font-size: 14px;
  font-weight: 500;
`;