import React, { useMemo, useState } from "react";
import {
    ProfitLossContainer,
    StatementTitle,
    StatementTableWrapper,
    StatementTable,
    TableHeader,
    SectionRow,
    DataRow,
    TotalRow,
} from "./ProfitLoss.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import {
    employeeColumns,
    employeeData,
} from "../../../../Components/ReusableTable/dummydata";
const profitLossData = [

    { type: "section", particular: "REVENUE" },
    {
        particular: "Product Sales",
        currentYear: 18500000,
        lastYear: 16450000,
    },
    {
        particular: "Service Revenue",
        currentYear: 8750000,
        lastYear: 7950000,
    },
    {
        particular: "Maintenance Contracts",
        currentYear: 1800000,
        lastYear: 1550000,
    },
    {
        particular: "Other Income",
        currentYear: 1450000,
        lastYear: 1250000,
    },
    {
        type: "total",
        particular: "Total Revenue",
        currentYear: 28500000,
        lastYear: 25200000,
    },
    {
        type: "section",
        particular: "COST OF GOODS SOLD",
    },
    {
        particular: "Direct Materials & Inventory",
        currentYear: 12400000,
        lastYear: 11450000,
    },
    {
        particular: "Direct Labor",
        currentYear: 2650000,
        lastYear: 2350000,
    },
    {
        particular: "Project Costs",
        currentYear: 1750000,
        lastYear: 1600000,
    },
    {
        type: "total",
        particular: "Total Cost of Goods Sold",
        currentYear: 16800000,
        lastYear: 15400000,
    },
    {
        type: "total",
        particular: "Gross Profit",
        currentYear: 11700000,
        lastYear: 9800000,
    },
];

const formatAmount = (amount) =>
    amount.toLocaleString("en-US");

const ProfitLoss = () => {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");
    const rowsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const paginatedData = useMemo(() => {

        const start =
            (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );

    }, [currentPage]);
    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Profit & Loss Report"
                breadcrumbs={["Reports", "Profit & Loss Report"]}
                buttonText="ADD NEW EMPLOYEE"
                onButtonClick={() => console.log("Add Employee")}
            />
            <ReusableFilter
                search={search}
                onSearch={setSearch}

                department={department}
                departments={[
                    "HR",
                    "Finance",
                    "Development",
                    "Marketing",
                ]}
                onDepartment={setDepartment}

                status={status}
                statuses={[
                    "Present",
                    "Absent",
                    "On Leave",
                ]} 
                onStatus={setStatus}

                date={month}
                onDate={setMonth}

                showSearch
                showDepartment
                showStatus
                showDate
            />

            {/* <ReusableTable
                columns={employeeColumns}
                data={paginatedData}
            /> */}

            {/* <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            /> */}



            <ProfitLossContainer>
                <StatementTitle>
                    Profit &amp; Loss Statement
                </StatementTitle>

                <StatementTableWrapper>
                    <StatementTable>
                        <thead>
                            <TableHeader>
                                <th>PARTICULAR</th>
                                <th>CURRENT YEAR</th>
                                <th>LAST YEAR</th>
                                <th>VARIANCE</th>
                            </TableHeader>
                        </thead>

                        <tbody>
                            {profitLossData.map((item, index) => {
                                if (item.type === "section") {
                                    return (
                                        <SectionRow key={`${item.particular}-${index}`}>
                                            <td colSpan={4}>{item.particular}</td>
                                        </SectionRow>
                                    );
                                }

                                const variance =
                                    item.currentYear - item.lastYear;

                                const Row =
                                    item.type === "total" ? TotalRow : DataRow;

                                return (
                                    <Row key={`${item.particular}-${index}`}>
                                        <td>{item.particular}</td>
                                        <td>{formatAmount(item.currentYear)}</td>
                                        <td>{formatAmount(item.lastYear)}</td>
                                        <td>{formatAmount(variance)}</td>
                                    </Row>
                                );
                            })}
                        </tbody>
                    </StatementTable>
                </StatementTableWrapper>
            </ProfitLossContainer>

        </div>
    );
};

export default ProfitLoss;