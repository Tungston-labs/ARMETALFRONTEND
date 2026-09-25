import styled from "styled-components";


/* =========================================================
   PAGE
========================================================= */

export const InvoicePage = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  padding: 30px 20px;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  font-family:
    Arial,
    Helvetica,
    sans-serif;
`;


/* =========================================================
   INVOICE CONTAINER
========================================================= */

export const InvoiceContainer = styled.div`
  width: 100%;
  max-width: 760px;
  min-height: 1050px;

  background: #ffffff;

  border: 1px solid #222;

  padding: 30px 34px;

  box-sizing: border-box;

  color: #222;

  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);

  position: relative;
`;


/* =========================================================
   HEADER
========================================================= */

export const InvoiceHeader = styled.div`
  display: grid;

  grid-template-columns:
    1fr
    1fr
    0.8fr;

  align-items: start;

  min-height: 85px;
`;


/* =========================================================
   COMPANY
========================================================= */

export const CompanySection = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const CompanyDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CompanyName = styled.div`
  font-size: 10px;
  font-weight: 600;

  color: #111;

  margin-bottom: 3px;
`;

export const CompanyAddress = styled.div`
  font-size: 8.5px;

  line-height: 1.45;

  color: #333;

  white-space: normal;
`;


/* =========================================================
   LOGO
========================================================= */

export const LogoSection = styled.div`
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 7px;

  padding-top: 5px;
`;

export const LogoIcon = styled.div`
  width: 42px;
  height: 42px;

  border-radius: 50%;

  border: 3px solid #222;

  display: flex;

  align-items: center;
  justify-content: center;

  position: relative;

  font-size: 16px;

  color: #f15a24;

  box-sizing: border-box;

  &::before {
    content: "";

    position: absolute;

    width: 14px;
    height: 14px;

    border-radius: 50%;

    border: 2px solid #222;

    top: 6px;
    left: 11px;
  }

  span {
    margin-top: 13px;
    font-size: 12px;
  }
`;

export const LogoText = styled.div`
  display: flex;

  flex-direction: column;

  line-height: 1;
`;

export const LogoMainText = styled.div`
  font-size: 18px;

  font-weight: 600;

  color: #f15a24;
`;

export const LogoSubText = styled.div`
  font-size: 18px;

  font-weight: 700;

  color: #222;

  margin-top: 3px;
`;


/* =========================================================
   QUOTE
========================================================= */

export const QuoteSection = styled.div`
  text-align: right;

  padding-top: 2px;
`;

export const QuoteLabel = styled.div`
  font-size: 17px;

  font-weight: 700;

  color: #111;

  line-height: 1.1;
`;

export const QuoteNumber = styled.div`
  font-size: 17px;

  font-weight: 700;

  color: #111;

  margin-top: 2px;
`;


/* =========================================================
   DIVIDER
========================================================= */

export const Divider = styled.div`
  width: 100%;

  height: 1px;

  background: #eeeeee;

  margin: 10px 0 0;
`;


/* =========================================================
   INFORMATION SECTION
========================================================= */

export const InformationSection = styled.div`
  display: grid;

  grid-template-columns:
    1fr
    1fr
    1fr;

  min-height: 100px;
`;

export const InfoColumn = styled.div`
  padding: 12px 14px 8px 0;

  border-right: 1px solid #f1f1f1;

  box-sizing: border-box;

  &:last-child {
    border-right: none;

    padding-left: 14px;
  }

  &:nth-child(2) {
    padding-left: 14px;
  }
`;

export const InfoLabel = styled.div`
  font-size: 8px;

  font-weight: 700;

  color: #111;

  margin-bottom: 7px;

  text-transform: capitalize;

  &:not(:first-child) {
    margin-top: 12px;
  }
`;

export const InfoValue = styled.div`
  font-size: 9px;

  line-height: 1.5;

  color: #333;

  font-weight: 400;
`;

export const PaymentStatus = styled.span`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  background: #f58220;

  color: #ffffff;

  font-size: 8px;

  padding: 3px 8px;

  line-height: 1;

  min-width: 38px;

  height: 17px;

  box-sizing: border-box;
`;


/* =========================================================
   TABLE
========================================================= */

export const TableWrapper = styled.div`
  width: 100%;

  overflow-x: auto;

  margin-top: 12px;
`;

export const InvoiceTable = styled.table`
  width: 100%;

  border-collapse: collapse;

  table-layout: fixed;

  font-size: 8px;
`;

export const TableHead = styled.thead`
  border-bottom: 1px solid #e5e5e5;
