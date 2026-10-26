import React from "react";
import {
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
import useAddingInvoice from "./Useaddinginvoice";

/* Small presentational-only helpers, kept local since they are pure UI */
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

const errorStyle = { borderColor: "#c0392b" };
const ErrorText = ({ children }) =>
  children ? (
    <span
      style={{
        display: "block",
        color: "#c0392b",
        fontSize: "12px",
        marginTop: "4px",
      }}
    >
      {children}
    </span>
  ) : null;

const AddingInvoice = () => {
  const {
    id,
    isEditMode,
    salesOrders,
    customers,
    detailLoading,
    saveError,
    invoiceNumber,
    salesOrderRef,
    invoiceDate,
    dueDate,
    paymentStatus,
    amountPaid,
    from,
    billTo,
    payment,
    summary,
    items,
    errors,
    isSaving,
    notFound,
    handleInvoiceNumberChange,
    handleInvoiceDateChange,
    handleDueDateChange,
    handlePaymentStatusChange,
    handleAmountPaidChange,
    updateFrom,
    updateBillTo,
    updatePayment,
    handleSalesOrderChange,
    handleCustomerChange,
    addItem,
    removeItem,
    updateItem,
    handleCancel,
    handleSave,
    selectedInvoice,
    navigate,
  } = useAddingInvoice();

  if (detailLoading && isEditMode && !selectedInvoice) {
    return (
      <InvoiceContainer>
        <ReusableHeader
          title="Edit Invoice"
          breadcrumbs={["Sales", "Invoices"]}
          showBack
          onBack={() => navigate("/sales/invoices")}
        />
        <div style={{ padding: 20 }}>Loading invoice...</div>
      </InvoiceContainer>
    );
  }

  if (notFound) {
    return (
      <InvoiceContainer>
        <ReusableHeader
          title="Invoice not found"
          breadcrumbs={["Sales", "Invoices"]}
          showBack
          onBack={() => navigate("/sales/invoices")}
        />
        <div style={{ padding: 20 }}>
          No invoice found for id "{id}".{" "}
          <button onClick={handleCancel}>Back to Invoices</button>
        </div>
      </InvoiceContainer>
    );
  }

  return (
    <InvoiceContainer>
      <ReusableHeader
        title={isEditMode ? "Edit Invoice" : "Generate New Invoice"}
        breadcrumbs={["Sales", "Invoices"]}
        showBack
        onBack={() => navigate("/sales/invoices")}
      ></ReusableHeader>

      {saveError && (
        <div style={{ padding: "0 20px", color: "#c0392b" }}>
          {typeof saveError === "string"
            ? saveError
            : "Something went wrong saving this invoice."}
        </div>
      )}

      <InvoiceForm>
        <FormGrid>
          <FormGroup>
            <Label>SALES ORDER REFERENCE</Label>
            {isEditMode ? (
              <Input value={salesOrderRef} readOnly />
            ) : (
              <SelectWrapper>
                <Select value={salesOrderRef} onChange={handleSalesOrderChange}>
                  <option value="" disabled>
                    Select Sales Order
                  </option>
                  {salesOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.so_number || order.order_number || `Sales Order #${order.id}`}
                    </option>
                  ))}
                </Select>
                <FiChevronDown />
              </SelectWrapper>
            )}
          </FormGroup>

          <FormGroup>
            <Label>INVOICE NUMBER</Label>
            <Input
              placeholder="INV001"
              value={invoiceNumber}
              onChange={(e) => handleInvoiceNumberChange(e.target.value)}
              readOnly={isEditMode}
              style={errors.invoiceNumber ? errorStyle : undefined}
            />
            <ErrorText>{errors.invoiceNumber}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>INVOICE DATE</Label>
            <CalendarInput>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => handleInvoiceDateChange(e.target.value)}
                readOnly={isEditMode}
                disabled={isEditMode}
                style={errors.invoiceDate ? errorStyle : undefined}
              />
            </CalendarInput>
            <ErrorText>{errors.invoiceDate}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>DUE DATE</Label>
            <CalendarInput>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                style={errors.dueDate ? errorStyle : undefined}
              />
            </CalendarInput>
            <ErrorText>{errors.dueDate}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>PAYMENT STATUS</Label>
            <SelectWrapper>
              <Select
                value={paymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value)}
                style={errors.paymentStatus ? errorStyle : undefined}
              >
                <option value="" disabled>
                  Select Payment Status
                </option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partially_paid">Partially Paid</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
            <ErrorText>{errors.paymentStatus}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>AMOUNT PAID</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amountPaid}
              onChange={(e) => handleAmountPaidChange(e.target.value)}
              readOnly={paymentStatus === "paid" || paymentStatus === "pending"}
              style={errors.amountPaid ? errorStyle : undefined}
            />
            <ErrorText>{errors.amountPaid}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>FROM</Label>
            <Input
              placeholder="TUNGSTON LABS"
              value={from.name}
              onChange={(e) => updateFrom("name", e.target.value)}
              readOnly={isEditMode}
              style={errors.fromName ? errorStyle : undefined}
            />
            <ErrorText>{errors.fromName}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>
            <Input
              placeholder="Tungston Labs, Ullampilly Building,..."
              value={from.address}
              onChange={(e) => updateFrom("address", e.target.value)}
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>
            <Input
              placeholder="+91 97783 77526"
              value={from.phone}
              onChange={(e) => updateFrom("phone", e.target.value)}
              readOnly={isEditMode}
              style={errors.fromPhone ? errorStyle : undefined}
            />
            <ErrorText>{errors.fromPhone}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>EMAIL ID</Label>
            <Input
              placeholder="info@tungstonlabs.com"
              value={from.email}
              onChange={(e) => updateFrom("email", e.target.value)}
              readOnly={isEditMode}
              style={errors.fromEmail ? errorStyle : undefined}
            />
            <ErrorText>{errors.fromEmail}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>BILL TO</Label>
            <SelectWrapper>
              <Select
                value={billTo.client}
                onChange={handleCustomerChange}
                disabled={isEditMode}
                style={errors.billToClient ? errorStyle : undefined}
              >
                <option value="" disabled>
                  Company/Client Name
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name ||
                      customer.customer_name ||
                      `Customer #${customer.id}`}
                  </option>
                ))}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
            <ErrorText>{errors.billToClient}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>
            <Input
              placeholder="Company/Client ADDRESS"
              value={billTo.address}
              onChange={(e) => updateBillTo("address", e.target.value)}
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>
            <Input
              placeholder="Company/Client Phone Number"
              value={billTo.phone}
              onChange={(e) => updateBillTo("phone", e.target.value)}
              readOnly={isEditMode}
              style={errors.billToPhone ? errorStyle : undefined}
            />
            <ErrorText>{errors.billToPhone}</ErrorText>
          </FormGroup>

          <FormGroup>
            <Label>EMAIL ID</Label>
            <Input
              placeholder="Company/Client Email ID"
              value={billTo.email}
              onChange={(e) => updateBillTo("email", e.target.value)}
              readOnly={isEditMode}
              style={errors.billToEmail ? errorStyle : undefined}
            />
            <ErrorText>{errors.billToEmail}</ErrorText>
          </FormGroup>
        </FormGrid>

        <InvoiceItemsHeader>
          <SectionTitle>INVOICE ITEMS</SectionTitle>
          {!isEditMode && (
            <AddItemButton onClick={addItem}>
              <FiPlus />
              ADD ITEM
            </AddItemButton>
          )}
        </InvoiceItemsHeader>

        <ErrorText>{errors.itemsGeneral}</ErrorText>

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
                <th>VAT </th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const rowErrors = errors.items?.[item.id] || {};
                return (
                  <tr key={item.id}>
                    <td>{item.slNo}</td>
                    <td>
                      <input
                        placeholder="App Design"
                        value={item.service}
                        onChange={(e) => updateItem(item.id, "service", e.target.value)}
                        readOnly={isEditMode}
                        style={rowErrors.service ? errorStyle : undefined}
                      />
                      <ErrorText>{rowErrors.service}</ErrorText>
                    </td>
                    <td>
                      <input
                        placeholder="Wireframe Of 15 Pages"
                        value={item.particular}
                        onChange={(e) => updateItem(item.id, "particular", e.target.value)}
                        readOnly={isEditMode}
                      />
                    </td>
                    <td>
                      <input
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                        readOnly={isEditMode}
                        style={rowErrors.qty ? errorStyle : undefined}
                      />
                      <ErrorText>{rowErrors.qty}</ErrorText>
                    </td>
                    <td>
                      <input
                        value={item.hsCode}
                        onChange={(e) => updateItem(item.id, "hsCode", e.target.value)}
                        readOnly={isEditMode}
                      />
                    </td>
                    <td>
                      <input
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                        readOnly={isEditMode}
                        style={rowErrors.rate ? errorStyle : undefined}
                      />
                      <ErrorText>{rowErrors.rate}</ErrorText>
                    </td>
                    <td>
                      <input
                        value={item.vat}
                        onChange={(e) => updateItem(item.id, "vat", e.target.value)}
                        readOnly={isEditMode}
                        style={rowErrors.vat ? errorStyle : undefined}
                      />
                      <ErrorText>{rowErrors.vat}</ErrorText>
                    </td>
                    <td>
                      <input
                        value={item.vatAmount}
                        onChange={(e) => updateItem(item.id, "vatAmount", e.target.value)}
                        readOnly={isEditMode}
                      />
                    </td>
                    <td>
                      <input
                        value={item.amount}
                        onChange={(e) => updateItem(item.id, "amount", e.target.value)}
                        readOnly={isEditMode}
                      />
                    </td>
                    <td>
                      {!isEditMode && (
                        <DeleteButton onClick={() => removeItem(item.id)}>
                          <FiX />
                        </DeleteButton>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </InvoiceTable>
        </InvoiceTableWrapper>

        <PaymentSection>
          <PaymentLeft>
            <SectionTitle>
              PAYMENT DETAILS
              <FiEdit3 />
            </SectionTitle>

            <PaymentGrid>
              <FormGroup>
                <Label>Account Holder</Label>
                <Input
                  placeholder="TUNGSTON LABS"
                  value={payment.accountHolder}
                  onChange={(e) => updatePayment("accountHolder", e.target.value)}
                  readOnly={isEditMode}
                />
              </FormGroup>

              <FormGroup>
                <Label>Account Number</Label>
                <Input
                  placeholder="12534789652135"
                  value={payment.accountNumber}
                  onChange={(e) => updatePayment("accountNumber", e.target.value)}
                  readOnly={isEditMode}
                />
              </FormGroup>

              <FormGroup>
                <Label>IBAN</Label>
                <Input
                  placeholder="2654559"
                  value={payment.iban}
                  onChange={(e) => updatePayment("iban", e.target.value)}
                  readOnly={isEditMode}
                  style={errors.iban ? errorStyle : undefined}
                />
                <ErrorText>{errors.iban}</ErrorText>
              </FormGroup>

              <FormGroup>
                <Label>UPLOAD QR CODE</Label>
                <UploadBox>
                  <FiUpload />
                </UploadBox>
              </FormGroup>
            </PaymentGrid>
          </PaymentLeft>

          <PaymentRight>
            <SummaryRow>
              <span>Sub Total</span>
              <strong>{summary.subTotal || "0"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>Total VAT (15%)</span>
              <strong>{summary.vat || "0"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>Discount</span>
              <strong className="discount">{summary.discount || "0"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>Round Off</span>
              <strong>{summary.roundOff || "0"}</strong>
            </SummaryRow>
            <TotalAmount>
              <span>TOTAL AMOUNT</span>
              <strong>{summary.total || " 0"}</strong>
            </TotalAmount>
          </PaymentRight>
        </PaymentSection>

        <ButtonWrapper>
          <CancelButton onClick={handleCancel}>CANCEL</CancelButton>
          <PreviewButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? "SAVING..." : isEditMode ? "UPDATE" : "PREVIEW"}
          </PreviewButton>
        </ButtonWrapper>
      </InvoiceForm>
    </InvoiceContainer>
  );
};

export default AddingInvoice;
