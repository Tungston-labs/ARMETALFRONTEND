import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiRefreshCw,
  FiXCircle,
  FiDollarSign,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";
import { paymentsColumns } from "./paymentsColumns";
import {
  getCustomerPayments,
} from "../../../../../Redux/finance/Sales/CustomerSlice";

const Payments = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    customerPayments,
    customerPaymentsTotalItems,
    customerPaymentsTotalPages,
    customerPaymentsCurrentPage,
    customerPaymentsKpis,
    customerPaymentsLoading,
  } = useSelector((state) => state.customer);

  /* =========================================================
     FETCH CUSTOMER PAYMENTS
  ========================================================= */

  useEffect(() => {
    if (!customerId) return;

    dispatch(
      getCustomerPayments({
        customerId,
        params: {
          page: currentPage,
          ...(search ? { search } : {}),
        },
      })
    );
  }, [dispatch, customerId, currentPage, search]);

  /* =========================================================
     KPI CARDS
  ========================================================= */

  const quotationStats = [
    {
      title: "Total Payments Received",
      count:
        customerPaymentsKpis?.total_payments_received ?? 0,
      icon: <FiFileText />,
      backgroundColor: "#E8F1FF",
      iconColor: "#3478F6",
    },

    {
      title: "This Month Collections",
      count:
        customerPaymentsKpis?.this_month_collections ?? 0,
      icon: <FiDollarSign />,
      backgroundColor: "#FFF4E5",
      iconColor: "#F59E0B",
    },

    {
      title: "Pending Payments",
      count:
        customerPaymentsKpis?.pending_payments ?? 0,
      icon: <FiRefreshCw />,
      backgroundColor: "#E8F8EF",
      iconColor: "#22A06B",
    },

    {
      title: "Overdue Amount",
      count:
        customerPaymentsKpis?.overdue_amount ?? 0,
      icon: <FiXCircle />,
      backgroundColor: "#FDECEC",
      iconColor: "#E5484D",
    },
  ];

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* =========================================================
     PAGINATION
     ========================================================= */

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
        loading={customerPaymentsLoading}
      />

      {/* =====================================================
          FILTER
      ===================================================== */}

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        showSearch
      />

      {/* =====================================================
          TABLE
      ===================================================== */}

      <ReusableTable
        columns={paymentsColumns}
        data={customerPayments}
        loading={customerPaymentsLoading}
      />

      {/* =====================================================
          BACKEND PAGINATION
      ===================================================== */}

      <ReusablePagination
        currentPage={customerPaymentsCurrentPage || currentPage}
        totalPages={customerPaymentsTotalPages}
        totalRecords={customerPaymentsTotalItems}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Payments;