import React, { useState, useMemo } from 'react';
import { Container } from "../PayrollTablestyes";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../Components/StatsCards/StatsCards";
import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import Pagination from "../../../Components/Pagination/Pagination";
import IncentiveModal from "../../../Components/payroll/IncentiveModal/IncentiveModal";
import DeductionModal from "../../../Components/payroll/DeductionModal/DeductionModal";
import { getPayrollColumns } from "./payrollColumns";
import {
  usePayrollList,
  formatDate,
  calculateNetPay,
  getStatusColor,
  getPayrollCards,
} from "./usePayrollList";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import { HeaderButton } from '../../../Components/ReusableTable/ReusableHeader.styles';
import { useCurrency } from "../../../hooks/useCurrency"; // adjust path to match where you saved it

const PayrollList = () => {

  const LIMIT = 20;
  const [status, setStatus] = useState("");
  const [selectedMoreStatuses, setSelectedMoreStatuses] = useState([]);

  // Company's active currency, read from Redux (company slice) -
  // single source of truth shared across every module.
  const { currencyCode } = useCurrency();

  const {
    sortedData,
    loading,
    totalPages,
    page,
    departmentList,
    counts,
    searchTerm, setSearchTerm,
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    selectedDepartment, setSelectedDepartment,
    selectedEmployees,
    toggleEmployeeSelect,
    handleSelectAll,
    verificationStatus,
    handleCircleClick,
    handleSingleStatusChange,
    handlePageChange,
    showModal,
    selectedEmployee,
    setSelectedEmployee,
    setShowModal,
    handleCloseModal,

    showDeductionModal,
    setShowDeductionModal,
    handleCloseDeductionModal,
  } = usePayrollList();

  const departmentRows = Array.isArray(departmentList?.results)
    ? departmentList.results
    : Array.isArray(departmentList)
      ? departmentList
      : [];

  const departments = useMemo(
    () => departmentRows.map((d) => d.name),
    [departmentRows],
  );

  // status isn't filtered server-side, so filter it client-side on top
  // of the already-paginated/server-filtered sortedData
  const visibleRows = useMemo(() => {
    if (!Array.isArray(sortedData)) return [];
    let rows = sortedData;

    if (status) {
      rows = rows.filter((row) => row.status === status);
    }

    if (selectedMoreStatuses.length > 0) {
      rows = rows.filter((row) => selectedMoreStatuses.includes(row.status));
    }

    return rows;
  }, [sortedData, status, selectedMoreStatuses]);

  const columns = getPayrollColumns({
    page,
    limit: LIMIT,
    totalRows: visibleRows.length,
    selectedEmployees,
    handleSelectAll,
    toggleEmployeeSelect,
    formatDate,
    calculateNetPay,
    verificationStatus,
    handleCircleClick,
    handleSingleStatusChange,
    getStatusColor,
    currencyCode, // ← passed so any money column can format correctly
  });

const payrollCards = getPayrollCards(counts, currencyCode);
  const monthValue = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
  const handleDateChange = (value) => {
    const [year, month] = value.split("-");
    setSelectedYear(Number(year));
    setSelectedMonth(Number(month));
  };
  const handleAddIncentive = () => {
    setShowModal(true);
  };
  const handleAddDeduction = () => {
    setShowDeductionModal(true);
  };
  const handleBulkStatusUpdate = async (newStatus) => {
    const targets = sortedData.filter((emp) => selectedEmployees.includes(emp.id));

    for (const emp of targets) {
      try {
        await handleSingleStatusChange(emp, newStatus);
      } catch (err) {
        console.error(`Failed to update status for employee ${emp.id}`, err);
        // decide: break here to stop on first failure, or continue to attempt the rest
      }
    }
  };
  return (
    <Container>
      <ReusableHeader
        title="Payroll Overview – May 2026"
        breadcrumbs={["Payroll"]}
        
      >
        <HeaderButton
          $variant="danger"
          onClick={handleAddDeduction}
        >
          + ADD DEDUCTION
        </HeaderButton>

        <HeaderButton
          $variant="success"
          onClick={handleAddIncentive}
        >
          + ADD INCENTIVE
        </HeaderButton>
      </ReusableHeader>

      <StatsCards cards={payrollCards} />
      <ReusableFilter
        search={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search by Employee Name / Code"
        department={selectedDepartment}
        departments={departments}
        onDepartment={setSelectedDepartment}

        status={status}
        statuses={["Pending", "Paid", "OnHold", "Cancelled"]}
        onStatus={setStatus}

        date={monthValue}
        onDate={handleDateChange}

        showSearch
        showDepartment
        showStatus
        showDate
        showMoreOptions
        moreOptions={[
          { label: "On Hold", value: "OnHold" },
          { label: "Pending", value: "Pending" },
        ]}
        selectedMoreOptions={selectedMoreStatuses}
        onMoreOptionsChange={setSelectedMoreStatuses}

        selectedCount={selectedEmployees.length}
        bulkStatusOptions={[
          { label: "Pending", value: "Pending" },
          { label: "Paid", value: "Paid" },
          { label: "On Hold", value: "OnHold" },
          { label: "Cancelled", value: "Cancelled" },
        ]}
        onBulkStatusChange={handleBulkStatusUpdate}
      />

      <ReusableTable columns={columns} data={visibleRows} loading={loading} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalRecords={sortedData.length}
        onPageChange={handlePageChange}
      />

      {showModal && (
        <IncentiveModal
          employees={sortedData}
          month={selectedMonth}
          year={selectedYear}
          onClose={handleCloseModal}
          currencyCode={currencyCode} // ← so incentive amounts display in the right currency
        />
      )}

      {showDeductionModal && (
        <DeductionModal
          employees={sortedData}
          month={selectedMonth}
          year={selectedYear}
          onClose={handleCloseDeductionModal}
          currencyCode={currencyCode} // ← same for deductions
        />
      )}

    </Container>
  );
};

export default PayrollList;