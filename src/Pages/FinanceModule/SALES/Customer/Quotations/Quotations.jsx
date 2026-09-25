import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

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
import { getCustomerQuotations } from "../../../../../Redux/finance/Sales/CustomerSlice";

const Quotations = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams(); // adjust if id comes via props instead

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    quotations,
    quotationsKpiCards,
    quotationsTotalPages,
    quotationsLoading,
  } = useSelector((state) => state.customer);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {
    if (!customerId) return;

    dispatch(
      getCustomerQuotations({
        id: customerId,
        params: {
          page: currentPage,
          search: search || undefined,
        },
      })
    );
  }, [dispatch, customerId, currentPage, search]);

  /* =========================================================
     STATS (from kpi_cards)
  ========================================================= */

  const quotationStats = [
    {
      title: "Total Quotations",
      count: quotationsKpiCards?.total_quotations ?? 0,
      icon: <FiFileText />,
      backgroundColor: "#E8F1FF",
      iconColor: "#3478F6",
    },
    {
      title: "Total Amount",
      count: `AED ${(quotationsKpiCards?.total_amount ?? 0).toLocaleString()}`,
      icon: <FiDollarSign />,
      backgroundColor: "#FFF4E5",
      iconColor: "#F59E0B",
    },
    {
      title: "Negotiation Amount",
      count: `AED ${(quotationsKpiCards?.negotiation_amount ?? 0).toLocaleString()}`,
      icon: <FiRefreshCw />,
      backgroundColor: "#E8F8EF",
      iconColor: "#22A06B",
    },
    {
      title: "Rejected Quotations",
      count: quotationsKpiCards?.rejected_quotations ?? 0,
      icon: <FiXCircle />,
      backgroundColor: "#FDECEC",
      iconColor: "#E5484D",
    },
    {
      title: "Approved Quotations",
      count: quotationsKpiCards?.approved_quotations ?? 0,
      icon: <FiCheckCircle />,
      backgroundColor: "#E8F8EF",
      iconColor: "#22A06B",
    },
  ];

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
        data={quotations || []}
        loading={quotationsLoading}
      />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={quotationsTotalPages || 1}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Quotations;