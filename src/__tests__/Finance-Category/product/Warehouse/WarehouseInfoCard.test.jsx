import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import WarehouseInfoCard from "./WarehouseInfoCard";

describe("WarehouseInfoCard", () => {
  it("renders the warehouse name", () => {
    render(<WarehouseInfoCard warehouseName="Main Warehouse" />);

    expect(screen.getByText("Main Warehouse")).toBeInTheDocument();
  });

  it("renders the company name", () => {
    render(<WarehouseInfoCard companyName="Armetal Pvt Ltd" />);

    expect(screen.getByText("Armetal Pvt Ltd")).toBeInTheDocument();
  });

  it("renders all address fields", () => {
    render(
      <WarehouseInfoCard
        addressLine1="Industrial Area"
        addressLine2="Building 5"
        city="Kochi"
      />,
    );

    expect(screen.getByText("Industrial Area")).toBeInTheDocument();
    expect(screen.getByText("Building 5")).toBeInTheDocument();
    expect(screen.getByText("Kochi")).toBeInTheDocument();
  });

  it("renders a dash for missing values", () => {
    render(
      <WarehouseInfoCard
        warehouseName={null}
        companyName={undefined}
        addressLine1=""
        addressLine2={null}
        city={undefined}
      />,
    );

    expect(screen.getAllByText("-")).toHaveLength(5);
  });

  it("uses the supplied image source", () => {
    render(
      <WarehouseInfoCard
        image="/custom-warehouse.png"
        warehouseName="Main Warehouse"
      />,
    );

    const image = screen.getByRole("img", {
      name: "Main Warehouse",
    });

    expect(image).toHaveAttribute("src", "/custom-warehouse.png");
  });

  it("uses the default image when image is not supplied", () => {
    render(<WarehouseInfoCard warehouseName="Main Warehouse" />);

    expect(screen.getByRole("img", { name: "Main Warehouse" })).toHaveAttribute(
      "src",
      "/warehouse-logo.png",
    );
  });

  it("uses Warehouse as the image alt text when warehouse name is missing", () => {
    render(<WarehouseInfoCard />);

    expect(screen.getByRole("img", { name: "Warehouse" })).toBeInTheDocument();
  });

  it("converts numeric field values to strings", () => {
    render(<WarehouseInfoCard warehouseName={100} city={682001} />);

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("682001")).toBeInTheDocument();
  });

  it("renders zero as a valid field value", () => {
    render(<WarehouseInfoCard warehouseName={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
