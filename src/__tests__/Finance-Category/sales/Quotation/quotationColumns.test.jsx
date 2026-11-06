
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { quotationColumns } from "./quotationColumns";

const createDependencies = () => {
    const dispatch = vi.fn();

    const convertQuotation = vi.fn((id) => ({
        type: "convertQuotation",
        payload: id,
    }));

    const fetchQuotationList = vi.fn((params) => ({
        type: "fetchQuotationList",
        payload: params,
    }));

    const fetchQuotationKpi = vi.fn(() => ({
        type: "fetchQuotationKpi",
    }));

    const fetchQuotationDetails = vi.fn((id) => ({
        type: "fetchQuotationDetails",
        payload: id,
    }));

    const showQuotation = vi.fn();
    const formatCurrency = vi.fn((value) => `SAR ${value}`);

    return {
        dispatch,
        convertQuotation,
        fetchQuotationList,
        fetchQuotationKpi,
        fetchQuotationDetails,
        showQuotation,
        formatCurrency,
    };
};

const renderColumn = (column, row) => {
    return render(<>{column.render(row)}</>);
};

describe("quotationColumns", () => {
    it("should return all quotation columns", () => {
        const dependencies = createDependencies();

        const columns = quotationColumns(dependencies);

        expect(columns).toHaveLength(8);

        expect(columns.map((column) => column.header)).toEqual([
            "Quote No.",
            "Customer",
            "Issue Date",
            "Valid Till",
            "Quote Amount",
            "Negotiation Amount",
            "Status",
            "Action",
        ]);
    });

    it("should render the quotation number", () => {
        const columns = quotationColumns(createDependencies());

        const column = columns.find(
            (item) => item.accessor === "quoteNumber"
        );

        renderColumn(column, {
            quoteNumber: "QT-001",
        });

        expect(screen.getByText("QT-001")).toBeInTheDocument();
    });

    it("should format the quotation amount", () => {
        const dependencies = createDependencies();
        const columns = quotationColumns(dependencies);

        const column = columns.find(
            (item) => item.accessor === "quoteAmount"
        );

        renderColumn(column, {
            quoteAmount: 1500,
        });

        expect(dependencies.formatCurrency).toHaveBeenCalledWith(1500);
        expect(screen.getByText("SAR 1500")).toBeInTheDocument();
    });

    it.each([
        ["Approved", "#e8f7ee"],
        ["Pending", "#fff0ec"],
        ["Rejected", "#fdebea"],
        ["Draft", "#f5f7fb"],
    ])("should render %s status with the expected background", (status, background) => {
        const columns = quotationColumns(createDependencies());

        const column = columns.find(
            (item) => item.accessor === "status"
        );

        renderColumn(column, { status });

        const statusElement = screen.getByText(status);

        expect(statusElement).toBeInTheDocument();
        expect(statusElement).toHaveStyle({
            background,
        });
    });

    it("should convert quotation and refresh the list and KPI", async () => {
        const dependencies = createDependencies();

        dependencies.dispatch.mockReturnValue({
            unwrap: () => Promise.resolve({ success: true }),
        });

        const columns = quotationColumns({
            ...dependencies,
            currentPage: 2,
            rowsPerPage: 10,
        });

        const actionColumn = columns.find(
            (item) => item.accessor === "action"
        );

        renderColumn(actionColumn, {
            id: 101,
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Convert SO",
            })
        );

        expect(dependencies.convertQuotation).toHaveBeenCalledWith(101);

        await waitFor(() => {
            expect(dependencies.fetchQuotationList).toHaveBeenCalledWith({
                page: 2,
                page_size: 10,
            });

            expect(dependencies.fetchQuotationKpi).toHaveBeenCalled();
        });
    });

    it("should not refresh the list if conversion fails", async () => {
        const dependencies = createDependencies();

        dependencies.dispatch.mockReturnValue({
            unwrap: () => Promise.reject(new Error("Conversion failed")),
        });

        const columns = quotationColumns(dependencies);

        const actionColumn = columns.find(
            (item) => item.accessor === "action"
        );

        renderColumn(actionColumn, { id: 101 });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Convert SO",
            })
        );

        await waitFor(() => {
            expect(dependencies.dispatch).toHaveBeenCalled();
        });

        expect(dependencies.fetchQuotationList).not.toHaveBeenCalled();
        expect(dependencies.fetchQuotationKpi).not.toHaveBeenCalled();
    });

    it("should fetch quotation details and display the quotation", async () => {
        const dependencies = createDependencies();

        const quotationDetails = {
            id: 101,
            quotation_number: "QT-101",
        };

        dependencies.dispatch.mockReturnValue({
            unwrap: () => Promise.resolve(quotationDetails),
        });

        const columns = quotationColumns(dependencies);

        const actionColumn = columns.find(
            (item) => item.accessor === "action"
        );

        renderColumn(actionColumn, { id: 101 });

        fireEvent.click(
            screen.getByTitle("View quotation")
        );

        await waitFor(() => {
            expect(dependencies.fetchQuotationDetails).toHaveBeenCalledWith(101);
            expect(dependencies.showQuotation).toHaveBeenCalledWith(
                quotationDetails
            );
        });
    });

    it("should handle quotation detail request failure", async () => {
        const dependencies = createDependencies();

        dependencies.dispatch.mockReturnValue({
            unwrap: () => Promise.reject(new Error("Details failed")),
        });

        const columns = quotationColumns(dependencies);

        const actionColumn = columns.find(
            (item) => item.accessor === "action"
        );

        renderColumn(actionColumn, { id: 101 });

        fireEvent.click(
            screen.getByTitle("View quotation")
        );

        await waitFor(() => {
            expect(dependencies.fetchQuotationDetails).toHaveBeenCalledWith(101);
        });

        expect(dependencies.showQuotation).not.toHaveBeenCalled();
    });

    it("should render download and delete buttons", () => {
        const columns = quotationColumns(createDependencies());

        const actionColumn = columns.find(
            (item) => item.accessor === "action"
        );

        renderColumn(actionColumn, { id: 101 });

        expect(
            screen.getByTitle("Download quotation")
        ).toBeInTheDocument();

        expect(
            screen.getByTitle("Delete quotation")
        ).toBeInTheDocument();
    });
});
