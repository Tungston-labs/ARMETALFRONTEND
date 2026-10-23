import styled from 'styled-components';

export const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 2rem 0 1rem;
`;

export const PlanCard = styled.div`
  display: flex;
  align-items: center;   /* ensures vertical alignment */
  justify-content: space-between; /* keeps price on right */
  border: 2px solid #1e3a8a;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  width: 40%;
  height: auto;
  gap: 1rem;  
  
`;

export const PlanIconWrapper = styled.div`
  background: #182657;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 10px;
  flex-shrink: 0; /* prevent shrinking */
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
  h3 {
    font-size: 1rem;
    margin: 0 0 4px 0;
    font-family: Satoshi;
font-weight: 700;
font-style: Bold;
font-size: 1.4rem;
line-height: 100%;
letter-spacing: 0%;
color:#3352BA;
  }

  p {
    margin: 0;
    line-height: 1.4;
    font-family: Satoshi;
font-weight: 400;
font-style: Regular;
font-size: 0.9rem;
line-height: 100%;
letter-spacing: 0%;
color:#3352BA;
  }
`;

export const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  white-space: nowrap; /* prevent wrapping */
`;


export const PaymentTable = styled.table`
  width: 100%;
  table-layout: fixed; /* Ensures uniform column width */
  border-collapse: collapse;
  text-align: center;
`;



export const TableHead = styled.th`
  border: 1px solid #ccc;
  padding: 0.6rem;
  text-align: center;
  // background-color: #FBFFF9;
`;

export const TableRow = styled.tr`
  background-color: ${({ status }) =>
    status === 'Un-Paid' ? '#FFEBEB' : '#FBFFF9'};
  transition: background-color 0.3s ease;
  table-layout: fixed;
`;


export const TableData = styled.td`
  border: 1px solid #ccc;
  padding: 0.6rem;
  text-align: center;
  background-color: white;
`;

export const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
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


export const ScrollableTbody = styled.tbody`
  display: block;
  max-height: 250px; /* Approx height for 5 rows, adjust as needed */
  overflow-y: auto;
  width: 100%;
`;
export const ScrollWrapper = styled.div`
  max-height: 300px;         /* Limits visible rows to ~5 */
  overflow-y: auto;
  width: 100%;
  margin: 0 auto;            /* Center horizontally */
  border: 1px solid #ccc;
  border-radius: 8px;
`;



export const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${({ $type }) => ($type === "error" ? "#fcebeb" : "#eaf3de")};
  color: ${({ $type }) => ($type === "error" ? "#a32d2d" : "#3b6d11")};
  border: 1px solid ${({ $type }) => ($type === "error" ? "#f5b8b8" : "#bfe3a0")};
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  animation: toastIn 0.2s ease-out;

  @keyframes toastIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SpinningIcon = styled.svg`
  font-size: 18px;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;