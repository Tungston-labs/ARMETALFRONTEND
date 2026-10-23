import React, { useMemo } from "react";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import usePayables from "./Usepayables";
import { payableColumns, buildStatsCards } from "./Payables.columns";

import {
    ExportButton,
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
} from "./Payables.styles";

import { FiDownload } from "react-icons/fi";

const Payables = () => {
    const {
        payables,
        dashboard,
        pagination,
        loading,
        error,
        vendorOptions,
        statuses,
        search,
        vendor,
        status,
        dateFrom,
        dateTo,
        onSearch,
        onVendorChange,
        onStatusChange,
        onDateFromChange,
        onDateToChange,
        onPageChange,
        onExport,
    } = usePayables();

    const statsCards = useMemo(() => buildStatsCards(dashboard), [dashboard]);

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Payables"
                breadcrumbs={["Accounting", "Payables"]}
            >
                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            aria-label="Start date"
                            value={dateFrom}
                            max={dateTo || undefined}
                            onChange={onDateFromChange}
                        />

                        <DateSeparator>-</DateSeparator>

                        <DateInput
                            type="date"
                            aria-label="End date"
                            value={dateTo}
                            min={dateFrom || undefined}
                            onChange={onDateToChange}
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>

                <ExportButton type="button" onClick={onExport}>
                    <FiDownload />
                    Export
                </ExportButton>
            </ReusableHeader>

            <StatsCards cards={statsCards} />

            <ReusableFilter
                search={search}
                onSearch={onSearch}
                searchPlaceholder="Search bill number or vendor"
                showSearch
                status={status}
                statuses={statuses}
                onStatus={onStatusChange}
                showStatus
                filters={[
                    {
                        key: "vendor",
                        value: vendor,
                        onChange: onVendorChange,
                        options: vendorOptions,
                        placeholder: "All Vendors",
                    },
                ]}
            />

            {error && (
                <p style={{ color: "#FF3131" }}>
                    {typeof error === "string"
                        ? error
                        : error.detail || "Failed to load accounts payable"}
                </p>
            )}

            {loading && <p>Loading...</p>}

            <ReusableTable columns={payableColumns} data={payables} />

            <ReusablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default Payables;