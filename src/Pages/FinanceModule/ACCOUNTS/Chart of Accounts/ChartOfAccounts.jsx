import React from "react";
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
  ExportButton,
} from "./ChartOfAccounts.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import { CiSearch } from "react-icons/ci";
import { MdAccountBalance } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import AddAccountModal from "./modal/AddAccountModal";
import useChartOfAccounts, {
  SECTION_COLORS,
  formatAmount,
  padCount,
  sectionTotal,
} from "./Usechartofaccounts";
import ReusableConfirmModal from "../../../../Components/modals/ReusableConfirmModal";
import { getAccountColumns,getStatsCards } from "./Chartofaccountscolumns";

const ChartOfAccounts = () => {
  const {
    loading,
    errorText,
    totalAccounts,
    filteredCount,
    groupedAccounts,
    stats,

    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    showAll,

    isModalOpen,
    editingAccount,
    handleAdd,
    handleEdit,
    handleCloseModal,

    handleDelete,
    handleExport,

    deleteTarget,
    handleCancelDelete,
    handleConfirmDelete,
  } = useChartOfAccounts();


const columns = getAccountColumns({
  onEdit: handleEdit,
  onDelete: handleDelete,
});

const statsCards = getStatsCards({
  stats,
  showAll,
  setStatusFilter,
  setTypeFilter,
});

  return (
    <Page>
      <ReusableHeader
        title="Chart Of Accounting"
        breadcrumbs={["Accounting", "Chart Of Accounting"]}
        buttonText="+ ADD NEW Account"
        onButtonClick={handleAdd}
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

        {/* Loading / error / empty states */}
        {loading && totalAccounts === 0 && <p>Loading accounts...</p>}

        {errorText && <p style={{ color: "#D32F2F" }}>{errorText}</p>}

        {!loading && !errorText && filteredCount === 0 && (
          <p>No accounts found.</p>
        )}

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

                <SectionTotal>{formatAmount(sectionTotal(items))}</SectionTotal>
              </SectionHeader>

              <TableWrapper>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHeader key={column.key}>
                          {column.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {items.map((account) => (
                      <TableRow key={account.id}>
                        {columns.map((column) => (
                          <TableCell key={column.key}>
                            {column.render(account)}
                          </TableCell>
                        ))}
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
        key={editingAccount?.id ?? "new"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        account={editingAccount}
      />

      {/* Delete confirmation */}
      <ReusableConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Account"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.code} - ${deleteTarget.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loadingText="Deleting..."
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
      />
    </Page>
  );
};

export default ChartOfAccounts;