import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiFileText, FiCheckCircle, FiXCircle, FiDollarSign } from "react-icons/fi";

import { invoicesColumns } from "./InvoiceColumns";
import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";

import {
  getCustomerInvoices,
  getCustomerInvoicesSummary,
} from "../../../../../Redux/finance/Sales/CustomerSlice";

const Invoices = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    invoices,
    invoicesTotalPages,
    invoicesLoading,
    invoicesSummary,
    invoicesSummaryLoading,
  } = useSelector((state) => state.customer);

  /* =========================================================
     FETCH INVOICES
  ========================================================= */

  useEffect(() => {
    if (!customerId) return;

    dispatch(
      getCustomerInvoices({
        customerId,
        params: {
          page: currentPage,
          search: search || undefined,
        },
      })
    );
  }, [dispatch, customerId, currentPage, search]);

  /* =========================================================
     FETCH INVOICES SUMMARY
  ========================================================= */

  useEffect(() => {
    if (!customerId) return;

    dispatch(getCustomerInvoicesSummary(customerId));
  }, [dispatch, customerId]);

  /* =========================================================
     STATS
  ========================================================= */

  const invoiceStats = [
    {
      title: "Total Invoices",
      count: invoicesSummary?.total_invoice ?? 0,
      icon: <FiFileText />,
      backgroundColor: "#E8F1FF",
      iconColor: "#3478F6",
    },
    {
      title: "Total Invoice Value",
      count: Number(invoicesSummary?.total_invoice_value ?? 0).toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      ),
      icon: <FiDollarSign />,
      backgroundColor: "#FFF4E5",
      iconColor: "#F59E0B",
    },
    {
      title: "Paid Invoices",
      count: invoicesSummary?.paid_invoice ?? 0,
      icon: <FiCheckCircle />,
      backgroundColor: "#E8F8EF",
      iconColor: "#22A06B",
    },
    {
      title: "Outstanding Amount",
      count: Number(invoicesSummary?.outstanding_amount ?? 0).toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      ),
      icon: <FiXCircle />,
      backgroundColor: "#FDECEC",
      iconColor: "#E5484D",
    },
    {
      title: "Pending Invoices",
      count: invoicesSummary?.pending_invoice ?? 0,
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
      <StatsCards cards={invoiceStats} loading={invoicesSummaryLoading} />

      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        showSearch
      />

      <ReusableTable
        columns={invoicesColumns}
        data={invoices}
        loading={invoicesLoading}
      />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={invoicesTotalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Invoices;