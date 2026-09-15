
import React, { useMemo, useState } from "react";
import { FiFileText, FiCheckCircle, FiXCircle, FiDollarSign, FiRefreshCw } from "react-icons/fi";

import {
  employeeColumns,
  employeeData,
} from "../../../../../Components/ReusableTable/dummydata";

import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";

const Orders = () => {
  const [search, setSearch] = useState("");

  const rowsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);


  /* =========================================================
     QUOTATION STATS
  ========================================================= */

const quotationStats = [
  {
    title: "Total Orders",
    count: employeeData.length,
    icon: <FiFileText />,
    backgroundColor: "#E8F1FF",
    iconColor: "#3478F6",
  },

  {
    title: "Open Orders",
    count: 0,
    icon: <FiDollarSign />,
    backgroundColor: "#FFF4E5",
    iconColor: "#F59E0B",
  },

  {
    title: "Completed Orders",
    count: 0,
    icon: <FiRefreshCw />,
    backgroundColor: "#E8F8EF",
    iconColor: "#22A06B",
  },

  {
    title: "Order Value",
    count: 0,
    icon: <FiXCircle />,
    backgroundColor: "#FDECEC",
    iconColor: "#E5484D",
  },

];

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(
    employeeData.length / rowsPerPage
  );


  /* =========================================================
     PAGINATED DATA
  ========================================================= */

  const paginatedData = useMemo(() => {
    const start =
      (currentPage - 1) * rowsPerPage;

    return employeeData.slice(
      start,
      start + rowsPerPage
    );
  }, [currentPage]);


  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <>
      {/* =====================================================
          STATS CARDS
      ===================================================== */}

      <StatsCards
        cards={quotationStats}
      />


      {/* =====================================================
          FILTER
      ===================================================== */}

      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        showSearch
      />


      {/* =====================================================
          TABLE
      ===================================================== */}

      <ReusableTable
        columns={employeeColumns}
        data={paginatedData}
      />


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Orders;