`;

export const TableHeaderCell = styled.th`
  padding: 9px 4px;

  text-align: ${(props) =>
    props.$left ? "left" : "center"};

  font-size: 7.5px;

  font-weight: 700;

  color: #222;

  white-space: nowrap;

  &:nth-child(1) {
    width: 8%;
  }

  &:nth-child(2) {
    width: 25%;
  }

  &:nth-child(3) {
    width: 8%;
  }

  &:nth-child(4) {
    width: 9%;
  }

  &:nth-child(5) {
    width: 13%;
  }

  &:nth-child(6) {
    width: 10%;
  }

  &:nth-child(7) {
    width: 12%;
  }

  &:nth-child(8) {
    width: 15%;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #f3f3f3;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 10px 4px;

  text-align: ${(props) =>
    props.$left ? "left" : "center"};

  font-size: 8px;

  color: #333;

  font-weight: 400;

  white-space: nowrap;
`;


/* =========================================================
   SUMMARY
========================================================= */

export const SummaryWrapper = styled.div`
  display: flex;

  justify-content: flex-end;

  margin-top: 12px;

  min-height: 170px;
`;

export const SummarySection = styled.div`
  width: 185px;

  display: flex;

  flex-direction: column;
`;

export const SummaryRow = styled.div`
  display: grid;

  grid-template-columns: 1fr auto;

  align-items: center;

  min-height: 29px;
`;

export const SummaryLabel = styled.span`
  font-size: 8px;

  color: #222;

  font-weight: 500;
`;

export const SummaryValue = styled.span`
  font-size: 8px;

  color: #222;

  text-align: right;

  font-weight: 500;
`;

export const DiscountValue = styled.span`
  font-size: 8px;

  color: #00a859;

  text-align: right;

  font-weight: 500;
`;

export const GrandTotalRow = styled.div`
  display: grid;

  grid-template-columns: 1fr auto;

  align-items: center;

  min-height: 42px;

  border-top: 1px solid #377d73;

  border-bottom: 1px solid #377d73;

  margin-top: 4px;
`;

export const GrandTotalLabel = styled.span`
  font-size: 8px;

  color: #222;

  font-weight: 700;
`;

export const GrandTotalValue = styled.span`
  font-size: 10px;

  color: #222;

  font-weight: 700;

  text-align: right;
`;


/* =========================================================
   TERMS
========================================================= */

export const TermsSection = styled.div`
  margin-top: 20px;

  padding: 20px 0 0 0;

  border-top: 1px solid #eeeeee;
`;

export const TermsTitle = styled.div`
  font-size: 9px;

  font-weight: 700;

  color: #222;

  margin-bottom: 5px;
`;

export const TermsText = styled.div`
  font-size: 8px;

  color: #999;

  line-height: 1.5;
`;

export const TermsNote = styled.div`
  font-size: 7px;

  color: #222;

  font-weight: 500;

  margin-top: 3px;
`;


/* =========================================================
   ACTION BUTTONS
========================================================= */

export const ActionSection = styled.div`
  display: flex;

  justify-content: flex-end;

  align-items: center;

  gap: 3px;

  margin-top: 64px;
`;

export const ActionButton = styled.button`
  height: 35px;

  min-width: 68px;

  padding: 0 11px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  border: 1px solid #d3dced;

  background: #ffffff;

  color: #222;

  font-size: 9px;

  font-weight: 500;

  cursor: pointer;

  transition: all 0.2s ease;

  svg {
    width: 12px;
    height: 12px;
  }

  &:hover {
    background: #f5f7fc;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const CancelButton = styled(ActionButton)`
  color: #222;

  border-color: #c8d3eb;
`;

export const DownloadButton = styled(ActionButton)`
  color: #222;

  border-color: #c8d3eb;
`;

export const DraftButton = styled(ActionButton)`
  color: #222;

  border-color: #c8d3eb;
`;

export const SentButton = styled(ActionButton)`
  min-width: 68px;

  background: #3049a6;

  color: #ffffff;

  border-color: #3049a6;

  font-weight: 600;

  &:hover {
    background: #273e91;
  }
`;


/* =========================================================
   FOOTER
========================================================= */

export const FooterSection = styled.div`
  position: absolute;

  left: 34px;

  right: 34px;

  bottom: 25px;

  padding-top: 12px;

  border-top: 1px solid #dddddd;

  display: flex;

  justify-content: flex-end;
`;

export const Website = styled.span`
  font-size: 8px;

  color: #333;
`;