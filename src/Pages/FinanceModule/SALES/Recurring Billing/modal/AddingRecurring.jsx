import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

import {
  InvoiceContainer as OrderContainer,
  InvoiceForm as OrderForm,
  SectionTitle,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  CalendarInput,
  InvoiceTableWrapper as OrderTableWrapper,
  SummaryRow,
  TotalAmount,
  ButtonWrapper,
  CancelButton,
  SendButton,
  // new
  SubText,
  RecurringGrid,
  ReadOnlyInput,
  InfoBanner,
  Highlight,
  RecurringItemsTable,
  AutoSendSection,
  AutoSendTitle,
  AutoSendBox,
  ToggleSwitch,
  BottomSection,
  SummaryBox,
} from "./AddingRecurring.styles";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";

const AddingRecurring = () => {
  const navigate = useNavigate();
  const [autoSend, setAutoSend] = useState(true);

  const goBack = () => navigate(-1);

  return (
    <OrderContainer>
      <ReusableHeader
        title="Add Recurring Billing"
        breadcrumbs={["Sales", "Recurring Billing"]}
        showBack
        onBack={goBack}
      />

      <OrderForm>
        <SectionTitle>Recurring Bill Information</SectionTitle>
        <SubText>
          Enable recurring options if this client will have recurring invoices.
        </SubText>

        <RecurringGrid>
          {/* ROW 1 */}
          <FormGroup>
            <Label>Bill No</Label>
            <ReadOnlyInput value="REC1235" readOnly />
          </FormGroup>

          <FormGroup>
            <Label>RECURRING TYPE</Label>
            <SelectWrapper>
              <Select defaultValue="">
                <option value="" disabled>
                  Select Recurring Type
                </option>
                <option value="invoice">Invoice</option>
                <option value="bill">Bill</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Customer/Vendor</Label>
            <SelectWrapper>
              <Select defaultValue="">
                <option value="" disabled>
                  Select Customer /Vendor
                </option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Address</Label>
            <Input placeholder="Company/Client ADDRESS" />
          </FormGroup>

          <FormGroup>
            <Label>AUTO EMAIL TO</Label>
            <Input placeholder="Enter Email ID" />
          </FormGroup>

          {/* ROW 2 */}
          <FormGroup>
            <Label>START DATE</Label>
            <CalendarInput>
              <Input type="date" />
            </CalendarInput>
          </FormGroup>

          <FormGroup>
            <Label>END DATE</Label>
            <SelectWrapper>
              <Select defaultValue="never">
                <option value="never">Never</option>
                <option value="on_date">On Date</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>FREQUENCY</Label>
            <SelectWrapper>
              <Select defaultValue="yearly">
                   <option value="daily">Daily</option>
                   <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>TOTAL RECURRENCE</Label>
            <SelectWrapper>
              <Select defaultValue="12">
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="unlimited">Unlimited</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>PAYMENT TERMS</Label>
            <SelectWrapper>
              <Select defaultValue="due_on_receipt">
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="net_7">Net 7</option>
                <option value="net_15">Net 15</option>
                <option value="net_30">Net 30</option>
                <option value="net_45">Net 45</option>
                <option value="net_60">Net 60</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          {/* ROW 3 */}
          <FormGroup>
            <Label>REMINDER BEFORE DUE DATE</Label>
            <SelectWrapper>
              <Select defaultValue="5">
                <option value="1">Before 1 Day</option>
                <option value="3">Before 3 Days</option>
                <option value="5">Before 5 Days</option>
                <option value="7">Before 7 Days</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>REMINDER BEFORE RENEWAL</Label>
            <SelectWrapper>
              <Select defaultValue="5">
                <option value="1">Before 1 Day</option>
                <option value="3">Before 3 Days</option>
                <option value="5">Before 5 Days</option>
                <option value="7">Before 7 Days</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>BILLING CYCLE</Label>
            <SelectWrapper>
              <Select defaultValue="advance">
                <option value="advance">Advance</option>
                <option value="arrears">Arrears</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>RECURRENCE STATUS</Label>
            <SelectWrapper>
              <Select defaultValue="active">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>WHATSAPP NUMBER</Label>
            <Input placeholder="0000000000" />
          </FormGroup>
        </RecurringGrid>

        <InfoBanner>
          Next invoice will be generated on <Highlight>28 May, 2026</Highlight>{" "}
          for the cycle billed 01 May – 31 May, 2026, then repeats monthly.
        </InfoBanner>

        {/* ITEMS */}
        <SectionTitle style={{ marginTop: 28, marginBottom: 12 }}>
          ITEMS
        </SectionTitle>

        <OrderTableWrapper>
          <RecurringItemsTable>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Product/Services</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>VAT (%)</th>
                <th>VAT (SAR)</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td>
                  <input defaultValue="Product 1" />
                </td>
                <td>
                  <input defaultValue="01" />
                </td>
                <td>
                  <input defaultValue="358.41" />
                </td>
                <td>
                  <input defaultValue="15%" />
                </td>
                <td>
                  <input defaultValue="53.76" />
                </td>
                <td>
                  <input defaultValue="SAR 412.17" />
                </td>
              </tr>
            </tbody>
          </RecurringItemsTable>
        </OrderTableWrapper>

        {/* AUTO-SEND + SUMMARY */}
        <BottomSection>
          <AutoSendSection>
            <AutoSendTitle>Auto-send invoice to customer</AutoSendTitle>
            <AutoSendBox>
              <span>
                Email the invoice automatically to the customer on each billing
                cycle.
              </span>
              <ToggleSwitch
                type="button"
                role="switch"
                aria-checked={autoSend}
                $on={autoSend}
                onClick={() => setAutoSend((prev) => !prev)}
              />
            </AutoSendBox>
          </AutoSendSection>

          <SummaryBox>
            <SummaryRow>
              <span>Subtotal</span>
              <strong>SAR 358.41</strong>
            </SummaryRow>
            <SummaryRow>
              <span>Tax (15% VAT)</span>
              <strong>SAR 53.76</strong>
            </SummaryRow>
            <TotalAmount>
              <span>AMOUNT PER CYCLE</span>
              <strong>SAR 412.17</strong>
            </TotalAmount>

            <ButtonWrapper>
              <CancelButton type="button" onClick={goBack}>
                CANCEL
              </CancelButton>
              <SendButton type="button">Create Recurring Bill</SendButton>
            </ButtonWrapper>
          </SummaryBox>
        </BottomSection>
      </OrderForm>
    </OrderContainer>
  );
};

export default AddingRecurring;