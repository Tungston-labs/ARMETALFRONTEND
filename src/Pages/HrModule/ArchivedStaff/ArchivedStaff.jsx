import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";
import { employeeColumns } from "./ArchivedStaffData";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import {
  getDeletedEmployees,
  rehireEmployeeById,
} from "../../../Redux/employeeSlice";
import { getDepartments } from "../../../Redux/departmentSlice";

// Must match the page size the backend uses for this list (20 per page).
// It drives the "Sl No" numbering: page 2 starts at 21, not 11.
const PAGE_SIZE = 20;

const SEARCH_DEBOUNCE_MS = 300;

const ArchivedStaff = () => {
  const dispatch = useDispatch();

  // Employee Redux state
  const {
    deletedEmployeeList = [],
    deletedEmployeePagination = {},
    loading,
  } = useSelector((state) => state.employee);

  // Department Redux state
  const departmentList = useSelector(
    (state) => state.departments?.list || []
  );

  // Convert department objects to names
  const departments = departmentList.map((department) => department.name);

  // The page lives in local state (not read back from Redux), so changing a
  // filter can reset it to 1 and a page click triggers exactly one request.
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [month, setMonth] = useState("");

  const totalPages = deletedEmployeePagination?.total_pages || 1;

  // Debounce typing in the search box and go back to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setPage(1);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
    setPage(1);
  };

  const buildParams = () => ({
    page,
    search: debouncedSearch,
    department,
    deleted_date: month,
  });

  const handleRestore = async (employeeId) => {
    try {
      await dispatch(rehireEmployeeById(employeeId)).unwrap();

      // If that was the last row on this page, step back one page
      // (the page change triggers the reload by itself).
      if (deletedEmployeeList.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        dispatch(getDeletedEmployees(buildParams()));
      }
    } catch (error) {
      console.error("Failed to restore employee:", error);
    }
  };

  // Fetch departments
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  // Fetch archived employees
  useEffect(() => {
    dispatch(getDeletedEmployees(buildParams()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, debouncedSearch, department, month]);

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Archived Employees"
        breadcrumbs={["Employees", "Archived"]}
      />

      <ReusableFilter
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by Employee Name"

        department={department}
        departments={departments}
        onDepartment={handleDepartmentChange}

        date={month}
        onDate={handleMonthChange}

        showSearch
        showDepartment
        showDate
      />

      <ReusableTable
        columns={employeeColumns(page, PAGE_SIZE, handleRestore)}
        data={deletedEmployeeList}
        loading={loading}
        autoLayout
      />

      <ReusablePagination
        currentPage={page}
        totalPages={totalPages}
        totalRecords={deletedEmployeePagination?.total_items ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ArchivedStaff;