import React, { useMemo, useState } from "react";
import { FiPlus, FiX, FiCalendar, FiChevronDown } from "react-icons/fi";

import {
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGrid,
  FieldWrapper,
  FieldLabel,
  InputWrapper,
  StyledInput,
  StyledSelect,
  SelectIcon,
  ItemsHeader,
  ItemsTitle,
  AddItemButton,
  TableWrapper,
  ItemsTable,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  ItemInput,
  QuantityInput,
  DeleteButton,
  EmptyCell,
  BottomArea,
  NotesSection,
  NotesLabel,
  NotesTextarea,
  SummarySection,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  DiscountValue,
  TotalBox,
  TotalLabel,
  TotalValue,
  FooterActions,
  CancelButton,
  PreviewButton,
} from "./GenerateQuotationModal.styles";

const createItem = () => ({
  id: `${Date.now()}-${Math.random()}`,
  service: "",
  description: "",
  quantity: "",
  hsCode: "",
  rate: "",
  vatRate: "15",
});

const GenerateQuotationModal = ({
  isOpen,
  onClose,
  onPreview,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState({
    quotationNumber: "INV001",
    quotationDate: "2026-04-17",
    dueDate: "2026-04-17",
    paymentStatus: "",
    from: "TUNGSTON LABS",
    companyAddress: "Tungston Labs, Ullampilly Building,...",
    phoneNumber: "+91 97783 77526",
    email: "info@tungstonlabs.com",
    billTo: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",
  });

  const [items, setItems] = useState([
    {
      id: "1",
      service: "App Design",
      description: "Wireframe Of 15 Pages",
      quantity: "1",
      hsCode: "56322",
      rate: "1970",
      vatRate: "15",
    },
    createItem(),
  ]);

  const [discount, setDiscount] = useState("19.69");

  const [notes, setNotes] = useState(
    "Above information is not an invoice and only an estimate of services\nPLEASE CONFIRM YOUR ACCEPTANCE OF THIS QUOTE",
  );

  const handleFormChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleItemChange = (id, field, value) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const handleAddItem = () => {
    setItems((previous) => [...previous, createItem()]);
  };

  const handleRemoveItem = (id) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const calculateItem = (item) => {
    const quantity = Number(item.quantity) || 0;

    const rate = Number(String(item.rate).replace(/[^0-9.-]/g, "")) || 0;

    const vatRate = Number(String(item.vatRate).replace(/[^0-9.-]/g, "")) || 0;

    const amount = quantity * rate;

    const vatAmount = (amount * vatRate) / 100;

    return {
      amount,
      vatAmount,
    };
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let vat = 0;

    items.forEach((item) => {
      const result = calculateItem(item);

      subtotal += result.amount;
      vat += result.vatAmount;
    });

    const discountAmount = Number(discount) || 0;

    const total = subtotal + vat - discountAmount;

    return {
      subtotal,
      vat,
      discount: discountAmount,
      total,
    };
  }, [items, discount]);

  const formatCurrency = (value) => {
    return `SAR ${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getAmount = (item) => {
    const { amount } = calculateItem(item);

    return amount ? formatCurrency(amount) : "";
  };

  const getVatAmount = (item) => {
    const { vatAmount } = calculateItem(item);

    return vatAmount ? formatCurrency(vatAmount) : "";
  };

  const handlePreview = () => {
    const quotationData = {
      ...formData,
      items,
      discount,
      notes,
      totals,
    };

    if (onPreview) {
      onPreview(quotationData);
      return;
    }

    console.log("Quotation Data:", quotationData);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Generate New Quotation</ModalTitle>

          <CloseButton
            type="button"
            onClick={onClose}
            aria-label="Close quotation modal"
          >
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGrid>
            {/* Quotation Number */}
            <FieldWrapper>
              <FieldLabel>QUOTATION NUMBER</FieldLabel>

              <InputWrapper>
                <StyledInput
                  value={formData.quotationNumber}
                  onChange={(event) =>
                    handleFormChange("quotationNumber", event.target.value)
                  }
                />
              </InputWrapper>
            </FieldWrapper>

            {/* Quotation Date */}
            <FieldWrapper>
              <FieldLabel>QUOTATION DATE</FieldLabel>

              <InputWrapper>
                <StyledInput
                  type="date"
                  value={formData.quotationDate}
                  onChange={(event) =>
                    handleFormChange("quotationDate", event.target.value)
                  }
                />

                <SelectIcon>
                  <FiCalendar />
                </SelectIcon>
              </InputWrapper>
            </FieldWrapper>

            {/* Due Date */}
            <FieldWrapper>
              <FieldLabel>DUE DATE</FieldLabel>

              <InputWrapper>
                <StyledInput
                  type="date"
                  value={formData.dueDate}
                  onChange={(event) =>
                    handleFormChange("dueDate", event.target.value)
                  }
                />

                <SelectIcon>
                  <FiCalendar />
                </SelectIcon>
              </InputWrapper>
            </FieldWrapper>

            {/* Payment Status */}
            <FieldWrapper>
              <FieldLabel>PAYMENT STATUS</FieldLabel>

              <InputWrapper>
                <StyledSelect
                  value={formData.paymentStatus}
                  onChange={(event) =>
                    handleFormChange("paymentStatus", event.target.value)
                  }
                >
                  <option value="">Select Payment Status</option>

                  <option value="pending">Pending</option>

                  <option value="paid">Paid</option>

                  <option value="partially_paid">Partially Paid</option>

                  <option value="overdue">Overdue</option>
                </StyledSelect>

                <SelectIcon>
                  <FiChevronDown />
                </SelectIcon>
              </InputWrapper>
            </FieldWrapper>

            {/* From */}
            <FieldWrapper>
              <FieldLabel>FROM</FieldLabel>

              <StyledInput
                value={formData.from}
                onChange={(event) =>
                  handleFormChange("from", event.target.value)
                }
              />
            </FieldWrapper>

            {/* Company Address */}
            <FieldWrapper>
              <FieldLabel>ADDRESS</FieldLabel>

              <StyledInput
                value={formData.companyAddress}
                onChange={(event) =>
                  handleFormChange("companyAddress", event.target.value)
                }
              />
            </FieldWrapper>

            {/* Phone */}
            <FieldWrapper>
              <FieldLabel>PHONE NUMBER</FieldLabel>

              <StyledInput
                value={formData.phoneNumber}
                onChange={(event) =>
                  handleFormChange("phoneNumber", event.target.value)
                }
              />
            </FieldWrapper>

            {/* Email */}
            <FieldWrapper>
              <FieldLabel>EMAIL ID</FieldLabel>

              <StyledInput
                value={formData.email}
                onChange={(event) =>
                  handleFormChange("email", event.target.value)
                }
              />
            </FieldWrapper>

            {/* Bill To */}
            <FieldWrapper>
              <FieldLabel>BILL TO</FieldLabel>

              <InputWrapper>
                <StyledSelect
                  value={formData.billTo}
                  onChange={(event) =>
                    handleFormChange("billTo", event.target.value)
                  }
                >
                  <option value="">Company/Client Name</option>

                  <option value="client_1">ABC Company</option>

                  <option value="client_2">XYZ Company</option>
                </StyledSelect>

                <SelectIcon>
                  <FiChevronDown />
                </SelectIcon>
              </InputWrapper>
            </FieldWrapper>

            {/* Client Address */}
            <FieldWrapper>
              <FieldLabel>ADDRESS</FieldLabel>

              <StyledInput
                value={formData.clientAddress}
                placeholder="Company/Client Address"
                onChange={(event) =>
                  handleFormChange("clientAddress", event.target.value)
                }
              />
            </FieldWrapper>

            {/* Client Phone */}
            <FieldWrapper>
              <FieldLabel>PHONE NUMBER</FieldLabel>

              <StyledInput
                value={formData.clientPhone}
                placeholder="Company/Client Phone Number"
                onChange={(event) =>
                  handleFormChange("clientPhone", event.target.value)
                }
              />
            </FieldWrapper>

            {/* Finance Email */}
            <FieldWrapper>
              <FieldLabel>FINANCE CONTACT EMAIL</FieldLabel>

              <InputWrapper>
                <StyledSelect
                  value={formData.clientEmail}
                  onChange={(event) =>
                    handleFormChange("clientEmail", event.target.value)
                  }
                >
                  <option value="">Company/Client Email ID</option>

                  <option value="finance@client.com">finance@client.com</option>

                  <option value="accounts@client.com">
                    accounts@client.com
                  </option>
                </StyledSelect>

                <SelectIcon>
                  <FiChevronDown />
                </SelectIcon>
              </InputWrapper>
            </FieldWrapper>
          </FormGrid>

          {/* Items */}
          <ItemsHeader>
            <ItemsTitle>QUOTATION ITEMS</ItemsTitle>

            <AddItemButton type="button" onClick={handleAddItem}>
              <FiPlus />
              ADD ITEM
            </AddItemButton>
          </ItemsHeader>

          <TableWrapper>
            <ItemsTable>
              <TableHead>
                <TableRow>
                  <TableHeader>SL NO</TableHeader>

                  <TableHeader>SERVICE</TableHeader>

                  <TableHeader>DESCRIPTION</TableHeader>

                  <TableHeader>QTY</TableHeader>

                  <TableHeader>HS CODE</TableHeader>

                  <TableHeader>RATE</TableHeader>

                  <TableHeader>VAT (%)</TableHeader>

                  <TableHeader>VAT (SAR)</TableHeader>

                  <TableHeader>AMOUNT</TableHeader>

                  <TableHeader>ACTION</TableHeader>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>

                    <TableCell>
                      <ItemInput
                        value={item.service}
                        onChange={(event) =>
                          handleItemChange(
                            item.id,
                            "service",
                            event.target.value,
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <ItemInput
                        value={item.description}
                        onChange={(event) =>
                          handleItemChange(
                            item.id,
                            "description",
                            event.target.value,
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <QuantityInput
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            event.target.value,
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <ItemInput
                        value={item.hsCode}
                        onChange={(event) =>
                          handleItemChange(
                            item.id,
                            "hsCode",
                            event.target.value,
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <ItemInput
                        value={item.rate}
                        onChange={(event) =>
                          handleItemChange(item.id, "rate", event.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <ItemInput
                        value={item.vatRate}
                        onChange={(event) =>
                          handleItemChange(
                            item.id,
                            "vatRate",
                            event.target.value,
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <ItemInput value={getVatAmount(item)} readOnly />
                    </TableCell>

                    <TableCell>
                      <ItemInput value={getAmount(item)} readOnly />
                    </TableCell>

                    <TableCell>
                      <DeleteButton
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Remove item"
                      >
                        <FiX />
                      </DeleteButton>
                    </TableCell>
                  </TableRow>
                ))}

                {items.length === 0 && (
                  <TableRow>
                    <EmptyCell colSpan="10">
                      No quotation items added.
                    </EmptyCell>
                  </TableRow>
                )}
              </TableBody>
            </ItemsTable>
          </TableWrapper>

          {/* Bottom */}
          <BottomArea>
            {/* Notes */}
            <NotesSection>
              <NotesLabel>NOTES</NotesLabel>

              <NotesTextarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Enter quotation notes..."
              />
            </NotesSection>

            {/* Summary */}
            <SummarySection>
              <SummaryRow>
                <SummaryLabel>Sub Total</SummaryLabel>

                <SummaryValue>{formatCurrency(totals.subtotal)}</SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>Total GST (₹)</SummaryLabel>

                <SummaryValue>{formatCurrency(totals.vat)}</SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>Discount</SummaryLabel>

                <DiscountValue>
                  -{formatCurrency(totals.discount)}
                </DiscountValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>Round Off</SummaryLabel>

                <SummaryValue>{formatCurrency(0)}</SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>Discount Amount</SummaryLabel>

                <InputWrapper>
                  <StyledInput
                    type="number"
                    value={discount}
                    onChange={(event) => setDiscount(event.target.value)}
                  />
                </InputWrapper>
              </SummaryRow>

              <TotalBox>
                <TotalLabel>TOTAL AMOUNT</TotalLabel>

                <TotalValue>{formatCurrency(totals.total)}</TotalValue>
              </TotalBox>
            </SummarySection>
          </BottomArea>

          {/* Footer */}
          <FooterActions>
            <CancelButton type="button" onClick={onClose}>
              CANCEL
            </CancelButton>

            <PreviewButton
              type="button"
              onClick={handlePreview}
              disabled={isSaving}
            >
              {isSaving ? "SAVING..." : "PREVIEW"}
            </PreviewButton>
          </FooterActions>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default GenerateQuotationModal;
