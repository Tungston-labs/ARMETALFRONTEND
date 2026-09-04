// Components/Table.jsx (updated)
import React from "react";
import {
  Container,
  Header,
  SectionTitle,
  FormSection,
  Row,
  Input,
  Select,
  ButtonGroup,
  Button,
  TwoColumnRows,
  FormGroups,
  Label,

} from "./Table.Styles";
import {
  getBankFieldConfig,
} from "../../../utils/employeeCountryFields";
import { Divider } from "antd";

const ErrorMsg = ({ msg }) =>
  msg ? (
    <p style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
      {msg}
    </p>
  ) : null;

const Table = ({
  country,
  bankConfig: providedBankConfig,
  bankName,
  setBankName,
  swiftCode,
  setSwiftCode,
  ifscCode,
setIfscCode,
  accountNumber,
  setAccountNumber,
  uanNumber,
  setUanNumber,
  panNumber,
  setPanNumber,
  taxRegime,
  setTaxRegime,
  tdsAmount,
  setTdsAmount,
  declaration80C,
  setDeclaration80C,
  basicSalary,
  setBasicSalary,
  salaryIncrement,
  setSalaryIncrement,
  housingAllowance,
  setHousingAllowance,
  transportation,
  setTransportation,
  errors = {},
  showNextButton = false,
  handleNext,
  // setBankProofImage, 
}) => {
  const bankConfig = providedBankConfig || getBankFieldConfig(country);
  const bankCodeValue = bankConfig.bankCodeField === "ifscCode" ? ifscCode : swiftCode;
  const setBankCodeValue = bankConfig.bankCodeField === "ifscCode" ? setIfscCode : setSwiftCode;

  return (
    <Container>
      <Header>
            <SectionTitle >Bank Details</SectionTitle>
      </Header>
 
      <FormSection>
        <Row>
                    <TwoColumnRows>
          <FormGroups>
            <Label>Bank Name</Label>
            <Input
              placeholder="Enter Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <ErrorMsg msg={errors.bankName} />
          </FormGroups>
          
             <FormGroups>
              <Label>{bankConfig.accountLabel}</Label>

              <Input
                placeholder={bankConfig.accountPlaceholder}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <ErrorMsg msg={errors.accountNumber} />
            </FormGroups>

            {bankConfig.showUan && (
              <FormGroups>
                <Label>UAN / EPF Number</Label>

                <Input
                  placeholder="Enter UAN / EPF Account Number"
                  value={uanNumber}
                  onChange={(e) => setUanNumber(e.target.value)}
                />
                <ErrorMsg msg={errors.uanNumber} />
              </FormGroups>
            )}
            </TwoColumnRows>
        </Row>
        <Row>
          <TwoColumnRows>
      <FormGroups>
  <Label>{bankConfig.bankCodeLabel}</Label>



  <Input
    placeholder={bankConfig.bankCodePlaceholder}
    value={bankCodeValue}
    onChange={(e) => setBankCodeValue(e.target.value.toUpperCase())}
  />
    <ErrorMsg
    msg={bankConfig.bankCodeField === "ifscCode" ? errors.ifscCode : errors.swiftCode}
  />
</FormGroups>

             <FormGroups>
              <Label>Basic Salary</Label>

              <Input
              type="number"
                placeholder="Enter Basic Salary"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
              <ErrorMsg msg={errors.basicSalary} />
            </FormGroups>

          </TwoColumnRows>
        </Row>
   
        {bankConfig.showIndianTax && (
          <>
          <Divider/>
            <SectionTitle>Tax and Compliance</SectionTitle>
            <Row>
              <TwoColumnRows>
              <FormGroups>
                <Label>PAN Number</Label>

                <Input
                  placeholder="Enter PAN Number"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                />
                <ErrorMsg msg={errors.panNumber} />
              </FormGroups>

              <FormGroups>
                <Label>Tax Regime</Label>
                <Select
                  value={taxRegime}
                  onChange={(e) => setTaxRegime(e.target.value)}
                >
                  <option value="">Select Regime</option>
                  <option value="old">Old Regime</option>
                  <option value="new">New Regime</option>
                </Select>
                <ErrorMsg msg={errors.taxRegime} />
              </FormGroups>
            </TwoColumnRows>

            <TwoColumnRows>
              <FormGroups>
                <Label>TDS Deduction Amount</Label>

                <Select
                  value={tdsAmount}
                  onChange={(e) => setTdsAmount(e.target.value)}
                >
                  <option value="">Select TDS %</option>
                  {[0, 10, 20, 30].map((i) => (
                    <option key={i} value={i}>
                      {i}%
                    </option>
                  ))}
                </Select>
                <ErrorMsg msg={errors.tdsAmount} />
              </FormGroups>

              <FormGroups>
                <Label>Declaration under 80C</Label>

                <Select
                  value={declaration80C}
                  onChange={(e) => setDeclaration80C(e.target.value)}
                >
                  <option value="">Declaration under 80C?</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
                <ErrorMsg msg={errors.declaration80C} />
              </FormGroups>
            </TwoColumnRows>
          </Row>
        </>
        )}

        {showNextButton && (
          <ButtonGroup>
            <Button type="button" onClick={handleNext}>
              Save
            </Button>
          </ButtonGroup>
        )}
      </FormSection>
    </Container>
  );
};

export default Table;
