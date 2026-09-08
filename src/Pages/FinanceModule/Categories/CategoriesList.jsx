import React, { useMemo, useState } from "react";
import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";
import {
  employeeColumns,
  employeeData,
} from "../../../Components/ReusableTable/dummydata";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../Components/ReusableTable/ReusableHeader.styles";
import { FiDownload } from "react-icons/fi";

const CategoriesList = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const rowsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(employeeData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return employeeData.slice(start, start + rowsPerPage);
  }, [currentPage]);

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader title="Categories" breadcrumbs={["Categories"]}>
        <HeaderButton $variant="excel">
          <FiDownload />
          EXPORT EXCEL
        </HeaderButton>

        <HeaderButton
        //   $variant="success"
        //   onClick={handleAddIncentive}
        >
          + ADD CATEGORY
        </HeaderButton>
      </ReusableHeader>
      <ReusableFilter
        search={search}
        onSearch={setSearch}
        department={department}
        departments={["HR", "Finance", "Development", "Marketing"]}
        onDepartment={setDepartment}
        status={status}
        statuses={["Present", "Absent", "On Leave"]}
        onStatus={setStatus}
        showSearch
        showDepartment
        showStatus
        rightButton={
          <HeaderButton
            $variant="orange"
            //   onClick={handleExportExcel}
          >
            Apply Filters
          </HeaderButton>
        }
      />

      <ReusableTable columns={employeeColumns} data={paginatedData} />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CategoriesList;
