import React, { useMemo, useState } from "react";

import {
  employeeColumns,
  employeeData,
} from "../../../../Components/ReusableTable/dummydata";

import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";

import {
  FiDollarSign,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiDownload,
} from "react-icons/fi";

import StatsCards from "../../../../Components/StatsCards/StatsCards";
import AddLedgerModal from "./modal/AddLedgerModal";

import {
  DateInput,
  DatePickerContainer,
  DateRangeWrapper,
  DateSeparator,
  ExportButton,
} from "./CustomerLedger.styles";

const CustomerLedger = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [customer, setCustomer] = useState("");

  // Date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

  // Ledger data
  const [ledgerData, setLedgerData] = useState(employeeData);

  const rowsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ledgerData.length / rowsPerPage);

  // Start date
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setCurrentPage(1);
  };

  // End date
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setCurrentPage(1);
  };

  // Open modal
  const handleAddLedger = () => {
    setIsLedgerModalOpen(true);
  };

  // Close modal
  const handleCloseLedger = () => {
    setIsLedgerModalOpen(false);
  };

  // Save ledger
  const handleSaveLedger = (newLedger) => {
    console.log("New Ledger Entry:", newLedger);

    const newEntry = {
      ...newLedger,
      id: Date.now(),
    };

    setLedgerData((prev) => [newEntry, ...prev]);

    setIsLedgerModalOpen(false);
    setCurrentPage(1);
  };

  // Export
  const handleExport = () => {
    console.log("Export Customer Ledger", {
      startDate,
      endDate,
      search,
      status,
      transactionType,
      customer,
    });
  };

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return ledgerData.slice(start, start + rowsPerPage);
  }, [currentPage, ledgerData]);

  // Customer Ledger Stats
  const cards = [
    {
      title: "Total Receivables",
      count: "SAR 45,000",
      icon: <FiDollarSign />,
      backgroundColor: "#E8F7EE",
      iconColor: "#127923",
    },
    {
      title: "Total Invoices",
      count: "SAR 32,500",
      icon: <FiCheckCircle />,
      backgroundColor: "#F3EFEC",
      iconColor: "#000000",
    },
    {
      title: "Total Collections",
      count: "SAR 12,500",
      icon: <FiCreditCard />,
      backgroundColor: "#E0F3F7",
      iconColor: "#4455EF",
    },
    {
      title: "Total Credit Notes",
      count: "08",
      icon: <FiClock />,
      backgroundColor: "#FEF5E6",
      iconColor: "#F48211",
    },
    {
      title: "Overdue Amount",
      count: "SAR 8,000",
      icon: <FiClock />,
      backgroundColor: "#E0F3F7",
      iconColor: "#000000",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <ReusableHeader
        title="Customer Ledger"
        breadcrumbs={["Sales", "Customer Ledger"]}
        buttonText="+ NEW JOURNAL ENTRY"
        onButtonClick={handleAddLedger}
      >
        {/* Export */}
        <ExportButton type="button" onClick={handleExport}>
          <FiDownload />
          <span>Export</span>
        </ExportButton>

        {/* Date Range */}
        <DateRangeWrapper>
          <DatePickerContainer>
            <DateInput
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              max={endDate || undefined}
              aria-label="Start date"
            />

            <DateSeparator>-</DateSeparator>

            <DateInput
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || undefined}
              aria-label="End date"
            />
          </DatePickerContainer>
        </DateRangeWrapper>
      </ReusableHeader>

      {/* Stats Cards */}
      <StatsCards cards={cards} loading={false} />

      {/* Filters */}
      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search Ledger"
        showSearch
        status={status}
        statuses={["Paid", "Pending", "Partially Paid", "Overdue"]}
        onStatus={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
        showStatus
        filters={[
          {
            key: "transactionType",
            value: transactionType,
            onChange: (value) => {
              setTransactionType(value);
              setCurrentPage(1);
            },
            options: [
              {
                label: "Invoice",
                value: "Invoice",
              },
              {
                label: "Payment",
                value: "Payment",
              },
              {
                label: "Credit Note",
                value: "Credit Note",
              },
              {
                label: "Journal Entry",
                value: "Journal Entry",
              },
            ],
            placeholder: "All Transaction Types",
          },

          {
            key: "customer",
            value: customer,
            onChange: (value) => {
              setCustomer(value);
              setCurrentPage(1);
            },
            options: [
              {
                label: "ABC Trading",
                value: "ABC Trading",
              },
              {
                label: "Riyadh Tech",
                value: "Riyadh Tech",
              },
              {
                label: "Al Noor Company",
                value: "Al Noor Company",
              },
              {
                label: "Saudi Solutions",
                value: "Saudi Solutions",
              },
            ],
            placeholder: "All Customers",
          },
        ]}
        showFilterButton
        filterButtonText="Filter"
        onFilterClick={() => {
          console.log("Ledger filter clicked", {
            search,
            transactionType,
            customer,
            status,
          });
        }}
      />

      {/* Table */}
      <ReusableTable columns={employeeColumns} data={paginatedData} />

      {/* Pagination */}
      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={ledgerData.length}
        onPageChange={setCurrentPage}
      />

      {/* Add Ledger Modal */}
      <AddLedgerModal
        isOpen={isLedgerModalOpen}
        onClose={handleCloseLedger}
        onSave={handleSaveLedger}
      />
    </div>
  );
};

export default CustomerLedger;
