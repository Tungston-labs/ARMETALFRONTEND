import React, { useMemo, useState } from "react";

import { FiChevronDown, FiX } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import {
  CreateBillContainer,
  BillHeader,
  Breadcrumbs,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  SelectIcon,
  ItemsTitle,
  ItemsTable,
  TableHeader,
  TableRow,
  TableCell,
  SmallInput,
  RemoveButton,
  SummaryWrapper,
  SummaryRow,
  TotalAmount,
  ButtonWrapper,
  CancelButton,
  PreviewButton,
} from "./CreateBill.style";

const CreateBill = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([
    {
      id: 1,
      product: "product 1",
      particular: "Product description",
      qty: 1,
      hsCode: "25366",
      rate: 1970,
      vat: 15,
    },
    {
      id: 2,
      product: "product 2",
      particular: "Product description",
      qty: 1,
      hsCode: "25366",
      rate: 1970,
      vat: 15,
    },
  ]);

  const [form, setForm] = useState({
    billNumber: "SR 0123",
    purchaseOrderReference: "INV 0123 - Chicking",
    billDate: "2026-04-17",
    dueDate: "Damaged Goods",
    vendor: "",
    paymentTerms: "NET 10",
    billStatus: "Unpaid",
    note: "",
    from: "TUNGSTON LABS",
    fromAddress: "Tungston Labs, Ullampilly Building,...",
    phoneNumber: "+91 97783 77526",
    email: "info@tungstonlabs.com",
    billTo: "",
    billToAddress: "",
    billToPhone: "",
    financeEmail: "",
  });

  const handleChange = (field, value) => {
    setForm((previous) => ({
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

  const handleRemoveItem = (id) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const calculations = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.rate || 0) * Number(item.qty || 0),
      0,
    );

    const vat = items.reduce(
      (sum, item) =>
        sum +
        (Number(item.rate || 0) *
          Number(item.qty || 0) *
          Number(item.vat || 0)) /
          100,
      0,
    );

    const discount = 19.69;

    const roundOff = 1411.15;

    return {
      subtotal,
      vat,
      discount,
      roundOff,
      total: roundOff,
    };
  }, [items]);

  return (
    <CreateBillContainer>
      <BillHeader>
        <h1>Create BILL</h1>

        <Breadcrumbs>
          <span>⌂ Dashboard</span>
          <span>›</span>
          <span>Purchases</span>
          <span>›</span>
          <strong>Bill</strong>
        </Breadcrumbs>
      </BillHeader>

      <FormGrid>
        <FormGroup>
          <Label>BILL NUMBER</Label>

          <Input
            value={form.billNumber}
            onChange={(event) => handleChange("billNumber", event.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>PURCHASE ORDER REFERENCE</Label>

          <Input
            value={form.purchaseOrderReference}
            onChange={(event) =>
              handleChange("purchaseOrderReference", event.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>BILL DATE</Label>

          <Input
            type="date"
            value={form.billDate}
            onChange={(event) => handleChange("billDate", event.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>DUE DATE</Label>

          <SelectWrapper>
            <Select
              value={form.dueDate}
              onChange={(event) => handleChange("dueDate", event.target.value)}
            >
              <option>Damaged Goods</option>

              <option>NET 10</option>

              <option>NET 15</option>

              <option>NET 30</option>
            </Select>

            <SelectIcon>
              <FiChevronDown />
            </SelectIcon>
          </SelectWrapper>
        </FormGroup>

        <FormGroup>
          <Label>VENDOR</Label>

          <SelectWrapper>
            <Select
              value={form.vendor}
              onChange={(event) => handleChange("vendor", event.target.value)}
            >
              <option value="">Select Vendor</option>

              <option value="mediora">Mediora</option>

              <option value="chicking">Chicking</option>

              <option value="nexora">Nexora Tech</option>
            </Select>

            <SelectIcon>
              <FiChevronDown />
            </SelectIcon>
          </SelectWrapper>
        </FormGroup>

        <FormGroup>
          <Label>PAYMENT TERMS</Label>

          <SelectWrapper>
            <Select
              value={form.paymentTerms}
              onChange={(event) =>
                handleChange("paymentTerms", event.target.value)
              }
            >
              <option>NET 10</option>

              <option>NET 15</option>

              <option>NET 30</option>
            </Select>

            <SelectIcon>
              <FiChevronDown />
            </SelectIcon>
          </SelectWrapper>
        </FormGroup>

        <FormGroup>
          <Label>BILL STATUS</Label>

          <SelectWrapper>
            <Select
              value={form.billStatus}
              onChange={(event) =>
                handleChange("billStatus", event.target.value)
              }
            >
              <option>Unpaid</option>

              <option>Partially Paid</option>

              <option>Fully Paid</option>
            </Select>

            <SelectIcon>
              <FiChevronDown />
            </SelectIcon>
          </SelectWrapper>
        </FormGroup>

        <FormGroup>
          <Label>NOTE</Label>

          <Input
            placeholder="Enter Note"
            value={form.note}
            onChange={(event) => handleChange("note", event.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>FROM</Label>

          <Input
            value={form.from}
            onChange={(event) => handleChange("from", event.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>ADDRESS</Label>

          <Input
            value={form.fromAddress}
            onChange={(event) =>
              handleChange("fromAddress", event.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>PHONE NUMBER</Label>

          <Input
            value={form.phoneNumber}
            onChange={(event) =>
              handleChange("phoneNumber", event.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>EMAIL ID</Label>

          <Input
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>BILL TO</Label>

          <SelectWrapper>
            <Select
              value={form.billTo}
              onChange={(event) => handleChange("billTo", event.target.value)}
            >
              <option value="">Company/Client Name</option>

              <option>Mediora</option>

              <option>Chicking</option>
            </Select>

            <SelectIcon>
              <FiChevronDown />
            </SelectIcon>
          </SelectWrapper>
        </FormGroup>

        <FormGroup>
          <Label>ADDRESS</Label>

          <Input
            placeholder="Company/Client ADDRESS"
            value={form.billToAddress}
            onChange={(event) =>
              handleChange("billToAddress", event.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>PHONE NUMBER</Label>

          <Input
            placeholder="Company/Client Phone Number"
            value={form.billToPhone}
            onChange={(event) =>
              handleChange("billToPhone", event.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>FINANCE CONTACT EMAIL</Label>

          <Input
            placeholder="Company/Client Email ID"
            value={form.financeEmail}
            onChange={(event) =>
              handleChange("financeEmail", event.target.value)
            }
          />
        </FormGroup>
      </FormGrid>

      <ItemsTitle>ITEMS</ItemsTitle>

      <ItemsTable>
        <TableHeader>
          <span>SL No</span>
          <span>Products</span>
          <span>Particular</span>
          <span>QTY</span>
          <span>HS Code</span>
          <span>Rate</span>
          <span>VAT (%)</span>
          <span>VAT (SAR)</span>
          <span>Amount</span>
          <span>Action</span>
        </TableHeader>

        {items.map((item, index) => {
          const amount = Number(item.rate || 0) * Number(item.qty || 0);

          const vatAmount = (amount * Number(item.vat || 0)) / 100;

          return (
            <TableRow key={item.id}>
              <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>

              <TableCell>
                <SmallInput
                  value={item.product}
                  onChange={(event) =>
                    handleItemChange(item.id, "product", event.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <SmallInput
                  value={item.particular}
                  onChange={(event) =>
                    handleItemChange(item.id, "particular", event.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <SmallInput
                  value={item.qty}
                  onChange={(event) =>
                    handleItemChange(item.id, "qty", event.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <SmallInput
                  value={item.hsCode}
                  onChange={(event) =>
                    handleItemChange(item.id, "hsCode", event.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <SmallInput
                  value={item.rate}
                  onChange={(event) =>
                    handleItemChange(item.id, "rate", event.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <SmallInput
                  value={item.vat}
                  onChange={(event) =>
                    handleItemChange(item.id, "vat", event.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                SAR{" "}
                {vatAmount.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </TableCell>

              <TableCell>
                <strong>
                  SAR{" "}
                  {amount.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </TableCell>

              <TableCell>
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <FiX />
                </RemoveButton>
              </TableCell>
            </TableRow>
          );
        })}
      </ItemsTable>

      <SummaryWrapper>
        <SummaryRow>
          <span>Sub Total</span>

          <strong>
            SAR{" "}
            {calculations.subtotal.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </strong>
        </SummaryRow>

        <SummaryRow>
          <span>Total VAT (15%)</span>

          <strong>
            SAR{" "}
            {calculations.vat.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </strong>
        </SummaryRow>

        <SummaryRow>
          <span>Discount</span>

          <strong className="discount">
            -SAR{" "}
            {calculations.discount.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </strong>
        </SummaryRow>

        <SummaryRow>
          <span>Round Off</span>

          <strong>
            SAR{" "}
            {calculations.roundOff.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </strong>
        </SummaryRow>

        <TotalAmount>
          <span>TOTAL AMOUNT</span>

          <strong>
            SAR{" "}
            {calculations.total.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </strong>
        </TotalAmount>
      </SummaryWrapper>

      <ButtonWrapper>
        <CancelButton type="button" onClick={() => navigate("/purchases/bill")}>
          CANCEL
        </CancelButton>

        <PreviewButton type="button">PREVIEW</PreviewButton>
      </ButtonWrapper>
    </CreateBillContainer>
  );
};

export default CreateBill;
