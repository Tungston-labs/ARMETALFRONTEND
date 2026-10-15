import styled from "styled-components";

/* =========================================================
   BREAKPOINTS
   desktop  : > 1200px  -> 4 column form, full table
   laptop   : <= 1200px -> 2 column form
   tablet   : <= 900px  -> tighter padding
   mobile   : <= 700px  -> 1 column form, table rows become cards
   small    : <= 480px  -> buttons stack / stretch
========================================================= */

/* =========================================================
   PAGE
========================================================= */

export const PageContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: #f4f7fd;
  font-family: "Poppins", sans-serif;
  overflow-x: hidden;
`;

/* =========================================================
   HEADER
========================================================= */

export const Header = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: block;
  background: #f4f7fd;
  padding: 20px;

  @media (max-width: 900px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: #3049a3;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  font-size: 11px;
`;

export const BreadcrumbItem = styled.span`
  color: ${({ active }) => (active ? "#3049a3" : "#111111")};
  font-weight: ${({ active }) => (active ? 500 : 400)};
`;

export const BreadcrumbSeparator = styled.span`
  color: #555555;
  font-size: 16px;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const UserAvatar = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const UserName = styled.span`
  color: #111111;
  font-size: 11px;
  font-weight: 600;
`;

export const UserRole = styled.span`
  color: #111111;
  font-size: 9px;
`;

/* =========================================================
   FORM
========================================================= */

export const FormContainer = styled.div`
  width: 100%;
  padding: 40px 42px;
  box-sizing: border-box;
  background: #ffffff;

  @media (max-width: 900px) {
    padding: 28px 24px;
  }

  @media (max-width: 480px) {
    padding: 20px 14px;
  }
`;

export const FormGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns:
    minmax(0, 215px)
    minmax(0, 215px)
    minmax(0, 215px)
    minmax(0, 1fr);
  gap: 22px;

  /* laptop: 2 columns, description takes the full last row */
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    & > *:last-child {
      grid-column: 1 / -1;
    }
  }

  /* mobile: 1 column */
  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

export const FormGroup = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 7px;
  color: #111111;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  text-transform: uppercase;

  @media (max-width: 700px) {
    font-size: 12px;
  }
`;

export const Required = styled.span`
  color: #ef4444;
  margin-left: 2px;
`;

export const Input = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 11px;
  box-sizing: border-box;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  outline: none;
  background: #ffffff;
  color: #555555;
  font-family: "Poppins", sans-serif;
  font-size: 12px;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: #3049a3;
  }

  &:disabled {
    background: #f4f4f4;
    color: #8a8a8a;
    cursor: not-allowed;
  }

  /* 16px stops iOS from zooming the page when an input is focused */
  @media (max-width: 700px) {
    height: 40px;
    font-size: 16px;
  }
`;

export const DateInputWrapper = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #111111;
    pointer-events: none;
  }
`;

export const DateInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 34px 0 11px;
  box-sizing: border-box;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  outline: none;
  background: #ffffff;
  color: #777777;
  font-family: "Poppins", sans-serif;
  font-size: 10px;

  &:focus {
    border-color: #3049a3;
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
  }

  @media (max-width: 700px) {
    height: 40px;
    font-size: 16px;
  }
`;

/* =========================================================
   ACCOUNT LINES HEADER
========================================================= */

export const AccountLinesHeader = styled.div`
  width: 100%;
  margin-top: 25px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

export const AccountLinesTitle = styled.h3`
  margin: 0;
  color: #111111;
  font-size: 12px;
  font-weight: 500;
`;

export const AddLineButton = styled.button`
  min-width: 100px;
  height: 35px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  background: #f7890b;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #e97800;
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 700px) {
    height: 40px;
    font-size: 12px;
  }
`;

/* =========================================================
   JOURNAL TABLE
   - desktop / tablet : normal table (scrolls sideways if too narrow)
   - mobile           : every row becomes a card (uses data-label on <td>)
========================================================= */

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #eeeeee;
  border-radius: 2px;

  @media (max-width: 700px) {
    overflow-x: visible;
    border: none;
  }
`;

export const JournalLinesTable = styled.table`
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  table-layout: fixed;
  font-family: "Poppins", sans-serif;

  thead {
    background: #3049a3;
  }

  th {
    height: 36px;
    padding: 0 29px;
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
  }

  td {
    height: 47px;
    padding: 5px 29px;
    border-bottom: 1px solid #eeeeee;
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 25%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 37%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 15%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 15%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 8%;
    padding-left: 0;
    padding-right: 20px;
    text-align: center;
  }

  /* tablet: tighter cells */
  @media (max-width: 900px) {
    th,
    td {
      padding-left: 14px;
      padding-right: 14px;
    }

    th:nth-child(5),
    td:nth-child(5) {
      padding-left: 0;
      padding-right: 10px;
    }
  }

  /* mobile: card layout */
  @media (max-width: 700px) {
    min-width: 0;
    table-layout: auto;

    thead {
      display: none;
    }

    tbody,
    tr,
    td {
      display: block;
      box-sizing: border-box;
    }

    tbody tr {
      position: relative;
      margin-bottom: 12px;
      padding: 12px 14px;
      border: 1px solid #e5e8ee;
      border-radius: 8px;
      background: #ffffff;
    }

    td,
    tbody tr:last-child td {
      height: auto;
      padding: 6px 0;
      border: none;
    }

    td:nth-child(n) {
      width: 100%;
    }

    td::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 4px;
      color: #3049a3;
      font-size: 11px;
      font-weight: 600;
    }

    /* leave room for the delete button */
    td:nth-child(1) {
      padding-right: 40px;
    }

    /* delete button sits in the card's top-right corner */
    td:nth-child(5) {
      position: absolute;
      top: 10px;
      right: 10px;
      width: auto;
      padding: 0;
    }

    td:nth-child(5)::before {
      content: none;
    }
  }
