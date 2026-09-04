import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, } from "../finance/FinancePage.Styles";
import FinanceModal from "./NewFinance";
import { createFinance, fetchFinanceList } from "../../Redux/financeThunks";
import StatsCards from "../../Components/StatsCards/StatsCards";
import Pagination from "../../Components/Pagination/Pagination";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";

import { getFinanceColumns, getStatCards } from "./FinanceColumns";
import { useCurrency } from "../../hooks/useCurrency"; // adjust path to match where you saved it

const PAGE_SIZE = 20;

const PAYMENT_LABEL_TO_CODE = { Income: "IN", Expense: "OUT" };
const PAYMENT_CODE_TO_LABEL = { IN: "Income", OUT: "Expense" };

const FinanceDetail = () => {
  const dispatch = useDispatch();

  // Company's active currency, read from Redux (company slice) -
  // same source used across Payroll, Reimbursement, etc.
  const { currencyCode } = useCurrency();

  const {
    list = [],
    loading,
    pagination = {},
    totalIncome = 0,
    totalExpense = 0,
    cashBalance = 0,
  } = useSelector((state) => state.finance);

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(""); // "IN" | "OUT" | ""
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState("");

useEffect(() => {
  dispatch(
    fetchFinanceList({
      page,
      pageSize: PAGE_SIZE,
      search: searchText,
      payment_type: selectedPayment,
      month: month,
    })
  );
}, [dispatch, page, searchText, selectedPayment, month]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchText, selectedPayment,month]);

  // Fix page overflow
  useEffect(() => {
    if (pagination?.totalPages && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [pagination?.totalPages, page]);

  const handleAddFinance = (formData) => {
    const payload = {
      category: formData.category,
      date: formData.date,
      note: formData.note,
      payment_type: formData.paymentType,
      amount: formData.amount1,
    };

    dispatch(createFinance(payload)).then(() => {
      setIsOpen(false);
      dispatch(
        fetchFinanceList({
          page: 1,
          pageSize: PAGE_SIZE,
        })
      );
      setPage(1);
    });
  };

  const handlePageChange = (newPage) => {
    if (!pagination?.totalPages) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
  };

  const columns = getFinanceColumns({ page, pageSize: PAGE_SIZE, currencyCode });

  // Cards fed into the generic StatsCards component — built from the
  // live Redux totals, since FinanceColumns.jsx has no access to them
  const statCards = getStatCards({ totalIncome, totalExpense, cashBalance, currencyCode });

  return (
    <>
      <Container>

        <ReusableHeader
          title="Finance"
          breadcrumbs={["Dashboard", "Finance"]}
          buttonText="+ ADD NEW FINANCE"
          onButtonClick={() => setIsOpen(true)}
        />
        <StatsCards cards={statCards} />
        <ReusableFilter
          showSearch
          search={searchText}
          onSearch={setSearchText}
          searchPlaceholder="Search Category / Note"
          showStatus
          status={PAYMENT_CODE_TO_LABEL[selectedPayment] || ""}
          statuses={["Income", "Expense"]}
          onStatus={(label) =>
            setSelectedPayment(PAYMENT_LABEL_TO_CODE[label] || "")
          }
          date={month}
          onDate={setMonth}
          showDate
        />

        <ReusableTable columns={columns} data={list} loading={loading} />


        <Pagination
          currentPage={page}
          totalPages={pagination?.totalPages || 1}
          totalRecords={pagination?.totalItems ?? 0}
          onPageChange={handlePageChange}
        />
      </Container>

      <FinanceModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleAddFinance}
      />
    </>
  );
};

export default FinanceDetail;