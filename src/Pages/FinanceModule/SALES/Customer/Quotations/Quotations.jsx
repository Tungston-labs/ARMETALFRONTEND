import React, { useMemo, useState } from "react";

import {
    employeeColumns,
    employeeData,
} from "../../../../../Components/ReusableTable/dummydata";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";



const Quotations = () => {
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
                title="Employees"
                breadcrumbs={["Dashboard", "Employees"]}
                buttonText="ADD NEW EMPLOYEE"
                onButtonClick={() => console.log("Add Employee")}
            />           <ReusableFilter
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

export default Quotations;