import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { BankMoneyOut, BankActionButton } from "./Banking.styles";
import { formatSAR } from "./BankingData";

export const getLoanAccountColumns = () => [
  { key: "slNo", title: "SL NO.", render: (row) => row.slNo },
  { key: "bankName", title: "Bank Name", render: (row) => row.bankName },
  {
    key: "loanAmount",
    title: "Loan Amount (SAR)",
    render: (row) => formatSAR(row.loanAmount).replace("SAR ", ""),
  },
  {
    key: "outstanding",
    title: "Outstanding",
    render: (row) => <BankMoneyOut>{formatSAR(row.outstanding)}</BankMoneyOut>,
  },
  {
    key: "interestRate",
    title: "Interest Rate",
    render: (row) => row.interestRate,
  },
  {
    key: "monthlyInstallment",
    title: "Monthly instalment",
    render: (row) => formatSAR(row.monthlyInstallment).replace("SAR ", ""),
  },
  { key: "tenure", title: "Tenure", render: (row) => row.tenure },
  { key: "nextDue", title: "Next due", render: (row) => row.nextDue },
  {
    key: "action",
    title: "Actions",
    render: () => (
      <BankActionButton type="button" aria-label="Loan actions">
        <FiMoreHorizontal />
      </BankActionButton>
    ),
  },
];
