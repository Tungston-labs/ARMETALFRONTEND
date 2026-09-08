import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  font-family: "Satoshi", sans-serif;
  min-height: 100vh;
`;

export const PageWrapper = styled.div`
  margin-top: 16px;
`;

export const CardContainer = styled.div`
  display: flex;
  margin-bottom: 32px;
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 22px 24px;
  min-width: 260px;
  min-height: 120px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  border-left: 6px solid #3352BA;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);

  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 22px;
  color: #3352BA;
`;

export const CardTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
`;

export const CardValue = styled.h2`
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
`;

export const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 14px;
  font-size: 14px;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
`;

export const Tr = styled.tr`
  background: ${({ $lop }) => ($lop > 0 ? "#fff1f2" : "transparent")};

  &:hover {
    background: ${({ $lop }) => ($lop > 0 ? "#ffe4e6" : "#f9fafb")};
  }
`;



export const Td = styled.td`
  padding: 14px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
`;
export const LopTd = styled.td`
  padding: 14px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ $lop }) => ($lop > 0 ? "#dc2626" : "#111827")};
  border-bottom: 1px solid #e5e7eb;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: right;
  margin-bottom: 16px;
`;
export const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f7f8fa;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #e4e7ec;

  input {
    border: none;
    background: transparent;
    font-size: 14px;
    outline: none;
    cursor: pointer;
  }
`;

export const ReportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #3352BA;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #8ca0e2;
  }

  &:active {
    transform: scale(0.98);
  }
`;