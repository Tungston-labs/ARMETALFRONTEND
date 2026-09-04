import React, { useState, useEffect } from "react";
import {
  PageContainer,
  DepartmentGrid,
  DepartmentCard,
  DepartmentHeader,
  DepartmentName,
  EmployeeCount,
  DropdownWrapper,
  EmployeeList,
  EmployeeItem,
  DropdownHeader,
  EmployeeCell,
  EmployeeRow,
} from "../attendance/AttendanceList.Styles";
import EmployeeTitle from "../../Components/Employee/Headers/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../Redux/departmentSlice";
import { getOnLeaveEmployees } from "../../Redux/leaveSlice";
import Loader from "../../Components/Loader/Loader";

const LeaveList = () => {
  const dispatch = useDispatch();
  const [selectedDept, setSelectedDept] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { list: departmentList, loading } = useSelector(
    (state) => state.departments
  );
  const { onLeaveEmployees } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  const handleToggle = (deptId) => {
    if (selectedDept === deptId) {
      setSelectedDept(null);
    } else {
      setSelectedDept(deptId);
      dispatch(getOnLeaveEmployees(deptId));
    }
  };

  // 🔍 Filter departments by search input
  const filteredDepartments = departmentList?.filter((dept) =>
    dept.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <PageContainer>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showAddButton={false}
        showDropdown={false}
        onSearchChange={setSearchText} 
        showBackArrow={false}
      />

      {loading ? (
        <Loader />
      ) : (
        <DepartmentGrid>
          {filteredDepartments?.length > 0 ? ( // ✅ use filtered list
            filteredDepartments.map((dept) => {
              const isOpen = selectedDept === dept.id;
              return (
                <DepartmentCard key={dept.id}>
                  <DepartmentHeader onClick={() => handleToggle(dept.id)}>
                    <DepartmentName>{dept.name || "Department"}</DepartmentName>
                    <EmployeeCount>
                      {dept.todays_leave_employee_count || 0} Employees
                    </EmployeeCount>
                  </DepartmentHeader>

                  {isOpen && (
                    <DropdownWrapper>
                      <DropdownHeader>
                        <span>Name</span>
                        <span>Employee ID</span>
                        <span>Designation</span>
                        <span>Email</span>
                      </DropdownHeader>

                      <EmployeeList>
                        {onLeaveEmployees?.length > 0 ? (
                          onLeaveEmployees.map((emp) => (
                            <EmployeeRow
                              key={emp.id}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr 2fr",
                                gap: "10px",
                              }}
                            >
                              <EmployeeCell>{emp.name || "-"}</EmployeeCell>
                              <EmployeeCell>{emp.employee_id || "-"}</EmployeeCell>
                              <EmployeeCell>{emp.designation || "-"}</EmployeeCell>
                              <EmployeeCell>{emp.email || "-"}</EmployeeCell>
                            </EmployeeRow>
                          ))
                        ) : (
                          <EmployeeItem>No employees on leave</EmployeeItem>
                        )}
                      </EmployeeList>
                    </DropdownWrapper>
                  )}
                </DepartmentCard>
              );
            })
          ) : (
            <p>No departments found.</p>
          )}
        </DepartmentGrid>
      )}
    </PageContainer>
  );
};

export default LeaveList;
