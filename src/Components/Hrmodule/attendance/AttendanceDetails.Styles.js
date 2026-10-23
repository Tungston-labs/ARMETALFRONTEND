import styled from "styled-components";
export const AttendanceLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
export const PageWrapper = styled.div`
  margin-top: 20px;
padding: 20px;
`;

export const Header = styled.h3`
  margin-bottom: 10px;
`;

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0.08,0.08,0,0.08);
`;

export const CardTitle = styled.p`
  color: gray;
  margin-bottom: 10px;
`;

export const CardValue = styled.h3`
  font-weight: 600;
`;

export const HistoryTable = styled.div`
  background: white;
  border-radius: 12px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f1f3f6;
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
`;

export const Tr = styled.tr`
  &:hover {
    background: #fafafa;
  }
`;

export const CalendarWrapper = styled.div`
  background: white;
  border-radius: 12px;

  .react-calendar {
    width: 100%;
    border: none;
  }
`;
export const TableScrollWrapper = styled.div`
  max-height: 350px;
  overflow-y: auto;
  

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
`;