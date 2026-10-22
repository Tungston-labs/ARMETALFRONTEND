
import React, { useEffect, useState } from "react";

import {
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBody,
  FormGrid,
  FormGroup,
  Label,
  Required,
  Input,
  SelectWrapper,
  Select,
  // SelectArrow,
  ButtonRow,
  CancelButton,
  SubmitButton,
  ModalSubtitle,
  EmployeeRow,
} from "./ProjectModal.Styles";
import { FiSave } from "react-icons/fi";

const initialFormData = {
  projectName: "",
  projectType: "on_site",
  latitude: "",
  longitude: "",
  priority: "high",
  startDate: "",
  projectStatus: "in_progress",
};

const ProjectModal = ({
  isOpen,
  onClose,
  editData = null,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(initialFormData);

  // Employees currently assigned to the project
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  // Employees who are team leads
  const [teamLeadIds, setTeamLeadIds] = useState([]);

  const isEditMode = Boolean(editData);

  useEffect(() => {
    if (editData) {
      setFormData({
        projectName:
          editData.projectName ||
          editData.name ||
          editData.title ||
          "",

        projectType:
          editData.projectType ||
          editData.punch_type ||
          "on_site",

        latitude:
          editData.latitude ?? "",

        longitude:
          editData.longitude ?? "",

        priority:
          editData.priority ||
          "high",

        startDate:
          editData.startDate ||
          editData.start_date ||
          editData.date ||
          "",

        projectStatus:
          editData.projectStatus ||
          editData.status ||
          "in_progress",
      });

      // Get currently assigned employees
      const projectEmployees = editData.employees || [];

      const employeeIds = projectEmployees
        .map((employee) => {
          if (
            typeof employee === "object" &&
            employee !== null
          ) {
            return employee.id;
          }

          return employee;
        })
        .filter(Boolean);

      setSelectedEmployeeIds(employeeIds);

      // Get current team leads using is_lead
      const leadIds = projectEmployees
        .filter(
          (employee) =>
            typeof employee === "object" &&
            employee !== null &&
            employee.is_lead === true
        )
        .map((employee) => employee.id);

      // Fallback to top-level team_leads if needed
      if (leadIds.length === 0 && editData.team_leads) {
        const topLevelLeadIds = editData.team_leads.map(
          (lead) => {
            if (
              typeof lead === "object" &&
              lead !== null
            ) {
              return lead.id;
            }

            return lead;
          }
        );

        setTeamLeadIds(topLevelLeadIds);
      } else {
        setTeamLeadIds(leadIds);
      }
    } else {
      setFormData(initialFormData);
      setSelectedEmployeeIds([]);
      setTeamLeadIds([]);
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // EMPLOYEE CHECKBOX
  // =====================================================

  const handleEmployeeToggle = (employeeId) => {
    setSelectedEmployeeIds((prev) => {
      if (prev.includes(employeeId)) {
        // If employee is removed,
        // also remove them from Team Leads
        setTeamLeadIds((leadIds) =>
          leadIds.filter((id) => id !== employeeId)
        );

        return prev.filter((id) => id !== employeeId);
      }

      return [...prev, employeeId];
    });
  };

  // =====================================================
  // TEAM LEAD CHECKBOX
  // =====================================================

  const handleTeamLeadToggle = (employeeId) => {
    // Team lead must be an assigned employee
    if (!selectedEmployeeIds.includes(employeeId)) {
      return;
    }

    setTeamLeadIds((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      }

      return [...prev, employeeId];
    });
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(
      {
        ...formData,

        // Send employees and team leads
        employeeIds: selectedEmployeeIds,
        teamLeadIds: teamLeadIds,
      },
      editData
    );
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setSelectedEmployeeIds([]);
    setTeamLeadIds([]);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const projectEmployees = editData?.employees || [];

  return (
    <Overlay>
      <ModalContainer>
        {/* Header */}
      <ModalHeader>
  <ModalTitle>{isEditMode ? "Edit Project" : "Add New Project"}</ModalTitle>
  <ModalSubtitle>
    {isEditMode
      ? "Update the project details and manage assigned employees."
      : "Create a new project and set its type, priority and start date."}
  </ModalSubtitle>
</ModalHeader>
        {/* Body */}
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGrid>

              {/* Project Name */}
              <FormGroup>
                <Label>
                  Project Name{" "}
                  <Required>*</Required>
                </Label>

                <Input
                  type="text"
                  name="projectName"
                  placeholder="Enter name of the Project"
                  value={formData.projectName}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* Project Type */}
              <FormGroup>
                <Label>
                  Project Type{" "}
                  <Required>*</Required>
                </Label>

                <SelectWrapper>
                  <Select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                  >
                    <option value="on_site">
                      On Site
                    </option>

                    <option value="variant">
                      Variant
                    </option>

                    <option value="bench">
                      Bench
                    </option>
                  </Select>

                  {/* <SelectArrow>⌄</SelectArrow> */}
                </SelectWrapper>
              </FormGroup>

              {/* Latitude */}
              <FormGroup>
                <Label>
                  Latitude{" "}
                  <Required>*</Required>
                </Label>

                <Input
                  type="text"
                  name="latitude"
                  placeholder="Enter Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* Longitude */}
              <FormGroup>
                <Label>
                  Longitude{" "}
                  <Required>*</Required>
                </Label>

                <Input
                  type="text"
                  name="longitude"
                  placeholder="Enter Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* Priority */}
              <FormGroup>
                <Label>
                  Priority{" "}
                  <Required>*</Required>
                </Label>

                <SelectWrapper>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="high">
                      High
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="low">
                      Low
                    </option>
                  </Select>

                  {/* <SelectArrow>⌄</SelectArrow> */}
                </SelectWrapper>
              </FormGroup>

              {/* Start Date */}
              <FormGroup>
                <Label>
                  Start Date{" "}
                  <Required>*</Required>
                </Label>

                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* Project Status */}
              <FormGroup>
                <Label>
                  Project Status{" "}
                  <Required>*</Required>
                </Label>

                <SelectWrapper>
                  <Select
                    name="projectStatus"
                    value={formData.projectStatus}
                    onChange={handleChange}
                  >
                    <option value="in_progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="on_hold">
                      On Hold
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </Select>

                  {/* <SelectArrow>⌄</SelectArrow> */}
                </SelectWrapper>
              </FormGroup>

            </FormGrid>

            {/* ================================================= */}
            {/* PROJECT EMPLOYEES */}
            {/* ================================================= */}

          {isEditMode && projectEmployees.length > 0 && (
  <EmployeeSection>
    <Label>Project Employees</Label>

    <EmployeeTable>
      <EmployeeHead>
        <span>Employee</span>
        <span>Team Lead</span>
      </EmployeeHead>

      {projectEmployees.map((employee) => {
        const isObj = typeof employee === "object" && employee !== null;
        const employeeId = isObj ? employee.id : employee;
        const employeeName = isObj
          ? employee.name ||
            employee.employee_name ||
            employee.full_name ||
            `Employee ${employee.id}`
          : `Employee ${employee}`;

        const isSelected = selectedEmployeeIds.includes(employeeId);
        const isLead = teamLeadIds.includes(employeeId);

        return (
          <EmployeeRow key={employeeId}>
            <CheckLabel>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleEmployeeToggle(employeeId)}
              />
              <span>{employeeName}</span>
            </CheckLabel>

            <CheckLabel $disabled={!isSelected}>
              <input
                type="checkbox"
                checked={isLead}
                disabled={!isSelected}
                onChange={() => handleTeamLeadToggle(employeeId)}
              />
              <span>Team Lead</span>
            </CheckLabel>
          </EmployeeRow>
        );
      })}
    </EmployeeTable>
  </EmployeeSection>
)}
            {/* Buttons */}
            <ButtonRow>
              <CancelButton
                type="button"
                onClick={handleClose}
              >
                CANCEL
              </CancelButton>

              <SubmitButton type="submit">
  <FiSave />
  {isEditMode ? "UPDATE PROJECT" : "CREATE PROJECT"}
</SubmitButton>
            </ButtonRow>
          </form>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default ProjectModal;

