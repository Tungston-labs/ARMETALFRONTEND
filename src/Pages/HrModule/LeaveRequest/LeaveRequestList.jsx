import React from "react";

import { Container } from "./leaveColumns.style";
import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import ReusableConfirmModal from "../../../Components/modals/ReusableConfirmModal";
import StatsCards from "../../../Components/StatsCards/StatsCards";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";

import useLeaveRequests from "./Useleaverequests";
export default function LeaveRequestList() {
  const {
    columns,
    leaveData,
    loading,
    payrollCards,

    page,
    pagination,
    handlePageChange,

    search,
    setSearch,
    departmentFilter,
    departmentOptions,
    handleDepartmentChange,
    statusFilter,
    handleStatusChange,
    dateValue,
    handleDateChange,

    showModal,
    actionType,
    closeModal,
    handleStatusUpdate,
  } = useLeaveRequests();

  const isApprove = actionType === "approve";

  return (
    <Container>
      <ReusableHeader
        title="Leave Requests"
        breadcrumbs={["Employees", "LeaveRequest"]}
      />

      <StatsCards cards={payrollCards} />

      <ReusableFilter
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by Employee Name / Code"
        department={departmentFilter}
        departments={departmentOptions}
        onDepartment={handleDepartmentChange}
        status={statusFilter}
        statuses={["Pending", "Approved", "Rejected"]}
        onStatus={handleStatusChange}
        date={dateValue}
        onDate={handleDateChange}
        showSearch
        showDepartment
        showStatus
        showDate
      />

      <ReusableTable
        autoLayout
        columns={columns}
        data={leaveData}
        loading={loading}
        loadingComponent={null}
      />

      <ReusablePagination
        currentPage={page}
        totalPages={pagination?.total_pages}
        totalRecords={pagination?.total_records}
        onPageChange={handlePageChange}
      />

      <ReusableConfirmModal
        show={showModal}
        title={isApprove ? "Approve Leave" : "Reject Leave"}
        message={
          isApprove
            ? "Are you sure you want to approve this leave request?"
            : "Are you sure you want to reject this leave request?"
        }
        confirmText={isApprove ? "Approve" : "Reject"}
        cancelText="Cancel"
        confirmVariant={isApprove ? "success" : "danger"}
        onConfirm={handleStatusUpdate}
        onClose={closeModal}
      />
    </Container>
  );
}