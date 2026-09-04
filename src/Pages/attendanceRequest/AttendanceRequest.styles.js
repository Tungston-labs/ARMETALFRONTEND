import styled from "styled-components";

export const Container = styled.div`
  padding: 30px;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:nth-child(even) td {
    background: #e6ecff;
  }
`;

export const Th = styled.th`
  padding: 15px;
  text-align: left;
  background-color: #304eb0;
  color: white;
`;

export const Td = styled.td`
  padding: 15px;
`;

export const Status = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  color: #fff;
  background: ${({ status }) => {
    if (status === "Approved") return "#22c55e";
    if (status === "Rejected") return "#ef4444";
    return "#f59e0b";
  }};
`;

export const ActionButton = styled.button`
  margin-right: 10px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  background: ${({ approve, reject }) =>
    approve ? "#22c55e" : reject ? "#ef4444" : "#2563eb"};
`;