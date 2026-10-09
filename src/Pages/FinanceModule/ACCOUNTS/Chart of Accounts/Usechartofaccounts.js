import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccounts,
  removeAccount,
  clearAccountError,
} from "../../../../Redux/finance/accounts/Accountingslice";

const TYPE_MAP = {
  Assets: "asset",
  Liabilities: "liability",
  Equity: "equity",
  Income: "revenue",
  Expenses: "expense",
};

const ACCOUNT_TYPES = Object.keys(TYPE_MAP);

export const SECTION_COLORS = {
  Assets: "#15B03E",
  Liabilities: "#E03131",
  Equity: "#7048E8",
  Income: "#1C7ED6",
  Expenses: "#F76707",
};

export const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const padCount = (value) => String(value).padStart(2, "0");

export const sectionTotal = (items) =>
  Math.abs(items.reduce((total, account) => total + account.signedBalance, 0));

const normalizeAccounts = (sections) => {
  const all = Object.values(sections || {}).flat();

  const nameById = Object.fromEntries(
    all.map((acc) => [acc.id, acc.account_name])
  );

  return Object.entries(TYPE_MAP).flatMap(([label, key]) =>
    (sections?.[key] || []).map((acc) => ({
      id: acc.id,
      code: acc.account_code,
      name: acc.account_name,
      parent:
        acc.parent_account && typeof acc.parent_account === "object"
          ? acc.parent_account.account_name
          : nameById[acc.parent_account] || "—",
      category: acc.category_display || acc.category,
      signedBalance: Number(acc.balance || 0), 
      balance: Math.abs(Number(acc.balance || 0)),
      type: label,
      status: acc.status_display || acc.status,
      raw: acc,
    }))
  );
};


const exportAccountsToCsv = (accounts) => {
  const headers = [
    "Code",
    "Account Name",
    "Parent Account",
    "Category",
    "Type",
    "Balance",
    "Status",
  ];

  const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;

  const rows = accounts.map((account) => [
    account.code,
    account.name,
    account.parent,
    account.category,
    account.type,
    account.balance.toFixed(2),
    account.status,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\n");

  // "\uFEFF" makes Excel read the file as UTF-8
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chart-of-accounts.csv";
  link.click();
  URL.revokeObjectURL(url);
};

const useChartOfAccounts = () => {
  const dispatch = useDispatch();

  const { sections, loading, error } = useSelector(
    (state) => state.accounting
  );

  // ---------------- local state ----------------
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // account waiting for delete confirmation

  useEffect(() => {
    dispatch(getAccounts());

    return () => {
      dispatch(clearAccountError());
    };
  }, [dispatch]);

  const accounts = useMemo(() => normalizeAccounts(sections), [sections]);

  const filteredAccounts = useMemo(() => {
    const searchValue = search.toLowerCase();

    return accounts.filter((account) => {
      const matchesSearch =
        String(account.name).toLowerCase().includes(searchValue) ||
        String(account.code).toLowerCase().includes(searchValue);

      const matchesType =
        typeFilter === "All" || account.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || account.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, search, typeFilter, statusFilter]);

  const groupedAccounts = useMemo(
    () =>
      ACCOUNT_TYPES.reduce((groups, type) => {
        groups[type] = filteredAccounts.filter(
          (account) => account.type === type
        );
        return groups;
      }, {}),
    [filteredAccounts]
  );

  const stats = useMemo(() => {
    const countByType = (type) =>
      accounts.filter((account) => account.type === type).length;

    return {
      total: accounts.length,
      active: accounts.filter((account) => account.status === "Active")
        .length,
      assets: countByType("Assets"),
      liabilities: countByType("Liabilities"),
      equity: countByType("Equity"),
    };
  }, [accounts]);

  const errorText =
    typeof error === "string" ? error : error ? JSON.stringify(error) : null;

  const showAll = () => {
    setTypeFilter("All");
    setStatusFilter("All");
  };

  const handleAdd = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (account) => {
    setEditingAccount(account.raw ?? account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  // ---------------- other actions ----------------
  // Delete icon click -> just opens the confirm modal
  const handleDelete = (account) => setDeleteTarget(account);

  const handleCancelDelete = () => setDeleteTarget(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(removeAccount(deleteTarget.id));

    setDeleteTarget(null);
  };

  const handleExport = () => exportAccountsToCsv(filteredAccounts);

  return {
    loading,
    errorText,
    totalAccounts: accounts.length,
    filteredCount: filteredAccounts.length,
    groupedAccounts,
    stats,

    // filters
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    showAll,

    // modal
    isModalOpen,
    editingAccount,
    handleAdd,
    handleEdit,
    handleCloseModal,

    // actions
    handleDelete,
    handleExport,

    // delete confirmation
    deleteTarget,
    handleCancelDelete,
    handleConfirmDelete,
  };
};

export default useChartOfAccounts;