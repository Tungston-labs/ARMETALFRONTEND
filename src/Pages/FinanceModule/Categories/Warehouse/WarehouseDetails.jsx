import React from "react";

import {
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiBox,
  FiArchive,
  FiPackage,
  FiAlertTriangle,
} from "react-icons/fi";

import WarehouseInfoCard from "../../../../Components/WarehouseDetails/WarehouseInfoCard";
import WarehouseContactCard from "../../../../Components/WarehouseDetails/WarehouseContactCard";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";

import StatsCards from "../../../../Components/StatsCards/StatsCards";

import { Page, DetailsGrid } from "./WarehouseDetails.styles";

const WarehouseDetails = () => {
  /* =========================================
     WAREHOUSE DATA
  ========================================= */

  const warehouse = {
    name: "Riyadh Central Warehouse",
    date: "22 July 2022",

    type: "Main",

    totalProducts: "1250",

    stockQuantity: "45,280 Units",

    lowStockProducts: "14",

    outOfStockProducts: "03",

    manager: "George",

    phoneNumber: "+966 50 123 4567",

    email: "info@riyadhtech.sa",

    storageCapacity: "18,500",

    companyName: "Nexora Tech Solutions",

    addressLine1: "PO Box 12345, King Fahd Road",

    addressLine2: "Riyadh, Saudi Arabia",
  };

  /* =========================================
     WAREHOUSE STATISTICS
  ========================================= */

  const warehouseCards = [
    {
      count: warehouse.type,
      title: "Warehouses Type",
      icon: <FiBox size={20} />,
      backgroundColor: "#E8EDFF",
      iconColor: "#3454B9",
    },

    {
      count: warehouse.totalProducts,
      title: "Total Products",
      icon: <FiArchive size={20} />,
      backgroundColor: "#E4F7FB",
      iconColor: "#22A6C7",
    },

    {
      count: warehouse.stockQuantity,
      title: "Total Stock Quantity",
      icon: <FiPackage size={20} />,
      backgroundColor: "#E9F8ED",
      iconColor: "#16A34A",
    },

    {
      count: warehouse.lowStockProducts,
      title: "Low Stock Products",
      icon: <FiPackage size={20} />,
      backgroundColor: "#FFF2E5",
      iconColor: "#FF8500",
    },

    {
      count: warehouse.outOfStockProducts,
      title: "Out of Stock Products",
      icon: <FiAlertTriangle size={20} />,
      backgroundColor: "#FFECEC",
      iconColor: "#FF2D2D",
    },
  ];

  /* =========================================
     EDIT WAREHOUSE
  ========================================= */

  const handleEditWarehouse = () => {
    console.log("Edit warehouse:", warehouse);
  };

  /* =========================================
     DELETE WAREHOUSE
  ========================================= */

  const handleDeleteWarehouse = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${warehouse.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    console.log("Delete warehouse:", warehouse);
  };

  /* =========================================
     EXPORT WAREHOUSE
  ========================================= */

  const handleExportWarehouse = () => {
    console.log("Export warehouse:", warehouse);
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <Page>
      {/* =====================================
          HEADER
      ===================================== */}

      <ReusableHeader
        title={`${warehouse.name} - ${warehouse.date}`}
        breadcrumbs={["Dashboard", "Products", "Warehouse"]}
      >


        {/* EDIT */}

        <HeaderButton onClick={handleEditWarehouse}>
          <FiEdit2 />
          EDIT
        </HeaderButton>

        {/* DELETE */}

        <HeaderButton $variant="delete" onClick={handleDeleteWarehouse}>
          <FiTrash2 />
          DELETE
        </HeaderButton>
      </ReusableHeader>

      {/* =====================================
          STATS CARDS
      ===================================== */}

      <StatsCards cards={warehouseCards} loading={false} />

      {/* =====================================
          WAREHOUSE DETAILS
      ===================================== */}

      <DetailsGrid>
        {/* ===================================
            WAREHOUSE INFORMATION
        =================================== */}

        <WarehouseInfoCard
          image="/warehouse-logo.png"
          warehouseName={warehouse.name}
          companyName={warehouse.companyName}
          addressLine1={warehouse.addressLine1}
          addressLine2={warehouse.addressLine2}
        />

        {/* ===================================
            CONTACT INFORMATION
        =================================== */}

        <WarehouseContactCard
          manager={warehouse.manager}
          phoneNumber={warehouse.phoneNumber}
          email={warehouse.email}
          storageCapacity={warehouse.storageCapacity}
        />
      </DetailsGrid>
    </Page>
  );
};

export default WarehouseDetails;
