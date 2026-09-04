import React, { useState, useEffect } from "react";
import {
  PageContainer,
  DepartmentGrid,
  DepartmentCard,
  DepartmentHeader,
  DepartmentName,
  EmployeeCount,
  DropdownWrapper,
  PaginationWrapper,
  PageButton,
  PageInfo,
  StatusSelect,
  LeftWrapper,
  DepartmentIcon,
} from "../attendance/AttendanceList.Styles";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../Redux/departmentSlice";
import {
  fetchReimbursementsByDepartment,
  updateReimbursementStatus,
} from "../../services/reimbursement";
import { useNavigate } from "react-router-dom";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import Side_detail from "./Side_detail.jsx";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader.jsx";
import ReusableTable from "../../Components/ReusableTable/ReusableTable.jsx";
import NoEmployeeFound from "../../Components/No found/Noemployeefound.jsx";
import Loader from "../../Components/Loader/Loader";

const PAGE_SIZE = 10;

const paginate = (items, page, size) => {
  const start = (page - 1) * size;
  return items.slice(start, start + size);
};

const ReimbursementList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState(null);
  const [departmentReimbursements, setDepartmentReimbursements] = useState({});
  const [loadingDept, setLoadingDept] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pageByDept, setPageByDept] = useState({});

  const { list: departmentList = [], loading } = useSelector((state) => state.departments);

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  const loadDeptReimbursements = async (deptId) => {
    setLoadingDept(true);
    try {
      const data = await fetchReimbursementsByDepartment(deptId, 1);
      const mapped = data.results.map((emp) => ({
        ...emp,
        reimbursement_id: emp.id,
      }));

      setDepartmentReimbursements((prev) => ({ ...prev, [deptId]: mapped }));
      setPageByDept((prev) => ({ ...prev, [deptId]: 1 }));
    } catch (error) {
      console.error("Failed to fetch dept reimbursements:", error);
      setDepartmentReimbursements((prev) => ({ ...prev, [deptId]: [] }));
      setPageByDept((prev) => ({ ...prev, [deptId]: 1 }));
    }
    setLoadingDept(false);
  };

  const handleToggle = async (deptId) => {
    if (selectedDept === deptId) {
      setSelectedDept(null);
      return;
    }

    setSelectedDept(deptId);

    if (!departmentReimbursements[deptId]) {
      await loadDeptReimbursements(deptId);
    } else {
      setPageByDept((prev) => ({ ...prev, [deptId]: prev[deptId] || 1 }));
    }
  };

  const handleStatusChange = async (reimbursementId, newStatus, deptId) => {
    const prevList = [...(departmentReimbursements[deptId] || [])];

    try {
      setDepartmentReimbursements((prev) => ({
        ...prev,
        [deptId]: prev[deptId].map((emp) =>
          emp.reimbursement_id === reimbursementId ? { ...emp, status: newStatus } : emp,
        ),
      }));

      await updateReimbursementStatus(reimbursementId, newStatus);
    } catch (error) {
      console.error("Failed to update:", error);
      setDepartmentReimbursements((prev) => ({ ...prev, [deptId]: prevList }));
    }
  };

  const filteredDepartments = departmentList
    .map((dept) => {
      const reimbursements = departmentReimbursements[dept.id] || [];
      const search = searchText.toLowerCase();

      const matchingEmployees = search
        ? reimbursements.filter((emp) => (emp.employee_name || "").toLowerCase().includes(search))
        : reimbursements;

      const departmentMatches = dept.name.toLowerCase().includes(search);

      return {
        ...dept,
        employees: matchingEmployees,
        isVisible: search === "" || departmentMatches || matchingEmployees.length > 0,
      };
    })
    .filter((d) => d.isVisible);

  return (
    <PageContainer>
      <ReusableHeader
        title="Reimbursement"
        breadcrumbs={["Dashboard", "Reimbursement"]}
        buttonText="History"
        onButtonClick={() => setShowModal(true)}
      />

      <DepartmentGrid>
        {departmentList.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#666", width: "100%", fontFamily: "Poppins, sans-serif" }}>
            No departments found.
          </div>
        ) : filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept) => {
            const isOpen = selectedDept === dept.id;
            const employees = departmentReimbursements[dept.id] || [];

            const currentPage = pageByDept[dept.id] || 1;
            const totalPages = Math.max(1, Math.ceil(employees.length / PAGE_SIZE));
            const paginatedEmployees = paginate(employees, currentPage, PAGE_SIZE);
            const startIndex = (currentPage - 1) * PAGE_SIZE;

            const reimbursementColumns = [
              {
                header: "Sl No",
                accessor: "slNo",
                sortable: false,
                width: "70px",
                render: (_row, index) => startIndex + index + 1,
              },
              { header: "Employee Name", accessor: "employee_name", width: "200px" },
              { header: "Employee ID", accessor: "employee_code", width: "140px" },
              { header: "Job Position", accessor: "designation" },
              { header: "Amount", accessor: "amount", width: "120px" },
              {
                header: "Status",
                accessor: "status",
                sortable: false,
                width: "180px",
                render: (emp) => (
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusSelect
                      value={emp.status}
                      onChange={(e) =>
                        handleStatusChange(emp.reimbursement_id, e.target.value, dept.id)
                      }
                      disabled={emp.status === "Approve"}
                      className={
                        emp.status ? emp.status.replace(/\s+/g, "-").toLowerCase() : ""
                      }
                      style={{
                        cursor: emp.status === "Approve" ? "not-allowed" : "pointer",
                        pointerEvents: emp.status === "Approve" ? "none" : "auto",
                      }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="Approve">Approved</option>
                      <option value="Reject">Rejected</option>
                      <option value="On Hold">On Hold</option>
                      <option value="In Verification">In Verification</option>
                    </StatusSelect>
                  </div>
                ),
              },
            ];

            return (
              <DepartmentCard key={dept.id}>
                <DepartmentHeader onClick={() => handleToggle(dept.id)}>
                  <LeftWrapper>
                    <DepartmentIcon>{dept.name?.charAt(0)}</DepartmentIcon>
                    <DepartmentName>{dept.name}</DepartmentName>
                  </LeftWrapper>

                  <EmployeeCount>{dept.reimbursement_request_count || 0} Request</EmployeeCount>
                </DepartmentHeader>

                {isOpen && (
                  <DropdownWrapper onClick={(e) => e.stopPropagation()}>
                    <ReusableTable
                      columns={reimbursementColumns}
                      data={paginatedEmployees}
                      loading={loadingDept}
                      emptyMessage="No reimbursement records found."
                      onRowClick={(row) => navigate(`/reimbursement_info/${row.reimbursement_id}`)}
                    />

                    {employees.length > PAGE_SIZE && (
                      <PaginationWrapper onClick={(e) => e.stopPropagation()}>
                        <PageButton
                          disabled={currentPage === 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPageByDept((prev) => ({
                              ...prev,
                              [dept.id]: Math.max(1, currentPage - 1),
                            }));
                          }}
                        >
                          <FaAnglesLeft />
                        </PageButton>

                        <PageInfo>
                          Page {currentPage} / {totalPages}
                        </PageInfo>

                        <PageButton
                          disabled={currentPage === totalPages}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPageByDept((prev) => ({
                              ...prev,
                              [dept.id]: Math.min(totalPages, currentPage + 1),
                            }));
                          }}
                        >
                          <FaAnglesRight />
                        </PageButton>
                      </PaginationWrapper>
                    )}
                  </DropdownWrapper>
                )}
              </DepartmentCard>
            );
          })
        ) : (
        <NoEmployeeFound />
        )}
      </DepartmentGrid>

      {showModal && <Side_detail onClose={() => setShowModal(false)} />}
    </PageContainer>
  );
};

export default ReimbursementList;