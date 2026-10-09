import styled from "styled-components";

export const MainReportLayout = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: minmax(0, 1.70fr) minmax(400px, 1fr);

    gap: 16px;

    margin-top: 16px;

    align-items: stretch;
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