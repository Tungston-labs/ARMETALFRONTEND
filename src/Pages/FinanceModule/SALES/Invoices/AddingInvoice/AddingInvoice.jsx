import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { getInvoiceById } from "../SalesInvoices.columns";

const defaultItem = () => ({
  id: Date.now(),
  slNo: "01",
  service: "",
  particular: "",
  qty: "",
  hsCode: "",
  rate: "",
  vat: "",
  vatAmount: "",
  amount: "",
});

const emptyForm = {
  invoiceNumber: "",
  paymentStatus: "",
  from: { name: "", address: "", phone: "", email: "" },
  billTo: { client: "", address: "", phone: "", email: "" },
  payment: { accountHolder: "", accountNumber: "", iban: "" },
  summary: { subTotal: "", vat: "", discount: "", roundOff: "", total: "" },
  items: [defaultItem()],
};

// Bridges the flat mock row shape (SalesInvoices.columns.jsx) into the
// nested shape this form works with. Swap this out once a real
// "get invoice detail by id" endpoint exists — items/from/payment
// currently have no source data and are left at defaults.
const mapRowToFormData = (row) => ({
  invoiceNumber: row.invoice_number || "",
  invoiceDate: row.invoice_date || "",
  dueDate: row.due_date || "",
  paymentStatus: (row.payment_status || "").toLowerCase().includes("partial")
    ? "partial"
    : (row.payment_status || "").toLowerCase(),
  from: emptyForm.from,
  billTo: { ...emptyForm.billTo, client: row.customer || "" },
  payment: emptyForm.payment,
  summary: {
    ...emptyForm.summary,
    subTotal: row.amount || "",
    total: row.amount || "",
  },
  items: [defaultItem()],
});

const AddingInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const today = new Date().toISOString().split("T")[0];

  // Prefer the row passed via navigate() state (fast path, no lookup).
  // Fall back to the mock-data lookup for direct links/page refreshes,
  // where location.state is empty.
  const existingRow = isEditMode
    ? location.state?.invoiceData || getInvoiceById(id)
    : null;

  const initialData = existingRow ? mapRowToFormData(existingRow) : null;
  const notFound = isEditMode && !existingRow;

  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || "");
  const [invoiceDate, setInvoiceDate] = useState(initialData?.invoiceDate || today);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [paymentStatus, setPaymentStatus] = useState(initialData?.paymentStatus || "");
  const [from, setFrom] = useState(initialData?.from || emptyForm.from);
  const [billTo, setBillTo] = useState(initialData?.billTo || emptyForm.billTo);
  const [payment, setPayment] = useState(initialData?.payment || emptyForm.payment);
  const [summary, setSummary] = useState(initialData?.summary || emptyForm.summary);
  const [items, setItems] = useState(initialData?.items || [defaultItem()]);

  // Re-sync if the :id param changes while this component stays mounted
  useEffect(() => {
    if (existingRow) {
      const mapped = mapRowToFormData(existingRow);
      setInvoiceNumber(mapped.invoiceNumber);
      setInvoiceDate(mapped.invoiceDate);
      setDueDate(mapped.dueDate);
      setPaymentStatus(mapped.paymentStatus);
      setFrom(mapped.from);
      setBillTo(mapped.billTo);
      setPayment(mapped.payment);
      setSummary(mapped.summary);
      setItems(mapped.items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateItem = (itemId, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCancel = () => navigate("/sales/invoices");

  const handleSave = () => {
    const payload = {
      ...(isEditMode ? { id } : {}),
      invoiceNumber,
      invoiceDate,
      dueDate,
      paymentStatus,
      from,
      billTo,
      payment,
      summary,
      items,
    };
    // TODO: POST for create, PATCH/PUT for update, against your real API
    console.log(isEditMode ? "Update invoice:" : "Create invoice:", payload);
    navigate("/sales/invoices");
  };

  if (notFound) {
    return (
      <InvoiceContainer>
       <ReusableHeader
  title={isEditMode ? "Edit Invoice" : "Generate New Invoice"}
  breadcrumbs={["Sales", "Invoices"]}

></ReusableHeader>
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

      <InvoiceForm>
        <FormGrid>
          <FormGroup>
            <Label>INVOICE NUMBER</Label>
            <Input
              placeholder="INV001"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>INVOICE DATE</Label>
            <CalendarInput>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                readOnly={isEditMode}
                disabled={isEditMode}
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
                readOnly={isEditMode}
                disabled={isEditMode}
              />
            </CalendarInput>
          </FormGroup>

          <FormGroup>
            <Label>PAYMENT STATUS</Label>
            <SelectWrapper>
              <Select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
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

          <FormGroup>
            <Label>FROM</Label>
            <Input
              placeholder="TUNGSTON LABS"
              value={from.name}
              onChange={(e) => setFrom({ ...from, name: e.target.value })}
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>
            <Input
              placeholder="Tungston Labs, Ullampilly Building,..."
              value={from.address}
              onChange={(e) => setFrom({ ...from, address: e.target.value })}
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>
            <Input
              placeholder="+91 97783 77526"
              value={from.phone}
              onChange={(e) => setFrom({ ...from, phone: e.target.value })}
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>EMAIL ID</Label>
            <Input
              placeholder="info@tungstonlabs.com"
              value={from.email}
              onChange={(e) => setFrom({ ...from, email: e.target.value })}
              readOnly={isEditMode}
            />
          </FormGroup>
          <FormGroup>
            <Label>BILL TO</Label>
            <SelectWrapper>
              <Select
                value={billTo.client}
                onChange={(e) => setBillTo({ ...billTo, client: e.target.value })}
                disabled={isEditMode}
              >
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
            <Input
              placeholder="Company/Client ADDRESS"
              value={billTo.address}
              onChange={(e) =>
                setBillTo({ ...billTo, address: e.target.value })
              }
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>
            <Input
              placeholder="Company/Client Phone Number"
              value={billTo.phone}
              onChange={(e) =>
                setBillTo({ ...billTo, phone: e.target.value })
              }
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>EMAIL ID</Label>
            <Input
              placeholder="Company/Client Email ID"
              value={billTo.email}
              onChange={(e) =>
                setBillTo({ ...billTo, email: e.target.value })
              }
              readOnly={isEditMode}
            />
          </FormGroup>
        </FormGrid>

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
                    <input
                      placeholder="App Design"
                      value={item.service}
                      onChange={(e) => updateItem(item.id, "service", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Wireframe Of 15 Pages"
                      value={item.particular}
                      onChange={(e) => updateItem(item.id, "particular", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.hsCode}
                      onChange={(e) => updateItem(item.id, "hsCode", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.vat}
                      onChange={(e) => updateItem(item.id, "vat", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.vatAmount}
                      onChange={(e) => updateItem(item.id, "vatAmount", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={item.amount}
                      onChange={(e) => updateItem(item.id, "amount", e.target.value)}
                    />
                  </td>
                  <td>
                    <DeleteButton onClick={() => removeItem(item.id)}>
                      <FiX />
                    </DeleteButton>
                  </td>
                </tr>
              ))}
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
                  onChange={(e) =>
                    setPayment({ ...payment, accountHolder: e.target.value })
                  }
                  readOnly={isEditMode}
                />
              </FormGroup>

              <FormGroup>
                <Label>Account Number</Label>
                <Input
                  placeholder="12534789652135"
                  value={payment.accountNumber}
                  onChange={(e) =>
                    setPayment({ ...payment, accountNumber: e.target.value })
                  }
                  readOnly={isEditMode}
                />
              </FormGroup>

              <FormGroup>
                <Label>IBAN</Label>
                <Input
                  placeholder="2654559"
                  value={payment.iban}
                  onChange={(e) => setPayment({ ...payment, iban: e.target.value })}
                  readOnly={isEditMode}
                />
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
              <strong>{summary.subTotal || "SAR 0"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>Total VAT (15%)</span>
              <strong>{summary.vat || "SAR 0"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>Discount</span>
              <strong className="discount">{summary.discount || "SAR 0"}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>Round Off</span>
              <strong>{summary.roundOff || "SAR 0"}</strong>
            </SummaryRow>
            <TotalAmount>
              <span>TOTAL AMOUNT</span>
              <strong>{summary.total || "SAR 0"}</strong>
            </TotalAmount>
          </PaymentRight>
        </PaymentSection>

        <ButtonWrapper>
          <CancelButton onClick={handleCancel}>CANCEL</CancelButton>
          <PreviewButton onClick={handleSave}>
            {isEditMode ? "UPDATE" : "PREVIEW"}
          </PreviewButton>
        </ButtonWrapper>
      </InvoiceForm>
    </InvoiceContainer>
  );
};

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

export default AddingInvoice;