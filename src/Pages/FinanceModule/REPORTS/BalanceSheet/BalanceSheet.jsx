import React from "react";
import {
  Wallet,
  Scale,
  Landmark,
  BadgeCheck,
  CircleCheck,
  CircleAlert,
} from "lucide-react";
import { FiDownload } from "react-icons/fi";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import useBalanceSheet from "./useBalanceSheet";

import {
  BalanceSheetPage,
  DatePanel,
  DateField,
  StatementWrapper,
  StatementTable,
  StatementHeader,
  GrandTotalRow,
  StatusText,
  ExportButton,
  MessageRow,
} from "./BalanceSheet.styles";

const amountValue = (value) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
};

const hasValue = (group) => {
  const total = amountValue(group?.total);
  const accounts = Array.isArray(group?.accounts) ? group.accounts : [];
  return total !== 0 || accounts.length > 0;
};

const BalanceSheet = () => {
  const {
    report,
    summary,
    liabilities,
    assets,
    loading,
    error,
    asOfDate,
    handleDateChange,
    handleExport,
    status,
    formatAmount,
  } = useBalanceSheet();

  const safeSummary = summary ?? {};
  const safeLiabilities = liabilities ?? {};
  const safeAssets = assets ?? {};

  const equity = safeLiabilities.equity ?? {};
  const currentAssets = safeAssets.current_assets ?? {};
  const fixedAssets = safeAssets.fixed_assets ?? {};

  const statsCards = [
    {
      title: "Total Assets",
      count: formatAmount(safeSummary.total_assets),
      icon: <Wallet size={22} />,
      backgroundColor: "#E4F8EC",
      iconColor: "#16A34A",
    },
    {
      title: "Total Liabilities",
      count: formatAmount(safeSummary.total_liabilities),
      icon: <Landmark size={22} />,
      backgroundColor: "#F3E8FF",
      iconColor: "#9333EA",
    },
    {
      title: "Total Equity",
      count: formatAmount(safeSummary.total_equity),
      icon: <Scale size={22} />,
      backgroundColor: "#FCE7E7",
      iconColor: "#DC2626",
    },
    {
      title: "Working Capital",
      count: formatAmount(safeSummary.working_capital),
      icon: <BadgeCheck size={22} />,
      backgroundColor: "#E4F8EC",
      iconColor: "#16A34A",
    },
    {
      title: "Status",
      count: loading ? "Loading..." : status,
      icon:
        safeSummary.is_balanced === false ? (
          <CircleAlert size={22} />
        ) : (
          <CircleCheck size={22} />
        ),
      backgroundColor:
        safeSummary.is_balanced === false ? "#FCE7E7" : "#e4e4f8",
      iconColor: safeSummary.is_balanced === false ? "#DC2626" : "#16A34A",
    },
  ];

  const leftRows = [
    {
      type: "group",
      label: "Liabilities",
      value: {
        total: safeLiabilities.total_liabilities,
      },
      side: "liability",
    },
    {
      type: "account",
      label: "Vendor Payables",
      value: safeLiabilities.vendor_payable,
    },
    {
      type: "account",
      label: "Payroll Payables",
      value: safeLiabilities.payroll_payable,
    },
    {
      type: "account",
      label: "Tax Payables",
      value: safeLiabilities.tax_payable,
    },
    ...(hasValue(safeLiabilities.non_current_liabilities)
      ? [
          {
            type: "account",
            label: "Non-current Liabilities",
            value: safeLiabilities.non_current_liabilities,
          },
        ]
      : []),
    ...(hasValue(safeLiabilities.other_liabilities)
      ? [
          {
            type: "account",
            label: "Other Liabilities",
            value: safeLiabilities.other_liabilities,
          },
        ]
      : []),
    {
      type: "group",
      label: "Equity",
      value: equity,
      side: "liability",
    },
    {
      type: "account",
      label: "Capital Investment",
      value: equity.capital_investment,
    },
    {
      type: "account",
      label: "Retained Earnings",
      value: equity.retained_earnings,
    },
    {
      type: "account",
      label: "Current Year Profit",
      value: equity.current_year_profit,
      rawValue: true,
    },
  ];

  const rightRows = [
    {
      type: "group",
      label: "Current Assets",
      value: currentAssets,
      side: "asset",
    },
    {
      type: "account",
      label: "Bank Balance",
      value: currentAssets.bank_balance,
    },
    {
      type: "account",
      label: "Accounts Receivable",
      value: currentAssets.accounts_receivable,
    },
    {
      type: "account",
      label: "Cash Balance",
      value: currentAssets.cash_balance,
    },
    {
      type: "group",
      label: "Fixed Assets",
      value: fixedAssets,
      side: "asset",
    },
    {
      type: "account",
      label: "Computers & Laptops",
      value: fixedAssets.computers_and_laptops,
    },
    {
      type: "account",
      label: "Office Furniture",
      value: fixedAssets.office_furniture,
    },
    {
      type: "account",
      label: "Office Equipment",
      value: fixedAssets.office_equipment,
    },
    ...(hasValue(fixedAssets.other_fixed_assets)
      ? [
          {
            type: "account",
            label: "Other Fixed Assets",
            value: fixedAssets.other_fixed_assets,
          },
        ]
      : []),
    ...(hasValue(safeAssets.other_assets)
      ? [
          {
            type: "group",
            label: "Other Assets",
            value: safeAssets.other_assets,
            side: "asset",
          },
        ]
      : []),
  ];

  const renderStatementCell = (item, side) => {
    if (!item) {
      return <td colSpan={2} className="bs-empty-cell" aria-hidden="true" />;
    }

    const amount = item.rawValue
      ? amountValue(item.value)
      : amountValue(item.value?.total);

    if (item.type === "group") {
      return (
        <React.Fragment>
          <td className={`bs-group-label ${side}`}>{item.label}</td>
          <td className={`bs-group-amount ${side}`}>{formatAmount(amount)}</td>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <td className="bs-account-label">{item.label}</td>
        <td className="bs-account-amount">{formatAmount(amount)}</td>
      </React.Fragment>
    );
  };

  const rowCount = Math.max(leftRows.length, rightRows.length);

  return (
    <BalanceSheetPage>
      <ReusableHeader
        title="Balance Sheet"
        breadcrumbs={["Dashboard", "Reports", "Balance Sheet"]}
      >
        <ExportButton
          type="button"
          onClick={handleExport}
          disabled={loading || !report}
        >
          <FiDownload />
          Export Report
        </ExportButton>
      </ReusableHeader>

      <StatsCards loading={loading} cards={statsCards} />

      <DatePanel>
        <DateField
          id="balance-sheet-date"
          type="date"
          value={asOfDate}
          onChange={handleDateChange}
          aria-label="Balance sheet as of date"
        />
        {report?.as_of_date && <span>Report date: {report.as_of_date}</span>}
      </DatePanel>

      {error && (
        <MessageRow role="alert">
          {typeof error === "string"
            ? error
            : "Unable to load the balance sheet. Please try again."}
        </MessageRow>
      )}

      <StatementWrapper>
        <StatementTable>
          <colgroup>
            <col style={{ width: "39%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "39%" }} />
            <col style={{ width: "11%" }} />
          </colgroup>

          <thead>
            <StatementHeader>
              <th colSpan={2}>LIABILITIES &amp; EQUITY</th>
              <th colSpan={2}>ASSETS</th>
            </StatementHeader>
          </thead>

          <tbody>
            {loading && !report ? (
              <tr>
                <td colSpan={4} className="bs-message-cell">
                  Loading balance sheet...
                </td>
              </tr>
            ) : error && !report ? (
              <tr>
                <td colSpan={4} className="bs-message-cell">
                  Balance sheet data is unavailable.
                </td>
              </tr>
            ) : (
              <>
                {Array.from({ length: rowCount }, (_, index) => {
                  const leftItem = leftRows[index];
                  const rightItem = rightRows[index];

                  const rowType =
                    leftItem?.type === "group" || rightItem?.type === "group"
                      ? "bs-group-row"
                      : "bs-account-row";

                  return (
                    <tr className={rowType} key={`statement-row-${index}`}>
                      {renderStatementCell(
                        leftItem,
                        leftItem?.side ?? "liability",
                      )}
                      {renderStatementCell(
                        rightItem,
                        rightItem?.side ?? "asset",
                      )}
                    </tr>
                  );
                })}
              </>
            )}

            <GrandTotalRow>
              <td>TOTAL LIABILITIES + EQUITY</td>
              <td>
                {formatAmount(
                  safeSummary.total_liabilities_and_equity ??
                    safeLiabilities.total_liabilities_and_equity,
                )}
              </td>
              <td>TOTAL ASSETS</td>
              <td>
                {formatAmount(
                  safeSummary.total_assets ?? safeAssets.total_assets,
                )}
              </td>
            </GrandTotalRow>
          </tbody>
        </StatementTable>
      </StatementWrapper>

      {report && (
        <StatusText $balanced={safeSummary.is_balanced !== false}>
          {safeSummary.is_balanced === false
            ? `Balance difference: ${formatAmount(
                safeSummary.balance_difference,
              )}`
            : `Balance sheet ${String(status ?? "balanced").toLowerCase()}.`}
        </StatusText>
      )}
    </BalanceSheetPage>
  );
};

export default BalanceSheet;
