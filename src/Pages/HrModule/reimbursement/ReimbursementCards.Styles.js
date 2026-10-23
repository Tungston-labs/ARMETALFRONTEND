import styled from "styled-components";

/* =====================================================
   MAIN CONTAINER
===================================================== */

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  padding: 20px;

  box-sizing: border-box;

  background: #f5f6fa;

  @media (max-width: 650px) {
    padding: 15px;
  }
`;

/* =====================================================
   HEADER
===================================================== */

export const HeaderWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

/* =====================================================
   CARDS GRID
===================================================== */

export const CardsGrid = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 20px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;

    gap: 15px;
  }
`;

/* =====================================================
   CARD
===================================================== */

export const Card = styled.div`
  width: 100%;

  min-width: 0;

  min-height: 180px;

  padding: 20px 18px;

  box-sizing: border-box;

  background: #ffffff;

  border-radius: 14px;

  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.08);

  font-family: "Poppins", sans-serif;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;

  &:hover {
    transform: translateY(-3px);

    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 650px) {
    padding: 18px 16px;
  }
`;

/* =====================================================
   CARD HEADER
===================================================== */

export const CardHeader = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 10px;
`;

/* =====================================================
   REIMBURSEMENT NAME
===================================================== */

export const ReimbursementName = styled.h3`
  margin: 0;

  color: #202020;

  line-height: 1.3;

  font-family: "Poppins", sans-serif;

  font-weight: 600;

  font-size: 14px;

  line-height: 18px;

  letter-spacing: 0;

  text-transform: uppercase;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;
`;

/* =====================================================
   STATUS BADGE
===================================================== */

export const StatusBadge = styled.span`
  flex-shrink: 0;

  padding: 5px 9px;

  border-radius: 20px;

  font-family: "Poppins", sans-serif;

  font-weight: 400;

  font-size: 10px;

  line-height: 100%;

  letter-spacing: 0;

  background: ${({ status }) =>
    status === "Approved"
      ? "#e9f8ed"
      : "#fff4e9"};

  color: ${({ status }) =>
    status === "Approved"
      ? "#16a34a"
      : "#f47c20"};
`;

/* =====================================================
   EMPLOYEE NAME
===================================================== */

export const EmployeeName = styled.div`
  margin-bottom: 12px;

  color: #3154d8;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  font-family: "Poppins", sans-serif;

  font-weight: 600;

  font-size: 14px;

  line-height: 14px;

  letter-spacing: 0;

  strong {
    font-weight: 600;
  }
`;

/* =====================================================
   TOTAL AMOUNT
===================================================== */

export const TotalAmount = styled.div`
  display: inline-block;

  margin-bottom: 10px;

  padding: 10px;

  background: #fff4e9;

  color: #f47c20;

  border-radius: 4px;

  white-space: nowrap;

  font-family: "Poppins", sans-serif;

  font-weight: 400;

  font-size: 10px;

  line-height: 100%;

  letter-spacing: 0;
`;

/* =====================================================
   STATUS ROW
===================================================== */

export const StatusRow = styled.div`
  display: flex;

  align-items: center;

  gap: 6px;

  margin-bottom: 15px;

  width: 100%;

  overflow: hidden;

  @media (max-width: 400px) {
    flex-direction: column;

    align-items: flex-start;
  }
`;

/* =====================================================
   APPROVED
===================================================== */

export const ApprovedAmount = styled.span`
  display: inline-block;

  padding: 10px;

  background: #e9f8ed;

  color: #16a34a;

  border-radius: 4px;

  white-space: nowrap;

  flex-shrink: 0;

  font-family: "Poppins", sans-serif;

  font-weight: 400;

  font-size: 10px;

  line-height: 100%;

  letter-spacing: 0;
`;

/* =====================================================
   PENDING
===================================================== */

export const PendingAmount = styled.span`
  display: inline-block;

  padding: 10px;

  background: #ffe9e7;

  color: #ff3b30;

  border-radius: 4px;

  white-space: nowrap;

  flex-shrink: 0;

  font-family: "Poppins", sans-serif;

  font-weight: 400;

  font-size: 10px;

  line-height: 100%;

  letter-spacing: 0;
`;

/* =====================================================
   CARD BOTTOM
===================================================== */

export const CardBottom = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-top: 3px;
`;

/* =====================================================
   EMPLOYEE COUNT
===================================================== */

export const EmployeeCount = styled.div`
  display: flex;

  align-items: center;

  flex-shrink: 0;
`;

/* =====================================================
   EMPLOYEE IMAGE
===================================================== */

export const EmployeeImage = styled.img`
  width: 30px;

  height: 30px;

  object-fit: cover;

  border-radius: 50%;

  border: 2px solid #ffffff;

  box-sizing: border-box;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px) scale(1.08);

    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);

    position: relative;

    z-index: 5;
  }
`;

/* =====================================================
   REIMBURSEMENT NUMBER
===================================================== */

export const ReimbursementNumber = styled.span`
  width: 30px;

  height: 30px;

  margin-left: -5px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #ff8628;

  color: #ffffff;

  border-radius: 50%;

  border: 2px solid #ffffff;

  box-sizing: border-box;

  font-family: "Poppins", sans-serif;

  font-size: 10px;

  font-weight: 600;

  position: relative;

  z-index: 2;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px) scale(1.08);

    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);

    z-index: 10;
  }
`;

/* =====================================================
   VIEW BUTTON
===================================================== */

export const ViewButton = styled.button`
  padding: 8px;

  background: #ffffff;

  color: #222222;

  border: 1px solid #ff6b00;

  border-radius: 5px;

  font-family: "Poppins", sans-serif;

  font-weight: 500;

  font-size: 11px;

  text-align: center;

  text-transform: uppercase;

  white-space: nowrap;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #ff6b00;

    color: #ffffff;
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 480px) {
    padding: 7px 8px;

    font-size: 9px;
  }
`;
/* =====================================================
   EMPTY STATE
===================================================== */

export const EmptyState = styled.div`
  width: 100%;
  min-height: 280px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;

  box-sizing: border-box;

  background: #ffffff;

  border-radius: 14px;

  border: 1px solid #eeeeee;

  text-align: center;

  font-family: "Poppins", sans-serif;

  grid-column: 1 / -1;
`;

export const EmptyStateIcon = styled.div`
  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 16px;

  border-radius: 50%;

  background: #fff4e9;

  color: #ff8628;

  font-size: 26px;
`;

export const EmptyStateTitle = styled.h3`
  margin: 0 0 6px;

  color: #222222;

  font-size: 16px;

  font-weight: 600;
`;

export const EmptyStateText = styled.p`
  margin: 0;

  max-width: 400px;

  color: #8a8a8a;

  font-size: 12px;

  font-weight: 400;

  line-height: 1.6;
`;