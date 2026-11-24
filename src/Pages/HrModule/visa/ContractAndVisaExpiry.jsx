import React, { useEffect, useState } from "react";
import { Container } from "./Visa.Styles";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmployees,
  getUpcomingExpiryEmployees,
} from "../../../Redux/employeeSlice";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";
import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";

// Rows per page returned by the backend (drives the "Sl No" numbering)
const PAGE_SIZE = 20;

// =========================================================
// LABEL -> BACKEND EXPIRY TYPE MAPPING
// =========================================================
const EXPIRY_TYPE_MAP = {
  "Contract Within 30 Days": "contract",
  "Visa Within 30 Days": "visa",
};

const ContractAndVisaExpiry = () => {
  const dispatch = useDispatch();

  const { employeeList, loading, pagination } = useSelector(
    (state) => state.employees,
  );
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
  );

  const country = user?.company?.country || "IN";
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expiryFilter, setExpiryFilter] = useState("");

  // Debounce typing, then go back to page 1 (one request, not two)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (expiryFilter) {
      const mappedType = EXPIRY_TYPE_MAP[expiryFilter] || expiryFilter;

      dispatch(
        getUpcomingExpiryEmployees({
          expiryType: mappedType,
          days: 30,
          page,
          search: debouncedSearch,
        }),
      );
    } else {
      dispatch(getAllEmployees({ page, search: debouncedSearch }));
    }
  }, [dispatch, page, debouncedSearch, expiryFilter]);

  const handleExpiryFilterChange = (value) => {
    setExpiryFilter(value);
    setPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "----";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalPages = pagination?.total_pages || 1;

  const columns = [
    {
      header: "Sl No",
      accessor: "slNo",
      sortable: false,
      render: (row, index) => index + 1 + (page - 1) * PAGE_SIZE,
    },
    {
      header: "Employee name",
      accessor: "name",
    },
    {
      header: "Employee ID",
      accessor: "employee_code",
      sortable: false,
      render: (row) => row.employee_code,
    },
    {
      header: "Email",
      accessor: "email",
      sortable: false,
      render: (row) => row.email,
    },
    {
      header: country === "IN" ? "Contract Expiry Date" : "Visa Expiry Date",
      accessor: "expiry_date",
      sortable: false,
      render: (row) =>
        country === "IN"
          ? formatDate(row.contract_expiry_date)
          : formatDate(row.visa_expiry_date),
    },
  ];

  return (
    <>
      <Container>
        <ReusableHeader
          title="Employees"
          breadcrumbs={["Employees", "Visa & Contract"]}
        />
        <ReusableFilter
          search={searchText}
          onSearch={setSearchText}
          searchPlaceholder="Search by Name or Employee ID"
          status={expiryFilter}
          statuses={["Contract Within 30 Days", "Visa Within 30 Days"]}
          onStatus={handleExpiryFilterChange}
          showSearch
          showStatus
        />
        <ReusableTable
          columns={columns}
          data={employeeList || []}
          loading={loading}
          autoLayout
        />

        <ReusablePagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={pagination?.count ?? pagination?.total_items ?? 0}
          onPageChange={setPage}
        />
      </Container>
    </>
  );
};

export default ContractAndVisaExpiry;