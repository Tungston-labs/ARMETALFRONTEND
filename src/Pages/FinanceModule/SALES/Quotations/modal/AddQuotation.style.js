import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: rgba(15, 23, 42, 0.38);
  overflow: auto;
  font-family: "Poppins", sans-serif;
`;

export const ModalPage = styled.section`
  width: min(100%, 1600px);
  min-height: 100vh;
  margin: auto;
  background: #fff;
  color: #111;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.16);
`;

export const ModalHeader = styled.header`
  min-height: 78px;
  padding: 17px 3.3%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: #f3f6ff;
`;

export const HeaderTitle = styled.h1`
  margin: 0 0 3px;
  color: #3049a3;
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
`;

export const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
  color: #171717;
  strong {
    color: #3049a3;
    font-weight: 500;
  }
`;

export const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  strong,
  small {
    display: block;
  }
  strong {
    font-size: 11px;
    font-weight: 500;
  }
  small {
    margin-top: 3px;
    font-size: 9px;
  }
`;

export const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #d9dfeb;
  color: #3049a3;
  font-weight: 600;
`;

export const FormBody = styled.div`
  padding: 30px 3.7% 46px;
  @media (max-width: 700px) {
    padding: 22px 16px 30px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 12px;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.label`
  display: flex;
  min-width: 0;
  flex-direction: column;
`;

export const Label = styled.span`
  margin-bottom: 6px;
  color: #111;
  font-size: 10px;
  line-height: 14px;
  font-weight: 400;
`;

export const Required = styled.span`
  color: #ef4444;
`;

export const Input = styled.input`
  width: 100%;
  height: 35px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid #e4e6eb;
  border-radius: 4px;
  outline: none;
  background: #fff;
  color: #555;
  font:
    12px "Poppins",
    sans-serif;
  min-width: 0;
  &:focus {
    border-color: #3049a3;
  }
  &::placeholder {
    color: #858585;
    opacity: 1;
  }
  color-scheme: light;
`;

export const SelectWrap = styled.div`
  position: relative;
  width: 100%;
  svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    pointer-events: none;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 35px;
  appearance: none;
  box-sizing: border-box;
  padding: 0 35px 0 12px;
  border: 1px solid #e4e6eb;
  border-radius: 4px;
  outline: none;
  background: #fff;
  color: #555;
  font:
    12px "Poppins",
    sans-serif;
  &:focus {
    border-color: #3049a3;
  }
`;

export const ItemsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 19px 0 7px;
  h3 {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
  }
`;

export const AddItemButton = styled.button`
  height: 35px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  border-radius: 3px;
  background: #f48211;
  color: #fff;
  font:
    600 10px "Poppins",
    sans-serif;
  cursor: pointer;
  &:hover {
    background: #e87508;
  }
`;

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px dashed #d9dce3;
`;

export const ItemsTable = styled.table`
  width: 100%;
  min-width: 950px;
  border-collapse: collapse;
  table-layout: fixed;
  thead {
    background: #3049a3;
  }
  th {
    height: 34px;
    padding: 0 7px;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    font:
      600 10px "Poppins",
      sans-serif;
  }
  td {
    height: 48px;
    padding: 5px 7px;
    border-bottom: 1px solid #ededed;
    text-align: center;
    color: #333;
    font:
      10px "Poppins",
      sans-serif;
  }
  tr:last-child td {
    border-bottom: 0;
  }
  th:nth-child(1) {
    width: 7%;
  }
  th:nth-child(2) {
    width: 11%;
  }
  th:nth-child(3) {
    width: 19%;
  }
  th:nth-child(4) {
    width: 7%;
  }
  th:nth-child(5) {
    width: 9%;
  }
  th:nth-child(6) {
    width: 9%;
  }
  th:nth-child(7) {
    width: 8%;
  }
  th:nth-child(8) {
    width: 10%;
  }
  th:nth-child(9) {
    width: 11%;
  }
  th:nth-child(10) {
    width: 6%;
  }
  input {
    width: 100%;
    min-width: 0;
    height: 26px;
    box-sizing: border-box;
    padding: 0 5px;
    border: 1px solid #e7e7e7;
    border-radius: 0;
    outline: none;
    text-align: center;
    color: #555;
    background: #fff;
    font:
      10px "Poppins",
      sans-serif;
    &:focus {
      border-color: #3049a3;
    }
  }
  .serial {
    font-size: 10px;
  }
  .calculated {
    white-space: nowrap;
    font-size: 9px;
  }
`;

export const DeleteButton = styled.button`
  width: 24px;
  height: 24px;
  margin: auto;
  display: grid;
  place-items: center;
  border: 1px solid #ff3b30;
  border-radius: 50%;
  color: #ff3b30;
  background: #fff;
  cursor: pointer;
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  svg {
    width: 13px;
    height: 13px;
  }
`;

export const BottomSection = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(290px, 1fr);
  gap: 50px;
  margin-top: 20px;
  align-items: start;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }
`;

export const NotesBlock = styled.div`
  min-width: 0;
  h3 {
    margin: 12px 0 7px;
    font-size: 12px;
    font-weight: 500;
  }
  textarea {
    width: 100%;
    min-height: 42px;
    resize: vertical;
    box-sizing: border-box;
    padding: 8px 11px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    outline: none;
    color: #666;
    white-space: pre-wrap;
    font:
      9px/1.6 "Poppins",
      sans-serif;
  }
`;

export const Summary = styled.div`
  width: 100%;
  max-width: 360px;
  margin-left: auto;
`;

export const SummaryRow = styled.div`
  min-height: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #111;
  font:
    10px "Poppins",
    sans-serif;
  strong {
    font-weight: 600;
    white-space: nowrap;
  }
`;

export const DiscountInput = styled.input`
  width: 62px;
  height: 25px;
  box-sizing: border-box;
  padding: 0 5px;
  border: 1px solid #e5e5e5;
  text-align: right;
  color: #169b50;
  font:
    10px "Poppins",
    sans-serif;
`;

export const TotalBar = styled.div`
  height: 36px;
  margin-top: 8px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  background: #f48211;
  color: #fff;
  font:
    600 10px "Poppins",
    sans-serif;
`;

export const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 23px;
  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const LockNote = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #111;
  font:
    10px "Poppins",
    sans-serif;
  white-space: nowrap;
  svg {
    color: #9a873a;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 9px;
`;

export const OutlineButton = styled.button`
  min-width: 64px;
  height: 35px;
  padding: 0 11px;
  border: 1px solid #3049a3;
  border-radius: 4px;
  background: #fff;
  color: #111;
  font:
    500 10px "Poppins",
    sans-serif;
  cursor: pointer;
  &:hover {
    background: #f4f6ff;
  }
`;

export const PrimaryButton = styled.button`
  min-height: 35px;
  padding: 0 14px;
  border: 1px solid #3049a3;
  border-radius: 4px;
  background: #3049a3;
  color: #fff;
  font:
    600 10px "Poppins",
    sans-serif;
  cursor: pointer;
  &:hover {
    background: #263b88;
  }
`;

export const ErrorMessage = styled.div`
  margin-top: 12px;
  color: #b42318;
  font:
    11px "Poppins",
    sans-serif;
`;
