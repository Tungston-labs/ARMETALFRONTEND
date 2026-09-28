import React, { useEffect, useMemo, useState } from "react";

import { FiChevronDown, FiX } from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";

import {
  InvoiceContainer as ReturnContainer,
  InvoiceForm as ReturnForm,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  CalendarInput,
  InvoiceItemsHeader as ReturnItemsHeader,
  InvoiceTableWrapper as ReturnTableWrapper,
  InvoiceTable as ReturnTable,
  DeleteButton,
  PaymentSection,
  PaymentLeft,
  PaymentRight,
  SummaryRow,
  TotalAmount,
  ButtonWrapper,
  CancelButton,
  PreviewButton,
} from "./CreateSalesReturnAction.style";

import {
  getSalesReturnById,
  addSalesReturn,
  editSalesReturn,
  getInvoices,
  getInvoiceById,
  clearSelectedSalesReturn,
  clearSelectedInvoice,
  selectSelectedSalesReturn,
  selectSalesReturnDetailLoading,
  selectSalesReturnCreateLoading,
  selectSalesReturnUpdateLoading,
  selectSalesReturnError,
  selectInvoices,
  selectSelectedInvoice,
  selectSalesReturnInvoiceLoading,
} from "../../../../../Redux/finance/Sales/Salesreturnslice";

import {
  getCustomers,
  selectCustomers,
} from "../../../../../Redux/finance/Sales/CustomerSlice";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

const createDefaultItem = (index = 0) => ({
  id: Date.now() + Math.random(),

  productId: "",

  product: "",

  slNo: String(index + 1).padStart(2, "0"),

  invoicedQty: "",

  alreadyReturned: "0",

  returningNow: "0",

  condition: "",

  unitPrice: "0",

  returnValue: "0",
});

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getInvoiceCustomerId = (invoice) =>
  invoice?.customer_id ?? invoice?.customer?.id ?? invoice?.customer ?? "";

const getInvoiceCustomerName = (invoice) =>
  invoice?.customer_name ??
  invoice?.customer?.name ??
  invoice?.customer?.customer_name ??
  "";

const getProductId = (item) =>
  item?.product_id ?? item?.product?.id ?? item?.product?.product_id ?? "";

const getProductName = (item) =>
  item?.product_name ??
  item?.product?.name ??
  item?.product?.product_name ??
  item?.product ??
  "";

const getProductQuantity = (item) =>
  item?.quantity ?? item?.invoiced_qty ?? item?.invoice_quantity ?? 0;

const getProductPrice = (item) =>
  item?.unit_price ?? item?.rate ?? item?.price ?? 0;

/* -------------------------------------------------------
   Map API Sales Return
------------------------------------------------------- */

