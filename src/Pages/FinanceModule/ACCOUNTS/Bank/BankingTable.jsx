import React from "react";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import { getBankTransactionColumns } from "./BankTransactionColumns";
import { getAllBankColumns } from "./AllBankColumns";
import { getLoanAccountColumns } from "./LoanAccountColumns";

export function BankTransactionTable({ data }) {
  return (
    <ReusableTable
      autoLayout
      columns={getBankTransactionColumns()}
      data={data}
      loading={false}
    />
  );
}

export function AllBanksTable({ data }) {
  return (
    <ReusableTable
      autoLayout
      columns={getAllBankColumns()}
      data={data}
      loading={false}
    />
  );
}

export function LoanAccountsTable({ data }) {
  return (
    <ReusableTable
      autoLayout
      columns={getLoanAccountColumns()}
      data={data}
      loading={false}
    />
  );
}
