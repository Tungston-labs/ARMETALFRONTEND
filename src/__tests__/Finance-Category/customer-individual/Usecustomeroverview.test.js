import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// --------------------------------------------------------------------
// Paths below are relative to THIS file's location:
//   src/__tests__/Finance-Category/Customer/Usecustomeroverview.test.js
// Adjust to match the real folder depth of Usecustomeroverview.js
// in your project if different.
// --------------------------------------------------------------------

// ---- Mock react-redux ----
const mockDispatch = vi.fn();
let mockSelectorState;

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selectorFn) => selectorFn(mockSelectorState),
}));

// ---- Mock react-router-dom useParams ----
let mockParams = { id: "1" };
vi.mock("react-router-dom", () => ({
  useParams: () => mockParams,
}));


vi.mock(
  "../../../Redux/finance/Sales/CustomerSlice",
  () => ({
    getCustomerById: vi.fn((id) => ({
      type: "customer/getCustomerById",
      payload: id,
    })),
    uploadCustomerDocumentThunk: vi.fn((args) => ({
      type: "customer/uploadCustomerDocumentThunk",
      payload: args,
    })),
  })
);
import {
  useCustomerOverview,
  resolveDocumentUrl,
} from "../../../Pages/FinanceModule/SALES/Customer/Overview/Usecustomeroverview";
import {
  getCustomerById,
  uploadCustomerDocumentThunk,
} from "../../../Redux/finance/Sales/CustomerSlice";

const buildSelectedCustomer = (overrides = {}) => ({
  id: 6,
  customer_id: "CUS006",
  customer_name: "Al Noor Trading",
  company_name: "tungston labs",
  phno: "+91 7846952310",
  admin_email: "rekory@gmail.com",
  financial_email: "rekory1@gmail.com",
  technical_email: "rekoery1@gmail.com",
  cr_number: "#45646657",
  vat_number: "324353245",
  trade_license_number: "",
  currency: "INR",
  currency_name: "INR",
  payment_term_name: "Immediate",
  credit_limit: "1232.00",
  opening_balance: "12300.00",
  city: "Ernakulam",
  state: "Kerala",
  country: "India",
  postal: "682021",
  documents: [],
  ...overrides,
});

const setReduxState = (overrides = {}) => {
  mockSelectorState = {
    customer: {
      selectedCustomer: buildSelectedCustomer(),
      detailLoading: false,
      uploadLoading: false,
      error: null,
      ...overrides,
    },
  };
};

