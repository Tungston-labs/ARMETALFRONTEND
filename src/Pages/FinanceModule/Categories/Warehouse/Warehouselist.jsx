import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiDownload,
  FiHome,
  FiCheckCircle,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";

import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";

import StatsCards from "../../../../Components/StatsCards/StatsCards";

// Warehouse modal
import WarehouseModal from "../../../../Components/WarehouseModal/WarehouseModal";

import {
  employeeColumns,
  employeeData,
} from "../../../../Components/ReusableTable/dummydata";

const Warehouse = () => {
  /* =========================================
     NAVIGATION
  ========================================= */

  const navigate = useNavigate();

  /* =========================================
     STATE
  ========================================= */

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Warehouse modal state
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] =
    useState(false);

  const rowsPerPage = 20;

  /* =========================================
     WAREHOUSE STATISTICS
  ========================================= */

  const warehouseCards = [
    {
      count: "05",
      title: "Total Warehouses",
      icon: <FiHome size={20} />,
      backgroundColor: "#E8EDFF",
      iconColor: "#3454B9",
    },

    {
      count: "04",
      title: "Active Warehouses",
      icon: <FiCheckCircle size={20} />,
      backgroundColor: "#E8F7EE",
      iconColor: "#2E9B5B",
    },

    {
      count: "SAR 18.5M",
      title: "Total Stock Value",
      icon: <FiPackage size={20} />,
      backgroundColor: "#E9F8ED",
      iconColor: "#16A34A",
    },

    {
      count: "45,280 Units",
      title: "Total Stock Quantity",
      icon: <FiPackage size={20} />,
      backgroundColor: "#FFF0E5",
      iconColor: "#E67E22",
    },

    {
      count: "02",
      title: "Low Stock Warehouses",
      icon: <FiAlertCircle size={20} />,
      backgroundColor: "#FDEAEA",
      iconColor: "#D64545",
    },
  ];

  /* =========================================
     OPEN MODAL
  ========================================= */

  const handleAddWarehouse = () => {
    setIsWarehouseModalOpen(true);
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const handleCloseWarehouseModal = () => {
    setIsWarehouseModalOpen(false);
  };

  /* =========================================
     SAVE WAREHOUSE
  ========================================= */

  const handleSaveWarehouse = (warehouseData) => {
    console.log("Warehouse data:", warehouseData);

    /*
      Later you can put your API call here.

      Example:

      await createWarehouse(warehouseData);
    */

    setIsWarehouseModalOpen(false);
  };

  /* =========================================
     CLICK EMPLOYEE NAME
  ========================================= */

  const handleEmployeeClick = (employee) => {
    if (!employee?.id) {
      console.warn("Employee ID is missing:", employee);
      return;
    }

    navigate(`/employee/${employee.id}`);
  };

  /* =========================================
     CLICKABLE EMPLOYEE COLUMNS
  ========================================= */

  const clickableEmployeeColumns = useMemo(() => {
    if (!employeeColumns?.length) {
      return [];
    }

    return employeeColumns.map((column, index) => {
      /*
        Assuming the Employee Name is the
        first column after Sl No.

        If your employeeColumns already has
        an accessor like "employeeName", this
        will also work.
      */

      const isEmployeeNameColumn =
        column.accessor === "employeeName" ||
        column.accessor === "employee_name" ||
        column.accessor === "name" ||
        column.key === "employeeName" ||
        column.key === "employee_name" ||
        column.key === "name" ||
        index === 1;

      if (!isEmployeeNameColumn) {
        return column;
      }

      return {
        ...column,

        cell: (row) => {
          const employeeName =
            row?.[column.accessor] ??
            row?.[column.key] ??
            row?.employeeName ??
            row?.employee_name ??
            row?.name ??
            "";

          return (
            <button
              type="button"
              onClick={() => handleEmployeeClick(row)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                margin: 0,

                color: "#3454B9",

                fontFamily: "Poppins, sans-serif",
                fontSize: "12px",
                fontWeight: 500,

                cursor: "pointer",

                textAlign: "left",

                transition: "color 0.2s ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.textDecoration =
                  "underline";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.textDecoration =
                  "none";
              }}
            >
              {employeeName}
            </button>
          );
        },
      };
    });
  }, [employeeColumns]);

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.ceil(
    employeeData.length / rowsPerPage
  );

  const paginatedData = useMemo(() => {
    const start =
      (currentPage - 1) * rowsPerPage;

    return employeeData.slice(
      start,
      start + rowsPerPage
    );
  }, [currentPage]);

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div style={{ padding: 20 }}>

      {/* =====================================
          HEADER
      ===================================== */}

      <ReusableHeader
        title="Warehouse"
        breadcrumbs={["Warehouse"]}
      >
        <HeaderButton $variant="excel">
          <FiDownload />
          EXPORT EXCEL
        </HeaderButton>

        <HeaderButton onClick={handleAddWarehouse}>
          + ADD WAREHOUSE
        </HeaderButton>
      </ReusableHeader>

      {/* =====================================
          STATS CARDS
      ===================================== */}

      <StatsCards
        cards={warehouseCards}
        loading={false}
      />

      {/* =====================================
          FILTER
      ===================================== */}

      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}

        department={department}
        departments={[
          "HR",
          "Finance",
          "Development",
          "Marketing",
        ]}
        onDepartment={(value) => {
          setDepartment(value);
          setCurrentPage(1);
        }}

        status={status}
        statuses={[
          "Present",
          "Absent",
          "On Leave",
        ]}
        onStatus={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}

        showSearch
        showDepartment
        showStatus

        rightButton={
          <HeaderButton $variant="orange">
            Apply Filters
          </HeaderButton>
        }
      />

      {/* =====================================
          TABLE
      ===================================== */}

      <ReusableTable
        columns={clickableEmployeeColumns}
        data={paginatedData}
      />

      {/* =====================================
          PAGINATION
      ===================================== */}

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* =====================================
          WAREHOUSE MODAL
      ===================================== */}

      <WarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={handleCloseWarehouseModal}
        onSubmit={handleSaveWarehouse}
      />

    </div>
  );
};

export default Warehouse;