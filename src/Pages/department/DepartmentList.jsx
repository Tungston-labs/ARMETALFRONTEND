import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments, createNewDepartment } from "../../Redux/departmentSlice.js";


import {
  PageContainer,
  DepartmentGrid,
  DepartmentCard,
  DepartmentHeader,
  DepartmentName,
  EmployeeCount,
  DropdownWrapper,
  LeftWrapper,
  DepartmentIcon,
  PaginationWrapper,
  PageButton,
  PageInfo,
} from "../attendance/AttendanceList.Styles";
import {
  FormSection,
  InputGroup,
  Label,
  Input,
  ButtonGroups,
  CancelButton,
  TopRow,
  InputsWrapper,
  RightActions,
  DetailsBar,
  EditButton,
} from "../department/DepartmentDetails.Styles";
import { FaEdit, FaSave } from "react-icons/fa";
import { GoArrowUpRight } from "react-icons/go";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import NoEmployeeFound from "../../Components/No found/Noemployeefound.jsx";
import AddDepartment from "./AddDepartment.jsx";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader.jsx";
import ReusableTable from "../../Components/ReusableTable/ReusableTable.jsx";
import { useDepartmentDetails, PAGE_SIZE } from "./useDepartmentDetails.js";
import ReusablePagination from "../../Components/Pagination/ReusablePagination.jsx";

const paginate = (items, page, size) => {
  const start = (page - 1) * size;
  return items.slice(start, start + size);
};

