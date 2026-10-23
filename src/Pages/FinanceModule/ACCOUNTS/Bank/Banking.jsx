import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FiHome,
  FiCalendar,
  FiCreditCard,
  FiArrowUpCircle,
  FiDollarSign,
  FiArrowDownCircle,
} from "react-icons/fi";

import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import BankingHeader from "./BankingHeader";
import BankingTabs from "./BankingTabs";
import AddBankModal from "./Modal/AddBankModal";

import {
  BankTransactionTable,
  AllBanksTable,
  LoanAccountsTable,
} from "./BankingTable";

import { BankingPage, BankingTablePanel } from "./Banking.styles";

import {
  accountActions,
  loanActions,
  transactionActions,
} from "../../../../Redux/finance/accounts/BankingSlice";

import { mapBank, mapLoan, mapTransaction, formatSAR } from "./BankingData";

const PAGE_SIZE = 8;

const bankOptions = [
  { label: "Al Rajhi Bank", value: "Al Rajhi Bank" },
  { label: "Riyad Bank", value: "Riyad Bank" },
  { label: "Bank AlBilad", value: "Bank AlBilad" },
];

const transactionTypes = [
  { label: "Customer Receipt", value: "Customer Receipt" },
  { label: "Vendor Payment", value: "Vendor Payment" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Bank Charges", value: "Bank Charges" },
  { label: "Cash Deposit", value: "Cash Deposit" },
];

const bankTypes = [
  { label: "Cash Account", value: "Cash Account" },
  { label: "Loan Account", value: "Loan Account" },
];

const loanTypes = [{ label: "Term Loan", value: "Term Loan" }];

const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Reconciled", value: "Reconciled" },
];

const makeCard = (title, count, icon, backgroundColor, iconColor) => ({
  title,
  count,
  icon,
  backgroundColor,
  iconColor,
});

const sum = (rows, field) =>
  rows.reduce((total, row) => total + Number(row[field] || 0), 0);

function getStats(tab, transactions, banks, loans) {
  const moneyIn = sum(transactions, "moneyIn");
  const moneyOut = sum(transactions, "moneyOut");
  const loanOutstanding = sum(loans, "outstanding");
  const loanAmount = sum(loans, "loanAmount");
  const monthlyEmi = sum(loans, "monthlyInstalment");

  if (tab === "transactions") {
    return [
      makeCard(
        "Money in the bank",
        formatSAR(
          banks.reduce(
            (total, bank) => total + Number(bank.openingBalance || 0),
            0,
          ),
        ),
        <FiHome />,
        "#E9FBEF",
        "#16A34A",
      ),
      makeCard(
        "Cash on hand",
        formatSAR(
          banks
            .filter((bank) =>
              String(bank.bankType).toLowerCase().includes("cash"),
            )
            .reduce(
              (total, bank) => total + Number(bank.openingBalance || 0),
              0,
            ),
        ),
        <FiCalendar />,
        "#F3E8FF",
        "#9333EA",
      ),
      makeCard(
        "Money in (April)",
        formatSAR(moneyIn),
        <FiCreditCard />,
        "#E0F7FA",
        "#06B6D4",
      ),
      makeCard(
        "Money out (April)",
        formatSAR(moneyOut),
        <FiArrowUpCircle />,
        "#FFF0E0",
        "#F97316",
      ),
      makeCard(
        "Loans still owed",
        formatSAR(loanOutstanding),
        <FiDollarSign />,
        "#FEECEC",
        "#EF4444",
      ),
    ];
  }

  if (tab === "banks") {
    return [
      makeCard(
        "Total Bank Account",
        String(
          banks.filter(
            (bank) => !String(bank.bankType).toLowerCase().includes("loan"),
          ).length,
        ).padStart(2, "0"),
        <FiHome />,
        "#E9FBEF",
        "#16A34A",
      ),
      makeCard(
        "Total Loan Account",
        String(loans.length).padStart(2, "0"),
        <FiCalendar />,
        "#F3E8FF",
        "#9333EA",
      ),
      makeCard(
        "Money in (April)",
        formatSAR(moneyIn),
        <FiCreditCard />,
        "#E0F7FA",
        "#06B6D4",
      ),
      makeCard(
        "Money out (April)",
        formatSAR(moneyOut),
        <FiArrowUpCircle />,
        "#FFF0E0",
        "#F97316",
      ),
      makeCard(
        "Loans still owed",
        formatSAR(loanOutstanding),
        <FiDollarSign />,
        "#FEECEC",
        "#EF4444",
      ),
    ];
  }

  return [
    makeCard(
      "Total Loan Account",
      String(loans.length).padStart(2, "0"),
      <FiHome />,
      "#E9FBEF",
      "#16A34A",
    ),
    makeCard(
      "Total Loan Taken",
      formatSAR(loanAmount),
      <FiCalendar />,
      "#F3E8FF",
      "#9333EA",
    ),
    makeCard(
      "Loan Outstanding",
      formatSAR(loanOutstanding),
      <FiCreditCard />,
      "#E0F7FA",
      "#06B6D4",
    ),
    makeCard(
      "Total EMI per Month",
      formatSAR(monthlyEmi),
      <FiArrowDownCircle />,
      "#FFF0E0",
      "#F97316",
    ),
    makeCard(
      "Interest Payable",
      formatSAR(
        loans.reduce(
          (total, loan) =>
            total + Number(loan.interest_payable ?? loan.interestPayable ?? 0),
          0,
        ),
      ),
      <FiDollarSign />,
      "#FEECEC",
      "#EF4444",
    ),
  ];
}

