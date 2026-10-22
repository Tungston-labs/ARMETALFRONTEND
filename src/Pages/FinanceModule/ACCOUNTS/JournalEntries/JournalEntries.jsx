// UI PAGE: markup only. All logic comes from useJournalEntries.js.

import React from "react";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
    ExportButton,
    JournalStatusContainer,
    JournalStatusLabel,
    JournalStatusValue,
    JournalSummaryAmount,
    JournalSummaryContainer,
    JournalSummaryContent,
    JournalSummaryIcon,
    JournalSummaryItem,
    JournalSummaryLabel,
} from "./JournalEntry.style";
import { FiUpload } from "react-icons/fi";
import { TbFileInvoice, TbArrowUp } from "react-icons/tb";
import {
    MdOutlineInventory2,
    MdOutlineAccountBalance,
} from "react-icons/md";

import JournalEntryAction from "./Action/JournalEntryAction";
import useJournalEntries from "./Usejournalentries";

// API filter values (?source=manual|auto)
const sourceOptions = [
    { label: "Manual", value: "manual" },
    { label: "Auto", value: "auto" },
];

// Dropdown label -> sent to the API in lowercase (?status=draft|posted|...)
const statusOptions = ["Draft", "Posted", "Voided"];

const capitalize = (value = "") =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

const padCount = (value) => String(value).padStart(2, "0");

const messageStyle = {
    padding: "16px 4px",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
};

const JournalEntries = () => {
    const {
        // data
        entries,
        pagination,
        counts,
        loading,
        countsLoading,
        saving,
        errorText,

        // filter values
        search,
        status,
        source,
        startDate,
        endDate,

        // handlers
        setSearch,
        setCurrentPage,
        handleStatusChange,
        handleSourceChange,
        handleStartDateChange,
        handleEndDateChange,
        handlePost,
        handleVoid,
        handleDelete,
        handleNewJournalEntry,
        handleImportJournal,
    } = useJournalEntries();

    // ReusableTable column format: { header, accessor, render?, sortable?, width? }
    const journalColumns = [
        { header: "Entry No.", accessor: "entry_number", render: (row) => row.entry_number ?? row.id },
        { header: "Date", accessor: "entry_date" },
        { header: "Reference", accessor: "reference_number", render: (row) => row.reference_number || "-" },
        { header: "Description", accessor: "description", render: (row) => row.description || "-" },
        { header: "Source", accessor: "source", render: (row) => capitalize(row.source) },
        { header: "Status", accessor: "status", render: (row) => capitalize(row.status) },
        {
            header: "Actions",
            accessor: "actions",
            sortable: false,
            render: (row) => {
                // const rowStatus = String(row.status || "").toLowerCase();

                return (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {/* Info icon: drafts open the edit form */}
                        <JournalEntryAction row={row} />

                        {/* To bring back Post / Delete / Void buttons, uncomment this and the rowStatus line above:
                        {rowStatus === "draft" && (
                            <>
                                <button type="button" disabled={saving} onClick={() => handlePost(row)}>Post</button>
                                <button type="button" disabled={saving} onClick={() => handleDelete(row)}>Delete</button>
                            </>
                        )}
                        {rowStatus === "posted" && (
                            <button type="button" disabled={saving} onClick={() => handleVoid(row)}>Void</button>
                        )} */}
                    </div>
                );
            },
        },
    ];

    const statsCards = [
        {
            count: padCount(counts?.total ?? 0),
            title: "Total Entries",
            icon: <TbFileInvoice />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: padCount(counts?.auto ?? 0),
            title: "Auto-Posted",
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#F1E8FF",
            iconColor: "#923CFF",
        },
        {
            count: padCount(counts?.manual ?? 0),
            title: "Manual Entries",
            icon: <MdOutlineInventory2 />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: padCount(counts?.draft ?? 0),
            title: "Draft(Unposted)",
            icon: <TbArrowUp />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
        {
            count: padCount(counts?.voided ?? 0),
            title: "Voided",
            icon: <TbArrowUp />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Journal Entries"
                breadcrumbs={["Accounting", "Journal Entries"]}
                buttonText="NEW JOURNAL ENTRY"
                onButtonClick={handleNewJournalEntry}
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

                <ExportButton type="button" onClick={handleImportJournal}>
                    <FiUpload />
                    IMPORT JOURNAL
                </ExportButton>
            </ReusableHeader>

            <StatsCards cards={statsCards} loading={countsLoading && !counts} />

            {/* TODO: still dummy. No API returns debit/credit totals for the month yet. */}
            <JournalSummaryContainer>
                <JournalSummaryItem>
                    <JournalSummaryIcon $background="#E5F7EC" $color="#008A2E">
                        <TbFileInvoice />
                    </JournalSummaryIcon>

                    <JournalSummaryContent>
                        <JournalSummaryLabel>
                            Total Debit (This Month)
                        </JournalSummaryLabel>

                        <JournalSummaryAmount>
                            SAR 26,816.37
                        </JournalSummaryAmount>
                    </JournalSummaryContent>
                </JournalSummaryItem>

                <JournalSummaryItem>
                    <JournalSummaryIcon $background="#FFF3E0" $color="#FF6D00">
                        <TbFileInvoice />
                    </JournalSummaryIcon>

                    <JournalSummaryContent>
                        <JournalSummaryLabel>
                            Total Credit (This Month)
                        </JournalSummaryLabel>

                        <JournalSummaryAmount>
                            SAR 26,816.37
                        </JournalSummaryAmount>
                    </JournalSummaryContent>
                </JournalSummaryItem>

                <JournalStatusContainer>
                    <JournalStatusLabel>
                        Journal Status
                    </JournalStatusLabel>

                    <JournalStatusValue>
                        Balanced
                    </JournalStatusValue>
                </JournalStatusContainer>
            </JournalSummaryContainer>

            <ReusableFilter
                search={search}
                onSearch={setSearch}
                status={status}
                statuses={statusOptions}
                onStatus={handleStatusChange}
                showSearch
                showStatus
                filters={[
                    {
                        key: "source",
                        value: source,
                        onChange: handleSourceChange,
                        options: sourceOptions,
                        placeholder: "All Sources",
                    },
                ]}
            />

            {errorText && (
                <div style={{ ...messageStyle, color: "#e01b1b" }}>
                    {errorText}
                </div>
            )}

            <ReusableTable
                columns={journalColumns}
                data={entries}
                loading={loading}
                loadingMessage="Loading journal entries..."
                emptyMessage="No journal entries found."
            />

            <ReusablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default JournalEntries;