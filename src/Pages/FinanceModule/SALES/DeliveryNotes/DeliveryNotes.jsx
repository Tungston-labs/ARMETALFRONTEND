import React, { useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import {
  DateRangeWrapper,
  DatePickerContainer,
  DateInput,
  DateSeparator,
  ExportButton,
} from "./DeliveryNotes.style";

import {
  salesOrderColumns,
  salesOrderData,
  salesOrderStats,
} from "./DeliveryNotesColoumns";

const getCurrentMonthRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return { start: formatDate(firstDay), end: formatDate(lastDay) };
};

const DeliveryNotes = () => {
  const navigate = useNavigate();
  const currentMonth = getCurrentMonthRange();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [customer, setCustomer] = useState("");
  const [startDate, setStartDate] = useState(currentMonth.start);
  const [endDate, setEndDate] = useState(currentMonth.end);

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return salesOrderData.filter((row) => {
      const searchValue = search.trim().toLowerCase();
      const rowText = Object.values(row).join(" ").toLowerCase();
      const matchesSearch = !searchValue || rowText.includes(searchValue);

      const matchesStatus =
        !status || row.status.toLowerCase() === status.toLowerCase();

      const matchesCustomer =
        !customer || row.customer.toLowerCase() === customer.toLowerCase();

      const matchesStartDate = !startDate || row.order_date >= startDate;
      const matchesEndDate = !endDate || row.order_date <= endDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCustomer &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [search, status, customer, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const getStatusCount = (targetStatus) =>
    filteredData.filter(
      (row) => row.status.toLowerCase() === targetStatus.toLowerCase(),
    ).length;

  const totalAmount = filteredData.reduce((sum, row) => {
    const amount = Number(
      String(row.amount).replace("SAR", "").replace(/,/g, "").trim(),
    );
    return sum + (Number.isNaN(amount) ? 0 : amount);
  }, 0);

  const stats = salesOrderStats({
    totalOrders: filteredData.length,
    totalAmount: ` ${totalAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    completedOrders: getStatusCount("Completed"),
    pendingOrders: getStatusCount("Pending"),
    cancelledOrders: getStatusCount("Cancelled"),
  });

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setStartDate("");
      setCurrentPage(1);
      return;
    }
    setStartDate(value);
    setCurrentPage(1);
    if (endDate && value > endDate) setEndDate(value);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setEndDate("");
      setCurrentPage(1);
      return;
    }
    if (startDate && value < startDate) return;
    setEndDate(value);
    setCurrentPage(1);
  };

  const handleExport = () => {
    console.log("Export Sales Orders", {
      startDate,
      endDate,
      search,
      status,
      customer,
    });
    // Add Excel/PDF export logic here
  };

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Sales Orders"
        breadcrumbs={["Sales", "Sales Orders"]}
        buttonText="+ CREATE DELIVERY NOTE"
        onButtonClick={() => navigate("add")}
      >
        <ExportButton type="button" onClick={handleExport}>
          <FiDownload />
          <span>Export</span>
        </ExportButton>

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

      <StatsCards cards={stats} />

      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search Order"
        showSearch
        status={status}
        statuses={["Completed", "Pending", "Cancelled"]}
        onStatus={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
        showStatus
        filters={[
          {
            key: "customer",
            value: customer,
            onChange: (value) => {
              setCustomer(value);
              setCurrentPage(1);
            },
            options: [
              { label: "ABC Trading", value: "ABC Trading" },
              { label: "Riyadh Tech", value: "Riyadh Tech" },
              { label: "Al Noor Company", value: "Al Noor Company" },
              { label: "Saudi Solutions", value: "Saudi Solutions" },
            ],
            placeholder: "All Customer",
          },
        ]}
        showFilterButton
        filterButtonText="Filter"
        onFilterClick={() => console.log("Filter clicked")}
      />

      <ReusableTable columns={salesOrderColumns} data={paginatedData} />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DeliveryNotes;
