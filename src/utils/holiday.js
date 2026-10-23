import * as XLSX from "xlsx-js-style";

export const exportHolidayExcel = (holidays = []) => {
  const workbook = XLSX.utils.book_new();

  const rows = [
    ["HOLIDAY REPORT"],
    [],
    [`Total Holidays: ${holidays.length}`],
    [],
    [
      "Sl No",
      "Date",
      "Day",
      "Description",
      "Holiday Type",
    ],
  ];

  holidays.forEach((holiday, index) => {
    rows.push([
      index + 1,
      holiday.date || "-",
      holiday.day || "-",
      holiday.description || "-",
      holiday.holiday_type_display || "-",
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws["!cols"] = [
    { wch: 10 },
    { wch: 18 },
    { wch: 18 },
    { wch: 35 },
    { wch: 25 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    ws,
    "Holiday Report"
  );

  XLSX.writeFile(
    workbook,
    "Holiday_Report.xlsx"
  );
};