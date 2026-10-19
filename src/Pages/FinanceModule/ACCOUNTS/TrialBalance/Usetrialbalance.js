import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Adjust this path to where your slice lives
import {
  getTrialBalance,
  getTrialBalanceDashboard,
} from "../../../../Redux/finance/accounts/TrialBalanceslice";
import { formatAmount } from "./TrialBalanceColumns";

// API type value -> UI meta. Order here = order of sections / dropdown / cards.
// `className` must match the SectionHeader classes in TrialBalance.styles.
const TYPE_META = {
  asset: { label: "Assets", className: "assets", color: "#15B03E", normalBalance: "Debit" },
  liability: { label: "Liabilities", className: "liabilities", color: "#E03131", normalBalance: "Credit" },
  equity: { label: "Equity", className: "equity", color: "#7048E8", normalBalance: "Credit" },
  revenue: { label: "Income", className: "income", color: "#1C7ED6", normalBalance: "Credit" },
  expense: { label: "Expenses", className: "expenses", color: "#F76707", normalBalance: "Debit" },
};

const FALLBACK_META = { label: "Other", className: "", color: "#3455BC", normalBalance: "Debit" };

export const TYPE_OPTIONS = Object.entries(TYPE_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

const toNumber = (value) => Number(value) || 0;

const formatCurrency = (amount) => `SAR ${formatAmount(amount)}`;

// rejectWithValue sends back either a string or the DRF error object
const getErrorText = (error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error.detail) return error.detail;

  return Object.entries(error)
    .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(", ") : msg}`)
    .join(" | ");
};

const downloadCsv = (fileName, headers, rows) => {
  const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\n");

  // "\uFEFF" makes Excel read the file as UTF-8 (needed for the "–" in names)
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const useTrialBalance = () => {
  const dispatch = useDispatch();

  const { groups, dashboard, loading, error, dashboardError } = useSelector(
    (state) => state.trialBalance
  );

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All"); // "All" | asset | liability | ...
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Wait 400ms after typing before calling the API
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(id);
  }, [search]);

  // Trial balance list
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (typeFilter !== "All") params.type = typeFilter;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;

    dispatch(getTrialBalance(params));
  }, [dispatch, debouncedSearch, typeFilter, dateFrom, dateTo]);

  // Dashboard (cards + balance banner) only depends on the date range
  useEffect(() => {
    const params = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;

    dispatch(getTrialBalanceDashboard(params));
  }, [dispatch, dateFrom, dateTo]);

  // API groups -> UI sections (empty groups hidden, amounts as numbers)
  const sections = useMemo(
    () =>
      groups
        .filter((group) => group.accounts?.length > 0)
        .map((group) => {
          const meta = TYPE_META[group.type] || FALLBACK_META;
          const debit = toNumber(group.total_debit);
          const credit = toNumber(group.total_credit);
          const net = meta.normalBalance === "Debit" ? debit - credit : credit - debit;

          return {
            type: group.type,
            label: group.label || meta.label,
            className: meta.className,
            color: meta.color,
            normalBalance: meta.normalBalance,
            totalText: (net),
            items: group.accounts.map((account) => ({
              id: account.account_id,
              code: account.account_code,
              name: account.account_name,
              type: account.account_type_label,
              debit: toNumber(account.debit_amount),
              credit: toNumber(account.credit_amount),
            })),
          };
        }),
    [groups]
  );

  // Balance banner (from the dashboard API)
  const summary = useMemo(
    () => ({
      ready: Boolean(dashboard),
      isBalanced: Boolean(dashboard?.is_balanced),
      debitText: formatCurrency(toNumber(dashboard?.total_debit)),
      creditText: formatCurrency(toNumber(dashboard?.total_credit)),
      differenceText: formatCurrency(toNumber(dashboard?.difference)),
    }),
    [dashboard]
  );

  // Stat cards: total per type (from the dashboard API)
  const stats = useMemo(() => {
    const totals = {
      asset: dashboard?.total_asset,
      liability: dashboard?.total_liability,
      equity: dashboard?.total_equity,
      revenue: dashboard?.total_revenue ?? dashboard?.total_income,
      expense: dashboard?.total_expense,
    };

    return TYPE_OPTIONS.map(({ value, label }) => ({
      type: value,
      title: label,
      value: formatAmount(toNumber(totals[value])),
    }));
  }, [dashboard]);

  const handleExportExcel = () => {
    const rows = sections.flatMap((section) =>
      section.items.map((account) => [
        account.code,
        account.name,
        section.label,
        account.debit.toFixed(2),
        account.credit.toFixed(2),
      ])
    );

    downloadCsv(
      "trial-balance.csv",
      ["Code", "Account Name", "Type", "Debit (SAR)", "Credit (SAR)"],
      rows
    );
  };

  // Placeholder: swap for a real PDF export when ready
  const handleExportPdf = () => window.print();

  return {
    // filters
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,

    // data
    sections,
    summary,
    stats,

    // status
    loading,
    errorText: getErrorText(error || dashboardError),

    // actions
    handleExportExcel,
    handleExportPdf,
  };
};

export default useTrialBalance;