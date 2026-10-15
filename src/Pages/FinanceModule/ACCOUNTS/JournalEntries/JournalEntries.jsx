import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    employeeColumns,
    employeeData,
} from "../../../../Components/ReusableTable/dummydata";
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

const sourceOptions = [
    { label: "Invoice", value: "invoice" },
    { label: "Purchase", value: "purchase" },
    { label: "Payment", value: "payment" },
    { label: "Journal", value: "journal" },
    { label: "Manual", value: "manual" },
];

const JournalEntries = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [source, setSource] = useState("all");
    const [month, setMonth] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const rowsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);

    // Dummy values - replace with API data (e.g. from redux) later.
    // Pass loading={true} to StatsCards while the API is loading to show the skeleton.
    const statsCards = [
        {
            count: "248",
            title: "Total Entries",
            icon: <TbFileInvoice />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: "210",
            title: "Auto-Posted",
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#F1E8FF",
            iconColor: "#923CFF",
        },
        {
            count: "38",
            title: "Manual Entries",
            icon: <MdOutlineInventory2 />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: "03",
            title: "Draft(Unposted)",
            icon: <TbArrowUp />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
        {
            count: "12",
            title: "Voided",
            icon: <TbArrowUp />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
    ];

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );
    }, [currentPage]);

    const handleSourceChange = (value) => {
        setSource(value || "all");
        setCurrentPage(1);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setCurrentPage(1);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setCurrentPage(1);
    };

    const handleNewJournalEntry = () => {
        navigate("/accounts/journal-entries/add");
    };

    const handleImportJournal = () => {
        console.log("Import Journal Entries");
    };

    return (
        <div style={{ padding: 20 }}>
            {/* NOTE: "onButtonClick" is the assumed prop name for the header button.
                Check ReusableHeader for the real name. */}
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

            <StatsCards cards={statsCards} />
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
                statuses={[
                    "Present",
                    "Absent",
                    "On Leave",
                ]}
                onStatus={setStatus}
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

            <ReusableTable
                columns={employeeColumns}
                data={paginatedData}
            />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default JournalEntries;