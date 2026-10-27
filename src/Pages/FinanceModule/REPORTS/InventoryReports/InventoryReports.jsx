import React, { useMemo, useState } from "react";
import { FiDownload, FiRefreshCw } from "react-icons/fi";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import InventoryMovementChart from "./Chart/InventoryMovementChart";
import useInventoryReport from "./useInventoryReport";
import { buildInventoryKpis, formatSAR, getRecordValue, getStockStatus } from "./InventoryReportsConfig";
import {
  ReportPage, ExportButton, KPIGrid, KPICard, KPIIcon, KPIInfo, KPIName, KPIValue,
  FilterBar, DateFilter, DateInput, FilterSelect, MainReportLayout, TableSide,
  TableWrapper, InventoryTable, TableHead, TableCell, StatusText, Message, PaginationRow,
} from "./InventoryReports.styles";

const PAGE_SIZE = 10;

const InventoryReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const filters = useMemo(() => ({ page: currentPage, page_size: PAGE_SIZE, ...(startDate ? { start_date: startDate } : {}), ...(endDate ? { end_date: endDate } : {}), ...(status !== "all" ? { status } : {}) }), [currentPage, startDate, endDate, status]);
  const { report, loading, error, loadReport } = useInventoryReport(filters);
  const records = Array.isArray(report.results) ? report.results : [];
  const kpis = buildInventoryKpis(report);

  const updateFilter = (setter) => (event) => { setter(event.target.value); setCurrentPage(1); };

  const exportReport = () => {
    const headers = ["Code", "Product", "Category", "Warehouse", "Available Quantity", "Reserved Quantity", "Reorder Level", "Inventory Value", "Stock Status"];
    const rows = records.map((item) => [
      getRecordValue(item, ["code", "product_code", "sku", "item_code"]),
      getRecordValue(item, ["product_name", "product", "name", "item_name"]),
      getRecordValue(item, ["category_name", "category"]),
      getRecordValue(item, ["warehouse_name", "warehouse"]),
      getRecordValue(item, ["available_quantity", "available", "quantity", "stock", "current_stock"]),
      getRecordValue(item, ["reserved_quantity", "reserved"]),
      getRecordValue(item, ["reorder_level", "reorder", "minimum_stock"]),
      getRecordValue(item, ["inventory_value", "value", "total_value", "stock_value"], 0),
      getStockStatus(item),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const totalPages = Number(report.total_pages || 0);

  return (
    <ReportPage>
      <ReusableHeader title="Inventory Reports" breadcrumbs={["Reports", "Inventory Reports"]}>
        <ExportButton type="button" onClick={exportReport} disabled={loading || records.length === 0}>
          <FiDownload /> Export Current Page
        </ExportButton>
        <ExportButton type="button" onClick={() => loadReport()} disabled={loading}>
          <FiRefreshCw /> Refresh
        </ExportButton>
      </ReusableHeader>

      {error && <Message $error>{typeof error === "string" ? error : JSON.stringify(error)}</Message>}
      <KPIGrid>
        {kpis.map((item) => {
          const Icon = item.icon;
          return <KPICard key={item.title}>
            <KPIIcon $background={item.background} $color={item.color}><Icon /></KPIIcon>
            <KPIInfo><KPIName>{item.title}</KPIName><KPIValue>{item.value}</KPIValue></KPIInfo>
          </KPICard>;
        })}
      </KPIGrid>

      <FilterBar>
        <DateFilter>
          <DateInput aria-label="Start date" type="date" value={startDate} onChange={updateFilter(setStartDate)} />
          <span>to</span>
          <DateInput aria-label="End date" type="date" value={endDate} min={startDate || undefined} onChange={updateFilter(setEndDate)} />
        </DateFilter>
        <FilterSelect aria-label="Stock status" value={status} onChange={updateFilter(setStatus)}>
          <option value="all">All stock statuses</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </FilterSelect>
      </FilterBar>

      <MainReportLayout>
        <TableSide>
          <TableWrapper>
            <InventoryTable>
              <TableHead><tr>
                <th>Code</th><th>Product</th><th>Category</th><th>Warehouse</th>
                <th>Available Qty</th><th>Reserved Qty</th><th>Reorder Level</th><th>Inventory Value</th><th>Stock Status</th>
              </tr></TableHead>
              <tbody>
                {loading && <tr><td colSpan={9}>Loading inventory report…</td></tr>}
                {!loading && records.map((item, index) => {
                  const itemStatus = getStockStatus(item);
                  return <tr key={item.id ?? item.pk ?? item.product_id ?? `${getRecordValue(item, ["code", "sku"], "item")}-${index}`}>
                    <TableCell>{getRecordValue(item, ["code", "product_code", "sku", "item_code"])}</TableCell>
                    <TableCell>{getRecordValue(item, ["product_name", "product", "name", "item_name"])}</TableCell>
                    <TableCell>{getRecordValue(item, ["category_name", "category"])}</TableCell>
                    <TableCell>{getRecordValue(item, ["warehouse_name", "warehouse"])}</TableCell>
                    <TableCell>{getRecordValue(item, ["available_quantity", "available", "quantity", "stock", "current_stock"])}</TableCell>
                    <TableCell>{getRecordValue(item, ["reserved_quantity", "reserved"])}</TableCell>
                    <TableCell>{getRecordValue(item, ["reorder_level", "reorder", "minimum_stock"])}</TableCell>
                    <TableCell>{formatSAR(getRecordValue(item, ["inventory_value", "value", "total_value", "stock_value"], 0))}</TableCell>
                    <TableCell><StatusText $status={itemStatus}>{itemStatus}</StatusText></TableCell>
                  </tr>;
                })}
                {!loading && records.length === 0 && <tr><td colSpan={9} className="empty-state">No inventory records found.</td></tr>}
              </tbody>
            </InventoryTable>
          </TableWrapper>
          <PaginationRow>
            <span>{`Page ${report.current_page || 1}${totalPages ? ` of ${totalPages}` : ""} · ${report.total_items || 0} total items`}</span>
            <ReusablePagination currentPage={Number(report.current_page || currentPage)} totalPages={Math.max(1, totalPages)} onPageChange={(page) => setCurrentPage(page)} />
          </PaginationRow>
          <Message>Stock quantity: {Number(report.total_stock_items || 0).toLocaleString("en-US")} · Inventory value: {formatSAR(report.total_inventory_value)}</Message>
        </TableSide>
        <InventoryMovementChart records={records} />
      </MainReportLayout>
    </ReportPage>
  );
};

export default InventoryReports;