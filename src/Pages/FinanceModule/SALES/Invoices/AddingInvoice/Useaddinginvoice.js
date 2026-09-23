import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    addInvoice,
    updateInvoicePartial,
    getInvoiceById,
    getInvoiceSalesOrderById,
    getInvoiceSalesOrders,
    getInvoiceCompanyDetails,
    getInvoiceCustomers,
    clearInvoiceError,
    clearSelectedInvoice,
    clearSelectedSalesOrder,
} from "../../../../../Redux/finance/Sales/InvoiceSlice";

export const defaultItem = () => ({
    id: Date.now(),
    product: "",
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

export const emptyForm = {
    invoiceNumber: "",
    salesOrderRef: "",
    paymentStatus: "",
    from: { name: "", address: "", phone: "", email: "" },
    billTo: { client: "", address: "", phone: "", email: "" },
    payment: { accountHolder: "", accountNumber: "", iban: "" },
    summary: { subTotal: "", vat: "", discount: "", roundOff: "", total: "" },
    amountPaid: "",
    items: [defaultItem()],
};

const normalizePaymentStatus = (status = "") => {
    const value = String(status).trim().toLowerCase();

    if (
        value === "partially_paid" ||
        value === "partial_paid" ||
        value.includes("partial")
    ) {
        return "partially_paid";
    }

    if (value === "unpaid" || value === "pending") {
        return "pending";
    }

    if (value === "paid") {
        return "paid";
    }

    return value;
};

const mapInvoiceToFormData = (invoice) => {
    if (!invoice) return null;

    return {
        invoiceNumber: invoice.invoice_number || "",
        salesOrderRef:
            invoice.sales_order ||
            invoice.sales_order_id ||
            invoice.so_ref ||
            invoice.so_number ||
            "",
        invoiceDate: invoice.invoice_date || "",
        dueDate: invoice.due_date || "",
        paymentStatus: normalizePaymentStatus(invoice.payment_status || ""),
        from: {
            name: invoice?.from?.name || invoice.company_name || "",
            address: invoice?.from?.address || invoice.company_address || "",
            phone: invoice?.from?.phone || invoice.company_phone || "",
            email: invoice?.from?.email || invoice.company_email || "",
        },
        billTo: {
            client:
                invoice?.bill_to?.client ||
                invoice.customer ||
                invoice.customer_id ||
                "",
            address: invoice?.bill_to?.address || invoice.customer_address || "",
            phone: invoice?.bill_to?.phone || invoice.customer_phone || "",
            email: invoice?.bill_to?.email || invoice.customer_email || "",
        },
        payment: {
            accountHolder:
                invoice?.payment?.account_holder || invoice.account_holder || "",
            accountNumber:
                invoice?.payment?.account_number || invoice.account_number || "",
            iban: invoice?.payment?.iban || invoice.iban || "",
        },
        summary: {
            subTotal: invoice.subtotal ?? invoice.sub_total ?? "",
            vat: invoice.total_vat ?? invoice.vat ?? "",
            discount: invoice.discount ?? "",
            roundOff: invoice.round_off ?? "",
            total: invoice.total_amount ?? invoice.amount ?? "",
        },
        amountPaid: invoice.amount_paid ?? invoice.paid_amount ?? "",
        items:
            Array.isArray(invoice.items) && invoice.items.length > 0
                ? invoice.items.map((item, idx) => ({
                    id: item.id ?? Date.now() + idx,
                    product: item.product || "",
                    slNo: String(idx + 1).padStart(2, "0"),
                    service: item.product_name || item.service_name || item.service || "",
                    particular: item.particular || item.description || "",
                    qty: item.quantity ?? item.qty ?? "",
                    hsCode: item.hs_code || "",
                    rate: item.rate || "",
                    vat: item.vat_percentage ?? item.vat ?? "",
                    vatAmount: item.vat_amount || "",
                    amount: item.amount || "",
                }))
                : [defaultItem()],
    };
};


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s-]{7,20}$/;
const IBAN_RE = /^[A-Za-z0-9]{5,34}$/;

const PAYMENT_TERMS_DAYS = {
    due_on_receipt: 0,
    net_7: 7,
    net_15: 15,
    net_30: 30,
    net_45: 45,
    net_60: 60,
};

const addDaysToDateString = (dateStr, days) => {
    if (!dateStr) return dateStr;
    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateStr;
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const isValidEmail = (value) => EMAIL_RE.test(String(value).trim());
const isValidPhone = (value) => PHONE_RE.test(String(value).trim());

const BACKEND_FIELD_MAP = {
    due_date: "dueDate",
    invoice_date: "invoiceDate",
    invoice_number: "invoiceNumber",
    payment_status: "paymentStatus",
    amount_paid: "amountPaid",
    sales_order: "salesOrderRef",
    company_name: "fromName",
    company_email: "fromEmail",
    company_phone: "fromPhone",
    company_address: "fromAddress",
    customer: "billToClient",
    customer_email: "billToEmail",
    customer_phone: "billToPhone",
    customer_address: "billToAddress",
    iban: "iban",
};

const extractMessage = (value) => {
    if (Array.isArray(value)) return value.join(" ");
    if (typeof value === "string") return value;
    return "";
};

const mapBackendErrors = (payload) => {
    if (!payload || typeof payload !== "object") return {};
    const mapped = {};
    Object.entries(payload).forEach(([key, value]) => {
        const message = extractMessage(value);
        if (!message) return;
        const localKey = BACKEND_FIELD_MAP[key] || key;
        mapped[localKey] = message;
    });
    return mapped;
};

const validateItems = (items) => {
    const itemErrors = {};
    let hasValidItem = false;

    items.forEach((item) => {
        const rowErrors = {};
        const hasAnyValue = Boolean(
            item.service?.trim() || item.particular?.trim() || item.qty !== "" || item.rate !== ""
        );

        if (!hasAnyValue) return;

        if (!item.service?.trim()) {
            rowErrors.service = "Service is required";
        }

        const qtyNum = Number(item.qty);
        if (item.qty === "" || Number.isNaN(qtyNum) || qtyNum <= 0) {
            rowErrors.qty = "Enter a valid quantity";
        }

        const rateNum = Number(item.rate);
        if (item.rate === "" || Number.isNaN(rateNum) || rateNum < 0) {
            rowErrors.rate = "Enter a valid rate";
        }

        if (item.vat !== "" && item.vat !== undefined && item.vat !== null) {
            const vatNum = Number(item.vat);
            if (Number.isNaN(vatNum) || vatNum < 0 || vatNum > 100) {
                rowErrors.vat = "VAT must be 0-100";
            }
        }

        if (Object.keys(rowErrors).length === 0) {
            hasValidItem = true;
        } else {
            itemErrors[item.id] = rowErrors;
        }
    });

    return { itemErrors, hasValidItem };
};



export const useAddingInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isEditMode = Boolean(id);
    const today = new Date().toISOString().split("T")[0];

    const {
        salesOrders,
        selectedSalesOrder,
        selectedInvoice,
        companyDetails,
        customers,
        detailLoading,
        createLoading,
        updateLoading,
        error: saveError,
    } = useSelector((state) => state.invoice);

    const [invoiceNumber, setInvoiceNumber] = useState(emptyForm.invoiceNumber);
    const [salesOrderRef, setSalesOrderRef] = useState(emptyForm.salesOrderRef);
    const [invoiceDate, setInvoiceDate] = useState(today);
    const [dueDate, setDueDate] = useState(today);
    const [paymentStatus, setPaymentStatus] = useState(emptyForm.paymentStatus);
    const [amountPaid, setAmountPaid] = useState(emptyForm.amountPaid);
    const [from, setFrom] = useState(emptyForm.from);
    const [billTo, setBillTo] = useState(emptyForm.billTo);
    const [payment, setPayment] = useState(emptyForm.payment);
    const [summary, setSummary] = useState(emptyForm.summary);
    const [items, setItems] = useState(emptyForm.items);

    const [errors, setErrors] = useState({});

    /* ---- initial data loads ---- */
    useEffect(() => {
        dispatch(clearInvoiceError());
        dispatch(getInvoiceCompanyDetails());
        dispatch(getInvoiceCustomers());
        if (!isEditMode) {
            dispatch(getInvoiceSalesOrders());
        }
        return () => {
            dispatch(clearSelectedInvoice());
            dispatch(clearSelectedSalesOrder());
        };
    }, [dispatch, isEditMode]);


    useEffect(() => {
        if (isEditMode) {
            dispatch(clearInvoiceError());
            dispatch(getInvoiceById(id));
        }
    }, [dispatch, id, isEditMode]);


    useEffect(() => {
        if (!companyDetails || isEditMode) return;

        setFrom((prev) => ({
            name: companyDetails.name || companyDetails.company_name || prev.name,
            address: companyDetails.address || prev.address,
            phone: companyDetails.phone || prev.phone,
            email: companyDetails.email || prev.email,
        }));
    }, [companyDetails, isEditMode]);


    useEffect(() => {
        if (!selectedInvoice) return;

        const mapped = mapInvoiceToFormData(selectedInvoice);
        setInvoiceNumber(mapped.invoiceNumber);
        setSalesOrderRef(mapped.salesOrderRef);
        setInvoiceDate(mapped.invoiceDate || today);
        setDueDate(mapped.dueDate);
        setPaymentStatus(mapped.paymentStatus);
        setAmountPaid(mapped.amountPaid);
        setFrom(mapped.from);
        setBillTo(mapped.billTo);
        setPayment(mapped.payment);
        setSummary(mapped.summary);
        setItems(mapped.items);
        setErrors({});
    }, [selectedInvoice]);


    useEffect(() => {
        if (isEditMode || !selectedSalesOrder) return;

        setBillTo((prev) => ({
            ...prev,
            client: selectedSalesOrder.customer ?? prev.client,
            address: selectedSalesOrder.customer_address || prev.address,
            phone: selectedSalesOrder.customer_phone || prev.phone,
            email: selectedSalesOrder.customer_email || prev.email,
        }));

        if (selectedSalesOrder.payment_terms in PAYMENT_TERMS_DAYS) {
            const days = PAYMENT_TERMS_DAYS[selectedSalesOrder.payment_terms];
            setDueDate(addDaysToDateString(invoiceDate, days));
        } else if (selectedSalesOrder.due_date && selectedSalesOrder.due_date >= invoiceDate) {

            setDueDate(selectedSalesOrder.due_date);
        }

        if (Array.isArray(selectedSalesOrder.items) && selectedSalesOrder.items.length > 0) {
            setItems(
                selectedSalesOrder.items.map((item, idx) => ({
                    id: item.id ?? Date.now() + idx,
                    product: item.product || "",
                    slNo: String(idx + 1).padStart(2, "0"),
                    service: item.product_name || item.service_name || item.service || "",
                    particular: item.particular || item.description || "",
                    qty: item.quantity ?? item.qty ?? "",
                    hsCode: item.hs_code || "",
                    rate: item.rate || "",
                    vat: item.vat_percentage ?? item.vat ?? "",
                    vatAmount: item.vat_amount || "",
                    amount: item.amount || "",
                }))
            );
        }
    }, [selectedSalesOrder, isEditMode]);

    /* ---- error helpers ---- */
    const clearError = (field) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const clearItemError = (itemId, field) => {
        setErrors((prev) => {
            if (!prev.items || !prev.items[itemId] || !prev.items[itemId][field]) return prev;
            const nextItems = { ...prev.items };
            const nextRow = { ...nextItems[itemId] };
            delete nextRow[field];
            if (Object.keys(nextRow).length === 0) {
                delete nextItems[itemId];
            } else {
                nextItems[itemId] = nextRow;
            }
            const next = { ...prev, items: nextItems };
            if (Object.keys(nextItems).length === 0) delete next.items;
            return next;
        });
    };

    const handleInvoiceNumberChange = (value) => {
        setInvoiceNumber(value);
        clearError("invoiceNumber");
    };

    const handleInvoiceDateChange = (value) => {
        setInvoiceDate(value);
        clearError("invoiceDate");
        clearError("dueDate");
    };

    const handleDueDateChange = (value) => {
        setDueDate(value);
        clearError("dueDate");
    };

    const handlePaymentStatusChange = (value) => {
        setPaymentStatus(value);
        const total = toDecimal(summary.total);

        if (value === "paid" && total !== undefined) {
            setAmountPaid(String(total));
        }

        if (value === "pending") {
            setAmountPaid("0");
        }

        clearError("paymentStatus");
        clearError("amountPaid");
    };

    const handleAmountPaidChange = (value) => {
        setAmountPaid(value);
        clearError("amountPaid");
    };

    const updateFrom = (field, value) => {
        setFrom((prev) => ({ ...prev, [field]: value }));
        clearError(`from${capitalize(field)}`);
    };

    const updateBillTo = (field, value) => {
        setBillTo((prev) => ({ ...prev, [field]: value }));
        clearError(`billTo${capitalize(field)}`);
    };

    const updatePayment = (field, value) => {
        setPayment((prev) => ({ ...prev, [field]: value }));
        clearError(field);
    };

    const handleSalesOrderChange = (e) => {
        const value = e.target.value;
        setSalesOrderRef(value);
        if (value) {
            dispatch(getInvoiceSalesOrderById(value));
        }
    };

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;

        const selectedCustomer = customers.find(
            (customer) => String(customer.id) === String(customerId)
        );

        if (!selectedCustomer) return;

        setBillTo({
            client: selectedCustomer.id,
            address: selectedCustomer.billing_address || "",
            phone: selectedCustomer.phno || "",
            email: selectedCustomer.admin_email || "",
        });
        clearError("billToClient");
    };

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            {
                id: Date.now(),
                product: "",
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
        setErrors((prev) => {
            if (!prev.items || !prev.items[itemId]) return prev;
            const nextItems = { ...prev.items };
            delete nextItems[itemId];
            const next = { ...prev, items: nextItems };
            if (Object.keys(nextItems).length === 0) delete next.items;
            return next;
        });
    };

    const updateItem = (itemId, field, value) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
            )
        );
        clearItemError(itemId, field);
        if (errors.itemsGeneral) clearError("itemsGeneral");
    };

    const handleCancel = () => navigate("/sales/invoices");

    const toDecimal = (value) => {
        if (value === "" || value === null || value === undefined) return undefined;
        const num = Number(value);
        return Number.isNaN(num) ? undefined : num;
    };

    const buildApiPayload = () => {
        const payload = {
            sales_order: salesOrderRef || null,
            invoice_number: invoiceNumber || undefined,
            invoice_date: invoiceDate,
            due_date: dueDate || undefined,
            payment_status: paymentStatus || undefined,
            company_name: from.name || undefined,
            company_email: from.email || undefined,
            company_phone: from.phone || undefined,
            company_address: from.address || undefined,
            customer: billTo.client || undefined,
            customer_email: billTo.email || undefined,
            customer_phone: billTo.phone || undefined,
            customer_address: billTo.address || undefined,
            account_holder: payment.accountHolder || undefined,
            account_number: payment.accountNumber || undefined,
            iban: payment.iban || undefined,
            amount_paid: toDecimal(amountPaid),
            discount: toDecimal(summary.discount),
            round_off: toDecimal(summary.roundOff),
        };

        Object.keys(payload).forEach((key) => {
            if (payload[key] === undefined) delete payload[key];
        });

        return payload;
    };
    const validate = () => {
        const newErrors = {};

        if (!invoiceNumber.trim()) {
            newErrors.invoiceNumber = "Invoice number is required";
        }

        if (!invoiceDate) {
            newErrors.invoiceDate = "Invoice date is required";
        }

        if (!paymentStatus) {
            newErrors.paymentStatus = "Select a payment status";
        }

        const paidAmount = toDecimal(amountPaid);
        const totalAmount = toDecimal(summary.total);

        if (paymentStatus === "paid" && totalAmount !== undefined) {
            if (paidAmount === undefined || paidAmount < totalAmount) {
                newErrors.amountPaid = "Paid invoices must have the full amount paid";
            }
        }

        if (paymentStatus === "partially_paid") {
            if (
                paidAmount === undefined ||
                paidAmount <= 0 ||
                (totalAmount !== undefined && paidAmount >= totalAmount)
            ) {
                newErrors.amountPaid = "Enter a paid amount less than the invoice total";
            }
        }

        if (dueDate && invoiceDate && dueDate < invoiceDate) {
            newErrors.dueDate = "Due date cannot be before invoice date";
        }

        if (!isEditMode) {
            if (!from.name.trim()) {
                newErrors.fromName = "Company name is required";
            }

            if (!from.email.trim()) {
                newErrors.fromEmail = "Email is required";
            } else if (!isValidEmail(from.email)) {
                newErrors.fromEmail = "Enter a valid email address";
            }

            if (from.phone.trim() && !isValidPhone(from.phone)) {
                newErrors.fromPhone = "Enter a valid phone number";
            }

            if (!billTo.client) {
                newErrors.billToClient = "Select a client";
            }

            if (billTo.email.trim() && !isValidEmail(billTo.email)) {
                newErrors.billToEmail = "Enter a valid email address";
            }

            if (billTo.phone.trim() && !isValidPhone(billTo.phone)) {
                newErrors.billToPhone = "Enter a valid phone number";
            }

            const { itemErrors, hasValidItem } = validateItems(items);
            if (Object.keys(itemErrors).length > 0) {
                newErrors.items = itemErrors;
            }
            if (!hasValidItem) {
                newErrors.itemsGeneral = "Add at least one item with a service, quantity and rate";
            }
        }

        if (payment.iban.trim() && !IBAN_RE.test(payment.iban.trim())) {
            newErrors.iban = "Enter a valid IBAN";
        }

        return newErrors;
    };

    const handleSave = () => {
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const payload = buildApiPayload();
        const action = isEditMode
            ? updateInvoicePartial({ id, invoiceData: payload })
            : addInvoice(payload);

        dispatch(action).then((result) => {
            if (!result.error) {
                navigate("/sales/invoices");
                return;
            }
            const backendErrors = mapBackendErrors(result.payload);
            if (Object.keys(backendErrors).length > 0) {
                setErrors((prev) => ({ ...prev, ...backendErrors }));
            }
        });
    };

    const isSaving = isEditMode ? updateLoading : createLoading;
    const notFound = isEditMode && !detailLoading && !selectedInvoice && Boolean(saveError);

    /* ---- everything the UI layer needs ---- */
    return {
        id,
        navigate,
        isEditMode,

        // redux-derived data
        salesOrders,
        selectedSalesOrder,
        selectedInvoice,
        companyDetails,
        customers,
        detailLoading,
        createLoading,
        updateLoading,
        saveError,

        // form state
        invoiceNumber,
        salesOrderRef,
        invoiceDate,
        dueDate,
        paymentStatus,
        amountPaid,
        from,
        billTo,
        payment,
        summary,
        items,

        // validation
        errors,

        // derived flags
        isSaving,
        notFound,

        // handlers
        handleInvoiceNumberChange,
        handleInvoiceDateChange,
        handleDueDateChange,
        handlePaymentStatusChange,
        handleAmountPaidChange,
        updateFrom,
        updateBillTo,
        updatePayment,
        handleSalesOrderChange,
        handleCustomerChange,
        addItem,
        removeItem,
        updateItem,
        handleCancel,
        handleSave,
    };
};

export default useAddingInvoice;
