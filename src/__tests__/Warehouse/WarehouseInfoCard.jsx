import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import WarehouseInfoCard from "../../Pages/inventory/WarehouseInfoCard";

describe("WarehouseInfoCard", () => {
  /* =========================================================
     COMPLETE COMPONENT
  ========================================================= */

  it("renders all warehouse information correctly", () => {
    render(
      <WarehouseInfoCard
        image="/images/warehouse.jpg"
        warehouseName="Main Warehouse"
        companyName="Armetal Company"
        addressLine1="123 Industrial Area"
        addressLine2="Warehouse Street"
        city="Riyadh"
      />
    );

    expect(
      screen.getByText("Main Warehouse")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Armetal Company")
    ).toBeInTheDocument();

    expect(
      screen.getByText("123 Industrial Area")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Warehouse Street")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Riyadh")
    ).toBeInTheDocument();
  });

  /* =========================================================
     WAREHOUSE NAME
  ========================================================= */

  it("renders warehouse name", () => {
    render(
      <WarehouseInfoCard
        warehouseName="Central Warehouse"
      />
    );

    expect(
      screen.getByText("Central Warehouse")
    ).toBeInTheDocument();
  });

  it("renders dash when warehouse name is missing", () => {
    render(
      <WarehouseInfoCard
        warehouseName={null}
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(4);
  });

  it("renders dash when warehouse name is undefined", () => {
    render(<WarehouseInfoCard />);

    expect(screen.getAllByText("-")).toHaveLength(5);
  });

  it("renders dash when warehouse name is empty", () => {
    render(
      <WarehouseInfoCard
        warehouseName=""
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(5);
  });

  /* =========================================================
     COMPANY NAME
  ========================================================= */

  it("renders company name", () => {
    render(
      <WarehouseInfoCard
        companyName="Armetal Industries"
      />
    );

    expect(
      screen.getByText("Armetal Industries")
    ).toBeInTheDocument();
  });

  it("renders dash when company name is null", () => {
    render(
      <WarehouseInfoCard
        companyName={null}
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(5);
  });

  it("renders dash when company name is empty", () => {
    render(
      <WarehouseInfoCard
        companyName=""
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(5);
  });

  /* =========================================================
     ADDRESS LINE 1
  ========================================================= */

  it("renders address line 1", () => {
    render(
      <WarehouseInfoCard
        addressLine1="King Fahd Road"
      />
    );

    expect(
      screen.getByText("King Fahd Road")
    ).toBeInTheDocument();
  });

  it("renders dash when address line 1 is missing", () => {
    render(
      <WarehouseInfoCard
        addressLine1={null}
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(5);
  });

  /* =========================================================
     ADDRESS LINE 2
  ========================================================= */

  it("renders address line 2", () => {
    render(
      <WarehouseInfoCard
        addressLine2="Building 25"
      />
    );

    expect(
      screen.getByText("Building 25")
    ).toBeInTheDocument();
  });

  it("renders dash when address line 2 is missing", () => {
    render(
      <WarehouseInfoCard
        addressLine2={undefined}
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(5);
  });

  /* =========================================================
     CITY
  ========================================================= */

  it("renders city", () => {
    render(
      <WarehouseInfoCard
        city="Jeddah"
      />
    );

    expect(
      screen.getByText("Jeddah")
    ).toBeInTheDocument();
  });

  it("renders dash when city is missing", () => {
    render(
      <WarehouseInfoCard
        city={null}
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(5);
  });

  it("renders dash when city is empty", () => {
    render(
      <WarehouseInfoCard
        city=""
      />
    );

    expect(screen.getAllByText("-")).toHaveLength(5);
  });

  /* =========================================================
     IMAGE
  ========================================================= */

  it("renders custom warehouse image", () => {
    render(
      <WarehouseInfoCard
        image="/images/main-warehouse.jpg"
        warehouseName="Main Warehouse"
      />
    );

    const image = screen.getByRole("img", {
      name: "Main Warehouse",
    });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "/images/main-warehouse.jpg"
    );
  });

  it("uses default warehouse image when image is missing", () => {
    render(
      <WarehouseInfoCard
        warehouseName="Main Warehouse"
      />
    );

    const image = screen.getByRole("img", {
      name: "Main Warehouse",
    });

    expect(image).toHaveAttribute(
      "src",
      "/warehouse-logo.png"
    );
  });

  it("uses default warehouse image when image is null", () => {
    render(
      <WarehouseInfoCard
        image={null}
        warehouseName="Warehouse"
      />
    );

    const image = screen.getByRole("img", {
      name: "Warehouse",
    });

    expect(image).toHaveAttribute(
      "src",
      "/warehouse-logo.png"
    );
  });

  it("uses default warehouse image when image is empty", () => {
    render(
      <WarehouseInfoCard
        image=""
        warehouseName="Warehouse"
      />
    );

    const image = screen.getByRole("img", {
      name: "Warehouse",
    });

    expect(image).toHaveAttribute(
      "src",
      "/warehouse-logo.png"
    );
  });

  /* =========================================================
     IMAGE ALT
  ========================================================= */

  it("uses warehouse name as image alt text", () => {
    render(
      <WarehouseInfoCard
        image="/warehouse.jpg"
        warehouseName="Dubai Warehouse"
      />
    );

    expect(
      screen.getByRole("img", {
        name: "Dubai Warehouse",
      })
    ).toBeInTheDocument();
  });

  it("uses Warehouse as image alt when warehouse name is missing", () => {
    render(
      <WarehouseInfoCard
        image="/warehouse.jpg"
      />
    );

    expect(
      screen.getByRole("img", {
        name: "Warehouse",
      })
    ).toBeInTheDocument();
  });

  it("uses Warehouse as image alt when warehouse name is empty", () => {
    render(
      <WarehouseInfoCard
        image="/warehouse.jpg"
        warehouseName=""
      />
    );

    expect(
      screen.getByRole("img", {
        name: "Warehouse",
      })
    ).toBeInTheDocument();
  });

  /* =========================================================
     NUMERIC VALUES
  ========================================================= */

  it("converts numeric values to strings", () => {
    render(
      <WarehouseInfoCard
        warehouseName={123}
        companyName={456}
        addressLine1={789}
        addressLine2={100}
        city={200}
      />
    );

    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("456")).toBeInTheDocument();
    expect(screen.getByText("789")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  /* =========================================================
     ZERO VALUES
  ========================================================= */

  it("renders zero values instead of dash", () => {
    render(
      <WarehouseInfoCard
        warehouseName={0}
        companyName={0}
        addressLine1={0}
        addressLine2={0}
        city={0}
      />
    );

    expect(screen.getAllByText("0")).toHaveLength(5);
  });

  /* =========================================================
     BOOLEAN VALUES
  ========================================================= */

  it("converts boolean values to strings", () => {
    render(
      <WarehouseInfoCard
        warehouseName={true}
        companyName={false}
        addressLine1={true}
        addressLine2={false}
        city={true}
      />
    );

    expect(screen.getAllByText("true")).toHaveLength(3);
    expect(screen.getAllByText("false")).toHaveLength(2);
  });

  /* =========================================================
     MIXED VALUES
  ========================================================= */

  it("renders valid and missing values together correctly", () => {
    render(
      <WarehouseInfoCard
        warehouseName="Main Warehouse"
        companyName={null}
        addressLine1="Industrial Area"
        addressLine2=""
        city="Riyadh"
      />
    );

    expect(
      screen.getByText("Main Warehouse")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Industrial Area")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Riyadh")
    ).toBeInTheDocument();

    expect(screen.getAllByText("-")).toHaveLength(2);
  });

  /* =========================================================
     COMPLETE DEFAULT PROPS
  ========================================================= */

  it("renders correctly when no props are provided", () => {
    render(<WarehouseInfoCard />);

    expect(screen.getAllByText("-")).toHaveLength(5);

    const image = screen.getByRole("img", {
      name: "Warehouse",
    });

    expect(image).toHaveAttribute(
      "src",
      "/warehouse-logo.png"
    );
  });
});

