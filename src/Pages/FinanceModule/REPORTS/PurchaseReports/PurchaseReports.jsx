
import React, { useMemo, useState } from "react";
import {
  FiCalendar,
  FiCreditCard,
  FiDownload,
  FiAlertCircle,
  FiTrendingUp,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import PurchaseTrendChart from "./Chart/PurchaseTrendChart";

import {
  ReportPage,
  KPIGrid,
  KPICard,
  KPIIcon,
  KPIInfo,
  KPIName,
  KPIValue,
  FilterBar,
  DateFilter,
  DateInput,
  FilterSelect,
  MainReportLayout,
  TableSide,
  PurchaseTable,
  TableWrapper,
  TableHead,
  TableCell,
  StatusText,
  ExportButton,
} from "./PurchaseReports.styles";

const purchaseData = [
  { id: 1, po: "PO-01", date: "2026-10-02", vendor: "Cisco Systems", items: "08", value: 125000, outstanding: 0, bill: "Delivered", payment: "Paid", category: "Electronics" },
  { id: 2, po: "PO-02", date: "2026-10-04", vendor: "Dell Technologies", items: "12", value: 125000, outstanding: 0, bill: "Partially", payment: "Paid", category: "Electronics" },
  { id: 3, po: "PO-03", date: "2026-10-04", vendor: "Huawei", items: "06", value: 125000, outstanding: 420000, bill: "Pending", payment: "Paid", category: "Electronics" },
  { id: 4, po: "PO-04", date: "2026-10-04", vendor: "HP Enterprise", items: "04", value: 125000, outstanding: 650000, bill: "Delivered", payment: "Partial", category: "Electronics" },
  { id: 5, po: "PO-05", date: "2026-10-04", vendor: "Schneider Electric", items: "15", value: 125000, outstanding: 420000, bill: "Delivered", payment: "Paid", category: "Electrical" },
  { id: 6, po: "PO-06", date: "2026-10-04", vendor: "Cisco Systems", items: "08", value: 125000, outstanding: 420000, bill: "Delivered", payment: "Unpaid", category: "Electronics" },
  { id: 7, po: "PO-07", date: "2026-10-04", vendor: "Dell Technologies", items: "12", value: 125000, outstanding: 0, bill: "Delivered", payment: "Paid", category: "Electronics" },
  { id: 8, po: "PO-08", date: "2026-10-04", vendor: "Huawei", items: "04", value: 125000, outstanding: 0, bill: "Delivered", payment: "Unpaid", category: "Electronics" },
  { id: 9, po: "PO-09", date: "2026-10-04", vendor: "Huawei", items: "12", value: 125000, outstanding: 0, bill: "Delivered", payment: "Partial", category: "Electronics" },
  { id: 10, po: "PO-10", date: "2026-10-04", vendor: "Huawei", items: "15", value: 125000, outstanding: 0, bill: "Delivered", payment: "Paid", category: "Electronics" },
  { id: 11, po: "PO-11", date: "2026-10-05", vendor: "HP Enterprise", items: "05", value: 185000, outstanding: 50000, bill: "Pending", payment: "Partial", category: "Hardware" },
  { id: 12, po: "PO-12", date: "2026-10-06", vendor: "Schneider Electric", items: "09", value: 215000, outstanding: 0, bill: "Delivered", payment: "Paid", category: "Electrical" },
  { id: 13, po: "PO-13", date: "2026-10-07", vendor: "Cisco Systems", items: "07", value: 95000, outstanding: 25000, bill: "Pending", payment: "Unpaid", category: "Electronics" },
  { id: 14, po: "PO-14", date: "2026-10-08", vendor: "Dell Technologies", items: "10", value: 175000, outstanding: 0, bill: "Delivered", payment: "Paid", category: "Electronics" },
  { id: 15, po: "PO-15", date: "2026-10-09", vendor: "Huawei", items: "03", value: 85000, outstanding: 85000, bill: "Pending", payment: "Unpaid", category: "Electronics" },
  { id: 16, po: "PO-16", date: "2026-10-10", vendor: "HP Enterprise", items: "11", value: 320000, outstanding: 0, bill: "Delivered", payment: "Paid", category: "Hardware" },
  { id: 17, po: "PO-17", date: "2026-10-11", vendor: "Schneider Electric", items: "06", value: 145000, outstanding: 45000, bill: "Partially", payment: "Partial", category: "Electrical" },
  { id: 18, po: "PO-18", date: "2026-10-12", vendor: "Cisco Systems", items: "08", value: 210000, outstanding: 0, bill: "Delivered", payment: "Paid", category: "Electronics" },
  { id: 19, po: "PO-19", date: "2026-10-13", vendor: "Dell Technologies", items: "14", value: 265000, outstanding: 65000, bill: "Pending", payment: "Partial", category: "Electronics" },
  { id: 20, po: "PO-20", date: "2026-10-14", vendor: "Huawei", items: "05", value: 115000, outstanding: 0, bill: "Delivered", payment: "Paid", category: "Electronics" },
];

const formatSAR = (value) =>
  `SAR ${Number(value).toLocaleString("en-US")}`;

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const PurchaseReports = () => {
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-04-30");
  const [vendor, setVendor] = useState("all");
  const [category, setCategory] = useState("all");
  const [purchaseStatus, setPurchaseStatus] = useState("all");
  const [billStatus, setBillStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    return purchaseData.filter((item) => {
      const matchesDate =
        (!startDate || item.date >= startDate) &&
        (!endDate || item.date <= endDate);

      const matchesVendor =
        vendor === "all" || item.vendor === vendor;

      const matchesCategory =
        category === "all" || item.category === category;

      const matchesPurchase =
        purchaseStatus === "all" ||
        (purchaseStatus === "delivered" && item.bill === "Delivered") ||
        (purchaseStatus === "pending" && item.bill === "Pending") ||
        (purchaseStatus === "partial" && item.bill === "Partially");

      const matchesBill =
        billStatus === "all" || item.bill.toLowerCase() === billStatus;

      const matchesPayment =
        paymentStatus === "all" ||
        item.payment.toLowerCase() === paymentStatus;

      return (
        matchesDate &&
        matchesVendor &&
        matchesCategory &&
        matchesPurchase &&
        matchesBill &&
        matchesPayment
      );
    });
  }, [
    startDate,
    endDate,
    vendor,
    category,
    purchaseStatus,
    billStatus,
    paymentStatus,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / rowsPerPage)
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  };

  const exportReport = () => {
    const headers = [
      "PO NO",
      "PO Date",
      "Vendor",
      "Items",
      "Purchase Value",
      "Outstanding Value",
      "Bill Status",
      "Payment Status",
    ];

    const rows = filteredData.map((item) => [
      item.po,
      item.date,
      item.vendor,
      item.items,
      item.value,
      item.outstanding,
      item.bill,
      item.payment,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "purchase-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const kpis = [
    {
      title: "Total Purchases",
      value: "SAR 48.5M",
      icon: <FiDollarSign />,
      color: "#e8efff",
      iconColor: "#3154b5",
    },
    {
      title: "Total PO",
      value: "1,245",
      icon: <FiFileText />,
      color: "#dff4f7",
      iconColor: "#19a8c2",
    },
    {
      title: "Payments Made",
      value: "SAR 42.8M",
      icon: <FiCreditCard />,
      color: "#fff2e6",
      iconColor: "#ff850c",
    },
    {
      title: "Purchase Returns",
      value: "SAR 480K",
      icon: <FiAlertCircle />,
      color: "#f3dede",
      iconColor: "#ed3434",
    },
    {
      title: "Outstanding Payables",
      value: "SAR 5.7M",
      icon: <FiTrendingUp />,
      color: "#eee5ff",
      iconColor: "#8647ff",
    },
  ];

  return (
    <ReportPage>
      <ReusableHeader
        title="Purchase Reports"
        breadcrumbs={["Reports", "Purchase Reports"]}
      >
        <ExportButton type="button" onClick={exportReport}>
          Export Report <FiDownload />
        </ExportButton>
      </ReusableHeader>

      <KPIGrid>
        {kpis.map((item) => (
          <KPICard key={item.title}>
            <KPIIcon
              $background={item.color}
              $color={item.iconColor}
            >
              {item.icon}
            </KPIIcon>

            <KPIInfo>
              <KPIName>{item.title}</KPIName>
              <KPIValue>{item.value}</KPIValue>
            </KPIInfo>
          </KPICard>
        ))}
      </KPIGrid>

      <FilterBar>
        <DateFilter>
          <DateInput
            aria-label="Start date"
            type="date"
            value={startDate}
            onChange={updateFilter(setStartDate)}
          />
          <span>-</span>
          <DateInput
            aria-label="End date"
            type="date"
            value={endDate}
            onChange={updateFilter(setEndDate)}
          />
          <FiCalendar />
        </DateFilter>

        <FilterSelect
          aria-label="Vendor"
          value={vendor}
          onChange={updateFilter(setVendor)}
        >
          <option value="all">All Vendor</option>
          <option>Cisco Systems</option>
          <option>Dell Technologies</option>
          <option>Huawei</option>
          <option>HP Enterprise</option>
          <option>Schneider Electric</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Product category"
          value={category}
          onChange={updateFilter(setCategory)}
        >
          <option value="all">All Product Category</option>
          <option>Electronics</option>
          <option>Electrical</option>
          <option>Hardware</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Purchase status"
          value={purchaseStatus}
          onChange={updateFilter(setPurchaseStatus)}
        >
          <option value="all">Purchase Status</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
          <option value="partial">Partially</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Bill status"
          value={billStatus}
          onChange={updateFilter(setBillStatus)}
        >
          <option value="all">Bill Status</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
          <option value="partially">Partially</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Payment status"
          value={paymentStatus}
          onChange={updateFilter(setPaymentStatus)}
        >
          <option value="all">Payment Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="unpaid">Unpaid</option>
        </FilterSelect>
      </FilterBar>

      <MainReportLayout>
        <TableSide>
          <TableWrapper>
            <PurchaseTable>
              <TableHead>
                <tr>
                  <th>PO NO</th>
                  <th>PO Date</th>
                  <th>Vendor</th>
                  <th>Items</th>
                  <th>Purchase<br />Value</th>
                  <th>Outstanding<br />Value</th>
                  <th>Bill<br />Status</th>
                  <th>Payment<br />Status</th>
                </tr>
              </TableHead>

              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <TableCell>{item.po}</TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.items}</TableCell>
                    <TableCell>{formatSAR(item.value)}</TableCell>
                    <TableCell>{formatSAR(item.outstanding)}</TableCell>
                    <TableCell>
                      <StatusText $status={item.bill}>
                        {item.bill}
                      </StatusText>
                    </TableCell>
                    <TableCell>
                      <StatusText $status={item.payment}>
                        {item.payment}
                      </StatusText>
                    </TableCell>
                  </tr>
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      No purchase orders match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </PurchaseTable>
          </TableWrapper>

          <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TableSide>

        <PurchaseTrendChart />
      </MainReportLayout>
    </ReportPage>
  );
};

export default PurchaseReports;