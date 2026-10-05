import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// ---------------------------------------------------------------------------
// PATH SETUP: the component and its .styles file live in the same folder.
// Find it with:  find src -iname "VendorOverview*"
// Then replace OVERVIEW_DIR below (2 places: the import and the styles mock)
// with that folder relative to src, e.g.
//   Pages/FinanceModule/PURCHASES/Vendors/Overview
// Test location assumed: src/__tests__/Finance-Category/Purchase/
// ---------------------------------------------------------------------------
import VendorOverview from "../../../Pages/FinanceModule/PURCHASES/Vendors/Overview/VendorOverview";
import { getVendorOverview } from "../../../Redux/finance/purchases/Vendordetailslice";

// ---- react-redux / react-router: the component reads state.vendorDetail via
// useSelector, gets the vendor id from the route and dispatches getVendorOverview.
const { mockDispatch, hoisted } = vi.hoisted(() => ({
    mockDispatch: vi.fn(),
    hoisted: { state: {}, params: {} },
}));

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => selector(hoisted.state),
}));

vi.mock("react-router-dom", () => ({
    useParams: () => hoisted.params,
}));

vi.mock("../../../Redux/finance/purchases/Vendordetailslice", () => ({
    getVendorOverview: vi.fn((id) => ({ type: "getVendorOverview", payload: id })),
}));

vi.mock("lucide-react", () => {
    const icon = (name) => () => <svg data-testid={`icon-${name}`} />;
    return {
        Download: icon("Download"),
        FileText: icon("FileText"),
        PlusCircle: icon("PlusCircle"),
        Phone: icon("Phone"),
        Mail: icon("Mail"),
        BadgeCheck: icon("BadgeCheck"),
    };
});

// Styled components become plain elements
vi.mock("../../../Pages/FinanceModule/PURCHASES/Vendors/Overview/VendorOverview.styles", () => {
    const el =
        (Tag) =>
        ({ children, ...props }) => <Tag {...props}>{children}</Tag>;
    return {
        HeaderWrapper: el("div"),
        TopSection: el("div"),
        CompanyCard: el("div"),
        CompanyDetails: el("div"),
        CompanyName: el("h2"),
        CompanyText: el("p"),
        ContactCard: el("div"),
        ContactItem: el("div"),
        ContactTitle: el("div"),
        ContactValue: el("div"),
        InfoCard: el("div"),
        InfoItem: el("div"),
        InfoLabel: el("div"),
        InfoValue: el("div"),
        DocumentsCard: el("div"),
        DocumentsTitle: el("h3"),
        DocumentsContent: el("div"),
        DocumentsList: el("div"),
        DocumentItem: el("div"),
        DocumentIcon: el("div"),
        DocumentDetails: el("div"),
        DocumentName: el("span"),
        DocumentSize: el("span"),
        DownloadButton: el("button"),
        UploadButton: el("button"),
    };
});

// ---- fixtures ----

const vendor = {
    id: 7,
    vendor_id: "VEN00007",
    name: "ABC Trading LLC",
    billing_address: "Street 1, Business Bay",
    city: "Dubai",
    state: "Dubai",
    country: "UAE",
    postal: "12345",
    phno: "+971500000000",
    admin_email: "admin@abc.com",
    financial_email: "finance@abc.com",
    technical_email: "tech@abc.com",
    vendor_type_display: "Supplier",
    cr_number: "CR123",
    vat_registration_number: "VAT456",
    payment_term_display: "Net 30",
    payment_term: "net_30",
    credit_limit: "50000",
    opening_balance: "1250.5",
    currency: "AED",
    client_status_display: "Active",
};

const setDetail = (overrides = {}) => {
    hoisted.state = {
        vendorDetail: {
            vendor,
            overviewLoading: false,
            error: null,
            ...overrides,
        },
    };
};

// label span -> its wrapper div -> the item div; the value is the item's last child
const valueOf = (label) => screen.getByText(label).parentElement.parentElement.lastChild.textContent;

const getFileInput = (container) => container.querySelector('input[type="file"]');

const pdf = (name) => new File(["content"], name, { type: "application/pdf" });

