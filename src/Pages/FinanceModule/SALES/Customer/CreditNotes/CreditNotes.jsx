import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiFileText, FiCheckCircle, FiXCircle, FiDollarSign, FiRefreshCw } from "react-icons/fi";
import { creditNotesColumns } from "./creditNotesColumns";
import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";

import { getCustomerCreditNotes } from "../../../../../Redux/finance/Sales/CustomerSlice";

const CreditNotes = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    creditNotes,
    creditNotesTotalItems,
    creditNotesTotalPages,
    creditNotesKpis,
    creditNotesLoading,
  } = useSelector((state) => state.customer);

  const rowsPerPage = 10;

  /* =========================================================
     FETCH CREDIT NOTES
  ========================================================= */

  useEffect(() => {
    console.log("CreditNotes effect", { customerId });
    if (!customerId) return;
    dispatch(getCustomerCreditNotes({ customerId, params: { page: currentPage, search: search || undefined } }));
  }, [dispatch, customerId, currentPage, search]);

  /* =========================================================
     STATS
  ========================================================= */

  const creditNoteStats = [
    {
      title: "Total Credit Notes",
      count: creditNotesKpis?.total_credit_notes ?? 0,
      icon: <FiFileText />,
      backgroundColor: "#E8F1FF",
      iconColor: "#3478F6",
    },
    {
      title: "Total Credit Value",
      count: creditNotesKpis?.total_credit_value ?? 0,
      icon: <FiDollarSign />,
      backgroundColor: "#FFF4E5",
      iconColor: "#F59E0B",
    },
    {
      title: "This Month",
      count: creditNotesKpis?.this_month ?? 0,
      icon: <FiRefreshCw />,
      backgroundColor: "#E8F8EF",
      iconColor: "#22A06B",
    },
    {
      title: "Open Credit Notes",
      count: creditNotesKpis?.open_credit_notes ?? 0,
      icon: <FiXCircle />,
      backgroundColor: "#FDECEC",
      iconColor: "#E5484D",
    },
  ];

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <>
      <StatsCards cards={creditNoteStats} />

      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        showSearch
      />

      <ReusableTable
        columns={creditNotesColumns}
        data={creditNotes}
        loading={creditNotesLoading}
      />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={creditNotesTotalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default CreditNotes;