import React, { useMemo, useState } from "react";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";

import {
  employeeColumns,
  employeeData,
} from "../../../../Components/ReusableTable/dummydata";

import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";

import { FiDownload } from "react-icons/fi";

// IMPORT INVENTORY / STOCK ADJUSTMENT MODAL
import StockAdjustmentModal from "../../../../Components/InventoryModal/InventoryModal";

const InventoryList = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");

  const rowsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);

  // =======================================================
  // INVENTORY MODAL STATE
  // =======================================================

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  // =======================================================
  // PAGINATION
  // =======================================================

  const totalPages = Math.ceil(employeeData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return employeeData.slice(start, start + rowsPerPage);
  }, [currentPage]);

  // =======================================================
  // OPEN MODAL
  // =======================================================

  const handleAddInventory = () => {
    setIsInventoryModalOpen(true);
  };

  // =======================================================
  // CLOSE MODAL
  // =======================================================

  const handleCloseInventoryModal = () => {
    setIsInventoryModalOpen(false);
  };

  // =======================================================
  // SUBMIT INVENTORY
  // =======================================================

  const handleInventorySubmit = (formData) => {
    console.log("Inventory Adjustment Data:", formData);

    // API call can be added here

    setIsInventoryModalOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <ReusableHeader title="Categories" breadcrumbs={["Categories"]}>
        <HeaderButton $variant="excel">
          <FiDownload />
          EXPORT EXCEL
        </HeaderButton>

        <HeaderButton onClick={handleAddInventory}>
          + STOCK ADJUSTMENT
        </HeaderButton>
      </ReusableHeader>

      {/* =====================================================
          FILTER
      ===================================================== */}

      <ReusableFilter
        search={search}
        onSearch={setSearch}
        department={department}
        departments={["HR", "Finance", "Development", "Marketing"]}
        onDepartment={setDepartment}
        status={status}
        statuses={["Present", "Absent", "On Leave"]}
        onStatus={setStatus}
        showSearch
        showDepartment
        showStatus
        rightButton={
          <HeaderButton
            $variant="orange"
            // onClick={handleExportExcel}
          >
            Apply Filters
          </HeaderButton>
        }
      />

      {/* =====================================================
          TABLE
      ===================================================== */}

      <ReusableTable columns={employeeColumns} data={paginatedData} />

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* =====================================================
          INVENTORY / STOCK ADJUSTMENT MODAL
      ===================================================== */}

      <StockAdjustmentModal
        isOpen={isInventoryModalOpen}
        onClose={handleCloseInventoryModal}
        onSubmit={handleInventorySubmit}
      />
    </div>
  );
};

export default InventoryList;