describe("useCustomerOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = { id: "1" };
    setReduxState();
  });

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  test("dispatches getCustomerById with the route id on mount", () => {
    renderHook(() => useCustomerOverview());

    expect(getCustomerById).toHaveBeenCalledWith("1");
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "customer/getCustomerById" })
    );
  });

  test("does not dispatch getCustomerById when there is no route id", () => {
    mockParams = { id: undefined };

    renderHook(() => useCustomerOverview());

    expect(getCustomerById).not.toHaveBeenCalled();
  });

  test("re-dispatches getCustomerById when the route id changes", () => {
    const { rerender } = renderHook(() => useCustomerOverview());

    expect(getCustomerById).toHaveBeenCalledWith("1");

    mockParams = { id: "2" };
    rerender();

    expect(getCustomerById).toHaveBeenCalledWith("2");
  });

  // =====================================================
  // STATUS PASSTHROUGH
  // =====================================================

  test("passes through detailLoading, uploadLoading, and error from redux state", () => {
    setReduxState({
      detailLoading: true,
      uploadLoading: true,
      error: "boom",
    });

    const { result } = renderHook(() => useCustomerOverview());

    expect(result.current.detailLoading).toBe(true);
    expect(result.current.uploadLoading).toBe(true);
    expect(result.current.error).toBe("boom");
  });

  // =====================================================
  // CUSTOMER / DOCUMENTS FALLBACKS
  // =====================================================

  test("falls back to an empty object when selectedCustomer is null", () => {
    setReduxState({ selectedCustomer: null });

    const { result } = renderHook(() => useCustomerOverview());

    expect(result.current.customer).toEqual({});
    expect(result.current.documents).toEqual([]);
  });

  test("returns the real documents array when present", () => {
    const docs = [{ id: 1, document_name: "Trade License.pdf" }];
    setReduxState({
      selectedCustomer: buildSelectedCustomer({ documents: docs }),
    });

    const { result } = renderHook(() => useCustomerOverview());

    expect(result.current.documents).toEqual(docs);
  });

  // =====================================================
  // CONTACTS
  // =====================================================

  test("builds all four contact entries with real values", () => {
    const { result } = renderHook(() => useCustomerOverview());

    const labels = result.current.contacts.map((c) => c.label);
    expect(labels).toEqual([
      "Phone Number",
      "Admin Contact",
      "Financial Contact",
      "Technical Contact",
    ]);

    expect(result.current.contacts[0].value).toBe("+91 7846952310");
    expect(result.current.contacts[1].value).toBe("rekory@gmail.com");
    expect(result.current.contacts[2].value).toBe("rekory1@gmail.com");
    expect(result.current.contacts[3].value).toBe("rekoery1@gmail.com");
  });

  test("falls back to em dash for missing contact fields", () => {
    setReduxState({
      selectedCustomer: buildSelectedCustomer({
        phno: "",
        admin_email: "",
        financial_email: "",
        technical_email: "",
      }),
    });

    const { result } = renderHook(() => useCustomerOverview());

    result.current.contacts.forEach((c) => {
      expect(c.value).toBe("—");
    });
  });

  // =====================================================
  // COMPANY INFO
  // =====================================================

  test("builds companyInfo with all seven entries", () => {
    const { result } = renderHook(() => useCustomerOverview());

    expect(result.current.companyInfo).toHaveLength(7);
    expect(result.current.companyInfo.map((i) => i.label)).toEqual([
      "CR Number",
      "VAT Number",
      "Trade License Number",
      "Currency",
      "Credit Limit",
      "Payment Terms",
      "Opening Balance",
    ]);
  });

  test("uses currency_name over currency when both are present", () => {
    const { result } = renderHook(() => useCustomerOverview());

    const currencyItem = result.current.companyInfo.find(
      (i) => i.label === "Currency"
    );
    expect(currencyItem.value).toBe("INR");
  });

  test("falls back to currency when currency_name is missing", () => {
    setReduxState({
      selectedCustomer: buildSelectedCustomer({
        currency: "USD",
        currency_name: "",
      }),
    });

    const { result } = renderHook(() => useCustomerOverview());

    const currencyItem = result.current.companyInfo.find(
      (i) => i.label === "Currency"
    );
    expect(currencyItem.value).toBe("USD");
  });

  test("formats credit_limit with currency prefix and two decimals", () => {
    const { result } = renderHook(() => useCustomerOverview());

    const creditLimitItem = result.current.companyInfo.find(
      (i) => i.label === "Credit Limit"
    );
    expect(creditLimitItem.value).toBe("INR 1,232.00");
  });

  test("formats opening_balance with currency prefix and two decimals", () => {
    const { result } = renderHook(() => useCustomerOverview());

    const openingBalanceItem = result.current.companyInfo.find(
      (i) => i.label === "Opening Balance"
    );
    expect(openingBalanceItem.value).toBe("INR 12,300.00");
  });

  test("shows em dash for credit_limit and opening_balance when null", () => {
    setReduxState({
      selectedCustomer: buildSelectedCustomer({
        credit_limit: null,
        opening_balance: null,
      }),
    });

    const { result } = renderHook(() => useCustomerOverview());

    const creditLimitItem = result.current.companyInfo.find(
      (i) => i.label === "Credit Limit"
    );
    const openingBalanceItem = result.current.companyInfo.find(
      (i) => i.label === "Opening Balance"
    );

    expect(creditLimitItem.value).toBe("—");
    expect(openingBalanceItem.value).toBe("—");
  });

  test("treats credit_limit of 0 as a real value, not missing", () => {
    setReduxState({
      selectedCustomer: buildSelectedCustomer({ credit_limit: "0.00" }),
    });

    const { result } = renderHook(() => useCustomerOverview());

    const creditLimitItem = result.current.companyInfo.find(
      (i) => i.label === "Credit Limit"
    );
    expect(creditLimitItem.value).toBe("INR 0.00");
  });

  // =====================================================
  // COMPANY ADDRESS
  // =====================================================

  test("joins city, state, country, and postal with commas", () => {
    const { result } = renderHook(() => useCustomerOverview());

    expect(result.current.companyAddress).toBe(
      "Ernakulam, Kerala, India, 682021"
    );
  });

  test("skips missing address parts without leaving extra commas", () => {
    setReduxState({
      selectedCustomer: buildSelectedCustomer({
        city: "Ernakulam",
        state: "",
        country: "India",
        postal: "",
      }),
    });

    const { result } = renderHook(() => useCustomerOverview());

    expect(result.current.companyAddress).toBe("Ernakulam, India");
  });

  test("returns an empty string when all address parts are missing", () => {
    setReduxState({
      selectedCustomer: buildSelectedCustomer({
        city: "",
        state: "",
        country: "",
        postal: "",
      }),
    });

    const { result } = renderHook(() => useCustomerOverview());

    expect(result.current.companyAddress).toBe("");
  });

  // =====================================================
  // UPLOAD: handleUploadClick
  // =====================================================

  test("handleUploadClick clicks the hidden file input", () => {
    const { result } = renderHook(() => useCustomerOverview());

    const clickSpy = vi.fn();
    result.current.fileInputRef.current = { click: clickSpy };

    act(() => {
      result.current.handleUploadClick();
    });

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  test("handleUploadClick does not throw when fileInputRef.current is null", () => {
    const { result } = renderHook(() => useCustomerOverview());

    expect(() => {
      act(() => {
        result.current.handleUploadClick();
      });
    }).not.toThrow();
  });

  // =====================================================
  // UPLOAD: handleFileChange
  // =====================================================

  const buildFileChangeEvent = (file) => ({
    target: {
      files: file ? [file] : [],
      value: "some-value",
    },
  });

  test("dispatches uploadCustomerDocumentThunk with the selected file", () => {
    const { result } = renderHook(() => useCustomerOverview());

    const file = new File(["dummy"], "invoice.pdf", {
      type: "application/pdf",
    });
    const event = buildFileChangeEvent(file);

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(uploadCustomerDocumentThunk).toHaveBeenCalledWith({
      id: "1",
      documentName: "invoice.pdf",
      file,
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "customer/uploadCustomerDocumentThunk",
      })
    );
  });

  test("resets the file input value after dispatching", () => {
    const { result } = renderHook(() => useCustomerOverview());

    const file = new File(["dummy"], "invoice.pdf", {
      type: "application/pdf",
    });
    const event = buildFileChangeEvent(file);

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(event.target.value).toBe("");
  });

  test("does not dispatch when no file is selected", () => {
    const { result } = renderHook(() => useCustomerOverview());

    const event = buildFileChangeEvent(null);

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(uploadCustomerDocumentThunk).not.toHaveBeenCalled();
    expect(event.target.value).toBe("");
  });

  test("falls back to customer.id when there is no route id", () => {
    mockParams = { id: undefined };
    setReduxState({
      selectedCustomer: buildSelectedCustomer({ id: 99 }),
    });

    const { result } = renderHook(() => useCustomerOverview());

    const file = new File(["dummy"], "invoice.pdf", {
      type: "application/pdf",
    });
    const event = buildFileChangeEvent(file);

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(uploadCustomerDocumentThunk).toHaveBeenCalledWith({
      id: 99,
      documentName: "invoice.pdf",
      file,
    });
  });

  test("does not dispatch when there is no id at all (no route id, no customer id)", () => {
    mockParams = { id: undefined };
    setReduxState({ selectedCustomer: buildSelectedCustomer({ id: undefined }) });

    const { result } = renderHook(() => useCustomerOverview());

    const file = new File(["dummy"], "invoice.pdf", {
      type: "application/pdf",
    });
    const event = buildFileChangeEvent(file);

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(uploadCustomerDocumentThunk).not.toHaveBeenCalled();
  });
});

// ==========================================================
// resolveDocumentUrl (standalone export, tested separately)
// ==========================================================

describe("resolveDocumentUrl", () => {
  test("returns '#' when path is falsy", () => {
    expect(resolveDocumentUrl(null)).toBe("#");
    expect(resolveDocumentUrl(undefined)).toBe("#");
    expect(resolveDocumentUrl("")).toBe("#");
  });

  test("returns the path unchanged when it is already an absolute http(s) URL", () => {
    expect(resolveDocumentUrl("http://example.com/file.pdf")).toBe(
      "http://example.com/file.pdf"
    );
    expect(resolveDocumentUrl("https://example.com/file.pdf")).toBe(
      "https://example.com/file.pdf"
    );
  });

  test("prefixes a relative path with the configured base URL", () => {
    // VITE_API_BASE_URL is whatever your test env provides;
    // this just checks the relative path is appended to it.
    const result = resolveDocumentUrl("/media/file.pdf");
    expect(result.endsWith("/media/file.pdf")).toBe(true);
  });
});