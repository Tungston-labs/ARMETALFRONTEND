import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiChevronDown, FiPlus, FiX, FiCalendar } from "react-icons/fi";

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
  PaymentRight,
  SummaryRow,
  TotalAmount,
  ButtonWrapper,
  CancelButton,
  PreviewButton,
} from "./CreatedeliveryNotes.style";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import { getOrderById } from "../DeliveryNotesColoumns";

const defaultItem = () => ({
  id: Date.now(),
  slNo: "01",
  product: "",
  orderedQty: "",
  alreadyDelivered: "",
  deliveringNow: "",
  balance: "",
  amount: "",
  status: "Pending",
});

const emptyForm = {
  deliveryNoteNumber: "",
  salesOrderReference: "",
  deliveryDate: "",
  deliveryStatus: "Partially",
  orderedValue: "",
  alreadyDelivered: "",
  balanceToDeliver: "",
  thisDelivery: "",
  from: {
    name: "",
    address: "",
    phone: "",
    email: "",
  },
  billTo: {
    client: "",
    address: "",
    phone: "",
    email: "",
  },
  notes: "",
  items: [
    {
      id: Date.now(),
      slNo: "01",
      product: "Product 1",
      orderedQty: "200",
      alreadyDelivered: "80",
      deliveringNow: "120",
      balance: "0",
      amount: "SAR 2,265.50",
      status: "Fully Delivered",
    },
    {
      id: Date.now() + 1,
      slNo: "02",
      product: "Product 2",
      orderedQty: "80",
      alreadyDelivered: "00",
      deliveringNow: "40",
      balance: "40",
      amount: "SAR 2,265.50",
      status: "Partial",
    },
    {
      id: Date.now() + 2,
      slNo: "03",
      product: "Product 3",
      orderedQty: "500",
      alreadyDelivered: "210",
      deliveringNow: "00",
      balance: "290",
      amount: "SAR 2,265.50",
      status: "Pending",
    },
  ],
};

const mapRowToFormData = (row) => ({
  deliveryNoteNumber:
    row?.delivery_note_number || row?.order_number || "DN 0123",
  salesOrderReference:
    row?.sales_order_reference || row?.so_number || "SO 0123 - Clicking",
  deliveryDate: row?.delivery_date || "2026-04-17",
  deliveryStatus: row?.delivery_status || "Partially",
  orderedValue: row?.ordered_value || "22,852 SAR",
  alreadyDelivered: row?.already_delivered || "9,240 SAR",
  balanceToDeliver: row?.balance_to_deliver || "13,612 SAR",
  thisDelivery: row?.this_delivery || "7,320 SAR",
  from: {
    name: row?.from_name || "TUNGSTON LABS",
    address: row?.from_address || "Tungston Labs, Ullampilly Building,...",
    phone: row?.from_phone || "+91 97783 77526",
    email: row?.from_email || "info@tungstonlabs.com",
  },
  billTo: {
    client: row?.customer || "",
    address: row?.customer_address || "",
    phone: row?.customer_phone || "",
    email: row?.finance_contact_email || "",
  },
  notes:
    row?.notes ||
    "Remaining packaging units to be dispatched with next batch from Jeddah DC — awaiting stock replenishment.",
  items: emptyForm.items,
});

