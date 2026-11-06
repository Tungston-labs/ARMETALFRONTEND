import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import WarehouseContactCard from "./WarehouseContactCard";

describe("WarehouseContactCard", () => {
  it("renders all contact field labels", () => {
    render(<WarehouseContactCard />);

    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Email ID")).toBeInTheDocument();
    expect(screen.getByText("Storage Capacity")).toBeInTheDocument();
  });

  it("renders all supplied contact values", () => {
    render(
      <WarehouseContactCard
        manager="Ajay"
        phoneNumber="9876543210"
        email="ajay@example.com"
        storageCapacity="1000 Units"
      />,
    );

    expect(screen.getByText("Ajay")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("ajay@example.com")).toBeInTheDocument();
    expect(screen.getByText("1000 Units")).toBeInTheDocument();
  });

  it("renders a dash for missing values", () => {
    render(
      <WarehouseContactCard
        manager={null}
        phoneNumber={undefined}
        email=""
        storageCapacity={null}
      />,
    );

    const fallbackValues = screen.getAllByText("-");
    expect(fallbackValues).toHaveLength(4);
  });

  it("renders manager object using name", () => {
    render(
      <WarehouseContactCard
        manager={{ name: "John" }}
      />,
    );

    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("renders manager object using full_name", () => {
    render(
      <WarehouseContactCard
        manager={{ full_name: "John Smith" }}
      />,
    );

    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("renders manager object using username", () => {
    render(
      <WarehouseContactCard
        manager={{ username: "john123" }}
      />,
    );

    expect(screen.getByText("john123")).toBeInTheDocument();
  });

  it("uses a dash for an empty manager object", () => {
    render(
      <WarehouseContactCard
        manager={{}}
      />,
    );

    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  it("converts numeric values to strings", () => {
    render(
      <WarehouseContactCard
        phoneNumber={1234567890}
        storageCapacity={500}
      />,
    );

    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("renders zero as a valid value", () => {
    render(
      <WarehouseContactCard
        storageCapacity={0}
      />,
    );

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});