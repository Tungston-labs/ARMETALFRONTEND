import React from "react";
import { billingColumns } from "./billingColumns";
import { useRecurringBilling } from "./useRecurringBilling";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import ProductServiceModal from "./modal/AddingRecurringBilling";

import {
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
} from "./RecurringBilling.styles";

const RecurringBilling = () => {
    const {
        billing,
        billingTotalPages,
        billingLoading,
        customers,
        categories,
        products,
        recurringStats,
        summaryLoading,
        search,
        status,
        startDate,
        endDate,
        filterDefs,
        statuses,
        currentPage,
        setCurrentPage,
        showProductServiceModal,
        setShowProductServiceModal,
        handleSearch,
        handleStatus,
        handleStartDateChange,
        handleEndDateChange,
        handleSaveProductService,
    } = useRecurringBilling();

    return (
        <>
            <div style={{ padding: 20 }}>
                <ReusableHeader
                    title="Recurring Billing"
                    breadcrumbs={["Sales", "Recurring Billing"]}
                    buttonText="+ ADD NEW RECURRING BILLING"
                    onButtonClick={() => setShowProductServiceModal(true)}
                >
                 

                    <DateRangeWrapper>
                        <DatePickerContainer>
                            <DateInput
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                max={endDate || undefined}
                                aria-label="Start date"
                            />
                            <DateSeparator>-</DateSeparator>
                            <DateInput
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                min={startDate || undefined}
                                aria-label="End date"
                            />
                        </DatePickerContainer>
                    </DateRangeWrapper>
                </ReusableHeader>

                <StatsCards cards={recurringStats} loading={summaryLoading} />

                <ReusableFilter
                    search={search}
                    onSearch={handleSearch}
                    searchPlaceholder="Search Contract"
                    showSearch
                    status={status}
                    statuses={statuses}
                    onStatus={handleStatus}
                    showStatus
                    filters={filterDefs}
                />

                <ReusableTable
                    columns={billingColumns}
                    data={billing}
                    loading={billingLoading}
                />

                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={billingTotalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            <ProductServiceModal
                isOpen={showProductServiceModal}
                onClose={() => setShowProductServiceModal(false)}
                onSubmit={handleSaveProductService}
                customers={customers}
                categories={categories}
                products={products}
            />
        </>
    );
};

export default RecurringBilling;