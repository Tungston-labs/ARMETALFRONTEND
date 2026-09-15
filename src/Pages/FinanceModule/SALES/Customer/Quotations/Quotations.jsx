import React, { useMemo, useState } from "react";

import {
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiRefreshCw,
} from "react-icons/fi";

import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";

import { quotationColumns } from "./quotationColumns";

const Quotations = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const quotationData = [
    {
      quotationNo: "QT-0001",
      date: "15/09/2026",
      reference: "Customer Requirement",
      amount: "SAR 25,000.00",
      status: "Approved",
      validUntil: "30/09/2026",
      createdBy: "Admin",
      action: "View",
    },
    {
      quotationNo: "QT-0002",
      date: "14/09/2026",
      reference: "Annual Contract",
      amount: "SAR 18,500.00",
      status: "Negotiation",
      validUntil: "29/09/2026",
      createdBy: "Admin",
      action: "View",
    },
    {
      quotationNo: "QT-0003",
      date: "12/09/2026",
      reference: "Product Purchase",
      amount: "SAR 12,000.00",
      status: "Rejected",
      validUntil: "27/09/2026",
      createdBy: "Admin",
      action: "View",
    },
  ];

  /* =========================================================
     STATS
  ========================================================= */

  const quotationStats = [
    {
      title: "Total Quotations",
      count: quotationData.length,
      icon: <FiFileText />,
      backgroundColor: "#E8F1FF",
      iconColor: "#3478F6",
    },
    {
      title: "Total Amount",
      count: "SAR 55,500",
      icon: <FiDollarSign />,
      backgroundColor: "#FFF4E5",
      iconColor: "#F59E0B",
    },
    {
      title: "Negotiation Amount",
      count: "SAR 18,500",
      icon: <FiRefreshCw />,
      backgroundColor: "#E8F8EF",
      iconColor: "#22A06B",
    },
    {
      title: "Rejected Quotations",
      count: 1,
      icon: <FiXCircle />,
      backgroundColor: "#FDECEC",
      iconColor: "#E5484D",
    },
    {
      title: "Approved Quotations",
      count: 1,
      icon: <FiCheckCircle />,
      backgroundColor: "#E8F8EF",
      iconColor: "#22A06B",
    },
  ];

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return quotationData;
    }

    const searchValue = search.toLowerCase();

    return quotationData.filter((item) =>
      Object.values(item).some((value) =>
        String(value)
          .toLowerCase()
          .includes(searchValue)
      )
    );
  }, [search]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(
    filteredData.length / rowsPerPage
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return filteredData.slice(
      start,
      start + rowsPerPage
    );
  }, [currentPage, filteredData]);

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <>
      <StatsCards cards={quotationStats} />

      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        showSearch
      />

      <ReusableTable
        columns={quotationColumns}
        data={paginatedData}
      />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Quotations;