const DepartmentList = () => {
  const dispatch = useDispatch();
  const { list: departments = [] } = useSelector((state) => state.departments);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({ name: "", department_code: "" });
  const [newDeptError, setNewDeptError] = useState("");
  const [savingNewDept, setSavingNewDept] = useState(false);

  const {
    selectedDeptId,
    loadingDept,
    getEntry,
    toggleDepartment,
    toggleEdit,
    updateFormField,
    setPage,
    saveDepartment,
  } = useDepartmentDetails();

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return departments || [];
    const q = search.toLowerCase();
    return (departments || []).filter(
      (d) =>
        (d.name || "").toLowerCase().includes(q) ||
        (d.department_code || "").toLowerCase().includes(q),
    );
  }, [departments, search]);

  const handleNewDeptChange = (e) => {
    const { name, value } = e.target;
    setNewDeptForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleCreateDepartment = async () => {
    if (!newDeptForm.name?.trim()) {
      setNewDeptError("Please provide a department name.");
      return;
    }
    if (!newDeptForm.department_code?.trim()) {
      setNewDeptError("Please provide a department code.");
      return;
    }
    if (newDeptForm.department_code.length > 10) {
      setNewDeptError("Department code cannot exceed 10 characters.");
      return;
    }

    setNewDeptError("");
    setSavingNewDept(true);

    try {
      await dispatch(createNewDepartment(newDeptForm)).unwrap();
      setShowAddModal(false);
      setNewDeptForm({ name: "", department_code: "" });
      dispatch(getDepartments({ page: 1, search: "" }));
    } catch (err) {
      setNewDeptError(
        err?.payload?.detail ||
        err?.payload?.message ||
        err?.message ||
        "Something went wrong. Please try again later.",
      );
    } finally {
      setSavingNewDept(false);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setNewDeptForm({ name: "", department_code: "" });
    setNewDeptError("");
  };

  return (
    <PageContainer>
      <ReusableHeader
        title="Department"
        breadcrumbs={["Dashboard", "Department"]}
        buttonText="+ ADD NEW DEPARTMENT"
        onButtonClick={openAddModal}
      />

      <DepartmentGrid>
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept) => {
            const isOpen = selectedDeptId === dept.id;
            const entry = getEntry(dept.id);
            const { employees, details, form, page, isEditing } = entry;

            const sortedEmployees = [...employees].sort((a, b) =>
              (a?.name || "").localeCompare(b?.name || "", undefined, {
                sensitivity: "base",
              }),
            );

            const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / PAGE_SIZE));
            const currentPage = page || 1;
            const paginatedEmployees = paginate(sortedEmployees, currentPage, PAGE_SIZE);
            const startIndex = (currentPage - 1) * PAGE_SIZE;

            const employeeColumns = [
              {
                header: "Sl No",
                accessor: "slNo",
                sortable: false,
                render: (_row, index) => startIndex + index + 1,
              },
              {
                header: "Employee name",
                accessor: "name",
                render: (row) => (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600 }}>
                      {row.name ? row.name.charAt(0).toUpperCase() + row.name.slice(1) : ""}
                    </span>
                    <span style={{ fontSize: 12, color: "#888" }}>{row.email}</span>
                  </div>
                ),
              },
              { header: "Employee ID", accessor: "employee_code" },
              { header: "Job Position", accessor: "designation" },
            ];

            return (
              <DepartmentCard key={dept.id}>
                <DepartmentHeader onClick={() => toggleDepartment(dept.id, departments)}>
                  <LeftWrapper>
                    <DepartmentIcon>{dept.name?.charAt(0)}</DepartmentIcon>
                    <DepartmentName>{dept.name}</DepartmentName>
                  </LeftWrapper>

                  <EmployeeCount>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div>{dept.employee_count ?? 0}</div>
                      <GoArrowUpRight size={15} style={{ strokeWidth: 2 }} />
                    </div>
                  </EmployeeCount>
                </DepartmentHeader>

                {isOpen && (
                  <>
                    <DetailsBar>
                      <EditButton
                        $active={isEditing}
                        onClick={(e) => {
                          e.stopPropagation();
                          isEditing ? saveDepartment(dept.id) : toggleEdit(dept.id);
                        }}
                        aria-label={isEditing ? "Save department" : "Edit department"}
                      >
                        {isEditing ? <FaSave /> : <FaEdit />}
                        {isEditing ? "Save" : "Edit"}
                      </EditButton>
                    </DetailsBar>

                    <FormSection>
                      <TopRow>
                        <InputsWrapper>
                          <InputGroup>
                            <Label>Department name</Label>
                            <Input
                              name="name"
                              value={form.name ?? ""}
                              autoComplete="off"
                              onChange={(e) => updateFormField(dept.id, e)}
                              disabled={!isEditing}
                              style={{
                                cursor: isEditing ? "text" : "default",
                                textTransform: "capitalize",
                              }}
                            />
                          </InputGroup>

                          <InputGroup>
                            <Label>Department Code Name</Label>
                            <Input
                              name="department_code"
                              value={form.department_code ?? ""}
                              autoComplete="off"
                              onChange={(e) => updateFormField(dept.id, e)}
                              disabled={!isEditing}
                              style={{ cursor: isEditing ? "text" : "default" }}
                            />
                          </InputGroup>

                          <InputGroup>
                            <Label>Department head</Label>
                            {isEditing ? (
                              <select
                                name="department_head_id"
                                value={form.department_head_id ?? ""}
                                onChange={(e) => updateFormField(dept.id, e)}
                                style={{
                                  padding: "10px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "16px",
                                  cursor: "pointer",
                                }}
                              >
                                <option value="">-- Select Department Head --</option>
                                {employees.map((emp) => (
                                  <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <Input
                                name="department_head"
                                value={dept.department_head?.employee_code || "Not Assigned"}
                                disabled
                              />
                            )}
                          </InputGroup>
                        </InputsWrapper>

                        <RightActions>
                          {isEditing && (
                            <ButtonGroups>
                              <CancelButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleEdit(dept.id);
                                }}
                              >
                                Cancel
                              </CancelButton>
                            </ButtonGroups>
                          )}
                        </RightActions>
                      </TopRow>
                    </FormSection>

                    <DropdownWrapper onClick={(e) => e.stopPropagation()}>
                      <ReusableTable
                        columns={employeeColumns}
                        data={paginatedEmployees}
                        loading={loadingDept}
                      />
                    </DropdownWrapper>

                    {sortedEmployees.length > PAGE_SIZE && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <ReusablePagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalRecords={sortedEmployees.length}
                          onPageChange={(newPage) => setPage(dept.id, newPage)}
                        />
                      </div>
                    )}
                  </>
                )}
              </DepartmentCard>
            );
          })
        ) : (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <NoEmployeeFound searchTerm={search} label="No Department Found" />
          </div>
        )}
      </DepartmentGrid>

      {showAddModal && (
        <AddDepartment
          onClose={() => setShowAddModal(false)}
          form={newDeptForm}
          error={newDeptError}
          loading={savingNewDept}
          onChange={handleNewDeptChange}
          onSubmit={handleCreateDepartment}
        />
      )}
    </PageContainer>
  );
};

export default DepartmentList;