describe("VendorOverview", () => {
    let user;
    let urlCounter;

    beforeEach(() => {
        user = userEvent.setup();
        vi.clearAllMocks();
        hoisted.params = { id: "7" };
        setDetail();

        urlCounter = 0;
        URL.createObjectURL = vi.fn(() => `blob:mock-${++urlCounter}`);
        URL.revokeObjectURL = vi.fn();
        vi.spyOn(window, "open").mockImplementation(() => null);
    });

    // ---- vendor id / fetching ----

    describe("vendor id and fetching", () => {
        it("dispatches getVendorOverview with the route param 'id'", () => {
            render(<VendorOverview />);

            expect(getVendorOverview).toHaveBeenCalledWith("7");
            expect(mockDispatch).toHaveBeenCalledWith({ type: "getVendorOverview", payload: "7" });
        });

        it("falls back to the route param 'vendorId'", () => {
            hoisted.params = { vendorId: "VEN00007" };
            render(<VendorOverview />);

            expect(getVendorOverview).toHaveBeenCalledWith("VEN00007");
        });

        it("prefers 'id' over 'vendorId'", () => {
            hoisted.params = { id: "7", vendorId: "99" };
            render(<VendorOverview />);

            expect(getVendorOverview).toHaveBeenCalledWith("7");
        });

        it("fetches only once on mount", () => {
            render(<VendorOverview />);

            expect(getVendorOverview).toHaveBeenCalledTimes(1);
        });

        it("refetches when the id in the URL changes", () => {
            const { rerender } = render(<VendorOverview />);

            hoisted.params = { id: "8" };
            rerender(<VendorOverview />);

            expect(getVendorOverview).toHaveBeenLastCalledWith("8");
            expect(getVendorOverview).toHaveBeenCalledTimes(2);
        });

        it("shows a message and does not fetch when there is no id", () => {
            hoisted.params = {};
            render(<VendorOverview />);

            expect(screen.getByText(/No vendor id in the URL/)).toBeInTheDocument();
            expect(screen.getByText(/Check the route param name \(none\)\./)).toBeInTheDocument();
            expect(getVendorOverview).not.toHaveBeenCalled();
        });

        it("lists the available route params in the message", () => {
            hoisted.params = { foo: "1", bar: "2" };
            render(<VendorOverview />);

            expect(screen.getByText(/\(foo, bar\)/)).toBeInTheDocument();
        });
    });

    // ---- loading / error / empty states ----

    describe("states", () => {
        it("shows a loading message while loading with no vendor data", () => {
            setDetail({ vendor: null, overviewLoading: true });
            render(<VendorOverview />);

            expect(screen.getByText("Loading vendor...")).toBeInTheDocument();
        });

        it("keeps showing the vendor while it reloads", () => {
            setDetail({ overviewLoading: true });
            render(<VendorOverview />);

            expect(screen.queryByText("Loading vendor...")).not.toBeInTheDocument();
            expect(screen.getByText("ABC Trading LLC")).toBeInTheDocument();
        });

        it("shows a string error when there is no vendor data", () => {
            setDetail({ vendor: null, error: "Server error" });
            render(<VendorOverview />);

            expect(screen.getByText("Server error")).toHaveStyle({ color: "#B00020" });
        });

        it("shows error.detail", () => {
            setDetail({ vendor: null, error: { detail: "Not found." } });
            render(<VendorOverview />);

            expect(screen.getByText("Not found.")).toBeInTheDocument();
        });

        it("flattens field errors into 'field: message | field: message'", () => {
            setDetail({ vendor: null, error: { id: ["Invalid", "Bad"], page: "Oops" } });
            render(<VendorOverview />);

            expect(screen.getByText("id: Invalid, Bad | page: Oops")).toBeInTheDocument();
        });

        it("falls back to a generic message for an error with no readable content", () => {
            setDetail({ vendor: null, error: {} });
            render(<VendorOverview />);

            expect(screen.getByText("Failed to load vendor.")).toBeInTheDocument();
        });

        it("prefers the vendor over an error when both exist", () => {
            setDetail({ error: "Server error" });
            render(<VendorOverview />);

            expect(screen.queryByText("Server error")).not.toBeInTheDocument();
            expect(screen.getByText("ABC Trading LLC")).toBeInTheDocument();
        });

        it("shows a 'no data' message when there is no vendor", () => {
            setDetail({ vendor: null });
            render(<VendorOverview />);

            expect(screen.getByText("No vendor data found (id: 7).")).toBeInTheDocument();
        });

        it("copes with the reducer not being registered", () => {
            hoisted.state = {};
            render(<VendorOverview />);

            expect(screen.getByText("No vendor data found (id: 7).")).toBeInTheDocument();
            expect(getVendorOverview).toHaveBeenCalledWith("7");
        });
    });

    // ---- stale vendor protection ----

    describe("vendor matching the URL", () => {
        it("does not show a different vendor's data (no flash of the previous vendor)", () => {
            setDetail({ vendor: { ...vendor, id: 99, vendor_id: "VEN00099", name: "Old Vendor" } });
            render(<VendorOverview />);

            expect(screen.queryByText("Old Vendor")).not.toBeInTheDocument();
            expect(screen.getByText("No vendor data found (id: 7).")).toBeInTheDocument();
        });

        it("shows the loading message instead of a stale vendor", () => {
            setDetail({
                vendor: { ...vendor, id: 99, vendor_id: "VEN00099", name: "Old Vendor" },
                overviewLoading: true,
            });
            render(<VendorOverview />);

            expect(screen.getByText("Loading vendor...")).toBeInTheDocument();
            expect(screen.queryByText("Old Vendor")).not.toBeInTheDocument();
        });

        it("matches the vendor by its code (e.g. VEN00007)", () => {
            hoisted.params = { id: "VEN00007" };
            render(<VendorOverview />);

            expect(screen.getByText("ABC Trading LLC")).toBeInTheDocument();
        });

        it("matches the vendor by a numeric id given as a string", () => {
            hoisted.params = { id: "7" };
            render(<VendorOverview />);

            expect(screen.getByText("ABC Trading LLC")).toBeInTheDocument();
        });
    });

    // ---- company card ----

    describe("company card", () => {
        it("shows the name, billing address and joined location", () => {
            render(<VendorOverview />);

            expect(screen.getByText("ABC Trading LLC")).toBeInTheDocument();
            expect(screen.getByText("Street 1, Business Bay")).toBeInTheDocument();
            expect(screen.getByText("Dubai, Dubai, UAE, 12345")).toBeInTheDocument();
        });

        it("skips missing location parts", () => {
            setDetail({ vendor: { ...vendor, state: "", postal: null } });
            render(<VendorOverview />);

            expect(screen.getByText("Dubai, UAE")).toBeInTheDocument();
        });

        it("shows an em dash for a missing name, address and location", () => {
            setDetail({
                vendor: {
                    ...vendor,
                    name: "",
                    billing_address: null,
                    city: "",
                    state: "",
                    country: "",
                    postal: "",
                },
            });
            render(<VendorOverview />);

            const details = screen.getByRole("heading", { level: 2 }).parentElement;
            expect(within(details).getAllByText("—")).toHaveLength(3);
        });
    });

    // ---- contact card ----

    describe("contact card", () => {
        it("shows the 4 contact details", () => {
            render(<VendorOverview />);

            expect(valueOf("Phone Number")).toBe("+971500000000");
            expect(valueOf("Admin Email")).toBe("admin@abc.com");
            expect(valueOf("Financial Email")).toBe("finance@abc.com");
            expect(valueOf("Technical Email")).toBe("tech@abc.com");
        });

        it("shows an em dash for missing contact details", () => {
            setDetail({
                vendor: { ...vendor, phno: null, admin_email: "", financial_email: undefined },
            });
            render(<VendorOverview />);

            expect(valueOf("Phone Number")).toBe("—");
            expect(valueOf("Admin Email")).toBe("—");
            expect(valueOf("Financial Email")).toBe("—");
            expect(valueOf("Technical Email")).toBe("tech@abc.com");
        });

        it("uses a phone icon and three mail icons", () => {
            render(<VendorOverview />);

            expect(screen.getAllByTestId("icon-Phone")).toHaveLength(1);
            expect(screen.getAllByTestId("icon-Mail")).toHaveLength(3);
        });
    });

    // ---- company info ----

    describe("company info", () => {
        it("shows all 8 info items", () => {
            render(<VendorOverview />);

            expect(screen.getAllByTestId("icon-BadgeCheck")).toHaveLength(8);
            expect(valueOf("Vendor ID")).toBe("VEN00007");
            expect(valueOf("Vendor Type")).toBe("Supplier");
            expect(valueOf("CR Number")).toBe("CR123");
            expect(valueOf("VAT Number")).toBe("VAT456");
            expect(valueOf("Payment Term")).toBe("Net 30");
            expect(valueOf("Status")).toBe("Active");
        });

        it("shows money with currency, grouping and 2 decimals", () => {
            render(<VendorOverview />);

            expect(valueOf("Credit Limit")).toBe("AED 50,000.00");
            expect(valueOf("Opening Balance")).toBe("AED 1,250.50");
        });

        it("shows money without a currency prefix when there is no currency", () => {
            setDetail({ vendor: { ...vendor, currency: "" } });
            render(<VendorOverview />);

            expect(valueOf("Credit Limit")).toBe("50,000.00");
        });

        it("shows a real zero amount as 0.00", () => {
            setDetail({ vendor: { ...vendor, credit_limit: 0 } });
            render(<VendorOverview />);

            expect(valueOf("Credit Limit")).toBe("AED 0.00");
        });

        it.each([null, undefined, "", "not-a-number"])(
            "shows an em dash for the money value %s",
            (value) => {
                setDetail({ vendor: { ...vendor, credit_limit: value, opening_balance: value } });
                render(<VendorOverview />);

                expect(valueOf("Credit Limit")).toBe("—");
                expect(valueOf("Opening Balance")).toBe("—");
            }
        );

        it("falls back to the raw payment term when there is no display value", () => {
            setDetail({ vendor: { ...vendor, payment_term_display: "" } });
            render(<VendorOverview />);

            expect(valueOf("Payment Term")).toBe("net_30");
        });

        it("shows an em dash for missing info values", () => {
            setDetail({
                vendor: {
                    ...vendor,
                    vendor_type_display: null,
                    cr_number: "",
                    vat_registration_number: undefined,
                    payment_term_display: "",
                    payment_term: "",
                    client_status_display: null,
                },
            });
            render(<VendorOverview />);

            ["Vendor Type", "CR Number", "VAT Number", "Payment Term", "Status"].forEach((label) => {
                expect(valueOf(label)).toBe("—");
            });
        });
    });

    // ---- documents ----

    describe("documents", () => {
        it("starts with an empty state", () => {
            render(<VendorOverview />);

            expect(screen.getByText("Documents")).toBeInTheDocument();
            expect(screen.getByText("No documents uploaded")).toBeInTheDocument();
            expect(screen.queryByTitle("Download")).not.toBeInTheDocument();
        });

        it("has a hidden file input that accepts pdf and images, multiple", () => {
            const { container } = render(<VendorOverview />);
            const input = getFileInput(container);

            expect(input).toHaveStyle({ display: "none" });
            expect(input).toHaveAttribute("accept", ".pdf,.jpg,.jpeg,.png");
            expect(input).toHaveAttribute("multiple");
        });

        it("opens the file picker when Upload Document is clicked", async () => {
            const { container } = render(<VendorOverview />);
            const clickSpy = vi.spyOn(getFileInput(container), "click");

            await user.click(screen.getByText("Upload Document"));

            expect(clickSpy).toHaveBeenCalledTimes(1);
        });

        it("lists an uploaded file with its name and date", async () => {
            const { container } = render(<VendorOverview />);

            await user.upload(getFileInput(container), pdf("invoice.pdf"));

            expect(screen.getByText("invoice.pdf")).toBeInTheDocument();
            expect(screen.queryByText("No documents uploaded")).not.toBeInTheDocument();
            expect(screen.getByText(new Date().toLocaleDateString())).toBeInTheDocument();
            expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
        });

        it("lists several files uploaded at once", async () => {
            const { container } = render(<VendorOverview />);

            await user.upload(getFileInput(container), [pdf("a.pdf"), pdf("b.pdf")]);

            expect(screen.getByText("a.pdf")).toBeInTheDocument();
            expect(screen.getByText("b.pdf")).toBeInTheDocument();
            expect(screen.getAllByTitle("Download")).toHaveLength(2);
        });

        it("appends to the list on later uploads", async () => {
            // unique ids even though everything happens within the same millisecond
            let t = 1000;
            vi.spyOn(Date, "now").mockImplementation(() => (t += 1000));

            const { container } = render(<VendorOverview />);
            await user.upload(getFileInput(container), pdf("first.pdf"));
            await user.upload(getFileInput(container), pdf("second.pdf"));

            expect(screen.getByText("first.pdf")).toBeInTheDocument();
            expect(screen.getByText("second.pdf")).toBeInTheDocument();
            expect(screen.getAllByTitle("Download")).toHaveLength(2);

            Date.now.mockRestore();
        });

        it("ignores a file picker that is closed without a selection", () => {
            const { container } = render(<VendorOverview />);

            fireEvent.change(getFileInput(container), { target: { files: [] } });

            expect(URL.createObjectURL).not.toHaveBeenCalled();
            expect(screen.getByText("No documents uploaded")).toBeInTheDocument();
        });

        it("opens the file in a new tab when Download is clicked", async () => {
            const { container } = render(<VendorOverview />);
            await user.upload(getFileInput(container), pdf("invoice.pdf"));

            await user.click(screen.getByTitle("Download"));

            expect(window.open).toHaveBeenCalledWith("blob:mock-1", "_blank");
        });

        it("releases every created object URL on unmount", async () => {
            const { container, unmount } = render(<VendorOverview />);
            await user.upload(getFileInput(container), [pdf("a.pdf"), pdf("b.pdf")]);
            expect(URL.revokeObjectURL).not.toHaveBeenCalled();

            unmount();

            expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
            expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-1");
            expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-2");
        });
    });
});