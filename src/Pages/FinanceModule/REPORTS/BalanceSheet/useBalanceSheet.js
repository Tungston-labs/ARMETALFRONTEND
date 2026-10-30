import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBalanceSheet } from "../../../../Redux/finance/reports/BalanceSheetSlice";

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toNumber = (value) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
};

const getAccountName = (account, index) => {
  if (typeof account === "string") return account;

  return (
    account?.account_name ||
    account?.name ||
    account?.account ||
    account?.ledger_name ||
    account?.particular ||
    account?.title ||
    `Account ${index + 1}`
  );
};

const getAccountAmount = (account) => {
  if (typeof account === "number" || typeof account === "string") {
    return toNumber(account);
  }

  return toNumber(
    account?.balance ??
      account?.amount ??
      account?.closing_balance ??
      account?.total ??
      account?.net_amount ??
      0,
  );
};

const getAccounts = (group) =>
  Array.isArray(group?.accounts) ? group.accounts : [];

const formatAmount = (amount) =>
  `SAR ${toNumber(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const downloadCsv = (report) => {
  if (!report) return;

  const rows = [
    ["Balance Sheet", `As of ${report.as_of_date || ""}`],
    [],
    ["LIABILITIES & EQUITY", "Amount", "ASSETS", "Amount"],
  ];

  const liabilities = report.liabilities_and_equity || {};
  const assets = report.assets || {};

  const addGroupRows = (leftLabel, leftGroup, rightLabel, rightGroup) => {
    rows.push([
      leftLabel,
      toNumber(leftGroup?.total),
      rightLabel,
      toNumber(rightGroup?.total),
    ]);

    const leftAccounts = getAccounts(leftGroup);
    const rightAccounts = getAccounts(rightGroup);
    const length = Math.max(leftAccounts.length, rightAccounts.length);

    for (let index = 0; index < length; index += 1) {
      const left = leftAccounts[index];
      const right = rightAccounts[index];

      rows.push([
        left ? getAccountName(left, index) : "",
        left ? getAccountAmount(left) : "",
        right ? getAccountName(right, index) : "",
        right ? getAccountAmount(right) : "",
      ]);
    }
  };

  addGroupRows(
    "Current Liabilities",
    liabilities.current_liabilities,
    "Current Assets",
    assets.current_assets,
  );

  addGroupRows(
    "Vendor Payables",
    liabilities.vendor_payable,
    "Bank Balance",
    assets.current_assets?.bank_balance,
  );

  addGroupRows(
    "Payroll Payables",
    liabilities.payroll_payable,
    "Accounts Receivable",
    assets.current_assets?.accounts_receivable,
  );

  addGroupRows(
    "Tax Payables",
    liabilities.tax_payable,
    "Cash Balance",
    assets.current_assets?.cash_balance,
  );

  addGroupRows(
    "Equity",
    liabilities.equity,
    "Fixed Assets",
    assets.fixed_assets,
  );

  addGroupRows(
    "Capital Investment",
    liabilities.equity?.capital_investment,
    "Computers & Laptops",
    assets.fixed_assets?.computers_and_laptops,
  );

  addGroupRows(
    "Retained Earnings",
    liabilities.equity?.retained_earnings,
    "Office Furniture",
    assets.fixed_assets?.office_furniture,
  );

  rows.push([
    "Current Year Profit",
    toNumber(liabilities.equity?.current_year_profit),
    "Office Equipment",
    toNumber(assets.fixed_assets?.office_equipment?.total),
  ]);

  rows.push([
    "TOTAL LIABILITIES + EQUITY",
    toNumber(
      report.totals?.total_liabilities_and_equity ??
        report.summary?.total_liabilities_and_equity,
    ),
    "TOTAL ASSETS",
    toNumber(report.totals?.total_assets ?? report.summary?.total_assets),
  ]);

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `balance-sheet-${report.as_of_date || getToday()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const useBalanceSheet = () => {
  const dispatch = useDispatch();

  const { report, loading, error } = useSelector(
    (state) => state.balanceSheet || {},
  );

  const [asOfDate, setAsOfDate] = useState(getToday());
  const [companyPk, setCompanyPk] = useState("");

  useEffect(() => {
    const params = { as_of_date: asOfDate };

    if (companyPk !== "") {
      params.company_pk = companyPk;
    }

    const request = dispatch(fetchBalanceSheet(params));
    return () => request.abort();
  }, [dispatch, asOfDate, companyPk]);

  const summary = report?.summary || {};
  const liabilities = report?.liabilities_and_equity || {};
  const assets = report?.assets || {};

  const status = useMemo(() => {
    if (summary.is_balanced === true) return "Balanced";
    if (summary.is_balanced === false) return "Unbalanced";

    return summary.balance_status || "Unknown";
  }, [summary.is_balanced, summary.balance_status]);

  const handleDateChange = useCallback((event) => {
    const value = typeof event === "string" ? event : event.target.value;
    setAsOfDate(value);
  }, []);

  const handleExport = useCallback(() => {
    downloadCsv(report);
  }, [report]);

  return {
    report,
    summary,
    liabilities,
    assets,
    loading,
    error,
    asOfDate,
    setAsOfDate,
    companyPk,
    setCompanyPk,
    status,
    handleDateChange,
    handleExport,
    formatAmount,
  };
};

export default useBalanceSheet;
