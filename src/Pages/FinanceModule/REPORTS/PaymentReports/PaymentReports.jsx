
import React, { useMemo, useState } from "react";
import {
  FiDollarSign,
  FiCreditCard,
  FiAlertCircle,
  FiTrendingUp,
  FiDownload,
  FiActivity,
} from "react-icons/fi";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import PaymentTrendCharts from "./Chart/PaymentTrendCharts";

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
  TableWrapper,
  PaymentTable,
  TableHead,
  TableCell,
  StatusText,
  ExportButton,
  ChartsSide,
} from "./PaymentReports.styles";

const paymentData = [
  { id: 1, paymentId: "PAY-0001", date: "2026-06-02", type: "Customer Receipt", customer: "Al Noor Trading", reference: "INV-1025", method: "Bank Transfer", amount: 250000, status: "Completed", bank: "Riyad Bank" },
  { id: 2, paymentId: "PAY-0002", date: "2026-06-03", type: "Vendor Payment", customer: "Gulf Technologies", reference: "BILL-00125", method: "Bank Transfer", amount: 120000, status: "Completed", bank: "Al Rajhi" },
  { id: 3, paymentId: "PAY-0003", date: "2026-06-04", type: "Customer Receipt", customer: "Riyadh Supplies", reference: "INV-1080", method: "Credit Card", amount: 80000, status: "Pending", bank: "Riyad Bank" },
  { id: 4, paymentId: "PAY-0004", date: "2026-06-05", type: "Vendor Payment", customer: "Saudi Retail Group", reference: "BILL-00210", method: "Cheque", amount: 95000, status: "Completed", bank: "Riyad Bank" },
  { id: 5, paymentId: "PAY-0005", date: "2026-06-06", type: "Customer Receipt", customer: "Desert Manufacturing", reference: "INV-1025", method: "Cash", amount: 420000, status: "Pending", bank: "Al Rajhi" },
  { id: 6, paymentId: "PAY-0006", date: "2026-06-07", type: "Customer Receipt", customer: "Arabian Logistics", reference: "BILL-00125", method: "Bank Transfer", amount: 120000, status: "Completed", bank: "Riyad Bank" },
  { id: 7, paymentId: "PAY-0007", date: "2026-06-08", type: "Vendor Payment", customer: "Al Fahad Industries", reference: "INV-1080", method: "Credit Card", amount: 80000, status: "Completed", bank: "Al Rajhi" },
  { id: 8, paymentId: "PAY-0008", date: "2026-06-09", type: "Customer Receipt", customer: "Kingdom Electronics", reference: "BILL-00210", method: "Cheque", amount: 95000, status: "Completed", bank: "Riyad Bank" },
  { id: 9, paymentId: "PAY-0009", date: "2026-06-10", type: "Vendor Payment", customer: "Najd Trading Co.", reference: "INV-1080", method: "Cash", amount: 120000, status: "Pending", bank: "Al Rajhi" },
  { id: 10, paymentId: "PAY-0010", date: "2026-06-11", type: "Customer Receipt", customer: "Kingdom Electronics", reference: "INV-1025", method: "Bank Transfer", amount: 80000, status: "Completed", bank: "Riyad Bank" },
  { id: 11, paymentId: "PAY-0011", date: "2026-06-12", type: "Vendor Payment", customer: "Al Noor Trading", reference: "BILL-00310", method: "Bank Transfer", amount: 145000, status: "Completed", bank: "Al Rajhi" },
  { id: 12, paymentId: "PAY-0012", date: "2026-06-13", type: "Customer Receipt", customer: "Gulf Technologies", reference: "INV-1102", method: "Credit Card", amount: 215000, status: "Pending", bank: "Riyad Bank" },
  { id: 13, paymentId: "PAY-0013", date: "2026-06-14", type: "Vendor Payment", customer: "Riyadh Supplies", reference: "BILL-00325", method: "Cheque", amount: 110000, status: "Completed", bank: "Al Rajhi" },
  { id: 14, paymentId: "PAY-0014", date: "2026-06-15", type: "Customer Receipt", customer: "Saudi Retail Group", reference: "INV-1150", method: "Cash", amount: 90000, status: "Completed", bank: "Riyad Bank" },
  { id: 15, paymentId: "PAY-0015", date: "2026-06-16", type: "Vendor Payment", customer: "Desert Manufacturing", reference: "BILL-00410", method: "Bank Transfer", amount: 180000, status: "Pending", bank: "Al Rajhi" },
];