const mapReturnToForm = (salesReturn) => {
  if (!salesReturn) {
    return null;
  }

  const apiItems = Array.isArray(salesReturn.items) ? salesReturn.items : [];

  return {
    returnNumber: salesReturn.return_number || salesReturn.return_no || "",

    invoiceId:
      salesReturn.invoice_id ||
      salesReturn.invoice?.id ||
      salesReturn.invoice ||
      "",

    invoiceReference:
      salesReturn.invoice_reference ||
      salesReturn.invoice_ref ||
      salesReturn.invoice?.invoice_number ||
      "",

    returnDate: salesReturn.return_date || getToday(),

    reason: salesReturn.reason || "",

    invoiceValue: salesReturn.invoice_value ?? 0,

    alreadyReturned: salesReturn.already_returned ?? 0,

    eligibleToReturn: salesReturn.eligible_to_return ?? 0,

    from: {
      name: salesReturn.company_name || salesReturn.from?.name || "",

      address: salesReturn.company_address || salesReturn.from?.address || "",

      phone: salesReturn.company_phone || salesReturn.from?.phone || "",

      email: salesReturn.company_email || salesReturn.from?.email || "",
    },

    billTo: {
      client:
        salesReturn.customer_id ??
        salesReturn.customer?.id ??
        salesReturn.customer ??
        "",

      clientName: salesReturn.customer_name || salesReturn.customer?.name || "",

      address:
        salesReturn.customer_address || salesReturn.bill_to?.address || "",

      phone: salesReturn.customer_phone || salesReturn.bill_to?.phone || "",

      email: salesReturn.customer_email || salesReturn.bill_to?.email || "",
    },

    items:
      apiItems.length > 0
        ? apiItems.map((item, index) => ({
            id: item.id ?? Date.now() + index,

            productId: getProductId(item),

            product: getProductName(item),

            slNo: String(index + 1).padStart(2, "0"),

            invoicedQty:
              item.invoiced_qty ?? item.invoice_quantity ?? item.quantity ?? 0,

            alreadyReturned: item.already_returned ?? 0,

            returningNow: item.returning_now ?? item.return_quantity ?? 0,

            condition: item.condition || "",

            unitPrice: item.unit_price ?? item.rate ?? 0,

            returnValue: item.return_value ?? item.amount ?? 0,
          }))
        : [createDefaultItem()],

    notes: salesReturn.notes || salesReturn.reason_detail || "",
  };
};

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

