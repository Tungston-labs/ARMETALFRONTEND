import React, { useMemo, useState } from "react";
import {
  Page,
  ContentCard,
  FilterSection,
  SearchBox,
  SearchIcon,
  SearchInput,
  SelectWrapper,
  Select,
  SelectArrow,
  AccountSection,
  SectionHeader,
  SectionTitleWrapper,
  SectionIcon,
  SectionTitle,
  SectionCount,
  SectionTotal,
  TableWrapper,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Status,
  ActionWrapper,
  EditButton,
  DeleteButton,
  ExportButton,
} from "./ChartOfAccounts.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import { CiSearch } from "react-icons/ci";
import { GoVerified } from "react-icons/go";
import { MdAccountBalance } from "react-icons/md";
import { FiCalendar, FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import AddAccountModal from "./modal/AddAccountModal";
const ACCOUNT_TYPES = ["Assets", "Liabilities", "Equity", "Income", "Expenses"];


const accounts = [
  // Assets
  {
    code: "1000",
    name: "Cash in Hand",
    parent: "Current Asset",
    category: "Current Asset",
    balance: 24500,
    type: "Assets",
    status: "Active",
  },
  {
    code: "1010",
    name: "Al Rajhi Bank – Current A/c",
    parent: "Current Asset",
    category: "Current Asset",
    balance: 612340,
    type: "Assets",
    status: "Active",
  },
  {
    code: "1200",
    name: "Accounts Receivable",
    parent: "Current Asset",
    category: "Current Asset",
    balance: 54508.5,
    type: "Assets",
    status: "Active",
  },
  {
    code: "1300",
    name: "Inventory",
    parent: "Current Asset",
    category: "Current Asset",
    balance: 136085,
    type: "Assets",
    status: "Active",
  },
  {
    code: "1400",
    name: "VAT Receivable (Input VAT)",
    parent: "Current Asset",
    category: "Current Asset",
    balance: 38166.75,
    type: "Assets",
    status: "Active",
  },
  {
    code: "1500",
    name: "Fixed Assets – Equipment",
    parent: "Fixed Asset",
    category: "Fixed Asset",
    balance: 1550000,
    type: "Assets",
    status: "Active",
  },

  // Liabilities
  {
    code: "2000",
    name: "Accounts Payable",
    parent: "Current Liability",
    category: "Current Liability",
    balance: 112450,
    type: "Liabilities",
    status: "Active",
  },
  {
    code: "2100",
    name: "VAT Payable (Output VAT)",
    parent: "Current Liability",
    category: "Current Liability",
    balance: 68970,
    type: "Liabilities",
    status: "Active",
  },

  // Equity
  {
    code: "3000",
    name: "Share Capital",
    parent: "Equity",
    category: "Equity",
    balance: 250000,
    type: "Equity",
    status: "Active",
  },
  {
    code: "3100",
    name: "Retained Earnings",
    parent: "Equity",
    category: "Equity",
    balance: 175000,
    type: "Equity",
    status: "Active",
  },

  // Income
  {
    code: "4000",
    name: "Sales Revenue",
    parent: "Operating Income",
    category: "Operating Income",
    balance: 845000,
    type: "Income",
    status: "Active",
  },
  {
    code: "4100",
    name: "Service Income",
    parent: "Operating Income",
    category: "Operating Income",
    balance: 126500,
    type: "Income",
    status: "Active",
  },
  {
    code: "4200",
    name: "Other Income",
    parent: "Other Income",
    category: "Other Income",
    balance: 18200,
    type: "Income",
    status: "Active",
  },

  // Expenses
  {
    code: "5000",
    name: "Cost of Goods Sold",
    parent: "Direct Expense",
    category: "Direct Expense",
    balance: 412000,
    type: "Expenses",
    status: "Active",
  },
  {
    code: "5100",
    name: "Salaries & Wages",
    parent: "Operating Expense",
    category: "Operating Expense",
    balance: 198000,
    type: "Expenses",
    status: "Active",
  },
  {
    code: "5200",
    name: "Rent Expense",
    parent: "Operating Expense",
    category: "Operating Expense",
    balance: 72000,
    type: "Expenses",
    status: "Active",
  },
];

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const ChartOfAccounts = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const filteredAccounts = useMemo(() => {
    const searchValue = search.toLowerCase();

    return accounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(searchValue) ||
        account.code.toLowerCase().includes(searchValue);

      const matchesType =
        typeFilter === "All" || account.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || account.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, typeFilter, statusFilter]);

  const groupedAccounts = ACCOUNT_TYPES.reduce((groups, type) => {
    groups[type] = filteredAccounts.filter(
      (account) => account.type === type
    );
    return groups;
  }, {});

  const countByType = (type) =>
    accounts.filter((account) => account.type === type).length;

  const padCount = (value) => String(value).padStart(2, "0");

  const totalAccounts = accounts.length;

  const activeAccounts = accounts.filter(
    (account) => account.status === "Active"
  ).length;

  const sectionTotal = (items) =>
    items.reduce((total, account) => total + account.balance, 0);
const handleExport = () => {
  const headers = [
    "Code",
    "Account Name",
    "Parent Account",
    "Category",
    "Type",
    "Balance (SAR)",
    "Status",
  ];

  const escapeCell = (value) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const rows = filteredAccounts.map((account) => [
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

  // "\uFEFF" makes Excel read the file as UTF-8 (needed for the "–" in names)
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
  const statsCards = [
    {
      title: "Total Accounts",
      count: totalAccounts,
      icon: <MdAccountBalance />,
      backgroundColor: "#E8F5E9",
      iconColor: "#2E7D32",
      onClick: () => {
        setTypeFilter("All");
        setStatusFilter("All");
      },
    },
    {
      title: "Active Accounts",
      count: activeAccounts,
      icon: <FiCalendar />,
      backgroundColor: "#EDE7F6",
      iconColor: "#6A1B9A",
      onClick: () => setStatusFilter("Active"),
    },
    {
      title: "Asset Accounts",
      count: padCount(countByType("Assets")),
      icon: <GoVerified />,
      backgroundColor: "#E0F7EF",
      iconColor: "#00A86B",
      onClick: () => setTypeFilter("Assets"),
    },
    {
      title: "Liability Accounts",
      count: padCount(countByType("Liabilities")),
      icon: <FiCalendar />,
      backgroundColor: "#FFF3E0",
      iconColor: "#EF6C00",
      onClick: () => setTypeFilter("Liabilities"),
    },
    {
      title: "Equity Accounts",
      count: padCount(countByType("Equity")),
      icon: <FiCalendar />,
      backgroundColor: "#FDECEA",
      iconColor: "#D32F2F",
      onClick: () => setTypeFilter("Equity"),
    },

  ];
  const SECTION_COLORS = {
    Assets: "#15B03E",
    Liabilities: "#E03131",
    Equity: "#7048E8",
    Income: "#1C7ED6",
    Expenses: "#F76707",
  };
  return (
    <Page>
      <ReusableHeader
        title="Chart Of Accounting"
        breadcrumbs={["Accounting", "Chart Of Accounting"]}
        buttonText="+ ADD NEW Account"
        onButtonClick={() => setIsAddAccountOpen(true)}
      >
        <ExportButton type="button" onClick={handleExport}>
          <FiDownload /> Export Accounts
        </ExportButton>
      </ReusableHeader>

      <StatsCards cards={statsCards} />

      <ContentCard>
        {/* Filters */}
        <FilterSection>
          <SearchBox>
            <SearchIcon>
              <CiSearch />
            </SearchIcon>

            <SearchInput
              type="text"
              placeholder="Search Account"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </SearchBox>

          <SelectWrapper>
            <Select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="All">All Type</option>
              <option value="Assets">Assets</option>
              <option value="Liabilities">Liabilities</option>
              <option value="Equity">Equity</option>
              <option value="Income">Income</option>
              <option value="Expenses">Expenses</option>
            </Select>

            <SelectArrow>⌄</SelectArrow>
          </SelectWrapper>

          <SelectWrapper>
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>

            <SelectArrow>⌄</SelectArrow>
          </SelectWrapper>
        </FilterSection>

        {/* Account Groups */}
        {Object.entries(groupedAccounts).map(([type, items]) => {
          if (!items.length) return null;

          return (
            <AccountSection key={type}>
              <SectionHeader className={type.toLowerCase()}>
                <SectionTitleWrapper>
                  <SectionIcon $color={SECTION_COLORS[type]}>
                    <MdAccountBalance />
                  </SectionIcon>
                  <div>
                    <SectionTitle>{type.toUpperCase()}</SectionTitle>

                    <SectionCount>{items.length} Accounts</SectionCount>
                  </div>
                </SectionTitleWrapper>

                <SectionTotal>
                  SAR {formatAmount(sectionTotal(items))}
                </SectionTotal>
              </SectionHeader>

              <TableWrapper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Code</TableHeader>
                      <TableHeader>Account Name</TableHeader>
                      <TableHeader>Parent Account</TableHeader>
                      <TableHeader>Category</TableHeader>
                      <TableHeader>Balance (SAR)</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Action</TableHeader>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {items.map((account) => (
                      <TableRow key={`${account.type}-${account.code}`}>
                        <TableCell>{account.code}</TableCell>

                        <TableCell>{account.name}</TableCell>

                        <TableCell>{account.parent}</TableCell>

                        <TableCell>{account.category}</TableCell>

                        <TableCell>{formatAmount(account.balance)}</TableCell>

                        <TableCell>
                          <Status className={account.status.toLowerCase()}>
                            {account.status}
                          </Status>
                        </TableCell>

                        <TableCell>
                          <ActionWrapper>
                            <EditButton title="Edit"><CiEdit /></EditButton>

                            <DeleteButton title="Delete"><RxCross2 /></DeleteButton>
                          </ActionWrapper>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableWrapper>
            </AccountSection>
          );
        })}
      </ContentCard>
      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
      />
    </Page>

  );
};

export default ChartOfAccounts;