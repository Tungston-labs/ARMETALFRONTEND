import React, { useMemo, useState } from "react";
import { FiFileText, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

import { vendorLedgerColumns, vendorLedgerData } from "./dummydata";
import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";

const VendorLedgerTab = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const rowsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(vendorLedgerData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return vendorLedgerData.slice(start, start + rowsPerPage);
  }, [currentPage]);

  // Calculate total debit and credit
  const totalDebit = useMemo(() => {
    return vendorLedgerData.reduce(
      (total, row) => total + Number(row.debit || 0),
      0,
    );
  }, []);

  const totalCredit = useMemo(() => {
    return vendorLedgerData.reduce(
      (total, row) => total + Number(row.credit || 0),
      0,
    );
  }, []);

  const totalBalance = useMemo(() => {
    return vendorLedgerData.reduce(
      (total, row) => total + Number(row.balance || 0),
      0,
    );
  }, []);

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Stats Cards
  const statsCards = [
    {
      title: "Total Purchase Orders",
      count: vendorLedgerData.length,
      icon: <FiFileText />,
      backgroundColor: "#EEF2FF",
      iconColor: "#4F46E5",
    },
    {
      title: "Pending Orders",
      count: 0,
      icon: <FiClock />,
      backgroundColor: "#FFF7ED",
      iconColor: "#F59E0B",
    },
    {
      title: "Approved Orders",
      count: 0,
      icon: <FiCheckCircle />,
      backgroundColor: "#ECFDF5",
      iconColor: "#10B981",
    },
    {
      title: "Rejected Orders",
      count: 0,
      icon: <FiXCircle />,
      backgroundColor: "#FEF2F2",
      iconColor: "#EF4444",
    },
  ];

  const totalRow = {
    debit: formatAmount(totalDebit),
    credit: formatAmount(totalCredit),
    balance: formatAmount(totalBalance),
  };

  return (
    <>
      <StatsCards cards={statsCards} />

      <ReusableFilter
        search={search}
        onSearch={setSearch}
        status={status}
        statuses={["Present", "Absent", "On Leave"]}
        onStatus={setStatus}
        showSearch
        showStatus
      />

      <ReusableTable
        columns={vendorLedgerColumns}
        data={paginatedData}
        totalRow={totalRow}
        totalRowLabel="TOTAL"
      />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default VendorLedgerTab;
