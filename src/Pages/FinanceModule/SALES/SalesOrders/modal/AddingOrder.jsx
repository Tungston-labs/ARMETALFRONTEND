import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  Required,
  ErrorText,
  DraftButton,
  DownloadButton,
  SendButton,
} from "./AddingOrder.styles";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";

import {
  getSalesOrderById,
  addSalesOrder,
  editSalesOrder,
  getCompanies,
  getCustomers,
  getWarehouses,
  getAvailableQuotations,
  getQuotationById,
  clearSelectedSalesOrder,
  clearSelectedQuotation,
  clearSalesOrderError,
  selectSelectedSalesOrder,
  selectSalesOrderDetailLoading,
  selectSalesOrderCreateLoading,
  selectSalesOrderUpdateLoading,
  selectSalesOrderError,
  selectCompanies,
  selectCustomers,
  selectWarehouses,
  selectAvailableQuotations,
  selectSelectedQuotation,
} from "../../../../../Redux/finance/Sales/Salesorderslice";
import { Hourglass } from "lucide-react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;



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
  soNumber: "",
  orderStatus: "",
  paymentTerms: "",
  warehouse: "",
  from: { name: "", address: "", phone: "", email: "" },
  billTo: { client: "", address: "", phone: "", email: "" },
  payment: { accountHolder: "", accountNumber: "", iban: "" },
  summary: { subTotal: "", vat: "", discount: "", roundOff: "", total: "" },
  items: [defaultItem()],
};

const mapOrderToFormData = (order) => {
  if (!order) return null;

  return {
    orderNumber: order.order_number || order.quotation_number || "",
    soNumber: order.so_number || "",
    orderDate: order.order_date || "",
    deliveryDate: order.delivery_date || "",
    dueDate: order.due_date || "",
    paymentTerms: order.payment_terms || "",
    warehouse: order.warehouse || "",
    orderStatus: (order.order_status || order.status || "").toLowerCase(),

    from: {
      name: order?.from?.name || order.from_name || "",
      address: order?.from?.address || order.from_address || "",
      phone: order?.from?.phone || order.from_phone || "",
      email: order?.from?.email || order.from_email || "",
    },

    billTo: {
      client: order?.bill_to?.client || order.customer || "",
      address: order?.bill_to?.address || order.customer_address || "",
      phone: order?.bill_to?.phone || order.customer_phone || "",
      email: order?.bill_to?.email || order.customer_email || "",
    },

    payment: {
      accountHolder: order?.payment?.account_holder || "",
      accountNumber: order?.payment?.account_number || "",
      iban: order?.payment?.iban || "",
    },

    summary: {
      subTotal: order.subtotal ?? "",
      vat: order.total_vat ?? "",
      discount: order.discount ?? "",
      roundOff: order.round_off ?? "",
      total: order.order_value ?? "",
    },

    items:
      Array.isArray(order.items) && order.items.length > 0
        ? order.items.map((item, idx) => ({
          id: item.id ?? Date.now() + idx,
          slNo: String(idx + 1).padStart(2, "0"),
          service: item.service_name || "",
          particular: item.description || "",
          qty: item.quantity ?? "",
          hsCode: item.hs_code || "",
          rate: item.rate || "",
          vat: item.vat_percentage || "",
          vatAmount: item.vat_amount || "",
          amount: item.amount || "",
        }))
        : [defaultItem()],
  };
};

const AddingOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);
  const today = new Date().toISOString().split("T")[0];

  const selectedSalesOrder = useSelector(selectSelectedSalesOrder);
  const orderLoading = useSelector(selectSalesOrderDetailLoading);
  const createLoading = useSelector(selectSalesOrderCreateLoading);
  const updateLoading = useSelector(selectSalesOrderUpdateLoading);
  const saveError = useSelector(selectSalesOrderError);
  const companies = useSelector(selectCompanies);
  const customers = useSelector(selectCustomers);
  const warehouses = useSelector(selectWarehouses);
  const availableQuotations = useSelector(selectAvailableQuotations);
  const selectedQuotation = useSelector(selectSelectedQuotation);
  const [quotationId, setQuotationId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [orderNumber, setOrderNumber] = useState(emptyForm.orderNumber);
  const [soNumber, setSoNumber] = useState(emptyForm.soNumber);
  const [orderDate, setOrderDate] = useState(today);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState(emptyForm.paymentTerms);
  const [warehouse, setWarehouse] = useState(emptyForm.warehouse);
  const [orderStatus, setOrderStatus] = useState(emptyForm.orderStatus);
  const [from, setFrom] = useState(emptyForm.from);
  const [billTo, setBillTo] = useState(emptyForm.billTo);
  const [payment, setPayment] = useState(emptyForm.payment);
  const [summary, setSummary] = useState(emptyForm.summary);
  const [items, setItems] = useState(emptyForm.items);
const [isSendForApproval, setIsSendForApproval] = useState(false);
  const [errors, setErrors] = useState({});

  const clearError = (field) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  useEffect(() => {
    dispatch(getCompanies());
    dispatch(getCustomers());
    dispatch(getWarehouses());
    if (!isEditMode) {
      dispatch(getAvailableQuotations());
    }
  }, [dispatch, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(clearSalesOrderError());
      dispatch(getSalesOrderById(id));
    }
    return () => {
      dispatch(clearSelectedSalesOrder());
      dispatch(clearSelectedQuotation());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (!selectedSalesOrder) return;

    const mapped = mapOrderToFormData(selectedSalesOrder);
    setQuotationId(selectedSalesOrder.quotation ?? "");
    setCompanyId(selectedSalesOrder.company ?? "");
    setOrderNumber(mapped.orderNumber);
    setSoNumber(mapped.soNumber);
    setOrderDate(mapped.orderDate || today);
    setDeliveryDate(mapped.deliveryDate);
    setDueDate(mapped.dueDate);
    setPaymentTerms(mapped.paymentTerms);
    setWarehouse(mapped.warehouse);
    setOrderStatus(mapped.orderStatus);
    setFrom(mapped.from);
    setBillTo({
      ...mapped.billTo,
      client: selectedSalesOrder.customer ?? mapped.billTo.client,
    });
    setPayment(mapped.payment);
    setSummary(mapped.summary);
    setItems(mapped.items);
  }, [selectedSalesOrder]);

  useEffect(() => {
    if (isEditMode || !selectedQuotation) return;

    setCompanyId(selectedQuotation.company ?? "");
    setBillTo((prev) => ({
      ...prev,
      client: selectedQuotation.customer ?? prev.client,
    }));
    setWarehouse(selectedQuotation.warehouse ?? "");
    if (
      Array.isArray(selectedQuotation.items) &&
      selectedQuotation.items.length > 0
    ) {
      setItems(
        selectedQuotation.items.map((item, idx) => ({
          id: item.id ?? Date.now() + idx,
          slNo: String(idx + 1).padStart(2, "0"),
          service: item.service_name || item.service || "",
          particular: item.description || item.particular || "",
          qty: item.quantity ?? item.qty ?? "",
          hsCode: item.hs_code || "",
          rate: item.rate || "",
          vat: item.vat_percentage ?? item.vat ?? "",
          vatAmount: item.vat_amount || "",
          amount: item.amount || "",
        }))
      );
    }
  }, [selectedQuotation, isEditMode]);

  const handleQuotationChange = (e) => {
    const value = e.target.value;
    setQuotationId(value);
    const picked = availableQuotations.find(
      (q) => String(q.id) === String(value)
    );
    setOrderNumber(picked?.quotation_number || picked?.number || "");
    if (value) {
      dispatch(getQuotationById(value));
    }
  };

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

  const toDecimal = (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  };
const handleSaveDraft = async () => {
  try {
    // Replace with your draft-save API function.
    await handleSaveAsDraft();

    console.log("Draft saved successfully");
  } catch (error) {
    console.error("Failed to save draft:", error);
  }
};

const handleDownload = () => {
  // Connect your existing PDF/Excel download function here.
  handleDownloadDocument();
};

const handleSendClick = async () => {
  if (!isSendForApproval) {
    setIsSendForApproval(true);
    return;
  }

  await handleSendForApproval();
};
  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    const e = {};
    const t = (v) => String(v ?? "").trim();

    if (!orderDate) e.orderDate = "Order date is required";

    if (!deliveryDate) e.deliveryDate = "Delivery date is required";
    else if (orderDate && deliveryDate < orderDate)
      e.deliveryDate = "Delivery date cannot be before order date";

    if (!warehouse) e.warehouse = "Please select a warehouse";
    if (!paymentTerms) e.paymentTerms = "Please select payment terms";
    if (!billTo.client) e.billTo = "Please select a client";
    if (!t(billTo.address)) e.billToAddress = "Address is required";

    if (!t(billTo.phone)) e.billToPhone = "Phone number is required";
    else if (!PHONE_PATTERN.test(t(billTo.phone)))
      e.billToPhone = "Enter a valid phone number";

    if (!t(billTo.email)) e.billToEmail = "Finance email is required";
    else if (!EMAIL_PATTERN.test(t(billTo.email)))
      e.billToEmail = "Enter a valid email address";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ============================================================
  // PAYLOAD
  // ============================================================

  const buildApiPayload = () => {
    // so_number is generated by the backend, so it is never sent.
    const payload = {
      quotation: quotationId || null,
      company: companyId || null,
      customer: billTo.client || null,
      warehouse: warehouse || null,
      order_date: orderDate,
      delivery_date: deliveryDate || undefined,
      due_date: dueDate || undefined,
      payment_terms: paymentTerms || undefined,
      order_status: orderStatus || undefined,
      company_name: from.name || undefined,
      company_email: from.email || undefined,
      company_phone: from.phone || undefined,
      company_address: from.address || undefined,
      customer_email: billTo.email || undefined,
      customer_phone: billTo.phone || undefined,
      customer_address: billTo.address || undefined,
      discount: toDecimal(summary.discount),
      round_off: toDecimal(summary.roundOff),
      items: items.map((item) => ({
        service_name: item.service,
        description: item.particular,
        quantity: toDecimal(item.qty),
        hs_code: item.hsCode || undefined,
        rate: toDecimal(item.rate),
        vat_percentage: toDecimal(item.vat),
      })),
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });
    payload.items = payload.items.map((item) => {
      const cleaned = { ...item };
      Object.keys(cleaned).forEach((key) => {
        if (cleaned[key] === undefined) delete cleaned[key];
      });
      return cleaned;
    });

    return payload;
  };

  const handleSave = () => {
    // In edit mode the validated fields are read-only, so only validate on create.
    if (!isEditMode && !validate()) return;

    const payload = buildApiPayload();

    const action = isEditMode
      ? editSalesOrder({ id, salesOrderData: payload })
      : addSalesOrder(payload);

    dispatch(action).then((result) => {
      if (!result.error) {
        navigate("/sales/orders");
      }
    });
  };

  const isSaving = isEditMode ? updateLoading : createLoading;
  const notFound =
    isEditMode && !orderLoading && !selectedSalesOrder && Boolean(saveError);

  if (orderLoading && isEditMode && !selectedSalesOrder) {
    return (
      <OrderContainer>
        <ReusableHeader
          title="Edit Sales Order"
          breadcrumbs={["Sales", "Orders"]}
          showBack
          onBack={() => navigate("/sales/orders")}
        />
        <div style={{ padding: 20 }}>Loading order...</div>
      </OrderContainer>
    );
  }

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
            saveError?.order_status?.[0] ||
            "Unable to update Sales Order. Please try again."}
        </div>
      )}

      <OrderForm>
        <FormGrid>
          <FormGroup>
            <Label>QUOTE REFERENCE</Label>
            {isEditMode ? (
              <Input value={orderNumber} readOnly />
            ) : (
              <SelectWrapper>
                <Select value={quotationId} onChange={handleQuotationChange}>
                  <option value="" disabled>
                    Select Quotation
                  </option>
                  {availableQuotations.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.quotation_number || q.number || `Quotation #${q.id}`}
                    </option>
                  ))}
                </Select>
                <FiChevronDown />
              </SelectWrapper>
            )}
          </FormGroup>

          {/* SO NUMBER: auto-generated by the backend */}
          <FormGroup>
            <Label>SO NUMBER</Label>
            <Input
              placeholder="Auto-generated after save"
              value={soNumber}
              readOnly
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>
              ORDER DATE <Required />
            </Label>
            <CalendarInput>
              <Input
                type="date"
                value={orderDate}
                onChange={(e) => {
                  setOrderDate(e.target.value);
                  clearError("orderDate");
                }}
                readOnly={isEditMode}
                disabled={isEditMode}
              />
            </CalendarInput>
            {errors.orderDate && <ErrorText>{errors.orderDate}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>ORDER STATUS</Label>
            <SelectWrapper>
              <Select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <option value="" disabled>
                  Select Order Status
                </option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
                <option value="processing">Processing</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>
              DELIVERY DATE <Required />
            </Label>
            <CalendarInput>
              <Input
                type="date"
                value={deliveryDate}
                min={orderDate}
                onChange={(e) => {
                  setDeliveryDate(e.target.value);
                  clearError("deliveryDate");
                }}
                readOnly={isEditMode}
                disabled={isEditMode}
              />
            </CalendarInput>
            {errors.deliveryDate && <ErrorText>{errors.deliveryDate}</ErrorText>}

          </FormGroup>

          <FormGroup>
            <Label>DUE DATE</Label>
            <CalendarInput>
              <Input
                type="date"
                value={dueDate}
                min={orderDate}
                onChange={(e) => setDueDate(e.target.value)}
                readOnly={isEditMode}
                disabled={isEditMode}
              />
            </CalendarInput>
          </FormGroup>

          <FormGroup>
            <Label>
              PAYMENT TERMS <Required />
            </Label>
            <SelectWrapper>
              <Select
                value={paymentTerms}
                onChange={(e) => {
                  setPaymentTerms(e.target.value);
                  clearError("paymentTerms");
                }}
                disabled={isEditMode}
              >
                <option value="" disabled>
                  Select Payment Terms
                </option>
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="net_7">Net 7</option>
                <option value="net_15">Net 15</option>
                <option value="net_30">Net 30</option>
                <option value="net_45">Net 45</option>
                <option value="net_60">Net 60</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>

            {errors.paymentTerms && <ErrorText>{errors.paymentTerms}</ErrorText>}

          </FormGroup>

          <FormGroup>
            <Label>
              WAREHOUSE <Required />
            </Label>
            <SelectWrapper>
              <Select
                value={warehouse}
                onChange={(e) => {
                  setWarehouse(e.target.value);
                  clearError("warehouse");
                }}
                disabled={isEditMode}
              >
                <option value="" disabled>
                  Select Warehouse
                </option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name || w.warehouse_name || `Warehouse #${w.id}`}
                  </option>
                ))}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
            {errors.warehouse && (
              <span style={errorStyle}>{errors.warehouse}</span>
            )}
            {errors.warehouse && <ErrorText>{errors.warehouse}</ErrorText>}

          </FormGroup>

          <FormGroup>
            <Label>FROM</Label>
            {isEditMode ? (
              <Input value={from.name} readOnly />
            ) : (
              <SelectWrapper>
                <Select
                  value={companyId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCompanyId(value);
                    const picked = companies.find(
                      (c) => String(c.id) === String(value)
                    );
                    setFrom((prev) => ({
                      ...prev,
                      name: picked?.name || picked?.company_name || "",
                      address: picked?.address || prev.address,
                      phone: picked?.phone || prev.phone,
                      email: picked?.email || prev.email,
                    }));
                  }}
                >
                  <option value="" disabled>
                    Select Company
                  </option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.company_name || `Company #${c.id}`}
                    </option>
                  ))}
                </Select>
                <FiChevronDown />
              </SelectWrapper>
            )}
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
            <Label>
              BILL TO <Required />
            </Label>
            <SelectWrapper>
              <Select
                value={billTo.client}
                onChange={(e) => {
                  setBillTo({ ...billTo, client: e.target.value });
                  clearError("billTo");
                }}
                disabled={isEditMode}
              >
                <option value="" disabled>
                  Company/Client Name
                </option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.customer_name || `Customer #${c.id}`}
                  </option>
                ))}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
            {errors.billTo && <ErrorText>{errors.billTo}</ErrorText>}

          </FormGroup>

          <FormGroup>
            <Label>
              ADDRESS <Required />
            </Label>
            <Input
              placeholder="Company/Client ADDRESS"
              value={billTo.address}
              onChange={(e) => {
                setBillTo({ ...billTo, address: e.target.value });
                clearError("billToAddress");
              }}
              readOnly={isEditMode}
            />

            {errors.billToAddress && <ErrorText>{errors.billToAddress}</ErrorText>}

          </FormGroup>

          <FormGroup>
            <Label>
              PHONE NUMBER <Required />
            </Label>
            <Input
              placeholder="Company/Client Phone Number"
              value={billTo.phone}
              onChange={(e) => {
                setBillTo({ ...billTo, phone: e.target.value });
                clearError("billToPhone");
              }}
              readOnly={isEditMode}
            />

            {errors.billToPhone && <ErrorText>{errors.billToPhone}</ErrorText>}

          </FormGroup>

          <FormGroup>
            <Label>
              FINANCE EMAIL ID <Required />
            </Label>
            <Input
              placeholder="Company/Client Email ID"
              value={billTo.email}
              onChange={(e) => {
                setBillTo({ ...billTo, email: e.target.value });
                clearError("billToEmail");
              }}
              readOnly={isEditMode}
            />
            {errors.billToEmail && <ErrorText>{errors.billToEmail}</ErrorText>}

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
                      onChange={(e) =>
                        updateItem(item.id, "service", e.target.value)
                      }
                      readOnly={isEditMode}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Wireframe Of 15 Pages"
                      value={item.particular}
                      onChange={(e) =>
                        updateItem(item.id, "particular", e.target.value)
                      }
                      readOnly={isEditMode}
                    />
                  </td>
                  <td>
                    <input
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(item.id, "qty", e.target.value)
                      }
                      readOnly={isEditMode}
                    />
                  </td>
                  <td>
                    <input
                      value={item.hsCode}
                      onChange={(e) =>
                        updateItem(item.id, "hsCode", e.target.value)
                      }
                      readOnly={isEditMode}
                    />
                  </td>
                  <td>
                    <input
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(item.id, "rate", e.target.value)
                      }
                      readOnly={isEditMode}
                    />
                  </td>
                  <td>
                    <input
                      value={item.vat}
                      onChange={(e) =>
                        updateItem(item.id, "vat", e.target.value)
                      }
                      readOnly={isEditMode}
                    />
                  </td>
                  <td>
                    <input
                      value={item.vatAmount}
                      onChange={(e) =>
                        updateItem(item.id, "vatAmount", e.target.value)
                      }
                      readOnly={isEditMode}
                    />
                  </td>
                  <td>
                    <input
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(item.id, "amount", e.target.value)
                      }
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
              <strong className="discount">
                {summary.discount || "SAR 0"}
              </strong>
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

  
<SendButton
  type="button"
  onClick={handleSendClick}
  disabled={isSaving}
>
  {isSaving ? (
    <>
      <Hourglass className="loading-icon" />
      SENDING...
    </>
  ) : isSendForApproval ? (
    "SEND FOR APPROVAL"
  ) : (
    "SEND"
  )}
</SendButton>
</ButtonWrapper>
      </OrderForm>
    </OrderContainer>
  );
};

export default AddingOrder;