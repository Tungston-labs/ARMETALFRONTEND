import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// --------------------------------------------------------------------
// Paths below are relative to THIS file's location:
//   src/__tests__/Finance-Category/Customer/Overview.test.jsx
// Adjust to match the real folder depth of Overview.jsx and
// Usecustomeroverview.js in your project if different.
// --------------------------------------------------------------------
import Overview from "../../../Pages/FinanceModule/SALES/Customer/Overview/Overview";
import { useCustomerOverview } from "../../../Pages/FinanceModule/SALES/Customer/Overview/Usecustomeroverview";

// ---- Mock the data hook (path MUST match the import above exactly) ----
vi.mock(
  "../../../Pages/FinanceModule/SALES/Customer/Overview/Usecustomeroverview",
  () => ({
    useCustomerOverview: vi.fn(),
  })
);

// ---- Shared default mock return value for the hook ----
const buildHookReturn = (overrides = {}) => ({
  detailLoading: false,
  uploadLoading: false,
  error: null,

  customer: {
    company_name: "Tungston Labs",
    customer_name: "ABC Trading LLC",
    billing_address: "Kochi, Kerala, India",
  },

  documents: [],
  contacts: [],
  companyInfo: [],
  companyAddress: "Ernakulam, Kerala, 682021",

  fileInputRef: { current: null },
  handleUploadClick: vi.fn(),
  handleFileChange: vi.fn(),
  resolveDocumentUrl: vi.fn((doc) => `https://example.com/${doc}`),

  ...overrides,
});

