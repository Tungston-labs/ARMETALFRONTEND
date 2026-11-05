import React, { useMemo, useState } from "react";
import { FiCalendar, FiChevronDown, FiPlus, FiX, FiLock } from "react-icons/fi";
import {
  ModalOverlay,
  ModalPage,
  ModalHeader,
  HeaderTitle,
  Breadcrumbs,
  UserBlock,
  UserAvatar,
  FormBody,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrap,
  Select,
  ItemsHeader,
  AddItemButton,
  TableWrap,
  ItemsTable,
  DeleteButton,
  BottomSection,
  NotesBlock,
  Summary,
  SummaryRow,
  DiscountInput,
  TotalBar,
  Footer,
  LockNote,
  Actions,
  OutlineButton,
  PrimaryButton,
  ErrorMessage,
  Required,
} from "./AddQuotation.style";

const todayLocal = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const makeItem = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  service: "",
  description: "",
  quantity: "1",
  hsCode: "",
  rate: "",
  vatRate: "15",
});

const money = (value) =>
  `SAR ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const displayDate = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day} ${new Date(Number(year), Number(month) - 1)
    .toLocaleString("en", {
      month: "short",
    })
    .toUpperCase()}, ${year}`;
};

const GenerateQuotationModal = ({
  isOpen = true,
  onClose,
  onPreview,
  clients = [],
}) => {
  const today = todayLocal();

  const [quotationNumber, setQuotationNumber] = useState(
    () => `INV${String(Date.now()).slice(-5)}`,
  );
  const [quotationDate, setQuotationDate] = useState(today);
  const [dueDate, setDueDate] = useState(today);
  const [paymentStatus, setPaymentStatus] = useState("Draft");

  const [from, setFrom] = useState({
    name: "TUNGSTON LABS",
    address: "Tungston Labs, Ullampilly Building, Kerala",
    phone: "+91 97783 77526",
    email: "info@tungstonlabs.com",
  });

  const [billTo, setBillTo] = useState({
    client: "",
    address: "",
    phone: "",
    email: "",
  });

  const [items, setItems] = useState([makeItem(), makeItem()]);
  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState(
    "Above information is not an invoice and only an estimate of services.\nPLEASE CONFIRM YOUR ACCEPTANCE OF THIS QUOTE",
  );
  const [error, setError] = useState("");

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
      0,
    );
    const vat = items.reduce((sum, item) => {
      const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
      return sum + (amount * (Number(item.vatRate) || 0)) / 100;
    }, 0);
    const discountValue = Math.max(0, Number(discount) || 0);
    const total = Math.max(0, subtotal + vat - discountValue);
    return { subtotal, vat, discount: discountValue, total };
  }, [items, discount]);

  if (!isOpen) return null;

  const updateItem = (id, field, value) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => setItems((current) => [...current, makeItem()]);

  const removeItem = (id) => {
    setItems((current) => {
      if (current.length === 1) return current;
      return current.filter((item) => item.id !== id);
    });
  };

  const updateClient = (name) => {
    const selected = clients.find(
      (client) => String(client.id ?? client.name) === String(name),
    );
    setBillTo({
      client: selected?.name || name,
      address: selected?.address || "",
      phone: selected?.phone || "",
      email: selected?.email || "",
    });
  };

  const handlePreview = () => {
    const validItems = items.filter(
      (item) =>
        item.service.trim() ||
        item.description.trim() ||
        (Number(item.quantity) > 0 &&
          Number(item.rate) >= 0 &&
          item.rate !== ""),
    );

    if (!quotationNumber.trim()) {
      setError("Quotation number is required.");
      return;
    }
    if (!billTo.client.trim()) {
      setError("Please select or enter a company/client.");
      return;
    }
    if (!validItems.length) {
      setError("Please add at least one quotation item.");
      return;
    }
    if (!quotationDate || !dueDate || dueDate < quotationDate) {
      setError("Please select a valid quotation date and valid-till date.");
      return;
    }

    setError("");
    onPreview?.({
      quotationNumber,
      quotationDate,
      dueDate,
      paymentStatus,
      from,
      billTo,
      discount: totals.discount,
      notes,
      totals,
      items: validItems.map((item) => ({
        service: item.service,
        description: item.description,
        quantity: Number(item.quantity) || 1,
        hsCode: item.hsCode,
        rate: Number(item.rate) || 0,
        vatRate: Number(item.vatRate) || 0,
      })),
    });
  };

  return (
    <ModalOverlay role="presentation">
      <ModalPage
        role="dialog"
        aria-modal="true"
        aria-label="Generate new quotation"
      >
        <ModalHeader>
          <div>
            <HeaderTitle>Generate New Quotation</HeaderTitle>
            <Breadcrumbs>
              <span>⌂ Dashboard</span>
              <span>›</span>
              <span>Sales</span>
              <span>›</span>
              <strong>Quotations</strong>
            </Breadcrumbs>
          </div>
          <UserBlock>
            <UserAvatar>Ａ</UserAvatar>
            <span>
              <strong>Aishwarya</strong>
              <small>ADMIN</small>
            </span>
          </UserBlock>
        </ModalHeader>

        <FormBody>
          <FormGrid>
            <FormGroup>
              <Label>QUOTATION NUMBER</Label>
              <Input
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                placeholder="INV001"
              />
            </FormGroup>
            <FormGroup>
              <Label>QUOTATION DATE</Label>
              <Input
                type="date"
                value={quotationDate}
                onChange={(e) => setQuotationDate(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                VALID TILL <Required>*</Required>
              </Label>
              <Input
                type="date"
                min={quotationDate}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>STATUS</Label>
              <SelectWrap>
                <Select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>
                <FiChevronDown />
              </SelectWrap>
            </FormGroup>

            <FormGroup>
              <Label>FROM</Label>
              <Input
                value={from.name}
                onChange={(e) => setFrom({ ...from, name: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>ADDRESS</Label>
              <Input
                value={from.address}
                onChange={(e) => setFrom({ ...from, address: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>PHONE NUMBER</Label>
              <Input
                value={from.phone}
                onChange={(e) => setFrom({ ...from, phone: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>EMAIL ID</Label>
              <Input
                value={from.email}
                onChange={(e) => setFrom({ ...from, email: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                BILL TO <Required>*</Required>
              </Label>
              {clients.length ? (
                <SelectWrap>
                  <Select
                    value={billTo.client}
                    onChange={(e) => updateClient(e.target.value)}
                  >
                    <option value="">Select company/client</option>
                    {clients.map((client) => (
                      <option
                        key={client.id ?? client.name}
                        value={client.id ?? client.name}
                      >
                        {client.name}
                      </option>
                    ))}
                  </Select>
                  <FiChevronDown />
                </SelectWrap>
              ) : (
                <Input
                  value={billTo.client}
                  onChange={(e) =>
                    setBillTo({ ...billTo, client: e.target.value })
                  }
                  placeholder="Select company/client"
                />
              )}
            </FormGroup>
            <FormGroup>
              <Label>
                ADDRESS <Required>*</Required>
              </Label>
              <Input
                value={billTo.address}
                onChange={(e) =>
                  setBillTo({ ...billTo, address: e.target.value })
                }
                placeholder="Filled from the client"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                PHONE NUMBER <Required>*</Required>
              </Label>
              <Input
                value={billTo.phone}
                onChange={(e) =>
                  setBillTo({ ...billTo, phone: e.target.value })
                }
                placeholder="Filled from the client"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                Finance Contact Email <Required>*</Required>
              </Label>
              <Input
                type="email"
                value={billTo.email}
                onChange={(e) =>
                  setBillTo({ ...billTo, email: e.target.value })
                }
                placeholder="Filled from the client"
              />
            </FormGroup>
          </FormGrid>

          <ItemsHeader>
            <h3>QUOTATION ITEMS</h3>
            <AddItemButton type="button" onClick={addItem}>
              <FiPlus /> ADD ITEM
            </AddItemButton>
          </ItemsHeader>

          <TableWrap>
            <ItemsTable>
              <thead>
                <tr>
                  <th>SL No</th>
                  <th>Product</th>
                  <th>Description</th>
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
                {items.map((item, index) => {
                  const amount =
                    (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                  const vatAmount =
                    (amount * (Number(item.vatRate) || 0)) / 100;
                  return (
                    <tr key={item.id}>
                      <td className="serial">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td>
                        <input
                          aria-label="Product"
                          value={item.service}
                          onChange={(e) =>
                            updateItem(item.id, "service", e.target.value)
                          }
                          placeholder="Product name"
                        />
                      </td>
                      <td>
                        <input
                          aria-label="Description"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="Item description"
                        />
                      </td>
                      <td>
                        <input
                          aria-label="Quantity"
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          aria-label="HS Code"
                          value={item.hsCode}
                          onChange={(e) =>
                            updateItem(item.id, "hsCode", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          aria-label="Rate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(item.id, "rate", e.target.value)
                          }
                          placeholder="SAR"
                        />
                      </td>
                      <td>
                        <input
                          aria-label="VAT percentage"
                          type="number"
                          min="0"
                          max="100"
                          value={item.vatRate}
                          onChange={(e) =>
                            updateItem(item.id, "vatRate", e.target.value)
                          }
                        />
                      </td>
                      <td className="calculated">{money(vatAmount)}</td>
                      <td className="calculated">{money(amount)}</td>
                      <td>
                        <DeleteButton
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <FiX />
                        </DeleteButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </ItemsTable>
          </TableWrap>

          <BottomSection>
            <NotesBlock>
              <h3>NOTES</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </NotesBlock>
            <Summary>
              <SummaryRow>
                <span>Sub Total</span>
                <strong>{money(totals.subtotal)}</strong>
              </SummaryRow>
              <SummaryRow>
                <span>Total GST (SAR)</span>
                <strong>{money(totals.vat)}</strong>
              </SummaryRow>
              <SummaryRow>
                <span>Discount (SAR)</span>
                <DiscountInput
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </SummaryRow>
              <SummaryRow>
                <span>Round Off</span>
                <strong>{money(totals.total)}</strong>
              </SummaryRow>
              <TotalBar>
                <span>TOTAL AMOUNT</span>
                <strong>{money(totals.total)}</strong>
              </TotalBar>
            </Summary>
          </BottomSection>

          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

          <Footer>
            <LockNote>
              <FiLock /> Sent is locked until an admin approves this quote
            </LockNote>
            <Actions>
              <OutlineButton type="button" onClick={onClose}>
                CANCEL
              </OutlineButton>
              <OutlineButton type="button" onClick={handlePreview}>
                PREVIEW
              </OutlineButton>
              <PrimaryButton type="button" onClick={handlePreview}>
                SAVE DRAFT / CONTINUE
              </PrimaryButton>
            </Actions>
          </Footer>
        </FormBody>
      </ModalPage>
    </ModalOverlay>
  );
};

export default GenerateQuotationModal;
