import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  BankMoneyIn,
  BankMoneyOut,
  BankMuted,
  BankStatus,
  BankActionButton,
} from "./Banking.styles";

const money = (value) =>
  value
    ? Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "–";

export const getBankTransactionColumns = () => [
  { key: "date", title: "Date", render: (row) => row.date },
  {
    key: "referenceNo",
    title: "Reference No",
    render: (row) => row.referenceNo,
  },
  {
    key: "bankAccount",
    title: "Bank Account",
    render: (row) => row.bankAccount,
  },
  {
    key: "transactionType",
    title: "Transaction Type",
    render: (row) => row.transactionType,
  },
  {
    key: "moneyIn",
    title: "Money in (SAR)",
    render: (row) =>
      row.moneyIn ? (
        <BankMoneyIn>+ {money(row.moneyIn)}</BankMoneyIn>
      ) : (
        <BankMuted>–</BankMuted>
      ),
  },
  {
    key: "moneyOut",
    title: "Money out (SAR)",
    render: (row) =>
      row.moneyOut ? (
        <BankMoneyOut>- {money(row.moneyOut)}</BankMoneyOut>
      ) : (
        <BankMuted>–</BankMuted>
      ),
  },
  {
    key: "balance",
    title: "Balance after (SAR)",
    render: (row) => (
      <span
        style={{
          color: row.moneyOut && row.balance < 200000 ? "#ff3b45" : "inherit",
        }}
      >
        {money(row.balance)}
      </span>
    ),
  },
  {
    key: "status",
    title: "Status",
    render: (row) => <BankStatus $status={row.status}>{row.status}</BankStatus>,
  },
  {
    key: "action",
    title: "Action",
    render: () => (
      <BankActionButton type="button" aria-label="Transaction actions">
        <FiMoreHorizontal />
      </BankActionButton>
    ),
  },
];