const formatSAR = (value) =>
  `SAR ${Number(value).toLocaleString("en-US")}`;

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const PaymentReports = () => {
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [paymentType, setPaymentType] = useState("all");
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [bank, setBank] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    return paymentData.filter((item) => {
      return (
        (!startDate || item.date >= startDate) &&
        (!endDate || item.date <= endDate) &&
        (paymentType === "all" || item.type === paymentType) &&
        (method === "all" || item.method === method) &&
        (status === "all" || item.status.toLowerCase() === status) &&
        (bank === "all" || item.bank === bank)
      );
    });
  }, [startDate, endDate, paymentType, method, status, bank]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / rowsPerPage)
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  };

  const exportReport = () => {
    const headers = [
      "Payment ID",
      "Date",
      "Type",
      "Customer / Vendor",
      "Reference",
      "Method",
      "Amount",
      "Status",
      "Bank Account",
    ];

    const rows = filteredData.map((item) => [
      item.paymentId,
      item.date,
      item.type,
      item.customer,
      item.reference,
      item.method,
      item.amount,
      item.status,
      item.bank,
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
    link.download = "payment-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    {
      title: "Total Payments",
      value: "2,845",
      icon: <FiDollarSign />,
      background: "#e8efff",
      color: "#3154b5",
    },
    {
      title: "Total Payment Value",
      value: "SAR 68.5M",
      icon: <FiActivity />,
      background: "#fff2e6",
      color: "#ff850c",
    },
    {
      title: "Amount Received",
      value: "SAR 41.2M",
      icon: <FiCreditCard />,
      background: "#dff4f7",
      color: "#19a8c2",
    },
    {
      title: "Amount Paid",
      value: "SAR 27.3M",
      icon: <FiAlertCircle />,
      background: "#f3dede",
      color: "#ed3434",
    },
    {
      title: "Pending Payments",
      value: "SAR 3.8M",
      icon: <FiTrendingUp />,
      background: "#eee5ff",
      color: "#8647ff",
    },
  ];

  return (
    <ReportPage>
      <ReusableHeader
        title="Payment Reports"
        breadcrumbs={["Reports", "Payment Reports"]}
      >
        <ExportButton type="button" onClick={exportReport}>
          Export Report <FiDownload />
        </ExportButton>
      </ReusableHeader>

      <KPIGrid>
        {kpis.map((item) => (
          <KPICard key={item.title}>
            <KPIIcon
              $background={item.background}
              $color={item.color}
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
            onChange={changeFilter(setStartDate)}
          />

          <span>-</span>

          <DateInput
            aria-label="End date"
            type="date"
            value={endDate}
            onChange={changeFilter(setEndDate)}
          />
        </DateFilter>

        <FilterSelect
          aria-label="Payment type"
          value={paymentType}
          onChange={changeFilter(setPaymentType)}
        >
          <option value="all">Payment Type (Customer / Vendor)</option>
          <option value="Customer Receipt">Customer Receipt</option>
          <option value="Vendor Payment">Vendor Payment</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Payment method"
          value={method}
          onChange={changeFilter(setMethod)}
        >
          <option value="all">Payment Method</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cheque">Cheque</option>
          <option value="Cash">Cash</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Payment status"
          value={status}
          onChange={changeFilter(setStatus)}
        >
          <option value="all">Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Bank account"
          value={bank}
          onChange={changeFilter(setBank)}
        >
          <option value="all">Bank Account</option>
          <option value="Riyad Bank">Riyad Bank</option>
          <option value="Al Rajhi">Al Rajhi</option>
        </FilterSelect>
      </FilterBar>

      <MainReportLayout>
        <TableSide>
          <TableWrapper>
            <PaymentTable>
              <TableHead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Customer /<br />Vendor</th>
                  <th>Reference</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Bank Account</th>
                </tr>
              </TableHead>

              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <TableCell>{item.paymentId}</TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.method}</TableCell>
                    <TableCell>{formatSAR(item.amount)}</TableCell>
                    <TableCell>
                      <StatusText $status={item.status}>
                        {item.status}
                      </StatusText>
                    </TableCell>
                    <TableCell>{item.bank}</TableCell>
                  </tr>
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="empty-state">
                      No payments match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </PaymentTable>
          </TableWrapper>

          <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TableSide>

        <ChartsSide>
          <PaymentTrendCharts />
        </ChartsSide>
      </MainReportLayout>
    </ReportPage>
  );
};

export default PaymentReports;