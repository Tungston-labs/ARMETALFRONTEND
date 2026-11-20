
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
  DraftButton,
  DownloadButton,
} from "./AddingInvoice.styles";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import useAddingInvoice from "./Useaddinginvoice";

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

const lockedStyle = {
  background: "#f5f5f5",
  cursor: "not-allowed",
};

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
    isViewMode,

    salesOrders,
    customers,

    detailLoading,
    saveError,
    invoiceNumber,

    salesOrderRef,
    deliveryNoteRef,

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

    handleInvoiceDateChange,
    handleDueDateChange,
    handlePaymentStatusChange,
    handleAmountPaidChange,

    handleDiscountChange,

    updateFrom,
    updateBillTo,
    updatePayment,

    handleSalesOrderChange,
    handleCustomerChange,

    addItem,
    removeItem,
    updateItem,

    handleCancel,
    handleSaveDraft,
    handlePreview,
    handleDownload,

    selectedInvoice,
    navigate,
  } = useAddingInvoice();

  const pageTitle = isViewMode
    ? "Invoice Details"
    : isEditMode
      ? "Edit Invoice"
      : "Generate New Invoice";

  if (detailLoading && isEditMode && !selectedInvoice) {
    return (
      <InvoiceContainer>
        <ReusableHeader
          title={pageTitle}
          breadcrumbs={["Sales", "Invoices"]}
          showBack
          onBack={() => navigate("/sales/invoices")}
        />

        <div style={{ padding: 20 }}>
          Loading invoice...
        </div>
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
          <button onClick={handleCancel}>
            Back to Invoices
          </button>
        </div>
      </InvoiceContainer>
    );
  }

  return (
    <InvoiceContainer>
      <ReusableHeader
        title={pageTitle}
        breadcrumbs={["Sales", "Invoices"]}
        showBack
        onBack={() => navigate("/sales/invoices")}
      />

      {saveError && (
        <div style={{ padding: "0 20px", color: "#c0392b" }}>
          {typeof saveError === "string"
            ? saveError
            : saveError?.detail ||
              saveError?.message ||
              (typeof saveError === "object" &&
                Object.values(saveError)
                  .flat()
                  .filter((v) => typeof v === "string")
                  .join(" ")) ||
              "Something went wrong saving this invoice."}
        </div>
      )}

      <InvoiceForm>
        <FormGrid>
          {/* SALES ORDER REFERENCE */}
          <FormGroup>
            <Label>SALES ORDER REFERENCE</Label>

            <SelectWrapper>
              <Select
                value={salesOrderRef}
                onChange={handleSalesOrderChange}
                disabled={isEditMode || isViewMode}
              >
                <option value="">Select Sales Order</option>

                {salesOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.so_number ||
                      order.order_number ||
                      `Sales Order #${order.id}`}
                  </option>
                ))}

                {salesOrderRef &&
                  !salesOrders.some(
                    (order) =>
                      String(order.id) === String(salesOrderRef)
                  ) && (
                    <option value={salesOrderRef}>
                      {`Sales Order #${salesOrderRef}`}
                    </option>
                  )}
              </Select>

              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          {/* DELIVERY NOTE REFERENCE - READ ONLY TEXTBOX */}
          <FormGroup>
            <Label>DELIVERY NOTE REFERENCE</Label>

            <Input
              type="text"
              placeholder="Automatically populated from Sales Order"
              value={deliveryNoteRef || ""}
              readOnly
              style={lockedStyle}
            />
          </FormGroup>

          {/* INVOICE NUMBER */}
          <FormGroup>
            <Label>INVOICE NUMBER</Label>

            <Input
              placeholder="Auto-generated"
              value={invoiceNumber}
              readOnly
              style={lockedStyle}
            />
          </FormGroup>

          {/* INVOICE DATE */}
          <FormGroup>
            <Label>INVOICE DATE</Label>

            <CalendarInput>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) =>
                  handleInvoiceDateChange(e.target.value)
                }
                readOnly={isEditMode}
                disabled={isEditMode}
                style={errors.invoiceDate ? errorStyle : undefined}
              />
            </CalendarInput>

            <ErrorText>{errors.invoiceDate}</ErrorText>
          </FormGroup>

          {/* DUE DATE */}
          <FormGroup>
            <Label>DUE DATE</Label>

            <CalendarInput>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  handleDueDateChange(e.target.value)
                }
                readOnly={isViewMode}
                disabled={isViewMode}
                style={errors.dueDate ? errorStyle : undefined}
              />
            </CalendarInput>

            <ErrorText>{errors.dueDate}</ErrorText>
          </FormGroup>

          {/* PAYMENT STATUS */}
          <FormGroup>
            <Label>PAYMENT STATUS</Label>

            <SelectWrapper>
              <Select
                value={paymentStatus}
                onChange={(e) =>
                  handlePaymentStatusChange(e.target.value)
                }
                disabled={isViewMode}
                style={errors.paymentStatus ? errorStyle : undefined}
              >
                <option value="">Select Payment Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Pending</option>
                <option value="partially_paid">
                  Partially Paid
                </option>
              </Select>

              <FiChevronDown />
            </SelectWrapper>

            <ErrorText>{errors.paymentStatus}</ErrorText>
          </FormGroup>

          {/* FROM */}
          <FormGroup>
            <Label>FROM</Label>

            <Input
              placeholder="TUNGSTON LABS"
              value={from.name}
              onChange={(e) =>
                updateFrom("name", e.target.value)
              }
              readOnly={isEditMode}
              style={errors.fromName ? errorStyle : undefined}
            />

            <ErrorText>{errors.fromName}</ErrorText>
          </FormGroup>

          {/* COMPANY ADDRESS */}
          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              placeholder="Tungston Labs, Ullampilly Building,..."
              value={from.address}
              onChange={(e) =>
                updateFrom("address", e.target.value)
              }
              readOnly={isEditMode}
            />
          </FormGroup>

          {/* COMPANY PHONE */}
          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              placeholder="+91 97783 77526"
              value={from.phone}
              onChange={(e) =>
                updateFrom("phone", e.target.value)
              }
              readOnly={isEditMode}
              style={errors.fromPhone ? errorStyle : undefined}
            />

            <ErrorText>{errors.fromPhone}</ErrorText>
          </FormGroup>

          {/* COMPANY EMAIL */}
          <FormGroup>
            <Label>EMAIL ID</Label>

            <Input
              placeholder="info@tungstonlabs.com"
              value={from.email}
              onChange={(e) =>
                updateFrom("email", e.target.value)
              }
              readOnly={isEditMode}
              style={errors.fromEmail ? errorStyle : undefined}
            />

            <ErrorText>{errors.fromEmail}</ErrorText>
          </FormGroup>

          {/* BILL TO */}
          <FormGroup>
            <Label>BILL TO</Label>

            <SelectWrapper>
              <Select
                value={billTo.client}
                onChange={handleCustomerChange}
                disabled={isEditMode}
                style={errors.billToClient ? errorStyle : undefined}
              >
                <option value="">Company/Client Name</option>

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

          {/* CUSTOMER ADDRESS */}
          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              placeholder="Company/Client ADDRESS"
              value={billTo.address}
              onChange={(e) =>
                updateBillTo("address", e.target.value)
              }
              readOnly={isEditMode}
            />
          </FormGroup>

          {/* CUSTOMER PHONE */}
          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              placeholder="Company/Client Phone Number"
              value={billTo.phone}
              onChange={(e) =>
                updateBillTo("phone", e.target.value)
              }
              readOnly={isEditMode}
              style={errors.billToPhone ? errorStyle : undefined}
            />

            <ErrorText>{errors.billToPhone}</ErrorText>
          </FormGroup>

          {/* CUSTOMER EMAIL */}
          <FormGroup>
            <Label>FINANCE CONTACT EMAIL</Label>

            <Input
              placeholder="Company/Client Email ID"
              value={billTo.email}
              onChange={(e) =>
                updateBillTo("email", e.target.value)
              }
              readOnly={isEditMode}
              style={errors.billToEmail ? errorStyle : undefined}
            />

            <ErrorText>{errors.billToEmail}</ErrorText>
          </FormGroup>
        </FormGrid>

        {/* INVOICE ITEMS */}
        <InvoiceItemsHeader>
          <SectionTitle>INVOICE ITEMS</SectionTitle>

          {!isEditMode && !isViewMode && (
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
                <th>VAT</th>
                <th>Amount</th>
                {!isEditMode && !isViewMode && <th>Action</th>}
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
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "service",
                            e.target.value
                          )
                        }
                        readOnly={isEditMode || isViewMode}
                        style={
                          rowErrors.service ? errorStyle : undefined
                        }
                      />

                      <ErrorText>{rowErrors.service}</ErrorText>
                    </td>

                    <td>
                      <input
                        placeholder="Wireframe Of 15 Pages"
                        value={item.particular}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "particular",
                            e.target.value
                          )
                        }
                        readOnly={isEditMode || isViewMode}
                      />
                    </td>

                    <td>
                      <input
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(item.id, "qty", e.target.value)
                        }
                        readOnly={isEditMode || isViewMode}
                        style={
                          rowErrors.qty ? errorStyle : undefined
                        }
                      />

                      <ErrorText>{rowErrors.qty}</ErrorText>
                    </td>

                    <td>
                      <input
                        value={item.hsCode}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "hsCode",
                            e.target.value
                          )
                        }
                        readOnly={isEditMode || isViewMode}
                      />
                    </td>

                    <td>
                      <input
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "rate",
                            e.target.value
                          )
                        }
                        readOnly={isEditMode || isViewMode}
                        style={
                          rowErrors.rate ? errorStyle : undefined
                        }
                      />

                      <ErrorText>{rowErrors.rate}</ErrorText>
                    </td>

                    <td>
                      <input
                        value={item.vat}
                        onChange={(e) =>
                          updateItem(item.id, "vat", e.target.value)
                        }
                        readOnly={isEditMode || isViewMode}
                        style={
                          rowErrors.vat ? errorStyle : undefined
                        }
                      />

                      <ErrorText>{rowErrors.vat}</ErrorText>
                    </td>

                    <td>
                      <input
                        value={item.vatAmount}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "vatAmount",
                            e.target.value
                          )
                        }
                        readOnly={isEditMode || isViewMode}
                      />
                    </td>

                    <td>
                      <input
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "amount",
                            e.target.value
                          )
                        }
                        readOnly={isEditMode || isViewMode}
                      />
                    </td>

                    {!isEditMode && !isViewMode && (
                      <td>
                        <DeleteButton
                          onClick={() => removeItem(item.id)}
                        >
                          <FiX />
                        </DeleteButton>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </InvoiceTable>
        </InvoiceTableWrapper>

        {/* PAYMENT DETAILS AND SUMMARY */}
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
                  onChange={(e) =>
                    updatePayment("accountHolder", e.target.value)
                  }
                  readOnly={isEditMode || isViewMode}
                />
              </FormGroup>

              <FormGroup>
                <Label>Account Number</Label>

                <Input
                  placeholder="12534789652135"
                  value={payment.accountNumber}
                  onChange={(e) =>
                    updatePayment("accountNumber", e.target.value)
                  }
                  readOnly={isEditMode || isViewMode}
                />
              </FormGroup>

              <FormGroup>
                <Label>IBAN</Label>

                <Input
                  placeholder="2654559"
                  value={payment.iban}
                  onChange={(e) =>
                    updatePayment("iban", e.target.value)
                  }
                  readOnly={isEditMode || isViewMode}
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

              <input
                type="number"
                min="0"
                step="0.01"
                value={summary.discount ?? ""}
                onChange={(e) =>
                  handleDiscountChange(e.target.value)
                }
                className="discount-input"
                readOnly={isViewMode}
              />
            </SummaryRow>

            <SummaryRow>
              <span>Round Off</span>
              <strong>{summary.roundOff || "0"}</strong>
            </SummaryRow>

            <TotalAmount>
              <span>TOTAL AMOUNT</span>
              <strong>{summary.total || "0"}</strong>
            </TotalAmount>
          </PaymentRight>
        </PaymentSection>

        {/* BUTTONS */}
        <ButtonWrapper>
          {isViewMode ? (
            <>
              <CancelButton type="button" onClick={handleCancel}>
                BACK
              </CancelButton>

              <DownloadButton type="button" onClick={handleDownload}>
                DOWNLOAD
              </DownloadButton>
            </>
          ) : (
            <>
              <CancelButton type="button" onClick={handleCancel}>
                CANCEL
              </CancelButton>

              <DraftButton
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                SAVE DRAFT
              </DraftButton>

              <DownloadButton type="button" onClick={handleDownload}>
                DOWNLOAD
              </DownloadButton>

              <PreviewButton
                type="button"
                onClick={handlePreview}
                disabled={isSaving}
              >
                {isSaving ? "SAVING..." : "PREVIEW"}
              </PreviewButton>
            </>
          )}
        </ButtonWrapper>
      </InvoiceForm>
    </InvoiceContainer>
  );
};

export default AddingInvoice;
