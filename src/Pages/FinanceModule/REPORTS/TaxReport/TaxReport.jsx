
import React, { useMemo, useState } from "react";
import { FiDownload, FiDollarSign, FiActivity, FiCreditCard, FiAlertCircle, FiTrendingUp } from "react-icons/fi";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import TaxCollectionCharts from "./Chart/TaxCollectionCharts";

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
  ExportButton,
  MainReportLayout,
  TableSide,
  TableWrapper,
  TaxTable,
  TableHead,
  TableCell,
} from "./TaxReport.styles";

const taxData = [
  { id: 1, invoice: "INV-1001", date: "02 Jun 2026", type: "Sales", customer: "Al Noor Trading", taxable: "Travel", tax: 4500, taxType: "Approved", status: "Paid", taxTypeFilter: "VAT" },
  { id: 2, invoice: "BILL-2045", date: "03 Jun 2026", type: "Purchase", customer: "Gulf Technologies", taxable: "Training", tax: 2200, taxType: "Pending", status: "Pending", taxTypeFilter: "GST" },
  { id: 3, invoice: "INV-1002", date: "04 Jun 2026", type: "Sales", customer: "Riyadh Supplies", taxable: "Fuel", tax: 850, taxType: "Approved", status: "Paid", taxTypeFilter: "VAT" },
  { id: 4, invoice: "BILL-2050", date: "05 Jun 2026", type: "Purchase", customer: "Saudi Retail Group", taxable: "Maintenance", tax: 6800, taxType: "Approved", status: "Paid", taxTypeFilter: "GST" },
  { id: 5, invoice: "INV-1001", date: "05 Jun 2026", type: "Sales", customer: "Desert Manufacturing", taxable: "Travel", tax: 4500, taxType: "Approved", status: "Paid", taxTypeFilter: "VAT" },
  { id: 6, invoice: "BILL-2045", date: "06 Jun 2026", type: "Purchase", customer: "Gulf Technologies", taxable: "Training", tax: 2200, taxType: "Approved", status: "Paid", taxTypeFilter: "GST" },
  { id: 7, invoice: "INV-1002", date: "07 Jun 2026", type: "Sales", customer: "Al Noor Trading", taxable: "Fuel", tax: 850, taxType: "Pending", status: "Paid", taxTypeFilter: "VAT" },
  { id: 8, invoice: "BILL-2050", date: "08 Jun 2026", type: "Purchase", customer: "Saudi Retail Group", taxable: "Maintenance", tax: 4500, taxType: "Approved", status: "Paid", taxTypeFilter: "GST" },
  { id: 9, invoice: "INV-1001", date: "09 Jun 2026", type: "Sales", customer: "Najd Trading Co.", taxable: "Travel", tax: 2200, taxType: "Approved", status: "Pending", taxTypeFilter: "VAT" },
  { id: 10, invoice: "BILL-2045", date: "10 Jun 2026", type: "Purchase", customer: "Kingdom Electronics", taxable: "Fuel", tax: 850, taxType: "Approved", status: "Paid", taxTypeFilter: "GST" },
];

const kpis = [
  { title: "Total Tax Collected", value: "SAR 4.25M", icon: FiDollarSign, bg: "#e8efff", color: "#3154b5" },
  { title: "Input Tax Credit", value: "SAR 2.95M", icon: FiActivity, bg: "#fff2e6", color: "#ff850c" },
  { title: "Net Tax Payable", value: "SAR 1.30M", icon: FiCreditCard, bg: "#dff4f7", color: "#19a8c2" },
  { title: "Taxable Sales", value: "SAR 28.4M", icon: FiAlertCircle, bg: "#f3dede", color: "#ed3434" },
  { title: "Total Expense Claims", value: "SAR 19.7M", icon: FiTrendingUp, bg: "#eee5ff", color: "#8647ff" },
];

