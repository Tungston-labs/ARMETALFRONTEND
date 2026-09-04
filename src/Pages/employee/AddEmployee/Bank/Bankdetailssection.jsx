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
  CheckboxWrapper,
  CheckboxInput,
  CheckboxLabel,
  ErrorText,
} from "../EmployeeForm.styles";

// Same country-rules helper used by JobDetails.jsx / LegalInfoSection.jsx.
// Adjust the relative path below to match where this file actually lives.
import { getBankFieldConfig, isIndiaCompany } from "../../../../utils/employeeCountryFields";

/**
 * Bank Details section — the country-driven part of the bank form.
 * Account number vs IBAN, IFSC vs SWIFT, and the India-only tax fields
 * (PAN, tax regime, TDS, 80C declaration) all come from
 * getBankFieldConfig(companyCountry).
 *
 * Props:
 * - companyCountry: e.g. "IN" or "AE", from the logged-in user's company
 * - formData: the shared form state object
 * - errors: field-name-keyed error messages
 * - handleChange: shared onChange handler from the parent (must also
 *   handle checkbox inputs — see BankDetailsForm.jsx's handleChange)
 */
const BankDetailsSection = ({ companyCountry, formData, errors, handleChange }) => {
  const bankConfig = getBankFieldConfig(companyCountry);
  const isIndia = isIndiaCompany(companyCountry);

  return (
    <Section>
      <SectionTitle>Bank Details</SectionTitle>

      <FormGrid>
        {/* Bank Name */}
        <FormGroup>
          <Label>
            Bank Name<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="bankName"
            placeholder="Enter Bank Name"
            value={formData.bankName}
            onChange={handleChange}
          />
          {errors.bankName && <ErrorText>{errors.bankName}</ErrorText>}
        </FormGroup>

        {/* Account Number / IBAN — label & placeholder driven by country */}
        <FormGroup>
          <Label>
            {bankConfig.accountLabel}
            <Required>*</Required>
          </Label>
          <Input
            type="text"
            name="accountNumber"
            placeholder={bankConfig.accountPlaceholder}
            value={formData.accountNumber}
            onChange={handleChange}
          />
          {errors.accountNumber && <ErrorText>{errors.accountNumber}</ErrorText>}
        </FormGroup>

        {/* Bank Code — IFSC for India, SWIFT/BIC otherwise. Field name
            itself is dynamic (bankConfig.bankCodeField) so India's value
            lands in formData.ifscCode and everyone else's in swiftCode. */}
        <FormGroup>
          <Label>
            {bankConfig.bankCodeLabel}
            <Required>*</Required>
          </Label>
          <Input
            type="text"
            name={bankConfig.bankCodeField}
            placeholder={bankConfig.bankCodePlaceholder}
            value={formData[bankConfig.bankCodeField]}
            onChange={handleChange}
          />
          {errors[bankConfig.bankCodeField] && (
            <ErrorText>{errors[bankConfig.bankCodeField]}</ErrorText>
          )}
        </FormGroup>

        {/* Basic Salary — always shown */}
        <FormGroup>
          <Label>
            Basic Salary<Required>*</Required>
          </Label>
          <Input
            type="number"
            name="basicSalary"
            placeholder="Enter Basic Salary"
            value={formData.basicSalary}
            onChange={handleChange}
          />
          {errors.basicSalary && <ErrorText>{errors.basicSalary}</ErrorText>}
        </FormGroup>

        {/* UAN Number — India only, per bankConfig.showUan */}
        {bankConfig.showUan && (
          <FormGroup>
            <Label>UAN Number</Label>
            <Input
              type="text"
              name="uanNumber"
              placeholder="Enter UAN Number"
              value={formData.uanNumber}
              onChange={handleChange}
            />
            {errors.uanNumber && <ErrorText>{errors.uanNumber}</ErrorText>}
          </FormGroup>
        )}
      </FormGrid>

      {/* Indian tax fields — only rendered when bankConfig.showIndianTax is
          true (India). For every other country these are never collected;
          getBankSubmissionDefaults(country) fills in N/A / 0 / false at
          submission time instead. */}
      {bankConfig.showIndianTax && (
        <>
          <SectionTitle style={{ marginTop: 22 }}>Tax Details</SectionTitle>

          <FormGrid>
            {/* PAN Number */}
            <FormGroup>
              <Label>
                PAN Number<Required>*</Required>
              </Label>
              <Input
                type="text"
                name="panNumber"
                placeholder="Enter PAN Number"
                value={formData.panNumber}
                onChange={handleChange}
                maxLength={10}
                style={{ textTransform: "uppercase" }}
              />
              {errors.panNumber && <ErrorText>{errors.panNumber}</ErrorText>}
            </FormGroup>

            {/* Tax Regime */}
            <FormGroup>
              <Label>
                Tax Regime<Required>*</Required>
              </Label>
              <SelectWrapper>
                <Select name="taxRegime" value={formData.taxRegime} onChange={handleChange}>
                  <option value="">Select Tax Regime</option>
                  <option value="old">Old Regime</option>
                  <option value="new">New Regime</option>
                </Select>
                <SelectArrow>⌄</SelectArrow>
              </SelectWrapper>
              {errors.taxRegime && <ErrorText>{errors.taxRegime}</ErrorText>}
            </FormGroup>

            {/* TDS Deduction Amount */}
            <FormGroup>
              <Label>TDS Deduction Amount</Label>
              <Input
                type="number"
                name="tdsDeductionAmount"
                placeholder="Enter TDS Deduction Amount"
                value={formData.tdsDeductionAmount}
                onChange={handleChange}
              />
              {errors.tdsDeductionAmount && (
                <ErrorText>{errors.tdsDeductionAmount}</ErrorText>
              )}
            </FormGroup>

            {/* Declaration under 80C */}
            <FormGroup>
              <Label>Section 80C Declaration</Label>
              <CheckboxWrapper>
                <CheckboxInput
                  name="declaration80c"
                  checked={formData.declaration80c}
                  onChange={handleChange}
                />
                <CheckboxLabel>
                  I declare Section 80C investment proofs will be submitted
                </CheckboxLabel>
              </CheckboxWrapper>
              {errors.declaration80c && <ErrorText>{errors.declaration80c}</ErrorText>}
            </FormGroup>
          </FormGrid>
        </>
      )}
    </Section>
  );
};

export default BankDetailsSection;