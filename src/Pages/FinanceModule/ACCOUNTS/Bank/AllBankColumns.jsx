import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { BankType, BankActionButton } from "./Banking.styles";
import { formatSAR } from "./BankingData";

export const getAllBankColumns = () => [
  { key: "slNo", title: "SL NO.", render: (row) => row.slNo },
  { key: "bankName", title: "Bank Name", render: (row) => row.bankName },
  {
    key: "accountType",
    title: "Account Type",
    render: (row) => row.accountType,
  },
  {
    key: "accountNumber",
    title: "Account Number",
    render: (row) => row.accountNumber,
  },
  {
    key: "bankType",
    title: "Bank Type",
    render: (row) => <BankType $type={row.bankType}>{row.bankType}</BankType>,
  },
  {
    key: "openingBalance",
    title: "Opening Balance",
    render: (row) => formatSAR(row.openingBalance).replace("SAR ", ""),
  },
  {
    key: "outstanding",
    title: "Outstanding",
    render: (row) => (
      <BankType $type={row.bankType}>
        {formatSAR(row.outstanding).replace("SAR ", "")}
      </BankType>
    ),
  },
  {
    key: "action",
    title: "Action",
    render: () => (
      <BankActionButton type="button" aria-label="Bank actions">
        <FiMoreHorizontal />
      </BankActionButton>
    ),
  },
];
