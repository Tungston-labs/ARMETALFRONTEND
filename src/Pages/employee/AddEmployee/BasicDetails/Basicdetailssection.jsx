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
  PhoneWrapper,
  CountrySelect,
  PhoneInput,
  ErrorText,
} from "../EmployeeForm.styles";

/**
 * Basic Details section of the employee form.
 * Purely presentational — all state lives in the parent EmployeeForm.
 *
 * Props:
 * - formData: the shared form state object
 * - errors: field-name-keyed error messages
 * - handleChange: shared onChange handler from the parent
 */
const BasicDetailsSection = ({ formData, errors, handleChange }) => {
  return (
    <Section>
      
      <SectionTitle>Basic Details</SectionTitle>

      <FormGrid>
        {/* Name */}
        <FormGroup>
          <Label>
            Name<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}
        </FormGroup>

        {/* Email */}
        <FormGroup>
          <Label>
            Email<Required>*</Required>
          </Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </FormGroup>

        {/* Date of Birth */}
        <FormGroup>
          <Label>
            Date of Birth<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="dateOfBirth"
            placeholder="dd-mm-yyyy"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && <ErrorText>{errors.dateOfBirth}</ErrorText>}
        </FormGroup>

        {/* Employee ID */}
        <FormGroup>
          <Label>
            Employee ID<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="employeeId"
            placeholder="Enter employee code"
            value={formData.employeeId}
            onChange={handleChange}
          />
          {errors.employeeId && <ErrorText>{errors.employeeId}</ErrorText>}
        </FormGroup>

        {/* Gender */}
        <FormGroup>
          <Label>
            Gender<Required>*</Required>
          </Label>
          <SelectWrapper>
            <Select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
            <SelectArrow>⌄</SelectArrow>
          </SelectWrapper>
          {errors.gender && <ErrorText>{errors.gender}</ErrorText>}
        </FormGroup>

        {/* Contact Number */}
        <FormGroup>
          <Label>
            Contact Number<Required>*</Required>
          </Label>
          <PhoneWrapper>
            <CountrySelect
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
            >
              <option value="+971">UAE (+971)</option>
              <option value="+91">India (+91)</option>
              <option value="+1">USA (+1)</option>
              <option value="+44">UK (+44)</option>
            </CountrySelect>

            <PhoneInput
              type="text"
              name="contactNumber"
              placeholder="phone number"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </PhoneWrapper>
          {errors.contactNumber && <ErrorText>{errors.contactNumber}</ErrorText>}
        </FormGroup>

        {/* Address */}
        <FormGroup>
          <Label>
            Address<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="address"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <ErrorText>{errors.address}</ErrorText>}
        </FormGroup>

        {/* Country (employee's own address country — NOT the company country
            used for legal-field logic; see LegalInfoSection for that) */}
        <FormGroup>
          <Label>
            Country<Required>*</Required>
          </Label>
          <SelectWrapper>
            <Select name="country" value={formData.country} onChange={handleChange}>
              <option value="">Select Country</option>
              <option value="UAE">UAE</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
            </Select>
            <SelectArrow>⌄</SelectArrow>
          </SelectWrapper>
          {errors.country && <ErrorText>{errors.country}</ErrorText>}
        </FormGroup>
       

        {/* Blood Group */}
        <FormGroup>
          <Label>Blood Group</Label>
          <Input
            type="text"
            name="bloodGroup"
            placeholder="Enter Blood Group"
            value={formData.bloodGroup}
            onChange={handleChange}
          />
        </FormGroup>
      </FormGrid>
    </Section>
  );
};

export default BasicDetailsSection;