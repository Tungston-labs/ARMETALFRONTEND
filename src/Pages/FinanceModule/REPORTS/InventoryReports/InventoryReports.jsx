
import React, { useMemo, useState } from "react";
import {
  FiDollarSign,
  FiActivity,
  FiCreditCard,
  FiAlertCircle,
  FiTrendingUp,
  FiDownload,
} from "react-icons/fi";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import InventoryMovementChart from "./Chart/InventoryMovementChart";

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
  InventoryTable,
  TableHead,
  TableCell,
  StatusText,
} from "./InventoryReports.styles";

const inventoryData = [
  {
    id: 1,
    code: "PRD-001",
    product: "Cisco Router C9300",
    category: "Networking",
    warehouse: "Riyadh WH",
    available: 120,
    reserved: 15,
    reorder: 15,
    value: 1140000,
    status: "In Stock",
    type: "Hardware",
  },
  {
    id: 2,
    code: "PRD-002",
    product: "CAT6 Cable",
    category: "Cables",
    warehouse: "Jeddah WH",
    available: 850,
    reserved: 110,
    reorder: 120,
    value: 272000,
    status: "In Stock",
    type: "Consumables",
  },
  {
    id: 3,
    code: "PRD-003",
    product: "Smart Camera",
    category: "Security",
    warehouse: "Dammam WH",
    available: 18,
    reserved: 2,
    reorder: 5,
    value: 126000,
    status: "Low Stock",
    type: "Electronics",
  },
  {
    id: 4,
    code: "PRD-004",
    product: "Fiber Patch Panel",
    category: "Telecom",
    warehouse: "Riyadh WH",
    available: 0,
    reserved: 0,
    reorder: 15,
    value: 0,
    status: "Out of Stock",
    type: "Hardware",
  },
  {
    id: 5,
    code: "PRD-005",
    product: "Cisco Router C9300",
    category: "Networking",
    warehouse: "Riyadh WH",
    available: 120,
    reserved: 15,
    reorder: 20,
    value: 272000,
    status: "In Stock",
    type: "Hardware",
  },
  {
    id: 6,
    code: "PRD-006",
    product: "CAT6 Cable",
    category: "Cables",
    warehouse: "Jeddah WH",
    available: 850,
    reserved: 75,
    reorder: 85,
    value: 126000,
    status: "In Stock",
    type: "Consumables",
  },
  {
    id: 7,
    code: "PRD-007",
    product: "Smart Camera",
    category: "Security",
    warehouse: "Dammam WH",
    available: 18,
    reserved: 68,
    reorder: 72,
    value: 272000,
    status: "In Stock",
    type: "Electronics",
  },
  {
    id: 8,
    code: "PRD-008",
    product: "Cisco Router C9300",
    category: "Networking",
    warehouse: "Riyadh WH",
    available: 120,
    reserved: 45,
    reorder: 54,
    value: 126000,
    status: "Low Stock",
    type: "Hardware",
  },
  {
    id: 9,
    code: "PRD-009",
    product: "CAT6 Cable",
    category: "Cables",
    warehouse: "Jeddah WH",
    available: 850,
    reserved: 18,
    reorder: 25,
    value: 272000,
    status: "Low Stock",
    type: "Consumables",
  },
  {
    id: 10,
    code: "PRD-010",
    product: "Smart Camera",
    category: "Security",
    warehouse: "Dammam WH",
    available: 18,
    reserved: 12,
    reorder: 18,
    value: 126000,
    status: "In Stock",
    type: "Electronics",
  },
  {
    id: 11,
    code: "PRD-011",
    product: "Fiber Patch Panel",
    category: "Telecom",
    warehouse: "Riyadh WH",
    available: 45,
    reserved: 10,
    reorder: 15,
    value: 180000,
    status: "In Stock",
    type: "Hardware",
  },
  {
    id: 12,
    code: "PRD-012",
    product: "Smart Camera",
    category: "Security",
    warehouse: "Dammam WH",
    available: 3,
    reserved: 1,
    reorder: 5,
    value: 21000,
    status: "Low Stock",
    type: "Electronics",
  },
];

const formatSAR = (value) =>
  `SAR ${Number(value).toLocaleString("en-US")}`;

