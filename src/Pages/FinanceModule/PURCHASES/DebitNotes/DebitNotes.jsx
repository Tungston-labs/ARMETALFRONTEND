import React from "react";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import useDebitNotes from "./UseDebitNotes";
import { DateInput, DatePickerContainer, DateRangeWrapper, DateSeparator, ExportButton } from "./DebitNotes.styles";
import { FiDownload } from "react-icons/fi";

const DebitNotes = () => {
  const {
    search,
    vendor,
    vendorOptions,
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
    handleVendorChange,
    handleReasonChange,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    handleClearFilter,
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
       <ExportButton
                type="button"
                onClick={handleExport}
              >
                <FiDownload />
                <span>Export</span>
              </ExportButton>
      
              <DateRangeWrapper>
                <DatePickerContainer>
                  <DateInput
                    type="date"
                    value={startDate}
                    onChange={
                      handleStartDateChange
                    }
                    max={
                      endDate || undefined
                    }
                    aria-label="Start date"
                  />
      
                  <DateSeparator>
                    -
                  </DateSeparator>
      
                  <DateInput
                    type="date"
                    value={endDate}
                    onChange={
                      handleEndDateChange
                    }
                    min={
                      startDate || undefined
                    }
                    aria-label="End date"
                  />
                </DatePickerContainer>
              </DateRangeWrapper>
   </ReusableHeader>
    

      <StatsCards cards={cards} loading={kpiLoading} />

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        searchPlaceholder="Search"
        showSearch
        filters={[
          {
            key: "vendor",
            value: vendor,
            onChange: handleVendorChange,
            options: vendorOptions,
            placeholder: "All Vendor",
          },
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
        statusPlaceholder="All Status"
        rightButton={
          <button
            type="button"
            onClick={handleClearFilter}
            style={{
              height: "36px",
              padding: "0 18px",
              background: "#2563EB",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Clear Filter
          </button>
        }
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