describe("<Overview />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =====================================================
  // LOADING STATE
  // =====================================================

  test("shows a loading message when detailLoading is true", () => {
    useCustomerOverview.mockReturnValue(
      buildHookReturn({ detailLoading: true })
    );
    render(<Overview />);

    expect(
      screen.getByText("Loading customer overview...")
    ).toBeInTheDocument();
  });

  test("does not render customer details while loading", () => {
    useCustomerOverview.mockReturnValue(
      buildHookReturn({ detailLoading: true })
    );
    render(<Overview />);

    expect(screen.queryByText("Tungston Labs")).not.toBeInTheDocument();
  });

  // =====================================================
  // ERROR STATE
  // =====================================================

  test("shows an error message when error is set", () => {
    useCustomerOverview.mockReturnValue(
      buildHookReturn({ error: "Something went wrong" })
    );
    render(<Overview />);

    expect(
      screen.getByText("Failed to load customer overview.")
    ).toBeInTheDocument();
  });

  test("does not render customer details when there is an error", () => {
    useCustomerOverview.mockReturnValue(
      buildHookReturn({ error: "Something went wrong" })
    );
    render(<Overview />);

    expect(screen.queryByText("Tungston Labs")).not.toBeInTheDocument();
  });

  // =====================================================
  // COMPANY DETAILS
  // =====================================================

  test("renders the customer's company name, name, and addresses", () => {
    useCustomerOverview.mockReturnValue(buildHookReturn());
    render(<Overview />);

    expect(screen.getByText("Tungston Labs")).toBeInTheDocument();
    expect(screen.getByText("ABC Trading LLC")).toBeInTheDocument();
    expect(screen.getByText("Kochi, Kerala, India")).toBeInTheDocument();
    expect(
      screen.getByText("Ernakulam, Kerala, 682021")
    ).toBeInTheDocument();
  });

  test("falls back to customer_name when company_name is missing", () => {
    useCustomerOverview.mockReturnValue(
      buildHookReturn({
        customer: {
          company_name: "",
          customer_name: "ABC Trading LLC",
          billing_address: "Kochi, Kerala, India",
        },
      })
    );
    render(<Overview />);

    // customer_name appears twice: once as the CompanyName fallback,
    // once as the CompanyText line.
    expect(screen.getAllByText("ABC Trading LLC")).toHaveLength(2);
  });

  test("renders a dash when company_name, customer_name, and billing_address are all missing", () => {
    useCustomerOverview.mockReturnValue(
      buildHookReturn({
        customer: {
          company_name: "",
          customer_name: "",
          billing_address: "",
        },
      })
    );
    render(<Overview />);

    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(3);
  });

  // =====================================================
  // CONTACTS
  // =====================================================

  test("renders each contact's label and value with its icon", () => {
    const MockIcon = (props) => <svg data-testid="mock-icon" {...props} />;

    useCustomerOverview.mockReturnValue(
      buildHookReturn({
        contacts: [
          { label: "Phone", value: "+91 7846952310", icon: MockIcon },
          { label: "Email", value: "rekory@gmail.com", icon: MockIcon },
        ],
      })
    );
    render(<Overview />);

    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("+91 7846952310")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("rekory@gmail.com")).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-icon")).toHaveLength(2);
  });

  test("renders nothing in the contact card when contacts is empty", () => {
    useCustomerOverview.mockReturnValue(buildHookReturn());
    render(<Overview />);

    expect(screen.queryByText("Phone")).not.toBeInTheDocument();
  });

  // =====================================================
  // COMPANY INFO
  // =====================================================

  test("renders each company info item's label and value", () => {
    const MockIcon = (props) => <svg data-testid="info-icon" {...props} />;

    useCustomerOverview.mockReturnValue(
      buildHookReturn({
        companyInfo: [
          { label: "Industry", value: "Manufacturing", icon: MockIcon },
          { label: "Currency", value: "INR", icon: MockIcon },
        ],
      })
    );
    render(<Overview />);

    expect(screen.getByText("Industry")).toBeInTheDocument();
    expect(screen.getByText("Manufacturing")).toBeInTheDocument();
    expect(screen.getByText("Currency")).toBeInTheDocument();
    expect(screen.getByText("INR")).toBeInTheDocument();
  });

  // =====================================================
  // DOCUMENTS
  // =====================================================

  test("shows 'No documents uploaded' when documents is empty", () => {
    useCustomerOverview.mockReturnValue(buildHookReturn());
    render(<Overview />);

    expect(screen.getByText("No documents uploaded")).toBeInTheDocument();
  });

  test("renders a document's name and formatted date", () => {
    useCustomerOverview.mockReturnValue(
      buildHookReturn({
        documents: [
          {
            id: 1,
            document_name: "Trade License.pdf",
            document: "trade-license.pdf",
            created_at: "2026-09-14T06:26:47.724061Z",
          },
        ],
      })
    );
    render(<Overview />);

    expect(screen.getByText("Trade License.pdf")).toBeInTheDocument();
    expect(
      screen.queryByText("No documents uploaded")
    ).not.toBeInTheDocument();
  });

  test("renders multiple documents, each with a working download button", () => {
    const originalOpen = window.open;
    window.open = vi.fn();

    const hookReturn = buildHookReturn({
      documents: [
        {
          id: 1,
          document_name: "Doc One.pdf",
          document: "doc-one.pdf",
          created_at: "2026-01-01T00:00:00Z",
        },
        {
          id: 2,
          document_name: "Doc Two.pdf",
          document: "doc-two.pdf",
          created_at: "2026-02-01T00:00:00Z",
        },
      ],
    });
    useCustomerOverview.mockReturnValue(hookReturn);
    render(<Overview />);

    expect(screen.getByText("Doc One.pdf")).toBeInTheDocument();
    expect(screen.getByText("Doc Two.pdf")).toBeInTheDocument();

    const downloadButtons = screen.getAllByTitle("Download");
    expect(downloadButtons).toHaveLength(2);

    fireEvent.click(downloadButtons[0]);

    expect(hookReturn.resolveDocumentUrl).toHaveBeenCalledWith("doc-one.pdf");
    expect(window.open).toHaveBeenCalledWith(
      "https://example.com/doc-one.pdf",
      "_blank"
    );

    window.open = originalOpen;
  });

  test("does not crash when a document has no created_at", () => {
    useCustomerOverview.mockReturnValue(
      buildHookReturn({
        documents: [
          {
            id: 1,
            document_name: "No Date Doc.pdf",
            document: "no-date.pdf",
            created_at: null,
          },
        ],
      })
    );
    render(<Overview />);

    expect(screen.getByText("No Date Doc.pdf")).toBeInTheDocument();
  });

  // =====================================================
  // UPLOAD BUTTON
  // =====================================================

  test("shows 'Upload Document' label when not uploading", () => {
    useCustomerOverview.mockReturnValue(buildHookReturn());
    render(<Overview />);

    expect(screen.getByText("Upload Document")).toBeInTheDocument();
  });

  test("shows 'Uploading...' and disables the button while uploadLoading is true", () => {
    useCustomerOverview.mockReturnValue(
      buildHookReturn({ uploadLoading: true })
    );
    render(<Overview />);

    expect(screen.getByText("Uploading...")).toBeInTheDocument();

    const uploadButton = screen.getByRole("button", { name: /Uploading/i });
    expect(uploadButton).toBeDisabled();
  });

  test("calls handleUploadClick when the upload button is clicked", () => {
    const hookReturn = buildHookReturn();
    useCustomerOverview.mockReturnValue(hookReturn);
    render(<Overview />);

    fireEvent.click(
      screen.getByRole("button", { name: /Upload Document/i })
    );

    expect(hookReturn.handleUploadClick).toHaveBeenCalledTimes(1);
  });

  test("calls handleFileChange when a file is selected", () => {
    const hookReturn = buildHookReturn();
    useCustomerOverview.mockReturnValue(hookReturn);
    const { container } = render(<Overview />);

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(hookReturn.handleFileChange).toHaveBeenCalledTimes(1);
  });

  test("restricts the file input to pdf/jpg/jpeg/png", () => {
    useCustomerOverview.mockReturnValue(buildHookReturn());
    const { container } = render(<Overview />);

    const fileInput = container.querySelector('input[type="file"]');

    expect(fileInput).toHaveAttribute("accept", ".pdf,.jpg,.jpeg,.png");
  });
});