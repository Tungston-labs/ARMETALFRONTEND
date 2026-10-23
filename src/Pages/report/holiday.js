import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportHolidayPDF = (holidays = []) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Holiday Report", 14, 20);

  doc.setFontSize(11);
  doc.text(
    `Total Holidays: ${holidays.length}`,
    14,
    30
  );

  const tableData = holidays.map((holiday, index) => [
    index + 1,
    holiday.date || "-",
    holiday.day || "-",
    holiday.description || "-",
    holiday.holiday_type_display || "-",
  ]);

  autoTable(doc, {
    startY: 40,
    head: [[
      "Sl No",
      "Date",
      "Day",
      "Description",
      "Holiday Type",
    ]],
    body: tableData,
    theme: "grid",
  });

  doc.save("Holiday_Report.pdf");
};