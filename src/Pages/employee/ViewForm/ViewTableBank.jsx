import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Grid2,
  Field,
  Input,
  Label,
  ErrorText,
  Container,
  TableWrapper,
  Table,
  Th,
  Td,
  TableFooter,
  AddButton,
  Select,
  SaveBtn,
  Hr,
  SectionTitle,
  FormRow,
} from "./ViewTableBank.Styles";

import {
  fetchSalaryIncrements,
  addSalaryIncrement,
} from "../../../Redux/salaryIncrementSlice";
import { getBankFieldConfig } from "../../../utils/employeeCountryFields";

const ViewTableBank = ({
  employeeId,
  country,
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
  basicSalary,
  setBasicSalary,
  declaration80C,        
  setDeclaration80C,  
  errors = {},
}) => {
  const dispatch = useDispatch();

  const bankConfig = getBankFieldConfig(country);
  const isIfsc = bankConfig.bankCodeField === "ifscCode";
  const bankCodeValue = isIfsc ? ifscCode : swiftCode;
  const setBankCodeValue = isIfsc ? setIfscCode : setSwiftCode;
  const { increments = [] } = useSelector((state) => state.salaryIncrement);

  const [showNewRow, setShowNewRow] = useState(false);
  const [newIncrement, setNewIncrement] = useState({
    date: "",
    increment_amount: "",
  });

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchSalaryIncrements(employeeId));
    }
  }, [dispatch, employeeId]);

  const saveIncrement = async () => {
    if (!newIncrement.date || !newIncrement.increment_amount) {
      alert("Please enter date and increment amount");
      return;
    }

    try {
      await dispatch(
        addSalaryIncrement({
          employeeId,
          data: {
            employee: employeeId,
            date: newIncrement.date,
            increment_amount: Number(newIncrement.increment_amount),
          },
        })
      ).unwrap();

      setNewIncrement({ date: "", increment_amount: "" });
      setShowNewRow(false);

      dispatch(fetchSalaryIncrements(employeeId));
    } catch (err) {
      console.log(err);
      alert("Failed to add increment");
    }
  };

  return (

  <Container>
    <Hr />
    <SectionTitle>Bank Details</SectionTitle>

    <FormRow $columns={3}>
      <Field>
        <Label $required >Bank Name</Label>
        <Input
          placeholder="Enter Bank Name"
          value={bankName ?? ""}
          onChange={(e) => setBankName(e.target.value)}
        />
        <ErrorText>{errors.bankName}</ErrorText>
      </Field>

      <Field>
        <Label $required>{bankConfig.accountLabel}</Label>
        <Input
          placeholder={bankConfig.accountPlaceholder}
          value={accountNumber ?? ""}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <ErrorText>{errors.accountNumber}</ErrorText>
      </Field>

      {bankConfig.showUan && (
        <Field>
          <Label $required>UAN / EPF Number</Label>
          <Input
            placeholder="Enter UAN / EPF Account Number"
            value={uanNumber ?? ""}
            onChange={(e) => setUanNumber(e.target.value)}
          />
          <ErrorText>{errors.uanNumber}</ErrorText>
        </Field>
      )}

      <Field>
        <Label $required>{bankConfig.bankCodeLabel}</Label>
        <Input
          placeholder={bankConfig.bankCodePlaceholder}
          value={bankCodeValue ?? ""}
          onChange={(e) => setBankCodeValue(e.target.value.toUpperCase())}
          maxLength={isIfsc ? 11 : 20}
        />
        <ErrorText>{isIfsc ? errors.ifscCode : errors.swiftCode}</ErrorText>
      </Field>

      <Field>
        <Label $required>Basic Salary</Label>
        <Input
          type="number"
          placeholder="Enter Basic Salary"
          value={basicSalary ?? ""}
          onChange={(e) => setBasicSalary(e.target.value)}
        />
        <ErrorText>{errors.basicSalary}</ErrorText>
      </Field>
    </FormRow>

    {bankConfig.showIndianTax && (
      <>
        <Hr />
        <SectionTitle>Tax and Compliance</SectionTitle>

        <FormRow $columns={4}>
          <Field>
            <Label $required >PAN Number</Label>
            <Input
              placeholder="Enter PAN Number"
              value={panNumber ?? ""}
              onChange={(e) => setPanNumber(e.target.value)}
            />
            <ErrorText>{errors.panNumber}</ErrorText>
          </Field>

          <Field>
            <Label $required>Tax Regime</Label>
            <Select
              value={taxRegime ?? ""}
              onChange={(e) => setTaxRegime(e.target.value)}
            >
              <option value="">Select Regime</option>
              <option value="old">Old Regime</option>
              <option value="new">New Regime</option>
            </Select>
            <ErrorText>{errors.taxRegime}</ErrorText>
          </Field>

          <Field>
            <Label $required>TDS Deduction Amount</Label>
            <Select
              value={tdsAmount ?? ""}
              onChange={(e) => setTdsAmount(e.target.value)}
            >
              <option value="">Select TDS %</option>
              {[0, 10, 20, 30].map((i) => (
                <option key={i} value={i}>{i}%</option>
              ))}
            </Select>
            <ErrorText>{errors.tdsAmount}</ErrorText>
          </Field>

          <Field>
            <Label $required>Declaration under 80C</Label>
            <Select
              value={String(declaration80C ?? "")}
              onChange={(e) => setDeclaration80C(e.target.value)}
            >
              <option value="">Declaration under 80C?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
            <ErrorText>{errors.declaration80C}</ErrorText>
          </Field>
        </FormRow>
      </>
    )}

    <Hr />
    <SectionTitle>Salary Increment History</SectionTitle>

    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th $align="right">Increment Amount</Th>
            <Th $align="right">Total Salary</Th>
          </tr>
        </thead>
        <tbody>
          {increments.length > 0
            ? increments.map((item) => (
                <tr key={item.id}>
                  <Td>{item.date}</Td>
                  <Td $align="right">{item.increment_amount}</Td>
                  <Td $align="right">{item.total_salary}</Td>
                </tr>
              ))
            : !showNewRow && (
                <tr>
                  <Td colSpan={3} $align="center">No increments added</Td>
                </tr>
              )}

          {showNewRow && (
            <tr>
              <Td>
                <Input
                  type="date"
                  value={newIncrement.date}
                  onChange={(e) =>
                    setNewIncrement({ ...newIncrement, date: e.target.value })
                  }
                />
              </Td>
              <Td $align="right">
                <Input
                  type="number"
                  placeholder="Increment Amount"
                  value={newIncrement.increment_amount}
                  onChange={(e) =>
                    setNewIncrement({ ...newIncrement, increment_amount: e.target.value })
                  }
                />
              </Td>
              <Td $align="right">
                <SaveBtn type="button" onClick={saveIncrement}>Save</SaveBtn>
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </TableWrapper>

    <TableFooter>
      <AddButton type="button" onClick={() => setShowNewRow(true)}>
        + Add Increment
      </AddButton>
    </TableFooter>
  </Container>
);

};

export default ViewTableBank;