const InventoryReports = () => {
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-04-30");
  const [warehouse, setWarehouse] = useState("all");
  const [category, setCategory] = useState("all");
  const [product, setProduct] = useState("all");
  const [productType, setProductType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      return (
        (warehouse === "all" || item.warehouse === warehouse) &&
        (category === "all" || item.category === category) &&
        (product === "all" || item.product === product) &&
        (productType === "all" || item.type === productType)
      );
    });
  }, [warehouse, category, product, productType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / rowsPerPage)
  );

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
      "Product Code",
      "Product",
      "Category",
      "Warehouse",
      "Available Quantity",
      "Reserved Quantity",
      "Reorder Level",
      "Inventory Value",
      "Stock Status",
    ];

    const rows = filteredData.map((item) => [
      item.code,
      item.product,
      item.category,
      item.warehouse,
      item.available,
      item.reserved,
      item.reorder,
      item.value,
      item.status,
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
    link.download = "inventory-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    {
      title: "Total Products",
      value: "1,248",
      icon: <FiDollarSign />,
      background: "#e8efff",
      color: "#3154b5",
    },
    {
      title: "Inventory Value",
      value: "SAR 18.5M",
      icon: <FiActivity />,
      background: "#fff2e6",
      color: "#ff850c",
    },
    {
      title: "Low Stock Items",
      value: "42",
      icon: <FiCreditCard />,
      background: "#dff4f7",
      color: "#19a8c2",
    },
    {
      title: "Out of Stock",
      value: "18",
      icon: <FiAlertCircle />,
      background: "#f3dede",
      color: "#ed3434",
    },
    {
      title: "Total Stock Quantity",
      value: "48,560 Units",
      icon: <FiTrendingUp />,
      background: "#eee5ff",
      color: "#8647ff",
    },
  ];

  return (
    <ReportPage>
      <ReusableHeader
        title="Inventory Reports"
        breadcrumbs={["Reports", "Inventory Reports"]}
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

        <FilterSelect
          aria-label="Warehouse"
          value={warehouse}
          onChange={handleFilter(setWarehouse)}
        >
          <option value="all">Warehouse</option>
          <option value="Riyadh WH">Riyadh WH</option>
          <option value="Jeddah WH">Jeddah WH</option>
          <option value="Dammam WH">Dammam WH</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Category"
          value={category}
          onChange={handleFilter(setCategory)}
        >
          <option value="all">Category</option>
          <option value="Networking">Networking</option>
          <option value="Cables">Cables</option>
          <option value="Security">Security</option>
          <option value="Telecom">Telecom</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Product"
          value={product}
          onChange={handleFilter(setProduct)}
        >
          <option value="all">Product</option>
          <option value="Cisco Router C9300">Cisco Router C9300</option>
          <option value="CAT6 Cable">CAT6 Cable</option>
          <option value="Smart Camera">Smart Camera</option>
          <option value="Fiber Patch Panel">Fiber Patch Panel</option>
        </FilterSelect>

        <FilterSelect
          aria-label="Product type"
          value={productType}
          onChange={handleFilter(setProductType)}
        >
          <option value="all">Product Type</option>
          <option value="Hardware">Hardware</option>
          <option value="Consumables">Consumables</option>
          <option value="Electronics">Electronics</option>
        </FilterSelect>
      </FilterBar>

      <MainReportLayout>
        <TableSide>
          <TableWrapper>
            <InventoryTable>
              <TableHead>
                <tr>
                  <th>Code</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Warehouse</th>
                  <th>Available<br />Qty</th>
                  <th>Reserved<br />Qty</th>
                  <th>Reorder<br />Level</th>
                  <th>Inventory<br />Value</th>
                  <th>Stock Status</th>
                </tr>
              </TableHead>

              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.warehouse}</TableCell>
                    <TableCell>{item.available}</TableCell>
                    <TableCell>{item.reserved}</TableCell>
                    <TableCell>{item.reorder}</TableCell>
                    <TableCell>{formatSAR(item.value)}</TableCell>
                    <TableCell>
                      <StatusText $status={item.status}>
                        {item.status}
                      </StatusText>
                    </TableCell>
                  </tr>
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="empty-state">
                      No inventory records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </InventoryTable>
          </TableWrapper>

          <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TableSide>

        <InventoryMovementChart />
      </MainReportLayout>
    </ReportPage>
  );
};

export default InventoryReports;