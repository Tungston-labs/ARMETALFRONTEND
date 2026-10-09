import React, { useMemo, useState } from "react";
import {
    employeeColumns,
    employeeData,
} from "../../../../Components/ReusableTable/dummydata";

import { ExportButton, MainReportLayout, TableSide } from "./SalesReports.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import SalesTrendChart from "./Chart/SalesTrendChart";
import { FiDownload } from "react-icons/fi";

const Employee = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("all");
    const [category, setCategory] = useState("all");
    const rowsPerPage = 15;

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
const handleCustomerChange = (value) => {
        setCustomer(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
        setCurrentPage(1);
    };
    return (

        <div style={{ padding: 20 }}>
            <ReusableHeader
        title="Sales Reports"
        breadcrumbs={["Reports", "Sales Reports"]}
      >
        <ExportButton type="button"
        //  onClick={handleExport}
         >
          <FiDownload /> Export Accounts
        </ExportButton>
      </ReusableHeader>
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
                        key: "customer",
                        value: customer,
                        onChange: handleCustomerChange,
                        options: [
                            {
                                label: "All Customers",
                                value: "all",
                            },
                            {
                                label: "ABC Trading LLC",
                                value: "abc_trading",
                            },
                            {
                                label: "Al Noor Trading",
                                value: "al_noor",
                            },
                            {
                                label: "Gulf Supplies",
                                value: "gulf_supplies",
                            },
                            {
                                label: "Saudi Industrial Co.",
                                value: "saudi_industrial",
                            },
                        ],
                        placeholder: "All Customers",
                    },

                    {
                        key: "category",
                        value: category,
                        onChange: handleCategoryChange,
                        options: [
                            {
                                label: "All Categories",
                                value: "all",
                            },
                            {
                                label: "Products",
                                value: "products",
                            },
                            {
                                label: "Services",
                                value: "services",
                            },
                            {
                                label: "Subscriptions",
                                value: "subscriptions",
                            },
                            {
                                label: "Other",
                                value: "other",
                            },
                        ],
                        placeholder: "All Categories",
                    },
                ]}/>

            <MainReportLayout>

    <TableSide>

        <ReusableTable
                autoLayout
            columns={employeeColumns}
            data={paginatedData}
        />

        <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />

    </TableSide>


    <SalesTrendChart />

</MainReportLayout>

        </div>

    );
};

export default Employee;