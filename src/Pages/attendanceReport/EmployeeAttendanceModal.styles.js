import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 16px;
`;

export const ModalContainer = styled.div`
  background: #ffffff;
  /* border-radius: 16px; */
  border: 0.5px solid #eeeeee;
  width: 100%;
  max-width: 50%;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

    @media print {
    max-width: 100%;
    max-height: none;
    overflow: visible;
    border:none;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px 16px;
  border-bottom: 0.5px solid #eeeeee;
`;

export const ModalTitle = styled.h2`
  margin: 0 0 2px;
  font-size: 17px;
  font-weight: 500;
  color: #1a1a1a;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 6px;
  line-height: 1;
  margin-top: 2px;

  &:hover {
    background: #f7f8fa;
    color: #1a1a1a;
  }

  @media print {
    display: none;
  }
`;

export const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 0.5px solid #eeeeee;
`;

const cardColors = {
  present: { bg: "#eaf3de", text: "#3b6d11" },
  absent:  { bg: "#fcebeb", text: "#a32d2d" },
  lop:     { bg: "#faeeda", text: "#854f0b" },
  default: { bg: "#f7f8fa", text: "#1a1a1a" },
};

export const Card = styled.div`
  background: ${({ type }) => cardColors[type]?.bg || cardColors.default.bg};
  border-radius: 10px;
  padding: 14px 12px;
  text-align: center;
`;

export const CardTitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

export const CardValue = styled.div`
  font-size: 26px;
  font-weight: 500;
  color: ${({ type }) => cardColors[type]?.text || cardColors.default.text};
`;

export const AttendanceTableWrapper = styled.div`
  overflow-y: auto;
  flex: 1;
`;

export const AttendanceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const TableHeader = styled.th`
  position: sticky;
  top: 0;
  background: #f7f8fa;
  border-bottom: 0.5px solid #eeeeee;
  padding: 10px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f7f8fa;
  }
  &:hover {
    background: #e6f1fb;
  }
`;

export const TableCell = styled.td`
  padding: 10px 16px;
  border-bottom: 0.5px solid #eeeeee;
  font-size: 14px;
  color: #1a1a1a;
`;

const badgeStyles = {
  present:  { bg: "#eaf3de", color: "#3b6d11" },
  half_day: { bg: "#faeeda", color: "#854f0b" },
  leave:    { bg: "#e6f1fb", color: "#185fa5" },
  holiday:  { bg: "#e1f5ee", color: "#0f6e56" },
  absent:   { bg: "#fcebeb", color: "#a32d2d" },
  off:      { bg: "#faeeda", color: "#a32d2d" },
};

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ status }) => badgeStyles[status]?.bg || badgeStyles.absent.bg};
  color: ${({ status }) => badgeStyles[status]?.color || badgeStyles.absent.color};
`;

export const PrintButton = styled.button`
  border: 1px solid lightgray;
  background: white;
  color: black;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f7f8fa;
  }

  @media print {
    display: none !important;
  }
`;