export default function Banking() {
  const dispatch = useDispatch();

  const { accounts, loans, transactions } = useSelector(
    (state) => state.banking,
  );

  const [activeTab, setActiveTab] = useState("transactions");
  const [search, setSearch] = useState("");
  const [bank, setBank] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-04-30");
  const [page, setPage] = useState(1);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [modalError, setModalError] = useState("");

  // Fetch all three resource lists.
  useEffect(() => {
    dispatch(accountActions.fetch());
    dispatch(loanActions.fetch());
    dispatch(transactionActions.fetch());
  }, [dispatch]);

  const bankRows = useMemo(() => accounts.list.map(mapBank), [accounts.list]);

  const loanRows = useMemo(() => loans.list.map(mapLoan), [loans.list]);

  const transactionRows = useMemo(
    () => transactions.list.map(mapTransaction),
    [transactions.list],
  );

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setBank("");
    setType("");
    setStatus("");
    setPage(1);
  };

  const rows =
    activeTab === "transactions"
      ? transactionRows
      : activeTab === "banks"
        ? bankRows
        : loanRows;

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const query = search.trim().toLowerCase();

      if (
        query &&
        !Object.values(row).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        )
      ) {
        return false;
      }

      if (activeTab === "transactions") {
        return (
          (!bank || String(row.bankAccount) === bank) &&
          (!type || String(row.transactionType) === type) &&
          (!status || String(row.status) === status)
        );
      }

      if (activeTab === "banks") {
        return (
          (!bank || String(row.bankName) === bank) &&
          (!type || String(row.bankType) === type)
        );
      }

      return (
        (!bank || String(row.bankName) === bank) &&
        (!type || String(row.accountType) === type)
      );
    });
  }, [rows, search, bank, type, status, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const pageRows = filteredRows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const statsCards = useMemo(
    () => getStats(activeTab, transactionRows, bankRows, loanRows),
    [activeTab, transactionRows, bankRows, loanRows],
  );

  const filters = [
    {
      key: "bank",
      value: bank,
      onChange: changeFilter(setBank),
      options: bankOptions,
      placeholder: "All Bank Account",
    },
    {
      key: "type",
      value: type,
      onChange: changeFilter(setType),
      options:
        activeTab === "transactions"
          ? transactionTypes
          : activeTab === "banks"
            ? bankTypes
            : loanTypes,
      placeholder: "All Type",
    },
    {
      key: "status",
      value: activeTab === "transactions" ? status : "",
      onChange:
        activeTab === "transactions" ? changeFilter(setStatus) : undefined,
      options: statusOptions,
      placeholder: "All Status",
    },
  ];

  const handleSaveBank = async (formData) => {
    setModalError("");

    try {
      await dispatch(accountActions.create(formData)).unwrap();

      // Refresh the accounts list after successful creation.
      await dispatch(accountActions.fetch()).unwrap();

      setIsAddBankOpen(false);
    } catch (error) {
      setModalError(
        typeof error === "string"
          ? error
          : error?.detail ||
              error?.message ||
              "Unable to create bank account. Check the required API fields.",
      );
    }
  };

  return (
    <BankingPage>
      <BankingHeader
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(value) => {
          setStartDate(value);
          setPage(1);
        }}
        onEndDateChange={(value) => {
          setEndDate(value);
          setPage(1);
        }}
        onAddBank={() => {
          setModalError("");
          setIsAddBankOpen(true);
        }}
      />

      <StatsCards cards={statsCards} />

      <BankingTabs activeTab={activeTab} onChange={changeTab} />

      <BankingTablePanel>
        <ReusableFilter
          search={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          showSearch
          searchPlaceholder="Search"
          filters={filters}
        />

        {activeTab === "transactions" && (
          <BankTransactionTable
            data={pageRows}
            loading={transactions.loading}
          />
        )}

        {activeTab === "banks" && (
          <AllBanksTable data={pageRows} loading={accounts.loading} />
        )}

        {activeTab === "loans" && (
          <LoanAccountsTable data={pageRows} loading={loans.loading} />
        )}

        {activeTab === "transactions" && transactions.error && (
          <p role="alert">Failed to load transactions.</p>
        )}

        {activeTab === "banks" && accounts.error && (
          <p role="alert">Failed to load bank accounts.</p>
        )}

        {activeTab === "loans" && loans.error && (
          <p role="alert">Failed to load loans.</p>
        )}
      </BankingTablePanel>

      <ReusablePagination
        currentPage={safePage}
        totalPages={totalPages}
        totalRecords={filteredRows.length}
        onPageChange={(nextPage) => {
          if (nextPage >= 1 && nextPage <= totalPages) {
            setPage(nextPage);
          }
        }}
      />

      <AddBankModal
        isOpen={isAddBankOpen}
        onClose={() => {
          setIsAddBankOpen(false);
          setModalError("");
        }}
        onSubmit={handleSaveBank}
        loading={accounts.saving}
        error={modalError}
      />
    </BankingPage>
  );
}
