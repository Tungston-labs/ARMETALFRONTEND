import React, { useState } from "react";
import {
  PageWrapper,
  SectionTitle,
  SectionDescription,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  PreviewBanner,
  ItemsSection,
  ItemsTitle,
  ItemsTable,
  TableWrapper,
  ProductInput,
  SummaryArea,
  AutoSendSection,
  Toggle,
  ToggleInput,
  ToggleSlider,
  SummaryDetails,
  SummaryRow,
  TotalRow,
  ActionButtons,
  CancelButton,
  ApprovalButton,
} from "./RecurringBill.styles";

const RecurringBill = () => {
  const [form, setForm] = useState({
    billNo: "REC1235",
    recurringType: "",
    customer: "",
    address: "",
    email: "",
    startDate: "",
    endDate: "Never",
    frequency: "Yearly",
    totalRecurrence: "12",
    paymentTerms: "Due on Receipt",
    reminderDue: "Before 5 Days",
    reminderRenewal: "Before 5 Days",
    billingCycle: "Advance",
    status: "Active",
    whatsapp: "",
  });

  const [autoSend, setAutoSend] = useState(true);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fields = [
    {
      label: "Bill No",
      name: "billNo",
      type: "text",
      placeholder: "REC1235",
      readOnly: true,
    },
    {
      label: "RECURRING TYPE",
      name: "recurringType",
      type: "select",
      placeholder: "Select Recurring Type",
      options: ["Sales Invoice", "Purchase Bill"],
    },
    {
      label: "Customer/Vendor",
      name: "customer",
      type: "select",
      placeholder: "Select Customer /Vendor",
      options: ["Customer 1", "Customer 2", "Vendor 1"],
    },
    {
      label: "Address",
      name: "address",
      type: "text",
      placeholder: "Company/Client ADDRESS",
    },
    {
      label: "AUTO EMAIL TO",
      name: "email",
      type: "email",
      placeholder: "Enter Email ID",
    },
    {
      label: "START DATE",
      name: "startDate",
      type: "date",
      placeholder: "Select Date",
    },
    {
      label: "END DATE",
      name: "endDate",
      type: "select",
      options: ["Never", "Set End Date"],
    },
    {
      label: "FREQUENCY",
      name: "frequency",
      type: "select",
      options: ["Monthly", "Quarterly", "Half Yearly", "Yearly"],
    },
    {
      label: "TOTAL RECURRENCE",
      name: "totalRecurrence",
      type: "select",
      options: ["1", "3", "6", "12", "24"],
    },
    {
      label: "PAYMENT TERMS",
      name: "paymentTerms",
      type: "select",
      options: ["Due on Receipt", "Net 7", "Net 15", "Net 30", "Net 60"],
    },
    {
      label: "REMINDER BEFORE DUE DATE",
      name: "reminderDue",
      type: "select",
      options: ["Before 1 Day", "Before 3 Days", "Before 5 Days", "Before 7 Days"],
    },
    {
      label: "REMINDER BEFORE RENEWAL",
      name: "reminderRenewal",
      type: "select",
      options: ["Before 1 Day", "Before 3 Days", "Before 5 Days", "Before 7 Days"],
    },
    {
      label: "BILLING CYCLE",
      name: "billingCycle",
      type: "select",
      options: ["Advance", "Arrears"],
    },
    {
      label: "RECURRENCE STATUS",
      name: "status",
      type: "select",
      options: ["Active", "Inactive"],
    },
    {
      label: "WHATSAPP NUMBER",
      name: "whatsapp",
      type: "text",
      placeholder: "0000000000",
    },
  ];

  const items = [
    {
      slNo: "01",
      product: "Product 1",
      qty: "01",
      rate: "358.41",
      vat: "15%",
      vatAmount: "53.76",
      amount: "412.17",
    },
  ];

  const renderField = (field) => (
    <FormGroup key={field.name}>
      <Label>{field.label}</Label>

      {field.type === "select" ? (
        <Select
          value={form[field.name]}
          onChange={(e) => updateField(field.name, e.target.value)}
        >
          <option value="">{field.placeholder || "Select"}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          type={field.type}
          value={form[field.name]}
          placeholder={field.placeholder}
          readOnly={field.readOnly}
          onChange={(e) => updateField(field.name, e.target.value)}
        />
      )}
    </FormGroup>
  );

  const handleApproval = () => {
    // Connect your API / Redux approval action here.
    console.log("Recurring bill submitted:", { form, autoSend });
  };

  return (
    <PageWrapper>
      <SectionTitle>Recurring Bill Information</SectionTitle>
      <SectionDescription>
        Enable recurring option if this client will have recurring invoices.
      </SectionDescription>

      <FormGrid>{fields.map(renderField)}</FormGrid>

      <PreviewBanner>
        Next invoice will be generated on <strong>28 May, 2026</strong> for the
        cycle billed 01 May – 31 May, 2026, then repeats monthly.
      </PreviewBanner>

      <ItemsSection>
        <ItemsTitle>ITEMS</ItemsTitle>

        <TableWrapper>
          <ItemsTable>
            <thead>
              <tr>
                <th>SL NO</th>
                <th>Product/Services</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>VAT (%)</th>
                <th>VAT (SAR)</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.slNo}>
                  <td>{item.slNo}</td>
                  <td>
                    <ProductInput value={item.product} readOnly />
                  </td>
                  <td>
                    <ProductInput value={item.qty} readOnly />
                  </td>
                  <td>
                    <ProductInput value={item.rate} readOnly />
                  </td>
                  <td>
                    <ProductInput value={item.vat} readOnly />
                  </td>
                  <td>
                    <ProductInput value={item.vatAmount} readOnly />
                  </td>
                  <td>
                    <ProductInput
                      value={`SAR ${item.amount}`}
                      readOnly
                      $highlight
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </ItemsTable>
        </TableWrapper>
      </ItemsSection>

      <SummaryArea>
        <AutoSendSection>
          <h4>Auto-send invoice to customer</h4>
          <div>
            <span>
              Email the invoice automatically to the customer on each billing
              cycle.
            </span>

            <Toggle>
              <ToggleInput
                type="checkbox"
                checked={autoSend}
                onChange={(e) => setAutoSend(e.target.checked)}
              />
              <ToggleSlider />
            </Toggle>
          </div>
        </AutoSendSection>

        <SummaryDetails>
          <SummaryRow>
            <span>Subtotal</span>
            <strong>SAR 358.41</strong>
          </SummaryRow>

          <SummaryRow>
            <span>Tax (15% VAT)</span>
            <strong>SAR 53.76</strong>
          </SummaryRow>

          <TotalRow>
            <span>AMOUNT PER CYCLE</span>
            <strong>SAR 412.17</strong>
          </TotalRow>
        </SummaryDetails>
      </SummaryArea>

      <ActionButtons>
        <CancelButton type="button">CANCEL</CancelButton>
        <ApprovalButton type="button" onClick={handleApproval}>
          ⏳ SENT FOR APPROVAL
        </ApprovalButton>
      </ActionButtons>
    </PageWrapper>
  );
};

export default RecurringBill;