import React, { useMemo, useState } from "react";

import {
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiPlus,
  FiSearch,
  FiUpload,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import {
  PageContainer,
  Header,
  HeaderLeft,
  PageTitle,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  HeaderActions,
  HeaderButton,
  NewEntryButton,
  DateRangeButton,
  StatsGrid,
  SummaryBar,
  SummaryItem,
  SummaryIcon,
  SummaryContent,
  SummaryLabel,
  SummaryValue,
  SummaryStatus,
  StatusLabel,
  StatusValue,
  StatusCheck,
  ContentCard,
  FilterBar,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterWrapper,
  FilterSelect,
  FilterArrow,
  TableWrapper,
  JournalTable,
  StatusBadge,
  SourceText,
  BottomBar,
  ShowingText,
  Pagination,
  PaginationButton,
  PaginationNumber,
} from "./JournalEntry.style";

import JournalEntriesStats from "./JournalEntryStats";
import JournalEntryAction from "./Action/JournalEntryAction";

const JournalEntries = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const [entries] = useState([
    {
      id: 1,
      entryNo: "JE-1842",
      date: "20 June 2026",
      reference: "INV0401",
      description: "Invoice INV0401 — Al Noor Trading LLC",
      source: "Auto",
      debit: "4,200.00",
      credit: "4,200.00",
      status: "Posted",
      createdBy: "System",
    },
    {
      id: 2,
      entryNo: "JE-1842",
      date: "20 June 2026",
      reference: "INV0401",
      description: "Payment received PAY0501 — Mediora",
      source: "Auto",
      debit: "2,600.00",
      credit: "2,600.00",
      status: "Posted",
      createdBy: "System",
    },
    {
      id: 3,
      entryNo: "JE-1842",
      date: "20 June 2026",
      reference: "INV0401",
      description: "Bill BILL 0401 — Al Noor Trading (Vendor)",
      source: "Auto",
      debit: "9,904.20",
      credit: "9,904.20",
      status: "Pending",
      createdBy: "System",
    },
    {
      id: 4,
      entryNo: "JE-1842",
      date: "20 June 2026",
      reference: "INV0401",
      description: "Depreciation — Office Equipment (Apr 2026)",
      source: "Auto",
      debit: "5,500.00",
      credit: "5,500.00",
      status: "Posted",
      createdBy: "System",
    },
    {
      id: 5,
      entryNo: "JE-1842",
      date: "20 June 2026",
      reference: "INV0401",
      description: "Correction — misposted utility expense (Mar)",
      source: "Manual",
      debit: "1,200.00",
      credit: "1,200.00",
      status: "Draft",
      createdBy: "Admin",
    },
    {
      id: 6,
      entryNo: "JE-1842",
      date: "20 June 2026",
      reference: "INV0401",
      description: "Opening balance adjustment — Petty Cash",
      source: "Manual",
      debit: "3,000.00",
      credit: "3,000.00",
      status: "Posted",
      createdBy: "Admin",
    },
    {
      id: 7,
      entryNo: "JE-1842",
      date: "20 June 2026",
      reference: "INV0401",
      description: "Credit Note CN0034 — Al Noor Trading LLC",
      source: "Manual",
      debit: "412.17",
      credit: "412.17",
      status: "Posted",
      createdBy: "Admin",
    },
    {
      id: 8,
      entryNo: "JE-1842",
      date: "20 June 2026",
      reference: "INV0401",
      description: "Credit Note CN0034 — Al Noor Trading LLC",
      source: "Auto",
      debit: "412.17",
      credit: "412.17",
      status: "Posted",
      createdBy: "System",
    },
  ]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        entry.entryNo.toLowerCase().includes(searchValue) ||
        entry.reference.toLowerCase().includes(searchValue) ||
        entry.description.toLowerCase().includes(searchValue);

      const matchesSource =
        !source || entry.source.toLowerCase() === source.toLowerCase();

      const matchesStatus =
        !status || entry.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesSource && matchesStatus;
    });
  }, [entries, search, source, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEntries.length / rowsPerPage),
  );

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleSourceChange = (event) => {
    setSource(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setCurrentPage(1);
  };

  const handleNewEntry = () => {
    navigate("/accounts/journal-entries/new");
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const handleExport = () => {
    console.log("Export journal entries");
  };

  return (
    <PageContainer>
      {/* ================= HEADER ================= */}

      <Header>
        <HeaderLeft>
          <PageTitle>Journal Entries</PageTitle>

          <Breadcrumb>
            <BreadcrumbItem>
              <FiFileText size={13} />
              Dashboard
            </BreadcrumbItem>

            <BreadcrumbSeparator>›</BreadcrumbSeparator>

            <BreadcrumbItem>Accounting</BreadcrumbItem>

            <BreadcrumbSeparator>›</BreadcrumbSeparator>

            <BreadcrumbItem active>Journal Entries</BreadcrumbItem>
          </Breadcrumb>
        </HeaderLeft>

        <HeaderActions>
          <HeaderButton type="button" onClick={handleExport}>
            <FiUpload size={14} />
            IMPORT JOURNAL
          </HeaderButton>

          <NewEntryButton type="button" onClick={handleNewEntry}>
            <FiPlus size={15} />
            NEW JOURNAL ENTRY
          </NewEntryButton>

          <DateRangeButton type="button">
            <span>01 Apr 2026 - 30 Apr 2026</span>
            <FiCalendar size={13} />
          </DateRangeButton>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="User"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: "15px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                ARUN S
              </span>

              <span
                style={{
                  fontSize: "10px",
                  color: "#111827",
                }}
              >
                ADMIN
              </span>
            </div>
          </div>
        </HeaderActions>
      </Header>

      {/* ================= STAT CARDS ================= */}

      <StatsGrid>
        <JournalEntriesStats />
      </StatsGrid>

      {/* ================= SUMMARY ================= */}

      <SummaryBar>
        <SummaryItem>
          <SummaryIcon $type="debit">
            <FiFileText />
          </SummaryIcon>

          <SummaryContent>
            <SummaryLabel>Total Debit (This Month)</SummaryLabel>

            <SummaryValue>SAR 26,816.37</SummaryValue>
          </SummaryContent>
        </SummaryItem>

        <SummaryItem>
          <SummaryIcon $type="credit">
            <FiFileText />
          </SummaryIcon>

          <SummaryContent>
            <SummaryLabel>Total Credit (This Month)</SummaryLabel>

            <SummaryValue>SAR 26,816.37</SummaryValue>
          </SummaryContent>
        </SummaryItem>

        <SummaryStatus>
          <div>
            <StatusLabel>Journal Status</StatusLabel>

            <StatusValue>Balanced</StatusValue>
          </div>

          <StatusCheck>
            <FiCheckCircle />
          </StatusCheck>
        </SummaryStatus>
      </SummaryBar>

      {/* ================= TABLE CARD ================= */}

      <ContentCard>
        {/* FILTERS */}

        <FilterBar>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
            />

            <SearchIcon>
              <FiSearch />
            </SearchIcon>
          </SearchContainer>

          <FilterWrapper>
            <FilterSelect value={source} onChange={handleSourceChange}>
              <option value="">All Sources</option>
              <option value="Auto">Auto</option>
              <option value="Manual">Manual</option>
            </FilterSelect>

            <FilterArrow>
              <FiChevronDown />
            </FilterArrow>
          </FilterWrapper>

          <FilterWrapper>
            <FilterSelect value={status} onChange={handleStatusChange}>
              <option value="">All Status</option>
              <option value="Posted">Posted</option>
              <option value="Pending">Pending</option>
              <option value="Draft">Draft</option>
              <option value="Voided">Voided</option>
            </FilterSelect>

            <FilterArrow>
              <FiChevronDown />
            </FilterArrow>
          </FilterWrapper>
        </FilterBar>

        {/* TABLE */}

        <TableWrapper>
          <JournalTable>
            <thead>
              <tr>
                <th>Entry No.</th>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Source</th>
                <th>Debit (SAR)</th>
                <th>Credit (SAR)</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEntries.length > 0 ? (
                paginatedEntries.map((row) => (
                  <tr key={row.id}>
                    <td>{row.entryNo}</td>

                    <td>{row.date}</td>

                    <td>{row.reference}</td>

                    <td>{row.description}</td>

                    <td>
                      <SourceText $manual={row.source === "Manual"}>
                        {row.source}
                      </SourceText>
                    </td>

                    <td>{row.debit}</td>

                    <td>{row.credit}</td>

                    <td>
                      <StatusBadge $status={row.status}>
                        {row.status}
                      </StatusBadge>
                    </td>

                    <td>{row.createdBy}</td>

                    <td>
                      <JournalEntryAction row={row} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No journal entries found
                  </td>
                </tr>
              )}
            </tbody>
          </JournalTable>
        </TableWrapper>
      </ContentCard>

      {/* ================= PAGINATION ================= */}

      <BottomBar>
        <ShowingText>
          Showing{" "}
          {filteredEntries.length === 0
            ? 0
            : (currentPage - 1) * rowsPerPage + 1}
          –{Math.min(currentPage * rowsPerPage, filteredEntries.length)} of
          1,842 entries
        </ShowingText>

        <Pagination>
          <PaginationButton
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </PaginationButton>

          {[1, 2, 3].map((page) => (
            <PaginationNumber
              key={page}
              type="button"
              $active={currentPage === page}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationNumber>
          ))}

          <PaginationButton
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </PaginationButton>
        </Pagination>
      </BottomBar>
    </PageContainer>
  );
};

export default JournalEntries;
