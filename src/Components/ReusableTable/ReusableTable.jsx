import React, { useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";

import {
  Container,
  TableHeaderContainer,
  TableBodyContainer,
  StyledTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  EmptyState,
  LoadingState,
  LoadingContent,
} from "./ReusableTable.styles";

const ReusableTable = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  emptyMessage = "No Records Found",
  loadingMessage = "Loading...",
}) => {
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // =========================================================
  // SORT
  // =========================================================

  const handleSort = (key) => {
    if (!key) return;

    if (sortKey === key) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // =========================================================
  // SORTED DATA
  // =========================================================

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const first = a[sortKey];
      const second = b[sortKey];

      // Handle numbers
      if (
        typeof first === "number" &&
        typeof second === "number"
      ) {
        return sortDirection === "asc"
          ? first - second
          : second - first;
      }

      // Handle empty/null values
      const firstValue = String(first ?? "");
      const secondValue = String(second ?? "");

      return sortDirection === "asc"
        ? firstValue.localeCompare(secondValue)
        : secondValue.localeCompare(firstValue);
    });
  }, [data, sortKey, sortDirection]);

  return (
    <Container>
      {/* =====================================================
          TABLE HEADER
      ====================================================== */}

      <TableHeaderContainer>
        <StyledTable>
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th
                  key={column.accessor}
                  onClick={() =>
                    column.sortable !== false &&
                    handleSort(column.accessor)
                  }
                >
                  {column.header}

                  {column.sortable !== false &&
                    sortKey === column.accessor &&
                    (sortDirection === "asc"
                      ? " ▲"
                      : " ▼")}
                </Th>
              ))}
            </Tr>
          </Thead>
        </StyledTable>
      </TableHeaderContainer>

      {/* =====================================================
          TABLE BODY
      ====================================================== */}

      <TableBodyContainer>
        <StyledTable>
          <Tbody>

            {/* ================= LOADING ================= */}

            {loading && (
              <Tr>
                <Td colSpan={columns.length}>
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
            )}

            {/* ================= EMPTY ================= */}

            {!loading && sortedData.length === 0 && (
              <Tr>
                <Td colSpan={columns.length}>
                  <EmptyState>
                    {emptyMessage}
                  </EmptyState>
                </Td>
              </Tr>
            )}

            {/* ================= DATA ================= */}

            {!loading &&
              sortedData.map((row, index) => (
                <Tr
                  key={row.id ?? index}
                  onClick={() => onRowClick?.(row)}
                  style={
                    onRowClick
                      ? { cursor: "pointer" }
                      : undefined
                  }
                >
                  {columns.map((column) => (
                    <Td key={column.accessor}>
                      {column.render
                        ? column.render(row, index)
                        : row[column.accessor]}
                    </Td>
                  ))}
                </Tr>
              ))}

          </Tbody>
        </StyledTable>
      </TableBodyContainer>
    </Container>
  );
};

export default ReusableTable;