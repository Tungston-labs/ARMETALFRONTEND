import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronDown, FiPlus, FiX, FiLock } from "react-icons/fi";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import { createQuotation } from "../../../../../Redux/quotationThunks";

import {
  getCustomers,
  selectCustomers,
} from "../../../../../Redux/finance/Sales/CustomerSlice";

import {
  getProducts,
  selectProducts,
} from "../../../../../Redux/finance/Product/ProductSlice";

// Adjust this import path to your actual companySlice location.
import { getCompanySelf } from "../../../../../Redux/companySlice";

import {
  PageWrapper,
  FormBody,
  SectionTitle,
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

// Where to go after a successful save.
const QUOTATIONS_LIST_PATH = "/sales/quotations";

const todayLocal = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(now.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
};

const makeItem = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  productId: "",
  service: "",
  description: "",
  quantity: "1",
  hsCode: "",
  rate: "",
  vatRate: "",
});

const STATUS_API = {
  Draft: "draft",
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
};

const money = (value) =>
  `SAR ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getErrorMessage = (err) => {
  if (!err) return "";

  if (typeof err === "string") return err;

  if (err.detail || err.message) {
    return err.detail || err.message;
  }

  if (typeof err === "object") {
    const errorText = Object.values(err)
      .flat()
      .filter((value) => typeof value === "string")
      .join(" ");

    if (errorText) return errorText;
  }

  return "Something went wrong saving this quotation.";
};

// Customer field readers
const customerName = (customer) =>
  customer?.name ||
  customer?.customer_name ||
  customer?.company_name ||
  `Customer #${customer?.id}`;

const customerAddress = (customer) =>
  customer?.address ||
  customer?.billing_address ||
  customer?.customer_address ||
  "";

const customerPhone = (customer) =>
  customer?.phno ||
  customer?.phone ||
  customer?.phone_number ||
  customer?.mobile ||
  customer?.contact_number ||
  "";

const customerEmail = (customer) =>
  customer?.financial_email ||
  customer?.finance_email ||
  customer?.finance_contact_email ||
  customer?.email ||
  "";

// Product field readers
const productName = (product) =>
  product?.name ||
  product?.product_name ||
  product?.title ||
  `Product #${product?.id}`;

const productDescription = (product) =>
  product?.description || "";

const productHsCode = (product) =>
  product?.hs_code ||
  product?.hsn_code ||
  product?.hsn ||
  "";

const productRate = (product) =>
  product?.selling_price ??
  product?.sale_price ??
  product?.unit_price ??
  product?.price ??
  product?.rate ??
  "";

const productVat = (product) =>
  product?.vat_rate ??
  product?.vat ??
  product?.tax_rate ??
  product?.gst ??
  "";

