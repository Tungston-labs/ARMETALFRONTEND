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

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const EmployeeHeader = ({ formData, setFormData, setIsFormDirty, errors, setErrors }) => {
  const MAX_SIZE = 5 * 1024 * 1024;

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, [name]: "Please upload a valid image." }));
        return;
      }

      if (file.size > MAX_SIZE) {
        setErrors((prev) => ({ ...prev, [name]: "Image size must be less than 5 MB." }));
        return;
      }

      setErrors((prev) => ({ ...prev, [name]: "" }));
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear any existing email error while the user is still typing.
      // Actual validation happens on blur (see handleBlur below).
      if (name === "email" && errors?.email) {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    setIsFormDirty(true);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, email: "" }));
      } else if (!EMAIL_REGEX.test(value.trim())) {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address (e.g. name@example.com).",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }
  };

  
  return (
    <Container>
      <SectionTitle>Basic Details</SectionTitle>

      <InfoWrapper>
        <Row>
          <FieldGroup>
            <FieldLabel $required>Name</FieldLabel>
            <Input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.name && <ErrorText>{errors.name}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel $required>Email</FieldLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors?.email && <ErrorText>{errors.email}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel $required>Date of Birth</FieldLabel>
            <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            {errors?.dob && <ErrorText>{errors.dob}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel $required>Employee ID</FieldLabel>
            <Input
              type="text"
              name="employee_code"
              placeholder="Enter employee code"
              value={formData.employee_code}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.employee_code && <ErrorText>{errors.employee_code}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel $required>Gender</FieldLabel>
            <Select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
            {errors?.gender && <ErrorText>{errors.gender}</ErrorText>}
          </FieldGroup>
        </Row>

        <Row>
          <FieldGroup>
            <FieldLabel $required>Contact Number</FieldLabel>
            <Input
              type="number"
              name="phno"
              placeholder="Enter contact number"
              value={formData.phno}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.phno && <ErrorText>{errors.phno}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel $required>Address</FieldLabel>
            <Input
              name="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.address && <ErrorText>{errors.address}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel $required>Country</FieldLabel>
            <Input
              type="text"
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors?.country && <ErrorText>{errors.country}</ErrorText>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel $required>Blood Group</FieldLabel>
            <Select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </Select>
            {errors?.blood_group && <ErrorText>{errors.blood_group}</ErrorText>}
          </FieldGroup>
        </Row>
      </InfoWrapper>
    </Container>
  );
};

export default EmployeeHeader;