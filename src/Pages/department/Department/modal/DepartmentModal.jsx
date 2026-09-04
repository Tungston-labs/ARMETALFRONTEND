import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getEmployeesByDepartment,
} from "../../../../Redux/departmentSlice";

import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  Form,
  FormRow,
  FormGroup,
  Label,
  Required,
  Input,
  Select,
  ButtonRow,
  CancelButton,
  SubmitButton,
  ErrorMessage,
} from "./DepartmentModal.styles";

const emptyForm = {
  departmentName: "",
  departmentCode: "",
  headOfDepartment: "",
};

const DepartmentModal = ({
  isOpen,
  onClose,
  mode = "add",
  departmentData = null,
  departmentId = null,
  onSubmit,
  departments = [],
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(emptyForm);

  const [errors, setErrors] = useState({
    departmentName: "",
    departmentCode: "",
    general: "",
  });

  const isEdit = mode === "edit";

  // =====================================================
  // DEPARTMENT EMPLOYEES
  // =====================================================

  const {
    departmentEmployees = [],
    loadingEmployees,
  } = useSelector(
    (state) => state.departments
  );

  // =====================================================
  // GET EMPLOYEES OF CURRENT DEPARTMENT
  // =====================================================

  useEffect(() => {
    if (!isOpen || !isEdit || !departmentId) {
      return;
    }

    console.log(
      "Fetching employees for department:",
      departmentId
    );

    dispatch(
      getEmployeesByDepartment(departmentId)
    );
  }, [
    isOpen,
    isEdit,
    departmentId,
    dispatch,
  ]);

  // =====================================================
  // NORMALIZE DEPARTMENT EMPLOYEES
  // =====================================================

  const employeeList = Array.isArray(
    departmentEmployees
  )
    ? departmentEmployees
    : Array.isArray(
        departmentEmployees?.results
      )
    ? departmentEmployees.results
    : [];

  // =====================================================
  // FILL FORM
  // =====================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isEdit && departmentData) {
      setFormData({
        departmentName:
          departmentData.departmentName ||
          departmentData.name ||
          "",

        departmentCode:
          departmentData.departmentCode ||
          departmentData.department_code ||
          departmentData.code ||
          "",

        headOfDepartment:
          departmentData.headOfDepartment ||
          departmentData.head_of_department ||
          departmentData.department_head ||
          departmentData.department_head_id ||
          "",
      });
    } else {
      setFormData(emptyForm);
    }

    setErrors({
      departmentName: "",
      departmentCode: "",
      general: "",
    });
  }, [
    isOpen,
    isEdit,
    departmentData,
  ]);

  // =====================================================
  // CHECK UNIQUE DEPARTMENT NAME
  // =====================================================

  const checkUniqueName = (value) => {
    const name = String(value || "")
      .trim()
      .toLowerCase();

    if (!name) {
      return "";
    }

    const duplicate = departments.some(
      (department) => {
        if (
          isEdit &&
          departmentData &&
          Number(department.id) ===
            Number(departmentData.id)
        ) {
          return false;
        }

        const existingName = String(
          department.name ||
            department.departmentName ||
            ""
        )
          .trim()
          .toLowerCase();

        return existingName === name;
      }
    );

    if (duplicate) {
      return "Department name already exists.";
    }

    return "";
  };

  // =====================================================
  // CHECK UNIQUE DEPARTMENT CODE
  // =====================================================

  const checkUniqueCode = (value) => {
    const code = String(value || "")
      .trim()
      .toLowerCase();

    if (!code) {
      return "";
    }

    const duplicate = departments.some(
      (department) => {
        if (
          isEdit &&
          departmentData &&
          Number(department.id) ===
            Number(departmentData.id)
        ) {
          return false;
        }

        const existingCode = String(
          department.department_code ||
            department.departmentCode ||
            department.code ||
            ""
        )
          .trim()
          .toLowerCase();

        return existingCode === code;
      }
    );

    if (duplicate) {
      return "Department code already exists.";
    }

    return "";
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "departmentName") {
      setErrors((prev) => ({
        ...prev,
        departmentName:
          checkUniqueName(value),
        general: "",
      }));
    }

    if (name === "departmentCode") {
      setErrors((prev) => ({
        ...prev,
        departmentCode:
          checkUniqueCode(value),
        general: "",
      }));
    }

    if (
      name !== "departmentName" &&
      name !== "departmentCode"
    ) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    const newErrors = {
      departmentName: "",
      departmentCode: "",
      general: "",
    };

    if (!formData.departmentName.trim()) {
      newErrors.departmentName =
        "Department name is required.";
    } else {
      newErrors.departmentName =
        checkUniqueName(
          formData.departmentName
        );
    }

    if (!formData.departmentCode.trim()) {
      newErrors.departmentCode =
        "Department code is required.";
    } else {
      newErrors.departmentCode =
        checkUniqueCode(
          formData.departmentCode
        );
    }

    setErrors(newErrors);

    return (
      !newErrors.departmentName &&
      !newErrors.departmentCode
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
    };

    if (isEdit && departmentData?.id) {
      submitData.id =
        departmentData.id;
    }

    console.log(
      isEdit
        ? "Updating department:"
        : "Creating department:",
      submitData
    );

    if (!onSubmit) {
      return;
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error(
        "Department modal submit error:",
        error
      );

      if (error?.department_code) {
        const message = Array.isArray(
          error.department_code
        )
          ? error.department_code[0]
          : error.department_code;

        setErrors((prev) => ({
          ...prev,
          departmentCode: message,
        }));

        return;
      }

      if (error?.name) {
        const message = Array.isArray(
          error.name
        )
          ? error.name[0]
          : error.name;

        setErrors((prev) => ({
          ...prev,
          departmentName: message,
        }));

        return;
      }

      let message =
        error?.detail ||
        error?.message ||
        "Unable to save department. Please try again.";

      if (Array.isArray(message)) {
        message = message[0];
      }

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    setFormData(emptyForm);

    setErrors({
      departmentName: "",
      departmentCode: "",
      general: "",
    });

    onClose();
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={handleClose}>
      <Modal
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <ModalHeader>
          <ModalTitle>
            {isEdit
              ? "Edit Department"
              : "Add Department"}
          </ModalTitle>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>

          {/* =================================================
              DEPARTMENT NAME + CODE
          ================================================= */}

          <FormRow>

            <FormGroup>
              <Label>
                Department Name{" "}
                <Required>*</Required>
              </Label>

              <Input
                type="text"
                name="departmentName"
                value={
                  formData.departmentName
                }
                onChange={handleChange}
                placeholder="Development"
                autoComplete="off"
              />

              {errors.departmentName && (
                <ErrorMessage>
                  {
                    errors.departmentName
                  }
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                Department Code{" "}
                <Required>*</Required>
              </Label>

              <Input
                type="text"
                name="departmentCode"
                value={
                  formData.departmentCode
                }
                onChange={handleChange}
                placeholder="DEV-001"
                autoComplete="off"
              />

              {errors.departmentCode && (
                <ErrorMessage>
                  {
                    errors.departmentCode
                  }
                </ErrorMessage>
              )}
            </FormGroup>

          </FormRow>

          {/* =================================================
              HEAD OF DEPARTMENT
          ================================================= */}

          {isEdit && (
            <FormRow>
              <FormGroup>

                <Label>
                  Head Of The Department
                </Label>

                <Select
                  name="headOfDepartment"
                  value={
                    formData.headOfDepartment
                  }
                  onChange={handleChange}
                  disabled={
                    loadingEmployees
                  }
                >

                  <option value="">
                    {loadingEmployees
                      ? "Loading employees..."
                      : "Select Head"}
                  </option>

                  {employeeList.map(
                    (emp) => (
                      <option
                        key={emp.id}
                        value={emp.id}
                      >
                        {emp.name ||
                          emp.employee_name ||
                          emp.full_name ||
                          `Employee #${emp.id}`}
                      </option>
                    )
                  )}

                </Select>

                {!loadingEmployees &&
                  employeeList.length ===
                    0 && (
                    <ErrorMessage>
                      No employees found in
                      this department.
                    </ErrorMessage>
                  )}

              </FormGroup>
            </FormRow>
          )}

          {/* =================================================
              GENERAL ERROR
          ================================================= */}

          {errors.general && (
            <ErrorMessage>
              {errors.general}
            </ErrorMessage>
          )}

          {/* =================================================
              BUTTONS
          ================================================= */}
<ButtonRow>
  <CancelButton
    type="button"
    onClick={handleClose}
  >
    CANCEL
  </CancelButton>

  <SubmitButton
    type="submit"
    disabled={Boolean(
      errors.departmentName ||
        errors.departmentCode
    )}
  >
    {isEdit ? "UPDATE" : "CREATE"}
  </SubmitButton>
</ButtonRow>

        </Form>
      </Modal>
    </Overlay>
  );
};

export default DepartmentModal;