`;

/* =========================================================
   ACCOUNT SELECT
========================================================= */

export const AccountSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const AccountSelect = styled.select`
  width: 100%;
  height: 34px;
  padding: 0 28px 0 10px;
  appearance: none;
  border: 1px solid #e2e5e9;
  border-radius: 2px;
  outline: none;
  background: #ffffff;
  color: #777777;
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  cursor: pointer;

  &:focus {
    border-color: #3049a3;
  }

  @media (max-width: 700px) {
    height: 40px;
    font-size: 16px;
    border-radius: 4px;
  }
`;

export const SelectArrow = styled.div`
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  color: #111111;
  pointer-events: none;

  svg {
    width: 12px;
    height: 12px;
  }
`;

/* =========================================================
   LINE INPUTS
========================================================= */

export const LineInput = styled.input`
  width: 100%;
  height: 34px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #e2e5e9;
  border-radius: 2px;
  outline: none;
  color: #777777;
  font-family: "Poppins", sans-serif;
  font-size: 10px;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: #3049a3;
  }

  @media (max-width: 700px) {
    height: 40px;
    font-size: 16px;
    border-radius: 4px;
  }
`;

export const AmountInput = styled.input`
  width: 100%;
  /* max-width: 110px; */
  height: 34px;
  padding: 0 8px;
  box-sizing: border-box;
  border: 1px solid #e2e5e9;
  border-radius: 2px;
  outline: none;
  color: #777777;
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  /* text-align: right; */

  &:focus {
    border-color: #3049a3;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }

  appearance: textfield;

  @media (max-width: 700px) {
    max-width: none;
    height: 40px;
    font-size: 16px;
    border-radius: 4px;
  }
`;

/* =========================================================
   DELETE
========================================================= */

export const DeleteButton = styled.button`
  width: 25px;
  height: 25px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ff3b30;
  border-radius: 50%;
  background: #ffffff;
  color: #ff3b30;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fff1f0;
  }

  svg {
    width: 13px;
    height: 13px;
  }

  @media (max-width: 700px) {
    width: 30px;
    height: 30px;
    margin: 0;
  }
`;

/* =========================================================
   TOTALS
========================================================= */

export const TotalsBar = styled.div`
  width: 100%;
  min-height: 42px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background: #e4f7e9;

  @media (max-width: 900px) {
    padding: 10px 16px;
    row-gap: 6px;
  }

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`;

export const TotalItem = styled.div`
  display: flex;
  align-items: center;
`;

export const TotalDivider = styled.div`
  width: 1px;
  height: 17px;
  margin: 0 16px;
  background: #222222;

  @media (max-width: 700px) {
    display: none;
  }
`;

export const TotalLabel = styled.span`
  color: #111111;
  font-weight: 500;
font-family: "Poppins",sans-serif;
font-weight: 500;
font-style: Medium;
font-size: 12px;
line-height: 100%;
letter-spacing: 0%;

  @media (max-width: 700px) {
    font-size: 12px;
  }
`;

export const BalancedText = styled.span`
  margin-left: auto;
  color: ${({ $balanced }) => ($balanced ? "#188b37" : "#dc2626")};
font-family: "Poppins",sans-serif;
font-weight: 700;
font-style: Bold;
font-size: 12px;
line-height: 100%;
letter-spacing: 0%;

  @media (max-width: 700px) {
    margin-left: 0;
    font-size: 12px;
  }
`;

/* =========================================================
   FOOTER BUTTONS
========================================================= */

export const FooterButtons = styled.div`
  width: 100%;
  margin-top: 17px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;

  /* small phones: buttons share the row equally */
  @media (max-width: 480px) {
    gap: 8px;

    button {
      flex: 1 1 0;
      width: auto;
      min-width: 0;
    }
  }
`;

export const CancelButton = styled.button`
  width: 99px;
  height: 36px;
  border: 1px solid #3049a3;
  border-radius: 4px;
  background: #ffffff;
  color: #111111;
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f5f7ff;
  }

  @media (max-width: 700px) {
    height: 40px;
    font-size: 12px;
  }
`;

export const SaveDraftButton = styled.button`
  width: 99px;
  height: 36px;
  border: 1px solid #3049a3;
  border-radius: 4px;
  background: #ffffff;
  color: #111111;
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f5f7ff;
  }

  @media (max-width: 700px) {
    height: 40px;
    font-size: 12px;
  }
`;

export const PostButton = styled.button`
  width: 98px;
  height: 36px;
  border: 1px solid #3049a3;
  border-radius: 4px;
  background: #3049a3;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #263d8d;
  }

  @media (max-width: 700px) {
    height: 40px;
    font-size: 12px;
  }
`;