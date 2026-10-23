import React from "react";
import {
  Section,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  Required,
  Input,
  SelectWrapper,
  Select,
  SelectArrow,
  ErrorText,
} from "../EmployeeForm.styles";

/**
 * Job Details section of the employee form.
 * Purely presentational — all state lives in the parent EmployeeForm.
 *
 * Props:
 * - formData: the shared form state object
 * - errors: field-name-keyed error messages
 * - handleChange: shared onChange handler from the parent
 */
const JobDetailsSection = ({ formData, errors, handleChange }) => {
  return (
    <Section>
      <SectionTitle>Job Details</SectionTitle>

      <FormGrid>
        {/* Designation */}
        <FormGroup>
          <Label>
            Designation<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="designation"
            placeholder="Enter designation"
            value={formData.designation}
            onChange={handleChange}
          />
          {errors.designation && <ErrorText>{errors.designation}</ErrorText>}
        </FormGroup>

        {/* Joining Date */}
        <FormGroup>
          <Label>
            Joining Date<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="joiningDate"
            placeholder="dd-mm-yyyy"
            value={formData.joiningDate}
            onChange={handleChange}
          />
          {errors.joiningDate && <ErrorText>{errors.joiningDate}</ErrorText>}
        </FormGroup>

        {/* Department */}
        <FormGroup>
          <Label>
            Department<Required>*</Required>
          </Label>
          <SelectWrapper>
            <Select name="department" value={formData.department} onChange={handleChange}>
              <option value="">Select department</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
            </Select>
            <SelectArrow>⌄</SelectArrow>
          </SelectWrapper>
          {errors.department && <ErrorText>{errors.department}</ErrorText>}
        </FormGroup>

        {/* Employment Type */}
        <FormGroup>
          <Label>
            Employment Type<Required>*</Required>
          </Label>
          <SelectWrapper>
            <Select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
            </Select>
            <SelectArrow>⌄</SelectArrow>
          </SelectWrapper>
          {errors.employmentType && <ErrorText>{errors.employmentType}</ErrorText>}
        </FormGroup>

        {/* Roles */}
        <FormGroup>
          <Label>
            Roles<Required>*</Required>
          </Label>
          <SelectWrapper>
            <Select name="roles" value={formData.roles} onChange={handleChange}>
              <option value="">Select Roles</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
            </Select>
            <SelectArrow>⌄</SelectArrow>
          </SelectWrapper>
          {errors.roles && <ErrorText>{errors.roles}</ErrorText>}
        </FormGroup>

        {/* Total Leave */}
        <FormGroup $fullWidth>
          <Label>
            Total Leave<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="totalLeave"
            placeholder="Enter total leave"
            value={formData.totalLeave}
            onChange={handleChange}
          />
          {errors.totalLeave && <ErrorText>{errors.totalLeave}</ErrorText>}
        </FormGroup>

        {/* Casual Leave */}
        <FormGroup>
          <Label>Casual Leave</Label>
          <Input
            type="text"
            name="casualLeave"
            value={formData.casualLeave}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Sick Leave */}
        <FormGroup>
          <Label>Sick Leave</Label>
          <Input
            type="text"
            name="sickLeave"
            value={formData.sickLeave}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Earned Leave */}
        <FormGroup>
          <Label>Earned Leave</Label>
          <Input
            type="text"
            name="earnedLeave"
            value={formData.earnedLeave}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Maternity Leave */}
        <FormGroup>
          <Label>Maternity Leave</Label>
          <Input
            type="text"
            name="maternityLeave"
            value={formData.maternityLeave}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Other Leave */}
        <FormGroup>
          <Label>Other Leave</Label>
          <Input
            type="text"
            name="otherLeave"
            value={formData.otherLeave}
            onChange={handleChange}
          />
        </FormGroup>
      </FormGrid>
    </Section>
  );
};

export default JobDetailsSection;