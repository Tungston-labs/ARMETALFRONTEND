import React from "react";

import {
  Container,
  InfoWrapper,
  Row,
  FieldGroup,
  FieldLabel,
  Input,
  TextArea,
  Select,
  ErrorText,
  SectionTitle,
} from "./EmployeeHeader.Styles";
import Stepper from "./Stepper";

const EmployeeHeader = ({
  employee = {},
  editable,
  onChange,
  onImageChange,
  errors,
}) => {
  return (
    <Container>
      <Stepper
        currentStep={1}
        editable={editable}
        profileImageSrc={
          employee.profile_pic instanceof File
            ? URL.createObjectURL(employee.profile_pic)
            : employee.profile_pic
        }
        onProfileImageChange={(file) => onImageChange?.(file)}
      />

      <SectionTitle>Basic Details</SectionTitle>

      <InfoWrapper>
        {/* ROW 1 */}
        <Row>
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={employee.name || ""}
              onChange={onChange}
              autoComplete="off"
              $error={Boolean(errors?.name)}
            />
            {errors?.name && <ErrorText>{errors.name}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={employee.email || ""}
              onChange={onChange}
              autoComplete="off"
              $error={Boolean(errors?.email)}
             readOnly
            />
            {errors?.email && <ErrorText>{errors.email}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Date of Birth</FieldLabel>
            <Input
              type="date"
              name="dob"
              value={employee.dob || ""}
              onChange={onChange}
              $error={Boolean(errors?.dob)}
            />
            {errors?.dob && <ErrorText>{errors.dob}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Employee ID</FieldLabel>
            <Input
              type="text"
              name="employee_code"
              placeholder="Enter employee ID"
              value={employee.employee_code || ""}
              onChange={onChange}
              autoComplete="off"
              $error={Boolean(errors?.employee_code)}
              readOnly
            />
            {errors?.employee_code && (
              <ErrorText>{errors.employee_code}</ErrorText>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Gender</FieldLabel>
            <Select
              name="gender"
              value={employee.gender || ""}
              onChange={onChange}
              $error={Boolean(errors?.gender)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
            {errors?.gender && <ErrorText>{errors.gender}</ErrorText>}
          </FieldGroup>
        </Row>

        {/* ROW 2 */}
        <Row>
          <FieldGroup>
            <FieldLabel>Contact Number</FieldLabel>
            <Input
              type="tel"
              name="phno"
              placeholder="Enter contact number"
              value={employee.phno || ""}
              onChange={onChange}
              autoComplete="off"
              $error={Boolean(errors?.phno)}
            />
            {errors?.phno && <ErrorText>{errors.phno}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Address</FieldLabel>
            <Input
              type="text"
              name="address"
              placeholder="Enter full address"
              value={employee.address || ""}
              onChange={onChange}
              autoComplete="off"
              $error={Boolean(errors?.address)}
            />
            {errors?.address && <ErrorText>{errors.address}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Country</FieldLabel>
            <Input
              type="text"
              name="country"
              placeholder="Enter country"
              value={employee.country || ""}
              onChange={onChange}
              autoComplete="off"
              $error={Boolean(errors?.country)}
            />
            {errors?.country && <ErrorText>{errors.country}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Blood Group</FieldLabel>
            <Select
              name="blood_group"
              value={employee.blood_group || ""}
              onChange={onChange}
              $error={Boolean(errors?.blood_group)}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Select>
            {errors?.blood_group && (
              <ErrorText>{errors.blood_group}</ErrorText>
            )}
          </FieldGroup>
          
        </Row>
      </InfoWrapper>
    </Container>
  );
};

export default EmployeeHeader;