const AddQuotation = ({ onCancel, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const today = todayLocal();

  // Redux data
  const customers = useSelector(selectCustomers);
  const products = useSelector(selectProducts);

  // Company details from company-self API
  const company = useSelector((state) => state.company.company);

  const handleCancel =
    onCancel || onClose || (() => navigate(-1));

  const [quotationDate, setQuotationDate] = useState(today);
  const [dueDate, setDueDate] = useState(today);
  const [paymentStatus, setPaymentStatus] = useState("Draft");

  // FROM details will be populated from company-self API
  const [from, setFrom] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [billTo, setBillTo] = useState({
    customerId: "",
    client: "",
    address: "",
    phno: "",
    financial_email: "",
  });

  const [items, setItems] = useState([
    makeItem(),
    makeItem(),
  ]);

  const [discount, setDiscount] = useState("0");

  const [notes, setNotes] = useState(
    "Above information is not an invoice and only an estimate of services.\nPLEASE CONFIRM YOUR ACCEPTANCE OF THIS QUOTE"
  );

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load company, customer and product data
  useEffect(() => {
    dispatch(getCompanySelf());
    dispatch(getCustomers({ page_size: 1000 }));
    dispatch(getProducts({ page_size: 1000 }));
  }, [dispatch]);

  // Populate FROM details when company API returns
  useEffect(() => {
    if (company) {
      setFrom({
        name: company.name || "",
        address: company.address || "",
        phone: company.contact_number || "",
        email: company.email || "",
      });
    }
  }, [company]);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum +
        (Number(item.quantity) || 0) *
          (Number(item.rate) || 0),
      0
    );

    const vat = items.reduce((sum, item) => {
      const amount =
        (Number(item.quantity) || 0) *
        (Number(item.rate) || 0);

      return (
        sum +
        (amount * (Number(item.vatRate) || 0)) / 100
      );
    }, 0);

    const discountValue = Math.max(
      0,
      Number(discount) || 0
    );

    const total = Math.max(
      0,
      subtotal + vat - discountValue
    );

    return {
      subtotal,
      vat,
      discount: discountValue,
      total,
    };
  }, [items, discount]);

  // Update quotation item
  const updateItem = (id, field, value) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  // Add new item
  const addItem = () => {
    setItems((current) => [
      ...current,
      makeItem(),
    ]);
  };

  // Remove item
  const removeItem = (id) => {
    setItems((current) =>
      current.length === 1
        ? current
        : current.filter((item) => item.id !== id)
    );
  };

  // Selecting a customer fills BILL TO details
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;

    const selected = customers.find(
      (customer) =>
        String(customer.id) === String(customerId)
    );

    setBillTo({
      customerId: selected?.id ?? "",
      client: selected ? customerName(selected) : "",
      address: selected ? customerAddress(selected) : "",
      phno: selected ? customerPhone(selected) : "",
      financial_email: selected
        ? customerEmail(selected)
        : "",
    });
  };

  // Selecting a product fills the item row
  const handleProductChange = (itemId, productId) => {
    const selected = products.find(
      (product) =>
        String(product.id) === String(productId)
    );

    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;

        if (!selected) {
          return {
            ...item,
            productId: "",
            service: "",
            description: "",
            hsCode: "",
            rate: "",
          };
        }

        const vat = productVat(selected);
        const rate = productRate(selected);

        return {
          ...item,
          productId: selected.id,
          service: productName(selected),
          description: productDescription(selected),
          hsCode: productHsCode(selected),
          rate: rate === "" ? "" : String(rate),
          vatRate:
            vat === "" ? item.vatRate : String(vat),
        };
      })
    );
  };

  // Validate quotation form
  const validate = () => {
    const validItems = items.filter(
      (item) =>
        item.service.trim() ||
        item.description.trim() ||
        (
          Number(item.quantity) > 0 &&
          Number(item.rate) >= 0 &&
          item.rate !== ""
        )
    );

    if (!billTo.customerId) {
      setError("Please select a customer.");
      return null;
    }

    if (!validItems.length) {
      setError("Please add at least one quotation item.");
      return null;
    }

    if (
      !quotationDate ||
      !dueDate ||
      dueDate < quotationDate
    ) {
      setError(
        "Please select a valid quotation date and valid-till date."
      );
      return null;
    }

    setError("");
    return validItems;
  };

  // Build API payload
  const buildPayload = (validItems, status) => ({
    customer: billTo.customerId,

    issue_date: quotationDate,
    valid_till: dueDate,

    status:
      STATUS_API[status] ||
      String(status).toLowerCase(),

    // Company details from company-self API
    from_company_name: from.name,
    from_address: from.address,
    from_phone_number: from.phone,
    from_email: from.email,

    // Customer details
    bill_to_name: billTo.client,
    bill_to_address: billTo.address,
    bill_to_phone: billTo.phno,
    finance_contact_email: billTo.financial_email,

    discount: totals.discount,
    round_off: 0,
    notes,

    items: validItems.map((item) => ({
      ...(item.productId
        ? { product: item.productId }
        : {}),

      service_name:
        item.service || item.description,

      description:
        item.description || item.service,

      quantity: Number(item.quantity) || 1,
      hs_code: item.hsCode || "",
      rate: Number(item.rate) || 0,
      vat_percentage: Number(item.vatRate) || 0,
    })),
  });

  // Save quotation
  const saveQuotation = async (status) => {
    if (isSaving) return;

    const validItems = validate();

    if (!validItems) return;

    setIsSaving(true);

    try {
      await dispatch(
        createQuotation(
          buildPayload(validItems, status)
        )
      ).unwrap();

      navigate(QUOTATIONS_LIST_PATH);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = () =>
    saveQuotation("Draft");

  const handleSend = () =>
    saveQuotation("Pending");

  // Download quotation as CSV
  const handleDownload = () => {
    const validItems = validate();

    if (!validItems) return;

    const rows = [
      ["Quotation Number", "Auto-generated on save"],
      ["Quotation Date", quotationDate],
      ["Valid Till", dueDate],
      ["From", from.name],
      ["Bill To", billTo.client],
      [],
      [
        "SL No",
        "Product",
        "Description",
        "Qty",
        "HS Code",
        "Rate",
        "VAT %",
        "VAT",
        "Amount",
      ],
      ...validItems.map((item, index) => {
        const amount =
          (Number(item.quantity) || 0) *
          (Number(item.rate) || 0);

        const vatAmount =
          (amount * (Number(item.vatRate) || 0)) / 100;

        return [
          index + 1,
          item.service,
          item.description,
          item.quantity,
          item.hsCode,
          item.rate,
          item.vatRate,
          vatAmount.toFixed(2),
          amount.toFixed(2),
        ];
      }),
      [],
      ["Sub Total", totals.subtotal.toFixed(2)],
      ["Total VAT", totals.vat.toFixed(2)],
      ["Discount", totals.discount.toFixed(2)],
      ["Total Amount", totals.total.toFixed(2)],
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotation.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <PageWrapper>
      <ReusableHeader
        title="Generate New Quotation"
        breadcrumbs={["Sales", "Quotations"]}
        showBack
        onBack={handleCancel}
      />

      <FormBody>
        <FormGrid>
          {/* QUOTATION NUMBER */}
          <FormGroup>
            <Label>QUOTATION NUMBER</Label>

            <Input
              placeholder="Auto-generated"
              value=""
              readOnly
              style={{
                background: "#f5f5f5",
                cursor: "not-allowed",
              }}
            />
          </FormGroup>

          {/* QUOTATION DATE */}
          <FormGroup>
            <Label>QUOTATION DATE</Label>

            <Input
              type="date"
              value={quotationDate}
              onChange={(e) =>
                setQuotationDate(e.target.value)
              }
            />
          </FormGroup>

          {/* VALID TILL */}
          <FormGroup>
            <Label>
              VALID TILL <Required>*</Required>
            </Label>

            <Input
              type="date"
              min={quotationDate}
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
            />
          </FormGroup>

          {/* STATUS */}
          <FormGroup>
            <Label>STATUS</Label>

            <SelectWrap>
              <Select
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value)
                }
              >
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Select>

              <FiChevronDown />
            </SelectWrap>
          </FormGroup>

          {/* FROM - COMPANY DETAILS */}
          <FormGroup>
            <Label>FROM</Label>

            <Input
              placeholder="Company Name"
              value={from.name}
              onChange={(e) =>
                setFrom({
                  ...from,
                  name: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              placeholder="Company Address"
              value={from.address}
              onChange={(e) =>
                setFrom({
                  ...from,
                  address: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              placeholder="Company Phone Number"
              value={from.phone}
              onChange={(e) =>
                setFrom({
                  ...from,
                  phone: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>EMAIL ID</Label>

            <Input
              type="email"
              placeholder="Company Email"
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
            <Label>
              BILL TO <Required>*</Required>
            </Label>

            <SelectWrap>
              <Select
                value={billTo.customerId}
                onChange={handleCustomerChange}
              >
                <option value="">Select Customer</option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customerName(customer)}
                  </option>
                ))}
              </Select>

              <FiChevronDown />
            </SelectWrap>
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              value={billTo.address}
              onChange={(e) =>
                setBillTo({
                  ...billTo,
                  address: e.target.value,
                })
              }
              placeholder="Company/Client ADDRESS"
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              value={billTo.phno || ""}
              onChange={(e) =>
                setBillTo({
                  ...billTo,
                  phno: e.target.value,
                })
              }
              placeholder="Company/Client Phone Number"
            />
          </FormGroup>

          <FormGroup>
            <Label>FINANCE CONTACT EMAIL</Label>

            <Input
              type="email"
              value={billTo.financial_email || ""}
              onChange={(e) =>
                setBillTo({
                  ...billTo,
                  financial_email: e.target.value,
                })
              }
              placeholder="Company/Client Email ID"
            />
          </FormGroup>
        </FormGrid>

        {/* QUOTATION ITEMS */}
        <ItemsHeader>
          <SectionTitle>QUOTATION ITEMS</SectionTitle>

          <AddItemButton
            type="button"
            onClick={addItem}
          >
            <FiPlus />
            ADD ITEM
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
                  (Number(item.quantity) || 0) *
                  (Number(item.rate) || 0);

                const vatAmount =
                  (amount *
                    (Number(item.vatRate) || 0)) /
                  100;

                return (
                  <tr key={item.id}>
                    <td>
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td>
                      <select
                        aria-label="Product"
                        value={item.productId}
                        onChange={(e) =>
                          handleProductChange(
                            item.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select product
                        </option>

                        {products.map((product) => (
                          <option
                            key={product.id}
                            value={product.id}
                          >
                            {productName(product)}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <input
                        aria-label="Description"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        aria-label="Quantity"
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        aria-label="HS Code"
                        value={item.hsCode}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "hsCode",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        aria-label="Rate"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="SAR"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "rate",
                            e.target.value
                          )
                        }
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
                          updateItem(
                            item.id,
                            "vatRate",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td className="calculated">
                      {money(vatAmount)}
                    </td>

                    <td className="calculated">
                      {money(amount)}
                    </td>

                    <td>
                      <DeleteButton
                        type="button"
                        aria-label="Remove item"
                        onClick={() =>
                          removeItem(item.id)
                        }
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

        {/* NOTES AND SUMMARY */}
        <BottomSection>
          <NotesBlock>
            <SectionTitle>NOTES</SectionTitle>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />
          </NotesBlock>

          <Summary>
            <SummaryRow>
              <span>Sub Total</span>
              <strong>{money(totals.subtotal)}</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Total VAT</span>
              <strong>{money(totals.vat)}</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Discount (SAR)</span>

              <DiscountInput
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) =>
                  setDiscount(e.target.value)
                }
              />
            </SummaryRow>

            <SummaryRow>
              <span>Round Off</span>
              <strong>{money(0)}</strong>
            </SummaryRow>

            <TotalBar>
              <span>TOTAL AMOUNT</span>
              <strong>{money(totals.total)}</strong>
            </TotalBar>
          </Summary>
        </BottomSection>

        {/* ERROR */}
        {error && (
          <ErrorMessage role="alert">
            {error}
          </ErrorMessage>
        )}

        {/* FOOTER */}
        <Footer>
          <LockNote>
            <FiLock />
            Sent is locked until an admin approves this quote
          </LockNote>

          <Actions>
            <OutlineButton
              type="button"
              onClick={handleCancel}
            >
              CANCEL
            </OutlineButton>

            <OutlineButton
              type="button"
              onClick={handleDownload}
            >
              DOWNLOAD
            </OutlineButton>

            <OutlineButton
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? "SAVING..." : "SAVE AS DRAFT"}
            </OutlineButton>

            <PrimaryButton
              type="button"
              onClick={handleSend}
              disabled={isSaving}
            >
              SEND
            </PrimaryButton>
          </Actions>
        </Footer>
      </FormBody>
    </PageWrapper>
  );
};

export default AddQuotation;