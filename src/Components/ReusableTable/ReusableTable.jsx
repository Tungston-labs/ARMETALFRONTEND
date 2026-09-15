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
          SINGLE SCROLLABLE TABLE
          Header + body live in ONE table inside ONE scroll
          container, so on small screens the header scrolls
          horizontally in sync with the body (same scrollbar),
          while position: sticky keeps it pinned vertically.
      ====================================================== */}

      <TableScrollContainer>
        <StyledTable>
          {/* StyledTable sets table-layout: fixed and a min-width in
              ReusableTable.styles.js. With fixed layout, a browser with
              no explicit widths just splits that min-width evenly across
              every column — that's what was squeezing Actions down to
              the same width as Code or Outstanding Days. This colgroup
              gives each column an explicit share driven by column.width,
              so short columns stay short and Actions gets real room.
              THIS is the piece that makes column.width actually do
              anything — without it, setting width on a column is a
              no-op. */}
          <colgroup>
            {columns.map((column) => (
              <col
                key={column.accessor}
                style={{ width: column.width || "auto" }}
              />
            ))}
          </colgroup>

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
                    <Td
                      key={column.accessor}
                      // Base Td styles clip every cell with nowrap +
                      // overflow: hidden, which is right for plain text
                      // but was also crushing custom render() content
                      // (buttons, links). Override just that here.
                      style={
                        column.render
                          ? {
                              whiteSpace: "normal",
                              overflow: "visible",
                              textOverflow: "clip",
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