import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiFileText, FiDollarSign, FiRefreshCw, FiXCircle } from "react-icons/fi";

import { ledgerColumns } from "./ledgerColumns";
import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";
import { LedgerTableWrapper } from "./Ledger.styles";
import { getCustomerLedger } from "../../../../../Redux/finance/Sales/CustomerSlice";

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Ledger = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    ledger,
    ledgerTotalPages,
    ledgerKpis,
    ledgerLoading,
  } = useSelector((state) => state.customer);

  /* =========================================================
     FETCH LEDGER
  ========================================================= */

  useEffect(() => {
    if (!customerId) return;

    dispatch(
      getCustomerLedger({
        customerId,
        params: {
          page: currentPage,
          search: search || undefined,
        },
      })
    );
  }, [dispatch, customerId, currentPage, search]);

  /* =========================================================
     STATS
  ========================================================= */

  const ledgerStats = [
    {
      title: "Opening Balance",
      count: formatAmount(ledgerKpis?.opening_balance),
      icon: <FiFileText />,
      backgroundColor: "#E8F1FF",
      iconColor: "#3478F6",
    },
    {
      title: "Total Invoice",
      count: formatAmount(ledgerKpis?.total_invoices),
      icon: <FiDollarSign />,
      backgroundColor: "#FFF4E5",
      iconColor: "#F59E0B",
    },
    {
      title: "Total Payments",
      count: formatAmount(ledgerKpis?.total_payments),
      icon: <FiRefreshCw />,
      backgroundColor: "#E8F8EF",
      iconColor: "#22A06B",
    },
    {
      title: "Credit Notes",
      count: formatAmount(ledgerKpis?.credit_notes),
      icon: <FiXCircle />,
      backgroundColor: "#FDECEC",
      iconColor: "#E5484D",
    },
    {
      title: "Outstanding",
      count: formatAmount(ledgerKpis?.outstanding),
      icon: <FiXCircle />,
      backgroundColor: "#FDECEC",
      iconColor: "#E5484D",
    },
  ];

  /* =========================================================
     TOTALS (current page)
  ========================================================= */

  const pageTotals = ledger.reduce(
    (acc, row) => {
      acc.debit += Number(row.debit || 0);
      acc.credit += Number(row.credit || 0);
      return acc;
    },
    { debit: 0, credit: 0 }
  );

  const closingBalance = ledgerKpis?.closing_balance ?? 0;

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <>
      <StatsCards cards={ledgerStats} />

      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        showSearch
      />

      <LedgerTableWrapper>
       <ReusableTable
  columns={ledgerColumns}
  data={ledger}
  loading={ledgerLoading}
  totalRow={{
    debit: formatAmount(pageTotals.debit),
    credit: formatAmount(pageTotals.credit),
    balance: formatAmount(closingBalance),
  }}
/>

        <ReusablePagination
          currentPage={currentPage}
          totalPages={ledgerTotalPages}
          onPageChange={setCurrentPage}
        />
      </LedgerTableWrapper>
    </>
  );
};

export default Ledger;