const TaxReport = () => {
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-04-30");
  const [taxType, setTaxType] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [vendor, setVendor] = useState("all");
  const [invoiceType, setInvoiceType] = useState("all");
  const [taxStatus, setTaxStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    return taxData.filter((item) => {
      const matchesTaxType =
        taxType === "all" || item.taxTypeFilter === taxType;

      const matchesCustomer =
        customer === "all" || item.customer === customer;

      const matchesVendor =
        vendor === "all" || item.customer === vendor;

      const matchesInvoiceType =
        invoiceType === "all" || item.type === invoiceType;

      const matchesTaxStatus =
        taxStatus === "all" || item.taxType === taxStatus;

      return (
        matchesTaxType &&
        matchesCustomer &&
        matchesVendor &&
        matchesInvoiceType &&
        matchesTaxStatus
      );
    });
  }, [taxType, customer, vendor, invoiceType, taxStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const handleFilter = (setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  };

  const exportReport = () => {
    const headers = [
      "Invoice/Bill No",
      "Date",
      "Type",
      "Customer/Vendor",
      "Taxable Amount",
      "Tax Amount",
      "Tax Type",
      "Status",
    ];

    const rows = filteredData.map((item) => [
      item.invoice,
      item.date,
      item.type,
      item.customer,
      item.taxable,
      item.tax,
      item.taxType,
      item.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tax-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <ReportPage>
      <ReusableHeader
        title="Tax Report"
        breadcrumbs={["Reports", "Tax Report"]}
      />

      <KPIGrid>
        {kpis.map((item) => {
          const Icon = item.icon;

          return (
            <KPICard key={item.title}>
              <KPIIcon $background={item.bg} $color={item.color}>
                <Icon />
              </KPIIcon>
              <KPIInfo>
                <KPIName>{item.title}</KPIName>
                <KPIValue>{item.value}</KPIValue>
              </KPIInfo>
            </KPICard>
          );
        })}
      </KPIGrid>

      <FilterBar>
        <DateFilter>
          <DateInput
            aria-label="Start date"
            type="date"
            value={startDate}
            onChange={handleFilter(setStartDate)}
          />
          <span>-</span>
          <DateInput
            aria-label="End date"
            type="date"
            value={endDate}
            onChange={handleFilter(setEndDate)}
          />
        </DateFilter>

        <FilterSelect value={taxType} onChange={handleFilter(setTaxType)}>
          <option value="all">Tax Type (VAT / GST)</option>
          <option value="VAT">VAT</option>
          <option value="GST">GST</option>
        </FilterSelect>

        <FilterSelect value={customer} onChange={handleFilter(setCustomer)}>
          <option value="all">Customer</option>
          {[...new Set(taxData.filter((item) => item.type === "Sales").map((item) => item.customer))].map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </FilterSelect>

        <FilterSelect value={vendor} onChange={handleFilter(setVendor)}>
          <option value="all">Vendor</option>
          {[...new Set(taxData.filter((item) => item.type === "Purchase").map((item) => item.customer))].map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </FilterSelect>

        <FilterSelect value={invoiceType} onChange={handleFilter(setInvoiceType)}>
          <option value="all">Invoice Type</option>
          <option value="Sales">Sales</option>
          <option value="Purchase">Purchase</option>
        </FilterSelect>

        <FilterSelect value={taxStatus} onChange={handleFilter(setTaxStatus)}>
          <option value="all">Tax Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </FilterSelect>

        <ExportButton type="button" onClick={exportReport}>
          Export Report <FiDownload />
        </ExportButton>
      </FilterBar>

      <MainReportLayout>
        <TableSide>
          <TableWrapper>
            <TaxTable>
              <TableHead>
                <tr>
                  <th>Invoice/<br />Bill No</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Customer/<br />Vendor</th>
                  <th>Taxable<br />Amount</th>
                  <th>Tax<br />Amount</th>
                  <th>Tax Type</th>
                  <th>Status</th>
                </tr>
              </TableHead>

              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <TableCell>{item.invoice}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell>{item.taxable}</TableCell>
                    <TableCell>
                      SAR {item.tax.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell>{item.taxType}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </tr>
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      No tax records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </TaxTable>
          </TableWrapper>

          <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TableSide>

        <TaxCollectionCharts />
      </MainReportLayout>
    </ReportPage>
  );
};

export default TaxReport;