const Createdeliverynotes = ({ onCancel, onPreview }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const today = new Date().toISOString().split("T")[0];

  const existingRow = id ? location.state?.orderData || getOrderById(id) : null;

  const initialData = existingRow ? mapRowToFormData(existingRow) : null;

  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState(
    initialData?.deliveryNoteNumber || "DN 0123",
  );

  const [salesOrderReference, setSalesOrderReference] = useState(
    initialData?.salesOrderReference || "SO 0123 - Clicking",
  );

  const [deliveryDate, setDeliveryDate] = useState(
    initialData?.deliveryDate || "2026-04-17",
  );

  const [deliveryStatus, setDeliveryStatus] = useState(
    initialData?.deliveryStatus || "Partially",
  );

  const [orderedValue, setOrderedValue] = useState(
    initialData?.orderedValue || "22,852 SAR",
  );

  const [alreadyDelivered, setAlreadyDelivered] = useState(
    initialData?.alreadyDelivered || "9,240 SAR",
  );

  const [balanceToDeliver, setBalanceToDeliver] = useState(
    initialData?.balanceToDeliver || "13,612 SAR",
  );

  const [thisDelivery, setThisDelivery] = useState(
    initialData?.thisDelivery || "7,320 SAR",
  );

  const [from, setFrom] = useState(initialData?.from || emptyForm.from);

  const [billTo, setBillTo] = useState(initialData?.billTo || emptyForm.billTo);

  const [notes, setNotes] = useState(initialData?.notes || emptyForm.notes);

  const [items, setItems] = useState(initialData?.items || emptyForm.items);

  useEffect(() => {
    if (existingRow) {
      const mapped = mapRowToFormData(existingRow);

      setDeliveryNoteNumber(mapped.deliveryNoteNumber);
      setSalesOrderReference(mapped.salesOrderReference);
      setDeliveryDate(mapped.deliveryDate);
      setDeliveryStatus(mapped.deliveryStatus);
      setOrderedValue(mapped.orderedValue);
      setAlreadyDelivered(mapped.alreadyDelivered);
      setBalanceToDeliver(mapped.balanceToDeliver);
      setThisDelivery(mapped.thisDelivery);
      setFrom(mapped.from);
      setBillTo(mapped.billTo);
      setNotes(mapped.notes);
      setItems(mapped.items);
    }
  }, [id]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        slNo: String(prev.length + 1).padStart(2, "0"),
        product: `Product ${prev.length + 1}`,
        orderedQty: "",
        alreadyDelivered: "",
        deliveringNow: "",
        balance: "",
        amount: "",
        status: "Pending",
      },
    ]);
  };

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateItem = (itemId, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    navigate("/sales/delivery-notes");
  };

  const handlePreview = () => {
    const payload = {
      ...(id ? { id } : {}),
      deliveryNoteNumber,
      salesOrderReference,
      deliveryDate,
      deliveryStatus,
      orderedValue,
      alreadyDelivered,
      balanceToDeliver,
      thisDelivery,
      from,
      billTo,
      notes,
      items,
    };

    if (onPreview) {
      onPreview(payload);
      return;
    }

    console.log("Delivery Note:", payload);
  };

  return (
    <OrderContainer>
      <ReusableHeader
        title="Generate Delivery Notes"
        breadcrumbs={["Dashboard", "Sales", "Delivery Notes"]}
        showBack={false}
      />

      <OrderForm>
        <FormGrid>
          {/* DELIVERY NOTE NUMBER */}
          <FormGroup>
            <Label>DELIVERY NOTE NUMBER</Label>
            <Input
              placeholder="DN 0123"
              value={deliveryNoteNumber}
              onChange={(e) => setDeliveryNoteNumber(e.target.value)}
            />
          </FormGroup>

          {/* SALES ORDER REFERENCE */}
          <FormGroup>
            <Label>SALES ORDER REFERENCE</Label>
            <Input
              placeholder="SO 0123 - Clicking"
              value={salesOrderReference}
              onChange={(e) => setSalesOrderReference(e.target.value)}
            />
          </FormGroup>

          {/* DELIVERY DATE */}
          <FormGroup>
            <Label>DELIVERY DATE</Label>
            <CalendarInput>
              <Input
                type="date"
                value={deliveryDate || today}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </CalendarInput>
          </FormGroup>

          {/* DELIVERY STATUS */}
          <FormGroup>
            <Label>DELIVERY STATUS</Label>
            <SelectWrapper>
              <Select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
              >
                <option value="Fully Delivered">Fully Delivered</option>
                <option value="Partially">Partially</option>
                <option value="Pending">Pending</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          {/* ORDERED VALUE */}
          <FormGroup>
            <Label>ORDERED VALUE (SO 0123)</Label>
            <Input
              placeholder="22,852 SAR"
              value={orderedValue}
              onChange={(e) => setOrderedValue(e.target.value)}
            />
          </FormGroup>

          {/* ALREADY DELIVERED */}
          <FormGroup>
            <Label>ALREADY DELIVERED</Label>
            <Input
              placeholder="9,240 SAR"
              value={alreadyDelivered}
              onChange={(e) => setAlreadyDelivered(e.target.value)}
            />
          </FormGroup>

          {/* BALANCE TO DELIVER */}
          <FormGroup>
            <Label>BALANCE TO DELIVER</Label>
            <Input
              placeholder="13,612 SAR"
              value={balanceToDeliver}
              onChange={(e) => setBalanceToDeliver(e.target.value)}
              style={{
                background: "#fff5e6",
              }}
            />
          </FormGroup>

          {/* THIS DELIVERY */}
          <FormGroup>
            <Label>THIS DELIVERY</Label>
            <Input
              placeholder="7,320 SAR"
              value={thisDelivery}
              onChange={(e) => setThisDelivery(e.target.value)}
              style={{
                background: "#e0f5ec",
              }}
            />
          </FormGroup>

          {/* FROM */}
          <FormGroup>
            <Label>FROM</Label>
            <Input
              placeholder="TUNGSTON LABS"
              value={from.name}
              onChange={(e) =>
                setFrom({
                  ...from,
                  name: e.target.value,
                })
              }
            />
          </FormGroup>

          {/* FROM ADDRESS */}
          <FormGroup>
            <Label>ADDRESS</Label>
            <Input
              placeholder="Tungston Labs, Ullampilly Building,..."
              value={from.address}
              onChange={(e) =>
                setFrom({
                  ...from,
                  address: e.target.value,
                })
              }
            />
          </FormGroup>

          {/* FROM PHONE */}
          <FormGroup>
            <Label>PHONE NUMBER</Label>
            <Input
              placeholder="+91 97783 77526"
              value={from.phone}
              onChange={(e) =>
                setFrom({
                  ...from,
                  phone: e.target.value,
                })
              }
            />
          </FormGroup>

          {/* FROM EMAIL */}
          <FormGroup>
            <Label>EMAIL ID</Label>
            <Input
              placeholder="info@tungstonlabs.com"
              value={from.email}
              onChange={(e) =>
                setFrom({
                  ...from,
                  email: e.target.value,
                })
              }
            />
          </FormGroup>

          {/* BILL TO */}
          <FormGroup>
            <Label>BILL TO</Label>
            <SelectWrapper>
              <Select
                value={billTo.client}
                onChange={(e) =>
                  setBillTo({
                    ...billTo,
                    client: e.target.value,
                  })
                }
              >
                <option value="">Company/Client Name</option>
                <option value="client1">Company 1</option>
                <option value="client2">Company 2</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          {/* BILL TO ADDRESS */}
          <FormGroup>
            <Label>ADDRESS</Label>
            <Input
              placeholder="Company/Client ADDRESS"
              value={billTo.address}
              onChange={(e) =>
                setBillTo({
                  ...billTo,
                  address: e.target.value,
                })
              }
            />
          </FormGroup>

          {/* BILL TO PHONE */}
          <FormGroup>
            <Label>PHONE NUMBER</Label>
            <Input
              placeholder="Company/Client Phone Number"
              value={billTo.phone}
              onChange={(e) =>
                setBillTo({
                  ...billTo,
                  phone: e.target.value,
                })
              }
            />
          </FormGroup>

          {/* FINANCE CONTACT EMAIL */}
          <FormGroup>
            <Label>Finance Contact Email</Label>
            <Input
              placeholder="Company/Client Email ID"
              value={billTo.email}
              onChange={(e) =>
                setBillTo({
                  ...billTo,
                  email: e.target.value,
                })
              }
            />
          </FormGroup>
        </FormGrid>

        {/* INVOICE ITEMS */}
        <OrderItemsHeader>
          <SectionTitle>INVOICE ITEMS</SectionTitle>

          <AddItemButton onClick={addItem}>
            <FiPlus />
            ADD ITEM
          </AddItemButton>
        </OrderItemsHeader>

        <OrderTableWrapper>
          <OrderTable>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Product</th>
                <th>Ordered Qty</th>
                <th>Already Delivered</th>
                <th>Delivering Now</th>
                <th>Balance</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.slNo}</td>

                  <td>
                    <input
                      value={item.product}
                      onChange={(e) =>
                        updateItem(item.id, "product", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.orderedQty}
                      onChange={(e) =>
                        updateItem(item.id, "orderedQty", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.alreadyDelivered}
                      onChange={(e) =>
                        updateItem(item.id, "alreadyDelivered", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.deliveringNow}
                      onChange={(e) =>
                        updateItem(item.id, "deliveringNow", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.balance}
                      onChange={(e) =>
                        updateItem(item.id, "balance", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(item.id, "amount", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <span
                      style={{
                        color:
                          item.status === "Fully Delivered"
                            ? "green"
                            : item.status === "Partial"
                              ? "#ff8a00"
                              : "red",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </OrderTable>
        </OrderTableWrapper>

        {/* SUMMARY */}
        <PaymentSection>
          <PaymentLeft style={{ flex: 1 }}>
            <div />
          </PaymentLeft>

          <PaymentRight
            style={{
              maxWidth: 390,
              marginLeft: "auto",
            }}
          >
            <SummaryRow>
              <span>Total Quantity</span>
              <strong>160 Unit</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Pending Quantity</span>
              <strong>330 Unit</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Delivery Value</span>
              <strong
                style={{
                  color: "#00a52a",
                }}
              >
                SAR 7,320
              </strong>
            </SummaryRow>

            <TotalAmount
              style={{
                marginTop: 10,
                background: "#ff8500",
                color: "#fff",
                borderRadius: 4,
              }}
            >
              <span>DELIVERY STATUS</span>
              <strong>PARTIAL</strong>
            </TotalAmount>
          </PaymentRight>
        </PaymentSection>

        {/* NOTES */}
        <div
          style={{
            marginTop: 25,
            width: "52%",
          }}
        >
          <Label>Notes & instructions</Label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Remaining packaging units to be dispatched with next batch from Jeddah DC — awaiting stock replenishment."
            style={{
              width: "100%",
              minHeight: "42px",
              marginTop: "7px",
              padding: "12px",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              resize: "none",
              fontFamily: "inherit",
              fontSize: "12px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* BUTTONS */}
        <ButtonWrapper
          style={{
            marginTop: 18,
          }}
        >
          <CancelButton onClick={handleCancel}>CANCEL</CancelButton>

          <PreviewButton onClick={handlePreview}>PREVIEW</PreviewButton>
        </ButtonWrapper>
      </OrderForm>
    </OrderContainer>
  );
};

export default Createdeliverynotes;
