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

  const handleSort = (key) => {
    if (!key) return;

    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const first = a[sortKey];
      const second = b[sortKey];

      if (typeof first === "number" && typeof second === "number") {
        return sortDirection === "asc" ? first - second : second - first;
      }

      const firstValue = String(first ?? "");
      const secondValue = String(second ?? "");

      return sortDirection === "asc"
        ? firstValue.localeCompare(secondValue)
        : secondValue.localeCompare(firstValue);
    });
  }, [data, sortKey, sortDirection]);

  return (
    <Container>
      <TableScrollContainer>
        <StyledTable>
          {/* data-priority on <col> keeps the column's width rule in
              sync with its header/body cells being hidden at the same
              breakpoint (see ReusableTable.styles.js responsive rules). */}
          <colgroup>
            {columns.map((column) => (
              <col
                key={column.accessor}
                data-priority={column.priority || 1}
                style={{ width: column.width || "auto" }}
              />
            ))}
          </colgroup>

          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th
                  key={column.accessor}
                  data-priority={column.priority || 1}
                  onClick={() =>
                    column.sortable !== false &&
                    handleSort(column.accessor)
                  }
                >
                  {column.header}

                  {column.sortable !== false &&
                    sortKey === column.accessor &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
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

            {!loading && sortedData.length === 0 && (
              <Tr>
                <Td colSpan={columns.length}>
                  <EmptyState>{emptyMessage}</EmptyState>
                </Td>
              </Tr>
            )}

            {!loading &&
              sortedData.map((row, index) => (
                <Tr
                  key={row.id ?? index}
                  onClick={() => onRowClick?.(row)}
                  style={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  {columns.map((column) => (
                    <Td
                      key={column.accessor}
                      data-priority={column.priority || 1}
                      style={
                        column.render
                          ? {
                              whiteSpace: "normal",
                            }
                          : undefined
                      }
                      title={
                        column.render
                          ? undefined
                          : String(row[column.accessor] ?? "")
                      }
                    >
                      {column.render
                        ? column.render(row, index)
                        : row[column.accessor]}
                    </Td>
                  ))}
                </Tr>
              ))}
          </Tbody>
        </StyledTable>
      </TableScrollContainer>
    </Container>
  );
};

export default ReusableTable;