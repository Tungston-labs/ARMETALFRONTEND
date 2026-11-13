import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  padding: 20px;
  background: #ffffff;
  font-family: "DM Sans", sans-serif;
  color: #111111;
  box-sizing: border-box;
`;

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin: 5px 0 7px;
`;

export const SectionDescription = styled.p`
  font-size: 13px;
  color: #333;
  margin: 0 0 20px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px 25px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #111;
`;

const fieldStyles = `
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  background: #fff;
  color: #777;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #3049a5;
  }

  &::placeholder {
    color: #858585;
  }

  &:disabled,
  &:read-only {
    background: #f5f5f5;
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const Select = styled.select`
  ${fieldStyles}
  cursor: pointer;
`;

export const PreviewBanner = styled.div`
  margin-top: 18px;
  padding: 11px 12px;
  background: #fff4e9;
  border: 1px solid #f0ddcb;
  border-radius: 5px;
  font-size: 13px;
  color: #111;
  line-height: 18px;

  strong {
    color: #3049a5;
    font-weight: 500;
  }
`;

export const ItemsSection = styled.div`
  margin-top: 22px;
`;

export const ItemsTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 15px;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const ItemsTable = styled.table`
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
  text-align: center;

  thead {
    background: #3049a5;
    color: #fff;
  }

  th {
    height: 40px;
    padding: 8px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }

  td {
    height: 65px;
    padding: 8px;
    font-size: 13px;
    color: #777;
  }

  tbody tr {
    border-bottom: 1px solid #f1f1f1;
  }
`;

export const ProductInput = styled.input`
  width: ${(props) => (props.$highlight ? "105px" : "80px")};
  max-width: 100%;
  height: 30px;
  padding: 0 5px;
  border: 1px solid #e5e5e5;
  background: #fff;
  text-align: center;
  font-family: inherit;
  font-size: 13px;
  color: ${(props) => (props.$highlight ? "red" : "#777")};
  font-weight: ${(props) => (props.$highlight ? "600" : "400")};
  box-sizing: border-box;
`;

export const SummaryArea = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
  align-items: start;
  margin-top: 15px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

export const AutoSendSection = styled.div`
  margin-top: 35px;

  h4 {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px;
  }

  > div {
    min-height: 36px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding: 5px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  span {
    font-size: 12px;
    color: #888;
  }

  @media (max-width: 800px) {
    margin-top: 0;
  }
`;

export const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 39px;
  height: 20px;
  flex-shrink: 0;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: #008b20;
  }

  &:checked + span::before {
    transform: translateX(19px);
  }
`;

export const ToggleSlider = styled.span`
  position: absolute;
  inset: 0;
  background: #bdbdbd;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.2s;

  &::before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    left: 2px;
    top: 2px;
    background: white;
    border-radius: 50%;
    transition: 0.2s;
  }
`;

export const SummaryDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 20px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  strong {
    font-weight: 600;
  }
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 13px 30px;
  margin-top: 2px;
  border-radius: 5px;
  background: #ff850b;
  color: white;
  font-size: 12px;
  font-weight: 600;

  strong {
    font-size: 13px;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    padding: 13px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 13px;
  margin-top: 16px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

export const CancelButton = styled.button`
  min-width: 112px;
  height: 41px;
  padding: 0 20px;
  border: 1px solid #3049a5;
  border-radius: 5px;
  background: white;
  color: #111;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #f4f6ff;
  }
`;

export const ApprovalButton = styled.button`
  min-width: 180px;
  height: 41px;
  padding: 0 18px;
  border: none;
  border-radius: 5px;
  background: #3049a5;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #253c91;
  }
`;