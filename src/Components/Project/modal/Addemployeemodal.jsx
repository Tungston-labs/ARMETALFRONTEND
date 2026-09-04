
import React, { useMemo, useState, useEffect } from "react";
import { PiMagnifyingGlass } from "react-icons/pi";

import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  FilterRow,
  Select,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  ListWrapper,
  EmployeeRow,
  RowIndex,
  RowName,
  Checkbox,
  EmptyState,
  ButtonRow,
  CancelButton,
  AddButton,
} from "./Addemployeemodal.styles";

const AddEmployeeModal = ({
  isOpen,
  onClose,
  employees = [],
  onAdd,
  isLoading = false,
}) => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  // Selected project employees
  const [selectedIds, setSelectedIds] = useState([]);

  // Selected team leads
  const [teamLeadIds, setTeamLeadIds] = useState([]);

  // ==========================================
  // RESET MODAL
  // ==========================================
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setDepartment("");
      setSelectedIds([]);
      setTeamLeadIds([]);
    }
  }, [isOpen]);

  // ==========================================
  // GET DEPARTMENTS
  // ==========================================
  const departmentOptions = useMemo(() => {
    const departments = employees
      .map((employee) => employee.department_name)
      .filter(
        (departmentName) =>
          departmentName && departmentName.trim() !== ""
      );

    return [...new Set(departments)].sort();
  }, [employees]);

  // ==========================================
  // FILTER EMPLOYEES
  // ==========================================
  const filteredEmployees = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const employeeName = (employee.name || "").toLowerCase();

      const employeeDepartment = (
        employee.department_name || ""
      ).trim();

      const matchesSearch =
        !searchValue || employeeName.includes(searchValue);

      const matchesDepartment =
        !department || employeeDepartment === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  // ==========================================
  // SELECT / UNSELECT EMPLOYEE
  // ==========================================
  const toggleEmployee = (employeeId) => {
    setSelectedIds((prev) => {
      if (prev.includes(employeeId)) {
        // If employee is removed,
        // also remove them from team leads
        setTeamLeadIds((teamLeadPrev) =>
          teamLeadPrev.filter((id) => id !== employeeId)
        );

        return prev.filter((id) => id !== employeeId);
      }

      return [...prev, employeeId];
    });
  };

  // ==========================================
  // SELECT / UNSELECT TEAM LEAD
  // ==========================================
  const toggleTeamLead = (employeeId) => {
    // Employee must first be selected
    if (!selectedIds.includes(employeeId)) {
      return;
    }

    setTeamLeadIds((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      }

      return [...prev, employeeId];
    });
  };

  // ==========================================
  // ADD EMPLOYEES
  // ==========================================
  const handleAdd = () => {
    if (selectedIds.length === 0) {
      return;
    }

    onAdd({
      employeeIds: selectedIds,
      teamLeadIds: teamLeadIds,
    });
  };

  // ==========================================
  // CLOSE
  // ==========================================
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <ModalHeader>
          <ModalTitle>
            Add Employee
          </ModalTitle>
        </ModalHeader>

        {/* ================================= */}
        {/* FILTER ROW */}
        {/* ================================= */}
        <FilterRow>

          {/* DEPARTMENT */}
          <Select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
            }}
          >
            <option value="">
              All Department
            </option>

            {departmentOptions.map((dept) => (
              <option
                key={dept}
                value={dept}
              >
                {dept}
              </option>
            ))}
          </Select>

          {/* SEARCH */}
          <SearchWrapper>
            <SearchInput
              type="text"
              placeholder="Search employee"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />

            <SearchIcon>
              <PiMagnifyingGlass size={16} />
            </SearchIcon>
          </SearchWrapper>

        </FilterRow>

        {/* ================================= */}
        {/* EMPLOYEE LIST */}
        {/* ================================= */}
        <ListWrapper>

          {filteredEmployees.length === 0 ? (
            <EmptyState>
              {department
                ? `No employees found in ${department}.`
                : "No employees found."}
            </EmptyState>
          ) : (
            <>
              {department && (
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "10px 0",
                  }}
                >
                  {department}
                </div>
              )}

              {/* TABLE HEADER */}
              <EmployeeRow
                style={{
                  fontWeight: "600",
                  borderBottom: "1px solid #eee",
                }}
              >
                <RowIndex></RowIndex>

                <RowName>
                  
                </RowName>

                <div
                  style={{
                    minWidth: "90px",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  Select
                </div>

                <div
                  style={{
                    minWidth: "100px",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  Team Lead
                </div>
              </EmployeeRow>

              {/* EMPLOYEES */}
              {filteredEmployees.map((employee, index) => {
                const isSelected = selectedIds.includes(
                  employee.id
                );

                const isTeamLead = teamLeadIds.includes(
                  employee.id
                );

                return (
                  <EmployeeRow
                    key={employee.id}
                  >
                    <RowIndex>
                      {String(index + 1).padStart(2, "0")}
                    </RowIndex>

                    <RowName>
                      {employee.name}
                    </RowName>

                    {/* EMPLOYEE CHECKBOX */}
                    <div
                      style={{
                        minWidth: "90px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Checkbox
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          toggleEmployee(employee.id)
                        }
                      />
                    </div>

                    {/* TEAM LEAD CHECKBOX */}
                    <div
                      style={{
                        minWidth: "100px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Checkbox
                        type="checkbox"
                        checked={isTeamLead}
                        disabled={!isSelected}
                        onChange={() =>
                          toggleTeamLead(employee.id)
                        }
                      />
                    </div>
                  </EmployeeRow>
                );
              })}
            </>
          )}

        </ListWrapper>

        {/* ================================= */}
        {/* BUTTONS */}
        {/* ================================= */}
        <ButtonRow>

          <CancelButton
            type="button"
            onClick={onClose}
          >
            CANCEL
          </CancelButton>

          <AddButton
            type="button"
            onClick={handleAdd}
            disabled={
              selectedIds.length === 0 ||
              isLoading
            }
          >
            {isLoading ? "ADDING..." : "ADD"}
          </AddButton>

        </ButtonRow>

      </Modal>
    </Overlay>
  );
};

export default AddEmployeeModal;

