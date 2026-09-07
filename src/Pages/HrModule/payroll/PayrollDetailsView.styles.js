import styled from "styled-components";
import { HiArrowLeft } from "react-icons/hi";

/* ─────────────────────────────────────────
   Container
───────────────────────────────────────── */
export const Container = styled.div`
  background-color: white;
  padding: 2rem;
  font-family: "DM Sans", "Arial", sans-serif;
  color: #111;

  @media (max-width: 768px)  { padding: 1rem; }
  @media (min-width: 2560px) { padding: 4rem; }
  @media (min-width: 3840px) { padding: 5rem; }
  @media (min-width: 7680px) { padding: 6rem; }
`;

/* ─────────────────────────────────────────
   Header row  (back arrow + badge + print)
───────────────────────────────────────── */
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1.25rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

export const BackTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
`;

export const BackIcon = styled(HiArrowLeft)`
  width: 22px;
  height: 22px;

  @media (min-width: 2560px) { width: 35px; height: 35px; }
  @media (min-width: 3840px) { width: 40px; height: 40px; }
  @media (min-width: 7680px) { width: 45px; height: 45px; }
`;

/* ─────────────────────────────────────────
   Status badge  (Paid / Unpaid / Pending …)
───────────────────────────────────────── */
export const Badge = styled.span`
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: clamp(12px, 1vw, 14px);
  font-weight: 500;

  background: ${({ status }) =>
    status === "Paid"      ? "#dcfce7" :
    status === "Cancelled" ? "#fee2e2" :
    status === "OnHold"    ? "#e0e7ff" :
                             "#fef9c3"};

  color: ${({ status }) =>
    status === "Paid"      ? "#166534" :
    status === "Cancelled" ? "#991b1b" :
    status === "OnHold"    ? "#3730a3" :
                             "#713f12"};

  border: 0.5px solid ${({ status }) =>
    status === "Paid"      ? "#bbf7d0" :
    status === "Cancelled" ? "#fecaca" :
    status === "OnHold"    ? "#c7d2fe" :
                             "#fde68a"};
`;

/* ─────────────────────────────────────────
   Print icon
───────────────────────────────────────── */
export const PrintIcon = styled.span`
  font-size: clamp(18px, 2vw, 24px);
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #374151;
  transition: color 0.2s;
  &:hover { color: #111827; }
`;

/* ─────────────────────────────────────────
   Section divider label
───────────────────────────────────────── */
export const SectionDivider = styled.p`
  font-size: 11px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: #6b7280;
  margin: 1.5rem 0 0.6rem;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 10px;
`;

/* ─────────────────────────────────────────
   Two-column grid  (collapses on tablet)
───────────────────────────────────────── */
export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media print {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 20px !important;
    page-break-inside: avoid !important;
  }
`;

/* ─────────────────────────────────────────
   Employee info card
───────────────────────────────────────── */
export const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 4px 16px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 0.5px solid #f3f4f6;
  &:last-child { border-bottom: none; }
`;

export const Label = styled.span`
  font-size: clamp(12px, 1vw, 14px);
  color: #6b7280;
  font-weight: 400;

  @media (min-width: 2560px) { font-size: 2.5rem; }
  @media (min-width: 3840px) { font-size: 3rem;   }
  @media (min-width: 7680px) { font-size: 3.5rem; }
`;

export const Value = styled.span`
  font-size: clamp(12px, 1vw, 14px);
  font-weight: 500;
  color: #111827;
  text-align: right;

  @media (min-width: 2560px) { font-size: 2.5rem; }
  @media (min-width: 3840px) { font-size: 3rem;   }
  @media (min-width: 7680px) { font-size: 3.5rem; }
`;

/* ─────────────────────────────────────────
   Earnings / Deductions / Summary table
───────────────────────────────────────── */
export const TableWrapper = styled.div`
  width: 100%;
  border: 0.5px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media print {
    width: 100% !important;
    table-layout: fixed !important;
  }

  thead th {
    background: #f9fafb;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #6b7280;
    padding: 10px 14px;
    text-align: left;
    border-bottom: 0.5px solid #e5e7eb;
  }

  thead th:last-child { text-align: right; }

  tbody td {
    padding: 9px 14px;
    border-bottom: 0.5px solid #f3f4f6;
    font-size: 13px;
    color: #111827;
  }

  tbody tr:last-child td { border-bottom: none; }

  tbody td:last-child {
    text-align: right;
    font-family: "DM Mono", monospace;
    font-size: 12px;
  }

  /* ── row variants ── */
  .total-row td {
    background: #f9fafb;
    font-weight: 500;
    border-top: 0.5px solid #e5e7eb;
  }

  .net-pay td {
    background: #0f172a;
    color: #f1f5f9;
    font-weight: 600;
    font-size: 14px;
  }

  .incentive-summary-row td {
    background: #f0fdf4;
    color: #166534;
    font-weight: 500;
  }

  .incentive-summary-row td:last-child {
    color: #166534;
    font-weight: 600;
  }
`;

export const TableData = styled.td``;

/* ─────────────────────────────────────────
   Incentive row  (green highlight inside Table)
───────────────────────────────────────── */
export const IncentiveRow = styled.tr`
  td {
    background: #f0fdf4;
    color: #166534;
  }

  td:last-child {
    font-family: "DM Mono", monospace;
    font-size: 12px;
    font-weight: 500;
    color: #166534;
    text-align: right;
  }
`;

/* ─────────────────────────────────────────
   Company header block (dark banner)
───────────────────────────────────────── */
export const CompanyHeader = styled.div`
  background-color: #0f172a;
  color: #ffffff;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;


`;

export const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const CompanyTag = styled.span`
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

export const CompanyName = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #f1f5f9;
`;

export const CompanyText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.6;
`;

export const CompanyLogo = styled.img`
  height: 64px;
  object-fit: contain;
  opacity: 0.9;


`;