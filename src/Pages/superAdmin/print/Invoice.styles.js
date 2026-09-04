// Invoice.styles.js

import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  /* max-width: 900px; */
  margin: 30px auto;
  padding: 40px 55px;
  background: #fff;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
  color: #222;

  @media (max-width: 768px) {
    padding: 25px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const Watermark = styled.img`
  position: absolute;
  width: 330px;
  opacity: 0.05;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 220px;
  }
`;

export const Header = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Logo = styled.img`
  width: 90px;
  object-fit: contain;

  @media (max-width: 480px) {
    width: 70px;
  }
`;

export const CompanyName = styled.h2`
  margin: 8px 0 0;
  color: #f26b3a;
  font-size: 28px;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const CompanySub = styled.p`
  margin: 0;
  font-size: 18px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: linear-gradient(
    to right,
    #222 0%,
    #222 30%,
    #f26b3a 30%,
    #f26b3a 70%,
    #222 70%,
    #222 100%
  );
  margin: 20px 0;
`;

export const InvoiceTitle = styled.h1`
  text-align: center;
  color: #f26b3a;
  font-size: 34px;
  margin-bottom: 35px;
  font-weight: 700;
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 35px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media print {
    flex-direction: row !important;
    gap: 20px;
  }
`;
export const AddressSection = styled.div`
  flex: 1;
`;

export const InvoiceSection = styled.div`
  width: 250px;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media print {
    width: 250px !important;
  }
`;


export const SectionTitle = styled.h4`
  color: #f26b3a;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 700;
`;

export const AddressText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.3;
`;

export const InvoiceText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
`;

export const TableHead = styled.tr`
  background: #f26b3a;
`;

export const TableHeader = styled.th`
  color: white;
  padding: 14px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #444;

  &:first-child {
    border-radius: 10px 0 0 0;
  }

  &:last-child {
    border-radius: 0 10px 0 0;
  }
`;

export const TableRow = styled.tr`
  td {
    border: 1px solid #444;
  }
`;

export const TableCell = styled.td`
  padding: 16px;
  text-align: center;
  font-size: 15px;
  vertical-align: top;
`;

export const GrandTotalRow = styled.tr`
  td {
    border: 1px solid #444;
    padding: 14px;
    font-weight: bold;
  }

  td:first-child {
    color: #f26b3a;
    text-align: center;
  }

  td:last-child {
    text-align: center;
  }
`;

export const NotesSection = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: 35px;
`;

export const NotesTitle = styled.h4`
  color: #f26b3a;
  margin-bottom: 10px;
`;

export const NotesList = styled.ol`
  margin: 0;
  padding-left: 18px;

  li {
    margin-bottom: 6px;
    font-size: 15px;
    line-height: 1.2;
  }
`;

export const BankSection = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: 45px;
`;

export const Footer = styled.div`
  margin-top: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

export const FooterCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FooterIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #f36b37;
  color: #fff;
  border-radius: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 17px;
`;

export const FooterText = styled.p`
  margin: 0;
  color: #333;
  font-size: 14px;
  line-height: 1.4;
`;

export const FooterAddress = styled.p`
  margin: 0;
  color: #333;
  font-size: 13px;
  line-height: 1.4;
`;

export const BottomLine = styled.div`
  margin-top: 15px;
  width: calc(100% + 110px);
  margin-left: -55px;
  height: 5px;
  background: #f36b37;

  @media (max-width: 768px) {
    width: calc(100% + 50px);
    margin-left: -25px;
  }

  @media (max-width: 480px) {
    width: calc(100% + 30px);
    margin-left: -15px;
  }
`;