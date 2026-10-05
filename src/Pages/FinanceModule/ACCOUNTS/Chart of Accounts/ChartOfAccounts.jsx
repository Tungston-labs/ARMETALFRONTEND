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
} from "./ChartOfAccounts.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

const accounts = [
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
    code: "2000",
    name: "VAT Receivable (Input VAT)",
    parent: "Current Asset",
    category: "Current Asset",
    balance: 38166.75,
    type: "Assets",
    status: "Active",
  },
  {
    code: "2100",
    name: "Fixed Assets – Equipment",
    parent: "Fixed Asset",
    category: "Fixed Asset",
    balance: 1550000,
    type: "Assets",
    status: "Active",
  },
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

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const searchValue = search.toLowerCase();

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

  const groupedAccounts = {
    Assets: filteredAccounts.filter(
      (account) => account.type === "Assets"
    ),

    Liabilities: filteredAccounts.filter(
      (account) => account.type === "Liabilities"
    ),

    Equity: filteredAccounts.filter(
      (account) => account.type === "Equity"
    ),
  };

  const totalAccounts = accounts.length;

  const activeAccounts = accounts.filter(
    (account) => account.status === "Active"
  ).length;

  const assetAccounts = accounts.filter(
    (account) => account.type === "Assets"
  ).length;

  const liabilityAccounts = accounts.filter(
    (account) => account.type === "Liabilities"
  ).length;

  const equityAccounts = accounts.filter(
    (account) => account.type === "Equity"
  ).length;

  const sectionTotal = (items) =>
    items.reduce((total, account) => total + account.balance, 0);


  const statsCards = [
  {
    title: "Total Accounts",
    count: totalAccounts,
    icon: "▤",
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
    icon: "▤",
    backgroundColor: "#EDE7F6",
    iconColor: "#6A1B9A",
    onClick: () => setStatusFilter("Active"),
  },
  {
    title: "Asset Accounts",
    count: String(assetAccounts).padStart(2, "0"),
    icon: "✧",
    backgroundColor: "#E0F7EF",
    iconColor: "#00A86B",
    onClick: () => setTypeFilter("Assets"),
  },
  {
    title: "Liability Accounts",
    count: String(liabilityAccounts).padStart(2, "0"),
    icon: "▤",
    backgroundColor: "#FFF3E0",
    iconColor: "#EF6C00",
    onClick: () => setTypeFilter("Liabilities"),
  },
  {
    title: "Equity Accounts",
    count: String(equityAccounts).padStart(2, "0"),
    icon: "▤",
    backgroundColor: "#FDECEA",
    iconColor: "#D32F2F",
    onClick: () => setTypeFilter("Equity"),
  },
];
  return (
    <Page> 
 <ReusableHeader
                title="Chart Of Accounting"
                breadcrumbs={["Accounting","Chart Of Accounting"]}
                buttonText="+ ADD NEW Account"
                onButtonClick={() => console.log("Add Employee")}
            />   

  <StatsCards cards={statsCards} />
      <ContentCard>
        {/* Filters */}
        <FilterSection>
          <SearchBox>
            <SearchIcon>⌕</SearchIcon>

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
                  <SectionIcon>
                    {type === "Assets"
                      ? "▥"
                      : type === "Liabilities"
                      ? "▥"
                      : "◆"}
                  </SectionIcon>

                  <div>
                   <SectionTitle>{type.toUpperCase()}</SectionTitle>

                    <SectionCount>
                      {items.length} Accounts
                    </SectionCount>
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
                    {items.map((account, index) => (
                      <TableRow key={`${account.code}-${index}`}>
                        <TableCell>{account.code}</TableCell>

                        <TableCell>{account.name}</TableCell>

                        <TableCell>{account.parent}</TableCell>

                        <TableCell>{account.category}</TableCell>

                        <TableCell>
                          {formatAmount(account.balance)}
                        </TableCell>

                        <TableCell>
                          <Status
                            className={account.status.toLowerCase()}
                          >
                            {account.status}
                          </Status>
                        </TableCell>

                        <TableCell>
                          <ActionWrapper>
                            <EditButton title="Edit">
                              ♢
                            </EditButton>

                            <DeleteButton title="Delete">
                              ×
                            </DeleteButton>
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
    </Page>
  );
};

export default ChartOfAccounts;