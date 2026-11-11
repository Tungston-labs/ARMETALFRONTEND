import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdWarehouse, MdCheckCircle, MdCancel } from "react-icons/md"; // or your icon library

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import StatsCards from "../../../../Components/StatsCards/StatsCards"; // adjust path

import {
  fetchWarehouses,
  fetchWarehouseKpi,
  clearWarehouseError,
} from "../../../../Redux/finance/Product/warehouseSlice";

const PAGE_SIZE = 10;

const warehouseColumns = [
      { accessor: "code", header: "Warehouse Name" },
  { accessor: "warehouse_name", header: "Warehouse Name" },
  { accessor: "city", header: "Location" },
  { accessor: "manager_name", header: "Manager" },
  { accessor: "status", header: "Total units" },
    { accessor: "status", header: "Stock Value" },
      { accessor: "storage_capacity", header: "Capacity used" },
        { accessor: "status", header: "Status" },
          { accessor: "status", header: "Status" },
];

const WarehouseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { warehouses, totalPages, loading, error, kpi, kpiLoading } =
    useSelector((state) => state.warehouse);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    const params = { page: currentPage, page_size: PAGE_SIZE };
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status.toLowerCase();
    dispatch(fetchWarehouses(params));
  }, [dispatch, currentPage, debouncedSearch, status]);

  useEffect(() => {
    dispatch(fetchWarehouseKpi());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearWarehouseError());
    };
  }, [dispatch]);

  /* Stats cards config */
  const statsCards = useMemo(
    () => [
      {
        title: "Total Warehouses",
        count: kpi.total_warehouses,
        icon: <MdWarehouse size={22} />,
        backgroundColor: "#eff6ff",
        iconColor: "#2563eb",
        onClick: () => setStatus(""),
      },
      {
        title: "Active Warehouses",
        count: kpi.active_warehouses,
        icon: <MdCheckCircle size={22} />,
        backgroundColor: "#ecfdf5",
        iconColor: "#059669",
        onClick: () => setStatus("Active"),
      },
      {
        title: "Inactive Warehouses",
        count: kpi.inactive_warehouses,
        icon: <MdCancel size={22} />,
        backgroundColor: "#fef2f2",
        iconColor: "#dc2626",
        onClick: () => setStatus("Inactive"),
      },
    ],
    [kpi],
  );

  const tableData = useMemo(
    () =>
      warehouses.map((w) => ({
        ...w,
        status: w?.status
          ? w.status.charAt(0).toUpperCase() + w.status.slice(1)
          : "-",
      })),
    [warehouses],
  );

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Warehouses"
        breadcrumbs={["Dashboard", "Warehouses"]}
        buttonText="ADD NEW WAREHOUSE"
        onButtonClick={() => navigate("/warehouses/add")}
      />

      <StatsCards cards={statsCards} loading={kpiLoading} />

      <ReusableFilter
        search={search}
        onSearch={setSearch}
        status={status}
        statuses={["Active", "Inactive"]}
        onStatus={setStatus}
        showSearch
        showStatus
        showDepartment={false}
        showDate={false}
      />

      {error && (
        <div style={{ color: "#b91c1c", margin: "12px 0" }}>
          {typeof error === "string"
            ? error
            : error?.detail || "Something went wrong"}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 24 }}>Loading warehouses…</div>
      ) : (
        <ReusableTable columns={warehouseColumns} data={tableData} />
      )}

      <ReusablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default WarehouseList;