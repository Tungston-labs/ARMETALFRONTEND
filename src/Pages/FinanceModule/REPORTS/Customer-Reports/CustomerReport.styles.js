import styled from "styled-components";

export const MainReportLayout = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(320px, 1fr);

    gap: 16px;

    margin-top: 16px;

    align-items: stretch;

    /* Tablet and below: stack table and side panel */
    @media (max-width: 1350px) {
        grid-template-columns: minmax(0, 1fr);
    }

    /* Mobile: tighter spacing */
    @media (max-width: 600px) {
        gap: 12px;
        margin-top: 12px;
    }
`;

export const TableSide = styled.div`
    min-width: 0;

    display: flex;
    flex-direction: column;
`;
export const ExportButton = styled.button`
  height: 38px;
  padding: 0 15px;
  border: 1px solid #dfe3ea;
  border-radius: 5px;
  background: #fff;
  font-family: "Poppins", sans-serif;
font-weight: 500;
font-style: Medium;
font-size: 13px;
line-height: 18px;
letter-spacing: 0px;
text-align: center;
text-transform: uppercase;
  cursor: pointer;
`;