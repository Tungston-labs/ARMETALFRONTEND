import React, { useState } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiPlus,
  FiX,
  FiUpload,
  FiEdit3,
} from "react-icons/fi";

import {
  InvoiceContainer,
  InvoiceForm,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  CalendarInput,
  InvoiceItemsHeader,
  AddItemButton,
  InvoiceTableWrapper,
  InvoiceTable,
  DeleteButton,
  PaymentSection,
  PaymentLeft,
  PaymentGrid,
  PaymentRight,
  SummaryRow,
  TotalAmount,
  ButtonWrapper,
  CancelButton,
  PreviewButton,
} from "./AddingInvoice.styles";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";

const Invoice = () => {
    const today = new Date().toISOString().split("T")[0];

const [invoiceDate, setInvoiceDate] = useState(today);
const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([
    {
      id: 1,
      slNo: "01",
      service: "App Design",
      particular: "Wireframe Of 15 Pages",
      qty: "1",
      hsCode: "25366",
      rate: "SAR 1,97",
      vat: "15 %",
      vatAmount: "SAR 295.50",
      amount: "SAR 2,265.50",
    },
    {
      id: 2,
      slNo: "02",
      service: "",
      particular: "",
      qty: "",
      hsCode: "",
      rate: "",
      vat: "",
      vatAmount: "",
      amount: "",
    },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        slNo: String(prev.length + 1).padStart(2, "0"),
        service: "",
        particular: "",
        qty: "",
        hsCode: "",
        rate: "",
        vat: "",
        vatAmount: "",
        amount: "",
      },
    ]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <InvoiceContainer>
        <ReusableHeader
                title="Generate New Invoice"
                breadcrumbs={[
                    "Sales",
                    "Invoices",
                ]}
                
            ></ReusableHeader>
      <InvoiceForm>
        {/* =====================================================
            INVOICE DETAILS
        ===================================================== */}

        <FormGrid>
          <FormGroup>
            <Label>INVOICE NUMBER</Label>
            <Input placeholder="INV001" />
          </FormGroup>

          <FormGroup>
            <Label>INVOICE DATE</Label>

          <CalendarInput>
    <Input
        type="date"
        value={invoiceDate}
        onChange={(e) => setInvoiceDate(e.target.value)}
    />

</CalendarInput>
          </FormGroup>

          <FormGroup>
            <Label>DUE DATE</Label>

            <CalendarInput>
    <Input
        type="date"
        value={dueDate}
        min={invoiceDate}
        onChange={(e) => setDueDate(e.target.value)}
    />

</CalendarInput>
          </FormGroup>

          <FormGroup>
            <Label>PAYMENT STATUS</Label>

            <SelectWrapper>
              <Select defaultValue="">
                <option value="" disabled>
                  Select Payment Status
                </option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partially Paid</option>
              </Select>

              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          {/* FROM */}

          <FormGroup>
            <Label>FROM</Label>
            <Input placeholder="TUNGSTON LABS" />
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>
            <Input placeholder="Tungston Labs, Ullampilly Building,..." />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>
            <Input placeholder="+91 97783 77526" />
          </FormGroup>

          <FormGroup>
            <Label>EMAIL ID</Label>
            <Input placeholder="info@tungstonlabs.com" />
          </FormGroup>

          {/* BILL TO */}

          <FormGroup>
            <Label>BILL TO</Label>

            <SelectWrapper>
              <Select defaultValue="">
                <option value="" disabled>
                  Company/Client Name
                </option>
                <option value="client1">Company 1</option>
                <option value="client2">Company 2</option>
              </Select>

              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>
            <Input placeholder="Company/Client ADDRESS" />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>
            <Input placeholder="Company/Client Phone Number" />
          </FormGroup>

          <FormGroup>
            <Label>EMAIL ID</Label>
            <Input placeholder="Company/Client Email ID" />
          </FormGroup>
        </FormGrid>

        {/* =====================================================
            INVOICE ITEMS
        ===================================================== */}

        <InvoiceItemsHeader>
          <SectionTitle>INVOICE ITEMS</SectionTitle>

          <AddItemButton onClick={addItem}>
            <FiPlus />
            ADD ITEM
          </AddItemButton>
        </InvoiceItemsHeader>

        <InvoiceTableWrapper>
          <InvoiceTable>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Service</th>
                <th>Particular</th>
                <th>QTY</th>
                <th>HS Code</th>
                <th>Rate</th>
                <th>VAT (%)</th>
                <th>VAT (SAR)</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.slNo}</td>

                  <td>
                    <TableInput
                      value={item.service}
                      placeholder="App Design"
                      readOnly={item.id === 1}
                    />
                  </td>

                  <td>
                    <TableInput
                      value={item.particular}
                      placeholder="Wireframe Of 15 Pages"
                      readOnly={item.id === 1}
                    />
                  </td>

                  <td>
                    <SmallInput
                      value={item.qty}
                      readOnly={item.id === 1}
                    />
                  </td>

                  <td>
                    <SmallInput
                      value={item.hsCode}
                      readOnly={item.id === 1}
                    />
                  </td>

                  <td>
                    <TableInput
                      value={item.rate}
                      readOnly={item.id === 1}
                    />
                  </td>

                  <td>
                    <SmallInput
                      value={item.vat}
                      readOnly={item.id === 1}
                    />
                  </td>

                  <td>
                    <TableInput
                      value={item.vatAmount}
                      readOnly={item.id === 1}
                    />
                  </td>

                  <td>
                    <AmountInput
                      value={item.amount}
                      readOnly={item.id === 1}
                    />
                  </td>

                  <td>
                    <DeleteButton
                      onClick={() => removeItem(item.id)}
                    >
                      <FiX />
                    </DeleteButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </InvoiceTable>
        </InvoiceTableWrapper>

        {/* =====================================================
            PAYMENT DETAILS
        ===================================================== */}

        <PaymentSection>
          <PaymentLeft>
            <SectionTitle>
              PAYMENT DETAILS
              <FiEdit3 />
            </SectionTitle>

            <PaymentGrid>
              <FormGroup>
                <Label>Account Holder</Label>
                <Input placeholder="TUNGSTON LABS" />
              </FormGroup>

              <FormGroup>
                <Label>Account Number</Label>
                <Input placeholder="12534789652135" />
              </FormGroup>

              <FormGroup>
                <Label>IBAN</Label>
                <Input placeholder="2654559" />
              </FormGroup>

              <FormGroup>
                <Label>UPLOAD QR CODE</Label>

                <UploadBox>
                  <FiUpload />
                </UploadBox>
              </FormGroup>
            </PaymentGrid>
          </PaymentLeft>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <PaymentRight>
            <SummaryRow>
              <span>Sub Total</span>
              <strong>SAR 1,970</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Total VAT (15%)</span>
              <strong>SAR 295.50</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Discount</span>
              <strong className="discount">
                -SAR 19.69
              </strong>
            </SummaryRow>

            <SummaryRow>
              <span>Round Off</span>
              <strong>SAR 1,411.15</strong>
            </SummaryRow>

            <TotalAmount>
              <span>TOTAL AMOUNT</span>
              <strong>SAR 1,411.15</strong>
            </TotalAmount>
          </PaymentRight>
        </PaymentSection>

        {/* =====================================================
            BUTTONS
        ===================================================== */}

        <ButtonWrapper>
          <CancelButton>
            CANCEL
          </CancelButton>

          <PreviewButton>
            PREVIEW
          </PreviewButton>
        </ButtonWrapper>
      </InvoiceForm>
    </InvoiceContainer>
  );
};

const TableInput = ({ value, placeholder, ...props }) => (
  <input
    value={value}
    placeholder={placeholder}
    {...props}
  />
);

const SmallInput = ({ value, ...props }) => (
  <input
    value={value}
    {...props}
  />
);

const AmountInput = ({ value, ...props }) => (
  <input
    value={value}
    {...props}
  />
);

const UploadBox = ({ children }) => (
  <div
    style={{
      height: "30px",
      border: "1px solid #e5e5e5",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      paddingLeft: "15px",
      color: "#111",
    }}
  >
    {children}
  </div>
);

export default Invoice;