const CreateSalesReturnAction = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isEditMode = Boolean(id);

  const selectedSalesReturn = useSelector(selectSelectedSalesReturn);

  const detailLoading = useSelector(selectSalesReturnDetailLoading);

  const createLoading = useSelector(selectSalesReturnCreateLoading);

  const updateLoading = useSelector(selectSalesReturnUpdateLoading);

  const saveError = useSelector(selectSalesReturnError);

  const customers = useSelector(selectCustomers);

  const invoices = useSelector(selectInvoices);

  const selectedInvoice = useSelector(selectSelectedInvoice);

  const invoiceLoading = useSelector(selectSalesReturnInvoiceLoading);

  const [returnNumber, setReturnNumber] = useState("");

  const [invoiceReference, setInvoiceReference] = useState("");

  const [invoiceId, setInvoiceId] = useState("");

  const [returnDate, setReturnDate] = useState(getToday());

  const [reason, setReason] = useState("");

  const [invoiceValue, setInvoiceValue] = useState(0);

  const [alreadyReturned, setAlreadyReturned] = useState(0);

  const [eligibleToReturn, setEligibleToReturn] = useState(0);

  const [from, setFrom] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [billTo, setBillTo] = useState({
    client: "",
    clientName: "",
    address: "",
    phone: "",
    email: "",
  });

  const [items, setItems] = useState([createDefaultItem()]);

  const [notes, setNotes] = useState("");

  /* ---------------------------------------------
       Initial data
    --------------------------------------------- */

  useEffect(() => {
    dispatch(getCustomers());

    dispatch(
      getInvoices({
        page_size: 100,
      }),
    );

    dispatch(clearSelectedInvoice());

    if (!isEditMode) {
      dispatch(clearSelectedSalesReturn());
    }
  }, [dispatch, isEditMode]);

  /* ---------------------------------------------
       Edit detail
    --------------------------------------------- */

  useEffect(() => {
    if (!isEditMode || !id) {
      return;
    }

    dispatch(getSalesReturnById(id));
  }, [dispatch, id, isEditMode]);

  /* ---------------------------------------------
       Populate edit form
    --------------------------------------------- */

  useEffect(() => {
    if (!selectedSalesReturn || !isEditMode) {
      return;
    }

    const mapped = mapReturnToForm(selectedSalesReturn);

    if (!mapped) {
      return;
    }

    setReturnNumber(mapped.returnNumber);

    setInvoiceId(mapped.invoiceId);

    setInvoiceReference(mapped.invoiceReference);

    setReturnDate(mapped.returnDate);

    setReason(mapped.reason);

    setInvoiceValue(mapped.invoiceValue);

    setAlreadyReturned(mapped.alreadyReturned);

    setEligibleToReturn(mapped.eligibleToReturn);

    setFrom(mapped.from);

    setBillTo(mapped.billTo);

    setItems(mapped.items);

    setNotes(mapped.notes);
  }, [selectedSalesReturn, isEditMode]);

  /* ---------------------------------------------
       Selected invoice
    --------------------------------------------- */

  useEffect(() => {
    if (!selectedInvoice) {
      return;
    }

    const customerId = getInvoiceCustomerId(selectedInvoice);

    const customerName = getInvoiceCustomerName(selectedInvoice);

    const invoiceItems = Array.isArray(selectedInvoice.items)
      ? selectedInvoice.items
      : Array.isArray(selectedInvoice.invoice_items)
        ? selectedInvoice.invoice_items
        : [];

    const mappedItems = invoiceItems.length
      ? invoiceItems.map((item, index) => ({
          id: item.id ?? Date.now() + index,

          productId: getProductId(item),

          product: getProductName(item),

          slNo: String(index + 1).padStart(2, "0"),

          invoicedQty: getProductQuantity(item),

          alreadyReturned: item.already_returned ?? 0,

          returningNow: 0,

          condition: "",

          unitPrice: getProductPrice(item),

          returnValue: 0,
        }))
      : [createDefaultItem()];

    setInvoiceReference(
      selectedInvoice.invoice_number || selectedInvoice.number || "",
    );

    setInvoiceValue(
      selectedInvoice.total ??
        selectedInvoice.invoice_value ??
        selectedInvoice.grand_total ??
        0,
    );

    setBillTo((previous) => ({
      ...previous,

      client: customerId || previous.client,

      clientName: customerName || previous.clientName,

      address:
        selectedInvoice.customer_address ||
        selectedInvoice.customer?.address ||
        previous.address,

      phone:
        selectedInvoice.customer_phone ||
        selectedInvoice.customer?.phone ||
        previous.phone,

      email:
        selectedInvoice.customer_email ||
        selectedInvoice.customer?.email ||
        previous.email,
    }));

    setItems(mappedItems);

    const invoiceTotal = Number(
      selectedInvoice.total ??
        selectedInvoice.invoice_value ??
        selectedInvoice.grand_total ??
        0,
    );

    const invoiceAlreadyReturned = Number(
      selectedInvoice.already_returned ?? 0,
    );

    setAlreadyReturned(invoiceAlreadyReturned);

    setEligibleToReturn(Math.max(0, invoiceTotal - invoiceAlreadyReturned));
  }, [selectedInvoice]);

  /* ---------------------------------------------
       Invoice change
    --------------------------------------------- */

  const handleInvoiceChange = (event) => {
    const value = event.target.value;

    setInvoiceId(value);

    if (!value) {
      dispatch(clearSelectedInvoice());

      setInvoiceReference("");

      setInvoiceValue(0);

      setItems([createDefaultItem()]);

      return;
    }

    dispatch(getInvoiceById(value));
  };

  /* ---------------------------------------------
       Items
    --------------------------------------------- */

  const updateItem = (itemId, field, value) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeItem = (itemId) => {
    setItems((previous) => previous.filter((item) => item.id !== itemId));
  };

  /* ---------------------------------------------
       Calculations
    --------------------------------------------- */

  const calculateReturnValue = (item) => {
    const quantity = Number(item.returningNow) || 0;

    const price = Number(item.unitPrice) || 0;

    return quantity * price;
  };

  const totalReturnValue = useMemo(
    () => items.reduce((total, item) => total + calculateReturnValue(item), 0),
    [items],
  );

  const totalReturnedItems = useMemo(
    () =>
      items.reduce(
        (total, item) => total + (Number(item.returningNow) || 0),
        0,
      ),
    [items],
  );

  /* ---------------------------------------------
       Validation
    --------------------------------------------- */

  const validateForm = () => {
    if (!invoiceId) {
      return "Please select an invoice.";
    }

    if (!returnDate) {
      return "Please select return date.";
    }

    if (!reason) {
      return "Please select a return reason.";
    }

    if (totalReturnValue <= 0) {
      return "Please enter a valid returning quantity.";
    }

    for (const item of items) {
      const returning = Number(item.returningNow) || 0;

      const invoiced = Number(item.invoicedQty) || 0;

      const returned = Number(item.alreadyReturned) || 0;

      const available = Math.max(0, invoiced - returned);

      if (returning > available) {
        return `Returning quantity for ${
          item.product || "the selected product"
        } cannot exceed ${available}.`;
      }
    }

    return "";
  };

  /* ---------------------------------------------
       Payload
    --------------------------------------------- */

  const buildPayload = () => {
    return {
      ...(returnNumber
        ? {
            return_number: returnNumber,
          }
        : {}),

      invoice: invoiceId,

      invoice_reference: invoiceReference,

      return_date: returnDate,

      reason,

      invoice_value: Number(invoiceValue) || 0,

      already_returned: Number(alreadyReturned) || 0,

      eligible_to_return: Number(eligibleToReturn) || 0,

      return_value: Number(totalReturnValue) || 0,

      company_name: from.name,

      company_address: from.address,

      company_phone: from.phone,

      company_email: from.email,

      customer: billTo.client || undefined,

      customer_address: billTo.address,

      customer_phone: billTo.phone,

      customer_email: billTo.email,

      notes,

      items: items.map((item) => ({
        ...(item.productId
          ? {
              product: item.productId,
            }
          : {
              product: item.product,
            }),

        invoiced_qty: Number(item.invoicedQty) || 0,

        already_returned: Number(item.alreadyReturned) || 0,

        returning_now: Number(item.returningNow) || 0,

        condition: item.condition || reason,

        unit_price: Number(item.unitPrice) || 0,

        return_value: calculateReturnValue(item),
      })),
    };
  };

  /* ---------------------------------------------
       Save
    --------------------------------------------- */

  const handleSave = async () => {
    const validationError = validateForm();

    if (validationError) {
      window.alert(validationError);

      return;
    }

    const payload = buildPayload();

    const action = isEditMode
      ? editSalesReturn({
          id,
          salesReturnData: payload,
        })
      : addSalesReturn(payload);

    const result = await dispatch(action);

    if (!result.error) {
      navigate("/sales/returns");
    }
  };

  const handleCancel = () => {
    navigate("/sales/returns");
  };

  const isSaving = isEditMode ? updateLoading : createLoading;

  /* ---------------------------------------------
       Loading
    --------------------------------------------- */

  if (isEditMode && detailLoading && !selectedSalesReturn) {
    return (
      <ReturnContainer>
        <ReusableHeader
          title="Edit Sales Return"
          breadcrumbs={["Sales", "Sales Return"]}
          showBack
          onBack={handleCancel}
        />

        <div
          style={{
            padding: 20,
          }}
        >
          Loading sales return...
        </div>
      </ReturnContainer>
    );
  }

  return (
    <ReturnContainer>
      <ReusableHeader
        title={isEditMode ? "Edit Sales Return" : "Create Sales Return"}
        breadcrumbs={["Sales", "Sales Return"]}
        showBack
        onBack={handleCancel}
      />

      {saveError && (
        <div
          style={{
            margin: "0 20px 16px",
            padding: "12px 16px",
            borderRadius: "6px",
            backgroundColor: "#fff1f0",
            border: "1px solid #ffccc7",
            color: "#c0392b",
            fontSize: "14px",
          }}
        >
          {typeof saveError === "string"
            ? saveError
            : saveError?.detail ||
              saveError?.message ||
              "Unable to save Sales Return. Please try again."}
        </div>
      )}

      <ReturnForm>
        <FormGrid>
          <FormGroup>
            <Label>RETURN NUMBER</Label>

            <Input
              value={returnNumber}
              onChange={(e) => setReturnNumber(e.target.value)}
              placeholder="SR 0123"
              readOnly={isEditMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>INVOICE REFERENCE</Label>

            {isEditMode ? (
              <Input value={invoiceReference} readOnly />
            ) : (
              <SelectWrapper>
                <Select
                  value={invoiceId}
                  onChange={handleInvoiceChange}
                  disabled={invoiceLoading}
                >
                  <option value="">
                    {invoiceLoading ? "Loading invoices..." : "Select Invoice"}
                  </option>

                  {invoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number ||
                        invoice.number ||
                        `Invoice #${invoice.id}`}
                      {invoice.customer_name
                        ? ` - ${invoice.customer_name}`
                        : ""}
                    </option>
                  ))}
                </Select>

                <FiChevronDown />
              </SelectWrapper>
            )}
          </FormGroup>

          <FormGroup>
            <Label>RETURN DATE</Label>

            <CalendarInput>
              <Input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </CalendarInput>
          </FormGroup>

          <FormGroup>
            <Label>REASON</Label>

            <SelectWrapper>
              <Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="">Select Reason</option>

                <option value="wrong_item">Wrong Item</option>

                <option value="damaged_product">Damaged Product</option>

                <option value="quality_issue">Quality Issue</option>
              </Select>

              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>INVOICE VALUE</Label>

            <Input
              value={`SAR ${Number(invoiceValue).toLocaleString("en-US")}`}
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label>ALREADY RETURNED</Label>

            <Input
              value={`SAR ${Number(alreadyReturned).toLocaleString("en-US")}`}
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label>ELIGIBLE TO RETURN</Label>

            <Input
              value={`SAR ${Number(eligibleToReturn).toLocaleString("en-US")}`}
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label>THIS RETURN</Label>

            <Input
              value={`SAR ${Number(totalReturnValue).toLocaleString("en-US")}`}
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label>FROM</Label>

            <Input
              value={from.name}
              onChange={(e) =>
                setFrom((previous) => ({
                  ...previous,
                  name: e.target.value,
                }))
              }
              placeholder="TUNGSTON LABS"
            />
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              value={from.address}
              onChange={(e) =>
                setFrom((previous) => ({
                  ...previous,
                  address: e.target.value,
                }))
              }
              placeholder="Tungston Labs, Ullampilly Building,..."
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              value={from.phone}
              onChange={(e) =>
                setFrom((previous) => ({
                  ...previous,
                  phone: e.target.value,
                }))
              }
              placeholder="+91 97783 77526"
            />
          </FormGroup>

          <FormGroup>
            <Label>EMAIL ID</Label>

            <Input
              value={from.email}
              onChange={(e) =>
                setFrom((previous) => ({
                  ...previous,
                  email: e.target.value,
                }))
              }
              placeholder="info@tungstonlabs.com"
            />
          </FormGroup>

          <FormGroup>
            <Label>BILL TO</Label>

            <SelectWrapper>
              <Select
                value={billTo.client}
                onChange={(e) => {
                  const value = e.target.value;

                  const customer = customers.find(
                    (item) => String(item.id) === String(value),
                  );

                  setBillTo((previous) => ({
                    ...previous,

                    client: value,

                    clientName: customer?.name || customer?.customer_name || "",
                  }));
                }}
              >
                <option value="">Company/Client Name</option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name ||
                      customer.customer_name ||
                      customer.company_name ||
                      `Customer #${customer.id}`}
                  </option>
                ))}
              </Select>

              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              value={billTo.address}
              onChange={(e) =>
                setBillTo((previous) => ({
                  ...previous,
                  address: e.target.value,
                }))
              }
              placeholder="Company/Client ADDRESS"
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              value={billTo.phone}
              onChange={(e) =>
                setBillTo((previous) => ({
                  ...previous,
                  phone: e.target.value,
                }))
              }
              placeholder="Company/Client Phone Number"
            />
          </FormGroup>

          <FormGroup>
            <Label>Finance Contact Email</Label>

            <Input
              value={billTo.email}
              onChange={(e) =>
                setBillTo((previous) => ({
                  ...previous,
                  email: e.target.value,
                }))
              }
              placeholder="Company/Client Email ID"
            />
          </FormGroup>
        </FormGrid>

        <ReturnItemsHeader>
          <SectionTitle>RETURNED ITEMS</SectionTitle>
        </ReturnItemsHeader>

        <ReturnTableWrapper>
          <ReturnTable>
            <thead>
              <tr>
                <th>SL NO</th>
                <th>Product</th>
                <th>Invoiced Qty</th>
                <th>Already Returned</th>
                <th>Returning Now</th>
                <th>Condition</th>
                <th>Unit Price</th>
                <th>Return Value</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.slNo}</td>

                  <td>
                    <input
                      value={item.product}
                      readOnly
                      placeholder="Product"
                    />
                  </td>

                  <td>
                    <input value={item.invoicedQty} readOnly />
                  </td>

                  <td>
                    <input value={item.alreadyReturned} readOnly />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.returningNow}
                      onChange={(e) => {
                        const value = e.target.value;

                        const invoiced = Number(item.invoicedQty) || 0;

                        const returned = Number(item.alreadyReturned) || 0;

                        const max = Math.max(0, invoiced - returned);

                        const numeric = Number(value) || 0;

                        updateItem(
                          item.id,
                          "returningNow",
                          Math.min(numeric, max),
                        );
                      }}
                    />
                  </td>

                  <td>
                    <input
                      value={item.condition}
                      onChange={(e) =>
                        updateItem(item.id, "condition", e.target.value)
                      }
                      placeholder="Wrong Item"
                    />
                  </td>

                  <td>
                    <input value={item.unitPrice} readOnly />
                  </td>

                  <td>
                    <input
                      value={`SAR ${calculateReturnValue(item).toLocaleString(
                        "en-US",
                      )}`}
                      readOnly
                    />
                  </td>

                  <td>
                    {items.length > 1 && (
                      <DeleteButton
                        type="button"
                        onClick={() => removeItem(item.id)}
                      >
                        <FiX />
                      </DeleteButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </ReturnTable>
        </ReturnTableWrapper>

        <PaymentSection>
          <PaymentLeft>
            <SectionTitle>Notes & reason detail</SectionTitle>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Price correction agreed with customer after post-delivery review..."
              style={{
                width: "100%",
                minHeight: "70px",
                resize: "none",
                border: "1px solid #e5e5e5",
                borderRadius: "4px",
                padding: "10px",
                fontFamily: "inherit",
                fontSize: "12px",
                boxSizing: "border-box",
              }}
            />
          </PaymentLeft>

          <PaymentRight>
            <SummaryRow>
              <span>Items returned</span>

              <strong>{totalReturnedItems} units</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Subtotal</span>

              <strong>
                SAR {Number(totalReturnValue).toLocaleString("en-US")}
              </strong>
            </SummaryRow>

            <TotalAmount>
              <span>Total Return Value</span>

              <strong>
                SAR {Number(totalReturnValue).toLocaleString("en-US")}
              </strong>
            </TotalAmount>
          </PaymentRight>
        </PaymentSection>

        <ButtonWrapper>
          <CancelButton type="button" onClick={handleCancel}>
            CANCEL
          </CancelButton>

          <PreviewButton type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving
              ? isEditMode
                ? "UPDATING..."
                : "CREATING..."
              : isEditMode
                ? "UPDATE"
                : "CREATE"}
          </PreviewButton>
        </ButtonWrapper>
      </ReturnForm>
    </ReturnContainer>
  );
};

export default CreateSalesReturnAction;
