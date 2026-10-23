import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import WarehouseContactCard from "../../Pages/inventory/WarehouseContactCard";

describe("WarehouseContactCard", () => {
  /* =========================================================
     BASIC RENDERING
  ========================================================= */

  it("renders all contact card labels", () => {
    render(
      <WarehouseContactCard
        manager="John Manager"
        phoneNumber="+966501234567"
        email="john@example.com"
        storageCapacity="10,000 units"
      />
    );

    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Email ID")).toBeInTheDocument();
    expect(screen.getByText("Storage Capacity")).toBeInTheDocument();
  });

  it("renders all provided values", () => {
    render(
      <WarehouseContactCard
        manager="John Manager"
        phoneNumber="+966501234567"
        email="john@example.com"
        storageCapacity="10,000 units"
      />
    );

    expect(screen.getByText("John Manager")).toBeInTheDocument();
    expect(
      screen.getByText("+966501234567")
    ).toBeInTheDocument();
    expect(
      screen.getByText("john@example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByText("10,000 units")
    ).toBeInTheDocument();
  });

  /* =========================================================
     MANAGER - STRING
  ========================================================= */

  it("renders manager when manager is a string", () => {
    render(
      <WarehouseContactCard
        manager="Ahmed Ali"
        phoneNumber="123456789"
        email="ahmed@example.com"
        storageCapacity="5000"
      />
    );

    expect(screen.getByText("Ahmed Ali")).toBeInTheDocument();
  });

  /* =========================================================
     MANAGER - OBJECT WITH NAME
  ========================================================= */

  it("renders manager name when manager is an object with name", () => {
    render(
      <WarehouseContactCard
        manager={{
          name: "Ahmed Ali",
        }}
        phoneNumber="123456789"
        email="ahmed@example.com"
        storageCapacity="5000"
      />
    );

    expect(screen.getByText("Ahmed Ali")).toBeInTheDocument();
  });

  /* =========================================================
     MANAGER - OBJECT WITH FULL NAME
  ========================================================= */

  it("renders full_name when manager name is unavailable", () => {
    render(
      <WarehouseContactCard
        manager={{
          full_name: "Ahmed Mohammed",
        }}
        phoneNumber="123456789"
        email="ahmed@example.com"
        storageCapacity="5000"
      />
    );

    expect(
      screen.getByText("Ahmed Mohammed")
    ).toBeInTheDocument();
  });

  /* =========================================================
     MANAGER - OBJECT WITH USERNAME
  ========================================================= */

  it("renders username when name and full_name are unavailable", () => {
    render(
      <WarehouseContactCard
        manager={{
          username: "ahmed123",
        }}
        phoneNumber="123456789"
        email="ahmed@example.com"
        storageCapacity="5000"
      />
    );

    expect(screen.getByText("ahmed123")).toBeInTheDocument();
  });

  /* =========================================================
     EMPTY OBJECT
  ========================================================= */

  it("renders dash when manager object has no display name", () => {
    render(
      <WarehouseContactCard
        manager={{}}
        phoneNumber="123456789"
        email="ahmed@example.com"
        storageCapacity="5000"
      />
    );

    const values = screen.getAllByText("-");

    expect(values.length).toBeGreaterThanOrEqual(1);
  });

  /* =========================================================
     NULL VALUES
  ========================================================= */

  it("renders dash for null values", () => {
    render(
      <WarehouseContactCard
        manager={null}
        phoneNumber={null}
        email={null}
        storageCapacity={null}
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(4);
  });

  /* =========================================================
     UNDEFINED VALUES
  ========================================================= */

  it("renders dash for undefined values", () => {
    render(<WarehouseContactCard />);

    expect(screen.getAllByText("-")).toHaveLength(4);
  });

  /* =========================================================
     EMPTY STRING VALUES
  ========================================================= */

  it("renders dash for empty string values", () => {
    render(
      <WarehouseContactCard
        manager=""
        phoneNumber=""
        email=""
        storageCapacity=""
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(4);
  });

  /* =========================================================
     PHONE NUMBER
  ========================================================= */

  it("renders phone number correctly", () => {
    render(
      <WarehouseContactCard
        manager="Manager"
        phoneNumber="+966 50 123 4567"
        email="manager@example.com"
        storageCapacity="1000"
      />
    );

    expect(
      screen.getByText("+966 50 123 4567")
    ).toBeInTheDocument();
  });

  it("converts numeric phone number to string", () => {
    render(
      <WarehouseContactCard
        manager="Manager"
        phoneNumber={9876543210}
        email="manager@example.com"
        storageCapacity="1000"
      />
    );

    expect(
      screen.getByText("9876543210")
    ).toBeInTheDocument();
  });

  /* =========================================================
     EMAIL
  ========================================================= */

  it("renders email correctly", () => {
    render(
      <WarehouseContactCard
        manager="Manager"
        phoneNumber="123456789"
        email="warehouse@example.com"
        storageCapacity="1000"
      />
    );

    expect(
      screen.getByText("warehouse@example.com")
    ).toBeInTheDocument();
  });

  /* =========================================================
     STORAGE CAPACITY
  ========================================================= */

  it("renders storage capacity correctly", () => {
    render(
      <WarehouseContactCard
        manager="Manager"
        phoneNumber="123456789"
        email="manager@example.com"
        storageCapacity="25,000 sq ft"
      />
    );

    expect(
      screen.getByText("25,000 sq ft")
    ).toBeInTheDocument();
  });

  it("converts numeric storage capacity to string", () => {
    render(
      <WarehouseContactCard
        manager="Manager"
        phoneNumber="123456789"
        email="manager@example.com"
        storageCapacity={50000}
      />
    );

    expect(
      screen.getByText("50000")
    ).toBeInTheDocument();
  });

  /* =========================================================
     OBJECT VALUES FOR OTHER PROPS
  ========================================================= */

  it("handles object value with name for phone number", () => {
    render(
      <WarehouseContactCard
        manager="Manager"
        phoneNumber={{ name: "Phone Contact" }}
        email="manager@example.com"
        storageCapacity="1000"
      />
    );

    expect(
      screen.getByText("Phone Contact")
    ).toBeInTheDocument();
  });

  it("handles object value with full_name for email", () => {
    render(
      <WarehouseContactCard
        manager="Manager"
        phoneNumber="123456789"
        email={{ full_name: "Email Contact" }}
        storageCapacity="1000"
      />
    );

    expect(
      screen.getByText("Email Contact")
    ).toBeInTheDocument();
  });

  it("handles object value with username for storage capacity", () => {
    render(
      <WarehouseContactCard
        manager="Manager"
        phoneNumber="123456789"
        email="manager@example.com"
        storageCapacity={{ username: "storage_user" }}
      />
    );

    expect(
      screen.getByText("storage_user")
    ).toBeInTheDocument();
  });

  /* =========================================================
     MIXED DATA
  ========================================================= */

  it("renders mixed valid and missing values correctly", () => {
    render(
      <WarehouseContactCard
        manager={{
          name: "Warehouse Manager",
        }}
        phoneNumber={null}
        email="manager@example.com"
        storageCapacity=""
      />
    );

    expect(
      screen.getByText("Warehouse Manager")
    ).toBeInTheDocument();

    expect(
      screen.getByText("manager@example.com")
    ).toBeInTheDocument();

    expect(screen.getAllByText("-")).toHaveLength(2);
  });

  /* =========================================================
     ZERO VALUES
  ========================================================= */

  it("renders zero values instead of dash", () => {
    render(
      <WarehouseContactCard
        manager="Manager"
        phoneNumber={0}
        email={0}
        storageCapacity={0}
      />
    );

    expect(screen.getAllByText("0")).toHaveLength(3);
  });

  /* =========================================================
     FALSE VALUES
  ========================================================= */

  it("renders false values as strings", () => {
    render(
      <WarehouseContactCard
        manager={false}
        phoneNumber={false}
        email={false}
        storageCapacity={false}
      />
    );

    expect(screen.getAllByText("false")).toHaveLength(4);
  });

  /* =========================================================
     SPECIAL OBJECT PRIORITY
  ========================================================= */

  it("prioritizes name over full_name and username", () => {
    render(
      <WarehouseContactCard
        manager={{
          name: "Name Value",
          full_name: "Full Name Value",
          username: "Username Value",
        }}
        phoneNumber="123"
        email="test@example.com"
        storageCapacity="1000"
      />
    );

    expect(screen.getByText("Name Value")).toBeInTheDocument();
    expect(
      screen.queryByText("Full Name Value")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Username Value")
    ).not.toBeInTheDocument();
  });

  it("prioritizes full_name over username", () => {
    render(
      <WarehouseContactCard
        manager={{
          full_name: "Full Name Value",
          username: "Username Value",
        }}
        phoneNumber="123"
        email="test@example.com"
        storageCapacity="1000"
      />
    );

    expect(
      screen.getByText("Full Name Value")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Username Value")
    ).not.toBeInTheDocument();
  });

  /* =========================================================
     COMPLETE COMPONENT
  ========================================================= */

  it("renders the complete warehouse contact card", () => {
    render(
      <WarehouseContactCard
        manager={{
          name: "Ahmed Ali",
        }}
        phoneNumber="+966501234567"
        email="ahmed@warehouse.com"
        storageCapacity="50,000 units"
      />
    );

    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Email ID")).toBeInTheDocument();
    expect(screen.getByText("Storage Capacity")).toBeInTheDocument();

    expect(screen.getByText("Ahmed Ali")).toBeInTheDocument();
    expect(
      screen.getByText("+966501234567")
    ).toBeInTheDocument();
    expect(
      screen.getByText("ahmed@warehouse.com")
    ).toBeInTheDocument();
    expect(
      screen.getByText("50,000 units")
    ).toBeInTheDocument();
  });
});

