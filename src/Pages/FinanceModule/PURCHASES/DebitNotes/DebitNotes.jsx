import React from "react";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import useDebitNotes from "./UseDebitNotes";

const DebitNotes = () => {
  const {
    search,

    reason,

    status,

    startDate,

    endDate,

    currentPage,

    totalPages,

    totalItems,

    setCurrentPage,

    cards,

    columns,

    paginatedData,

    loading,

    kpiLoading,

    errorMessage,

    reasonOptions,

    statusOptions,

    handleSearch,

    handleReasonChange,

    handleStatusChange,

    handleStartDateChange,

    handleEndDateChange,

    handleAddDebitNote,

    handleExport,
  } = useDebitNotes();

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Debit Notes"
        breadcrumbs={["Purchases", "Debit Notes"]}
        buttonText="+ CREATE DEBIT NOTE"
        onButtonClick={handleAddDebitNote}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={handleExport}
            style={{
              height: "34px",
              padding: "0 14px",
              border: "1px solid #D1D5DB",
              borderRadius: "4px",
              background: "#FFFFFF",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            EXPORT
          </button>

          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            style={{
              height: "34px",
              border: "1px solid #D1D5DB",
              borderRadius: "4px",
              padding: "0 8px",
              fontSize: "12px",
            }}
          />

          <span>-</span>

          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate || undefined}
            style={{
              height: "34px",
              border: "1px solid #D1D5DB",
              borderRadius: "4px",
              padding: "0 8px",
              fontSize: "12px",
            }}
          />
        </div>
      </ReusableHeader>

      {errorMessage && (
        <div
          style={{
            margin: "12px 0",
            padding: "10px 14px",
            borderRadius: 6,
            background: "#FDEEEE",
            color: "#B00020",
            fontSize: 14,
          }}
        >
          {errorMessage}
        </div>
      )}

      <StatsCards cards={cards} loading={kpiLoading} />

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        searchPlaceholder="Search"
        showSearch
        filters={[
          {
            key: "reason",
            value: reason,
            onChange: handleReasonChange,
            options: reasonOptions,
            placeholder: "All Reason",
          },
        ]}
        status={status}
        statuses={statusOptions}
        onStatus={handleStatusChange}
        showStatus
      />

      <ReusableTable columns={columns} data={paginatedData} loading={loading} />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalItems}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DebitNotes;
