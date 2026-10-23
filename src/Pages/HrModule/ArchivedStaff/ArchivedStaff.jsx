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

const ArchivedStaff = () => {
  const dispatch = useDispatch();

  const rowsPerPage = 10;

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
  const departments = departmentList.map(
    (department) => department.name
  );

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [month, setMonth] = useState("");

  const currentPage =
    deletedEmployeePagination?.current_page || 1;

  const totalPages =
    deletedEmployeePagination?.total_pages || 1;


  const handleRestore = async (employeeId) => {
    console.log("handleRestore called:", employeeId);

    try {
      const result = await dispatch(
        rehireEmployeeById(employeeId)
      ).unwrap();

      console.log("Employee restored successfully:", result);

      // Refresh archived employees
      dispatch(
        getDeletedEmployees({
          page: currentPage,
          search,
          department,
          deleted_date: month,
        })
      );
    } catch (error) {
      console.error("Failed to restore employee:", error);
    }
  };

  // Fetch departments
  useEffect(() => {
    dispatch(
      getDepartments({
        page: 1,
        search: "",
      })
    );
  }, [dispatch]);

  // Fetch archived employees
  useEffect(() => {
    dispatch(
      getDeletedEmployees({
        page: currentPage,
        search,
        department,
        deleted_date: month,
      })
    );
  }, [
    dispatch,
    currentPage,
    search,
    department,
    month,
  ]);


  useEffect(() => {
    if (deletedEmployeeList.length > 0) {
        console.log("Sample archived employee row:", deletedEmployeeList[0]);
    }
}, [deletedEmployeeList]);
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
        onDepartment={setDepartment}

        date={month}
        onDate={setMonth}

        showSearch
        showDepartment
        showDate
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ReusableTable columns={employeeColumns(currentPage, rowsPerPage, handleRestore)} data={deletedEmployeeList} />
      )}

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={deletedEmployeePagination?.total_items ?? 0}
        onPageChange={(page) => {
          dispatch(
            getDeletedEmployees({
              page,
              search,
              department,
              deleted_date: month,
            })
          );
        }}
      />
    </div>
  );
};

export default ArchivedStaff;