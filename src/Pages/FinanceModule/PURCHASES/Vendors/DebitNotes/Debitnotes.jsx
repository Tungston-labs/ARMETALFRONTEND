import React, { useMemo, useState } from "react";
import {
  FiCalendar,
  FiDownload,
  FiEdit2,
  FiX,
} from "react-icons/fi";

import {
  debitNoteColumns,
  debitNoteData,
} from "./dummydata";

import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";

const DebitNote = () => {
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");

  const rowsPerPage = 8;

  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return debitNoteData.filter((row) => {
      const matchesSearch =
        !searchValue ||
        String(row.debitNoteNo || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(row.againstBill || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesReason =
        !reason ||
        reason === "All Reason" ||
        String(row.reason || "").toLowerCase() === reason.toLowerCase();

      const matchesStatus =
        !status ||
        status === "All Status" ||
        String(row.status || "").toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesReason && matchesStatus;
    });
  }, [search, reason, status]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return filteredData.slice(start, start + rowsPerPage);
  }, [currentPage, filteredData]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleReason = (value) => {
    setReason(value);
    setCurrentPage(1);
  };

  const handleStatus = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const statsCards = [
    {
      title: "Total Debit Notes",
      count: "07",
      icon: <FiCalendar />,
      backgroundColor: "#ECFDF5",
      iconColor: "#16A34A",
    },
    {
      title: "Total Debit Value",
      count: "SAR 5,940.00",
      icon: <FiCalendar />,
      backgroundColor: "#F3E8FF",
      iconColor: "#9333EA",
    },
    {
      title: "Applied to Bills",
      count: "SAR 4,210.00",
      icon: <FiCalendar />,
      backgroundColor: "#ECFDF5",
      iconColor: "#16A34A",
    },
    {
      title: "Pending / Unapplied",
      count: "SAR 1,730.00",
      icon: <FiCalendar />,
      backgroundColor: "#FFF7ED",
      iconColor: "#F97316",
    },
    {
      title: "Cancelled Note",
      count: "01",
      icon: <FiCalendar />,
      backgroundColor: "#FEF2F2",
      iconColor: "#EF4444",
    },
  ];

  const columns = useMemo(
    () =>
      debitNoteColumns.map((column) => {
        if (column.accessor !== "action") {
          return column;
        }

        return {
          ...column,
          render: (row) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <button
                type="button"
                title="Download"
                style={{
                  width: "24px",
                  height: "24px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <FiDownload size={13} />
              </button>

              {row.showEdit && (
                <button
                  type="button"
                  title="Edit"
                  style={{
                    width: "24px",
                    height: "24px",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <FiEdit2 size={13} />
                </button>
              )}

              {row.showDelete && (
                <button
                  type="button"
                  title="Delete"
                  style={{
                    width: "24px",
                    height: "24px",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "#EF4444",
                  }}
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          ),
        };
      }),
    [],
  );

  const dateRange = (
    <div
      style={{
        height: "30px",
        minWidth: "174px",
        padding: "0 9px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "4px",
        fontSize: "11px",
        color: "#333333",
        whiteSpace: "nowrap",
      }}
    >
      <span>01 Apr 2026 - 30 Apr 2026</span>
      <FiCalendar size={13} />
    </div>
  );

  return (
    <>
      <StatsCards cards={statsCards} />

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        searchPlaceholder="Search PO"
        status={reason}
        statuses={[
          "All Reason",
          "Damaged Goods",
          "Short Delivery",
          "Purchase Return",
          "Billing Error",
        ]}
        onStatus={handleReason}
        showSearch
        showStatus
        rightButton={dateRange}
      />

      <div
        style={{
          marginTop: "-1px",
        }}
      >
        <ReusableFilter
          search=""
          onSearch={() => {}}
          status={status}
          statuses={[
            "All Status",
            "Issued",
            "Pending",
            "Cancelled",
          ]}
          onStatus={handleStatus}
          showStatus
          showSearch={false}
        />
      </div>

      <ReusableTable
        columns={columns}
        data={paginatedData}
      />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default DebitNote;