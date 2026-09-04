import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Overlay,
  Modal,
  Header,
  HeaderLeft,
  Title,
  Subtitle,
  CloseBtn,
  Body,
  SearchInput,
  EmployeeList,
  EmployeeItem,
  Checkbox,
  Avatar,
  EmpInfo,
  EmpName,
  EmpSub,
  SelectedCount,
  SelectedEmployees,
  SelectedEmployee,
  RemoveBtn,
  Row,
  Field,
  Label,
  Input,
  TextArea,
  Footer,
  CancelBtn,
  SaveBtn,
} from "../IncentiveModal/IncentiveModal.styles";

import { updatePayrollDeduction } from "../../../Redux/payrollSlice";

const DeductionModal = ({ onClose, employees = [], month, year }) => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [remarks, setRemarks] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // Search employees
  // -----------------------------------------
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(employees)) return [];

    const value = search.trim().toLowerCase();

    if (!value) return employees;

    return employees.filter((employee) => {
      const name = employee?.employee_name?.toLowerCase() || "";
      const employeeId = employee?.employee_id?.toLowerCase() || "";

      return name.includes(value) || employeeId.includes(value);
    });
  }, [employees, search]);

  // -----------------------------------------
  // Select / unselect employee
  // -----------------------------------------
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployees((prev) => {
      const exists = prev.some((item) => item.id === employee.id);

      if (exists) {
        return prev.filter((item) => item.id !== employee.id);
      }

      return [...prev, employee];
    });

    setErrors((prev) => {
      if (!prev.employee) return prev;

      const { employee: _employee, ...rest } = prev;
      return rest;
    });
  };

  // -----------------------------------------
  // Remove selected employee
  // -----------------------------------------
  const removeEmployee = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.filter((item) => item.id !== employeeId),
    );
  };

  // -----------------------------------------
  // Save deduction for all selected employees
  // -----------------------------------------
  const handleSave = async () => {
    const newErrors = {};

    if (selectedEmployees.length === 0) {
      newErrors.employee = "Please select at least one employee";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (Number(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!type.trim()) {
      newErrors.type = "Deduction type is required";
    }

    if (remarks.length > 200) {
      newErrors.remarks = "Remarks cannot exceed 200 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const results = await Promise.allSettled(
        selectedEmployees.map((employee) =>
          dispatch(
            updatePayrollDeduction({
              employeeId: employee.employee,
              month,
              year,
              deduction_amount: amount,
              deduction_type: type,
              deduction_reason: remarks,
            }),
          ).unwrap(),
        ),
      );

      const failedEmployees = [];
      let successCount = 0;

      results.forEach((result, index) => {
        const employee = selectedEmployees[index];

        if (result.status === "fulfilled") {
          successCount++;
        } else {
          const error = result.reason;

          let message =
            error?.error ||
            error?.message ||
            error?.detail ||
            (typeof error === "string" ? error : null) ||
            "Failed to add deduction";

          failedEmployees.push({
            employee,
            message,
          });
        }
      });

      // All successful
      if (failedEmployees.length === 0) {
        onClose(true);
        return;
      }

      // Some failed / some successful
      setErrors({
        general:
          successCount > 0
            ? `${successCount} employee${
                successCount > 1 ? "s" : ""
              } updated successfully.`
            : "Failed to add deduction.",
        employeeErrors: failedEmployees,
      });
    } catch (error) {
      console.error("Deduction Error:", error);

      setErrors({
        general: error?.error || error?.message || "Failed to add deduction",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        {/* HEADER */}
        <Header>
          <HeaderLeft>
            <Title>Add Deduction</Title>

            <Subtitle>
              {new Date(year, month - 1).toLocaleString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </Subtitle>
          </HeaderLeft>

          <CloseBtn onClick={() => onClose(false)}>✕</CloseBtn>
        </Header>

        <Body>
          {/* SEARCH */}
          <Field>
            <Label>Search Employee</Label>

            <SearchInput
              type="text"
              placeholder="Search by employee name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>

          {/* EMPLOYEE LIST */}
          <SelectedCount>
            {selectedEmployees.length} employee
            {selectedEmployees.length !== 1 ? "s" : ""} selected
          </SelectedCount>

          {errors.employee && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                margin: "6px 0 8px",
              }}
            >
              {errors.employee}
            </p>
          )}

          <EmployeeList>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => {
                const isSelected = selectedEmployees.some(
                  (item) => item.id === employee.id,
                );

                return (
                  <EmployeeItem
                    key={employee.id}
                    $selected={isSelected}
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    <Checkbox
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleEmployeeSelect(employee)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <Avatar>
                      {employee?.employee_name?.slice(0, 2).toUpperCase()}
                    </Avatar>

                    <EmpInfo>
                      <EmpName>{employee?.employee_name}</EmpName>

                      <EmpSub>
                        {employee?.employee_id} ·{" "}
                        {employee?.department || "N/A"}
                      </EmpSub>
                    </EmpInfo>
                  </EmployeeItem>
                );
              })
            ) : (
              <div
                style={{
                  padding: "15px",
                  textAlign: "center",
                  color: "#888",
                  fontSize: "13px",
                }}
              >
                No employees found
              </div>
            )}
          </EmployeeList>

          {errors.general && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "6px",
                background: "#fff4f4",
                border: "1px solid #f5c2c2",
              }}
            >
              <p
                style={{
                  color: "#d32f2f",
                  fontSize: "13px",
                  fontWeight: "600",
                  margin: "0 0 8px",
                }}
              >
                {errors.general}
              </p>

              {errors.employeeErrors?.map((item) => (
                <div
                  key={item.employee.id}
                  style={{
                    marginTop: "6px",
                    padding: "8px",
                    background: "#fff",
                    borderRadius: "5px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {item.employee.employee_name}
                  </div>

                  <div
                    style={{
                      color: "#d32f2f",
                      fontSize: "12px",
                      marginTop: "3px",
                    }}
                  >
                    {item.message}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SELECTED EMPLOYEES */}
          {selectedEmployees.length > 0 && (
            <SelectedEmployees>
              {selectedEmployees.map((employee) => (
                <SelectedEmployee key={employee.id}>
                  <span>{employee.employee_name}</span>

                  <RemoveBtn onClick={() => removeEmployee(employee.id)}>
                    ✕
                  </RemoveBtn>
                </SelectedEmployee>
              ))}
            </SelectedEmployees>
          )}

          {/* DEDUCTION DETAILS */}
          <Row>
            <Field>
              <Label>Deduction Amount</Label>

              <Input
                type="number"
                placeholder="e.g. 2000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              {errors.amount && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  {errors.amount}
                </p>
              )}
            </Field>

            <Field>
              <Label>Deduction Type</Label>

              <Input
                type="text"
                placeholder="e.g. Late Attendance"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />

              {errors.type && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  {errors.type}
                </p>
              )}
            </Field>
          </Row>

          <Field>
            <Label>Reason / Remarks</Label>

            <TextArea
              placeholder="Briefly describe the reason for this deduction..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            {errors.remarks && (
              <p
                style={{
                  color: "red",
                  fontSize: "12px",
                }}
              >
                {errors.remarks}
              </p>
            )}
          </Field>
        </Body>

        {/* FOOTER */}
        <Footer>
          <CancelBtn onClick={() => onClose(false)}>Cancel</CancelBtn>

          <SaveBtn onClick={handleSave} disabled={loading}>
            {loading
              ? "Saving..."
              : `Save Deduction${
                  selectedEmployees.length > 0
                    ? ` (${selectedEmployees.length})`
                    : ""
                }`}
          </SaveBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default DeductionModal;
