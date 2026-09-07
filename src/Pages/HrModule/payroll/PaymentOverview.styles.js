import styled from 'styled-components';

export const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 2rem 0 1rem;
`;

export const PlanCard = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #1e3a8a;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  width: 40%;
  height: 75px;
`;

export const PlanIcon = styled.div`
  width: 30px;
  height: 30px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const PlanDetails = styled.div`
  flex-grow: 1;
  font-size: 0.9rem;
  padding: 10px;

  h3 {
    font-size: 1rem;
    margin: 0;
  }

  p {
    margin: 0;
    line-height: 1.2;
  }
`;

export const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

export const PaymentTable = styled.table`
  width: 90%;
  border-collapse: collapse;

`;

export const TableHead = styled.th`
  border: 1px solid #ccc;
  padding: 0.6rem;
  text-align: center;
  background-color: #FBFFF9;
`;

export const TableRow = styled.tr`
  background-color: ${({ status }) =>
    status === 'Un-Paid' ? '#FFEBEB' : '#FBFFF9'};
  transition: background-color 0.3s ease;
`;

export const TableData = styled.td`
  border: 1px solid #ccc;
  padding: 0.6rem;
  text-align: center;
`;

export const StatusSelect = styled.select`
  padding: 0.3rem;
  border-radius: 4px;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 0 0.3rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const SaveButton = styled.button`
  background: #6b7280;
  color: white;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 5px;
`;

export const CancelButton = styled.button`
  background: #f87171;
  color: white;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 5px;
`;
