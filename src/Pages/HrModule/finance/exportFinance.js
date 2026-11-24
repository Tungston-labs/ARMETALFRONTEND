import * as XLSX from "xlsx";
import api from "../../../services/api"; // <-- your axios instance / API helper

const EXPORT_PAGE_SIZE = 1000;

// Fetch every page for the current filters (no UI pagination involved)
const fetchAllFinance = async (filters) => {
  const all = [];
  let page = 1;
  let totalPages = 1;

  do {
    // <-- use the same endpoint/param names your fetchFinanceList thunk uses
    const res = await api.get("/finance/", {
      params: { page, page_size: EXPORT_PAGE_SIZE, ...filters },
    });

    const data = res.data;
    all.push(...(data.results ?? data.list ?? []));
    totalPages = data.pagination?.totalPages ?? data.total_pages ?? 1;
    page += 1;
  } while (page <= totalPages);

  return all;
};

const toDDMMYYYY = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

export const exportFinanceToExcel = async (filters, currencyCode = "") => {
  const rows = await fetchAllFinance(filters);

  const sheetData = rows.map((row, i) => ({
    "Sl No": i + 1,
    Date: toDDMMYYYY(row.date),
    Category: row.category_name || "",
    Note: row.note || "",
    [`Income ${currencyCode}`.trim()]:
      row.payment_type === "IN" ? Number(row.amount) : "",
    [`Expense ${currencyCode}`.trim()]:
      row.payment_type === "OUT" ? Number(row.amount) : "",
    Status: row.payment_type === "IN" ? "Income" : "Expense",
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  worksheet["!cols"] = [
    { wch: 8 }, { wch: 12 }, { wch: 22 }, { wch: 40 },
    { wch: 16 }, { wch: 16 }, { wch: 10 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Finance");
  XLSX.writeFile(workbook, `finance_${new Date().toISOString().slice(0, 10)}.xlsx`);
};