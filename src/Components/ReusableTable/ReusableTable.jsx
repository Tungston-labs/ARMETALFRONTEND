import React, { useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";

import {
  Container,
  TableScrollContainer,
  StyledTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  EmptyState,
  LoadingState,
  LoadingContent,
  TotalRow,
  TotalDebit,
  TotalCredit,
  TotalBalance,
} from "./ReusableTable.styles";

const getColumnKey = (column, index) =>
  column.accessor ?? column.key ?? column.id ?? `column-${index}`;

const getAccessor = (column) =>
  column.accessor ?? column.key ?? column.id;

const getColumnLabel = (column) =>
  column.header ?? column.label ?? column.title ?? "";

const getCellValue = (row, column) => {
  const accessor = getAccessor(column);
  if (!accessor) return undefined;

  return String(accessor)
    .split(".")
    .reduce((value, key) => value?.[key], row);
};

const getRowKey = (row, index) =>
  row?.id ??
  row?.pk ??
  row?.uuid ??
  row?.account_number ??
  row?.transaction_id ??
  row?.payment_id ??
  row?.invoice_id ??
  `row-${index}`;

const ReusableTable = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  emptyMessage = "No Records Found",
  loadingMessage = "Loading...",
  totalRow,
  totalRowLabel = "TOTAL",
  autoLayout = false,
}) => {
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  const handleSort = (key) => {
    if (!key) return;

    if (sortKey === key) {
      setSortDirection((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return safeData;

    return [...safeData].sort((a, b) => {
      const first = getCellValue(a, { accessor: sortKey });
      const second = getCellValue(b, { accessor: sortKey });

      if (first == null && second == null) return 0;
      if (first == null) return 1;
      if (second == null) return -1;

      let result;

      if (typeof first === "number" && typeof second === "number") {
        result = first - second;
      } else {
        result = String(first).localeCompare(String(second), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }

      return sortDirection === "asc" ? result : -result;
    });
  }, [safeData, sortKey, sortDirection]);

  const renderCell = (column, row, rowIndex) => {
    if (typeof column.render === "function") {
      return column.render(row, rowIndex);
    }

    if (typeof column.cell === "function") {
      return column.cell(row, rowIndex);
    }

    const value = getCellValue(row, column);
    return value == null || value === "" ? "—" : String(value);
  };

  return (
    <Container>
      <TableScrollContainer>
        <StyledTable $autoLayout={autoLayout}>
          <colgroup>
            {safeColumns.map((column, index) => (
              <col
                key={getColumnKey(column, index)}
                data-priority={column.priority ?? 1}
                style={{ width: column.width || "auto" }}
              />
            ))}
          </colgroup>

          <Thead>
            <Tr>
              {safeColumns.map((column, index) => {
                const accessor = getAccessor(column);
                const sortable =
                  column.sortable !== false && Boolean(accessor);

                return (
                  <Th
                    key={getColumnKey(column, index)}
                    data-priority={column.priority ?? 1}
                    onClick={() => sortable && handleSort(accessor)}
                    style={{ cursor: sortable ? "pointer" : "default" }}
                  >
                    {getColumnLabel(column)}
                    {sortable &&
                      sortKey === accessor &&
                      (sortDirection === "asc" ? " ▲" : " ▼")}
                  </Th>
                );
              })}
            </Tr>
          </Thead>

          <Tbody>
            {loading ? (
              <Tr key="table-loading">
                <Td colSpan={Math.max(safeColumns.length, 1)}>
                  <LoadingState>
                    <LoadingContent>
                      <ClipLoader
                        size={22}
                        color="#F78926"
                        data-testid="clip-loader"
                      />
                      <span>{loadingMessage}</span>
                    </LoadingContent>
                  </LoadingState>
                </Td>
              </Tr>
            ) : sortedData.length === 0 ? (
              <Tr key="table-empty">
                <Td colSpan={Math.max(safeColumns.length, 1)}>
                  <EmptyState>{emptyMessage}</EmptyState>
                </Td>
              </Tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <Tr
                  key={getRowKey(row, rowIndex)}
                  onClick={() => onRowClick?.(row)}
                  style={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  {safeColumns.map((column, columnIndex) => (
                    <Td
                      key={getColumnKey(column, columnIndex)}
                      data-priority={column.priority ?? 1}
                      style={
                        column.render || column.cell
                          ? {
                              whiteSpace: autoLayout ? "nowrap" : "normal",
                            }
                          : undefined
                      }
                      title={
                        column.render || column.cell
                          ? undefined
                          : String(getCellValue(row, column) ?? "")
                      }
                    >
                      {renderCell(column, row, rowIndex)}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>

          {totalRow && !loading && (
            <tfoot>
              <TotalRow>
                {safeColumns.map((column, index) => {
                  const accessor = getAccessor(column);
                  const value =
                    index === 0
                      ? totalRowLabel
                      : accessor
                        ? totalRow[accessor] ?? ""
                        : "";

                  let content = value;

                  if (accessor === "debit") {
                    content = <TotalDebit>{value}</TotalDebit>;
                  } else if (accessor === "credit") {
                    content = <TotalCredit>{value}</TotalCredit>;
                  } else if (accessor === "balance") {
                    content = <TotalBalance>{value}</TotalBalance>;
                  }

                  return (
                    <Td key={getColumnKey(column, index)}>
                      {content}
                    </Td>
                  );
                })}
              </TotalRow>
            </tfoot>
          )}
        </StyledTable>
      </TableScrollContainer>
    </Container>
  );
};

export default ReusableTable;
