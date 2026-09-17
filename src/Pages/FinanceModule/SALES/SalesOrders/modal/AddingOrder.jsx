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
  InvoiceContainer as OrderContainer,
  InvoiceForm as OrderForm,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  CalendarInput,
  InvoiceItemsHeader as OrderItemsHeader,
  AddItemButton,
  InvoiceTableWrapper as OrderTableWrapper,
  InvoiceTable as OrderTable,
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
} from "./AddingOrder.styles";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import { getOrderById } from "../SalesOrders.columns";

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
  orderNumber: "",
  orderStatus: "",
  from: { name: "", address: "", phone: "", email: "" },
  billTo: { client: "", address: "", phone: "", email: "" },
  payment: { accountHolder: "", accountNumber: "", iban: "" },
  summary: { subTotal: "", vat: "", discount: "", roundOff: "", total: "" },
  items: [defaultItem()],
};

// Bridges the flat mock row shape (SalesOrders.columns.jsx) into the
// nested shape this form works with. Swap out once a real
// "get order detail by id" endpoint exists — items/from/payment
// currently have no source data and are left at defaults.
const mapRowToFormData = (row) => ({
  orderNumber: row.order_number || "",
  orderDate: row.order_date || "",
  deliveryDate: row.delivery_date || "",
  orderStatus: (row.status || "").toLowerCase(),
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

const AddingOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const today = new Date().toISOString().split("T")[0];

  // Prefer the row passed via navigate() state (fast path, no lookup).
  // Fall back to the mock-data lookup for direct links/page refreshes,
  // where location.state is empty.
  const existingRow = isEditMode
    ? location.state?.orderData || getOrderById(id)
    : null;

  const initialData = existingRow ? mapRowToFormData(existingRow) : null;
  const notFound = isEditMode && !existingRow;

  const [orderNumber, setOrderNumber] = useState(initialData?.orderNumber || "");
  const [orderDate, setOrderDate] = useState(initialData?.orderDate || today);
  const [deliveryDate, setDeliveryDate] = useState(initialData?.deliveryDate || "");
  const [orderStatus, setOrderStatus] = useState(initialData?.orderStatus || "");
  const [from, setFrom] = useState(initialData?.from || emptyForm.from);
  const [billTo, setBillTo] = useState(initialData?.billTo || emptyForm.billTo);
  const [payment, setPayment] = useState(initialData?.payment || emptyForm.payment);
  const [summary, setSummary] = useState(initialData?.summary || emptyForm.summary);
  const [items, setItems] = useState(initialData?.items || [defaultItem()]);

  // Re-sync if the :id param changes while this component stays mounted
  useEffect(() => {
    if (existingRow) {
      const mapped = mapRowToFormData(existingRow);
      setOrderNumber(mapped.orderNumber);
      setOrderDate(mapped.orderDate);
      setDeliveryDate(mapped.deliveryDate);
      setOrderStatus(mapped.orderStatus);
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

  const handleCancel = () => navigate("/sales/orders");

  const handleSave = () => {
    const payload = {
      ...(isEditMode ? { id } : {}),
      orderNumber,
      orderDate,
      deliveryDate,
      orderStatus,
      from,
      billTo,
      payment,
      summary,
      items,
    };
    // TODO: POST for create, PATCH/PUT for update, against your real API
    console.log(isEditMode ? "Update order:" : "Create order:", payload);
    navigate("/sales/orders");
  };

  if (notFound) {
    return (
      <OrderContainer>
        <ReusableHeader
          title="Order not found"
          breadcrumbs={["Sales", "Orders"]}
          showBack
          onBack={() => navigate("/sales/orders")}
        />
        <div style={{ padding: 20 }}>
          No order found for id "{id}".{" "}
          <button onClick={handleCancel}>Back to Orders</button>
        </div>
      </OrderContainer>
    );
  }

  return (
    <OrderContainer>
      <ReusableHeader
        title={isEditMode ? "Edit Sales Order" : "Generate New Sales Order"}
        breadcrumbs={["Sales", "Orders"]}
        showBack
        onBack={() => navigate("/sales/orders")}
      ></ReusableHeader>

      <OrderForm>
        <FormGrid>
          <FormGroup>
            <Label> SALES ORDER REFERENCE</Label>
            <Input
              placeholder="SO001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>INVOICE NUMBER </Label>
            <CalendarInput>
              <Input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                readOnly={isEditMode}
                disabled={isEditMode}
              />
            </CalendarInput>
          </FormGroup>

          <FormGroup>
            <Label>INVOICE DATE</Label>
            <CalendarInput>
              <Input
                type="date"
                value={deliveryDate}
                min={orderDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                readOnly={isEditMode}
                disabled={isEditMode}
              />
            </CalendarInput>
          </FormGroup>

          {/* ORDER STATUS — the only field editable in edit mode,
              mirroring how PAYMENT STATUS worked in AddingInvoice */}
          <FormGroup>
            <Label>PAYMENT STATUS</Label>
            <SelectWrapper>
              <Select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <option value="" disabled>
                  Select Order Status
                </option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
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
              onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>
            <Input
              placeholder="Company/Client Phone Number"
              value={billTo.phone}
              onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })}
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>FINANCE EMAIL ID</Label>
            <Input
              placeholder="Company/Client Email ID"
              value={billTo.email}
              onChange={(e) => setBillTo({ ...billTo, email: e.target.value })}
              readOnly={isEditMode}
            />
          </FormGroup>
        </FormGrid>

        <OrderItemsHeader>
          <SectionTitle>ORDER ITEMS</SectionTitle>
          {!isEditMode && (
            <AddItemButton onClick={addItem}>
              <FiPlus />
              ADD ITEM
            </AddItemButton>
          )}
        </OrderItemsHeader>

        <OrderTableWrapper>
          <OrderTable>
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
                      readOnly={isEditMode}
                    />
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
                    />
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
                    />
                  </td>
                  <td>
                    <input
                      value={item.vat}
                      onChange={(e) => updateItem(item.id, "vat", e.target.value)}
                      readOnly={isEditMode}
                    />
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
              ))}
            </tbody>
          </OrderTable>
        </OrderTableWrapper>

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
      </OrderForm>
    </OrderContainer>
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

export default AddingOrder;