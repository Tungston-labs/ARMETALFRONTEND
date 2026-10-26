export const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

// Table columns, used by TrialBalance.jsx for both the header and the cells.
// Add / remove / reorder a column here and every section updates.
export const trialBalanceColumns = [
  {
    key: "code",
    label: "Code",
    render: (account) => account.code,
  },
  {
    key: "name",
    label: "Account Name",
    render: (account) => account.name,
  },
  {
    key: "debit",
    label: "Debit",
    render: (account) => formatAmount(account.debit),
  },
  {
    key: "credit",
    label: "Credit",
    render: (account) => formatAmount(account.credit),
  },
];