import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";

const DeleteIcon = styled(FaTrashAlt)`
  color: #e11d1d;
  cursor: pointer;

  &:hover {
    color: #b91414;
  }
`;

const formatDate = (date) => {
  if (!date) return "----";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * @param {number} currentPage
 * @param {number} pageSize
 * @param {(id: string|number) => void} onDeleteClick
 */
export const getHolidayColumns = ({ currentPage, pageSize, onDeleteClick }) => [
  {
    header: "Sl No",
    accessor: "slNo",
    sortable: false,
    render: (row, index) => (currentPage - 1) * pageSize + index + 1,
  },
  {
    header: "Holiday name",
    accessor: "description",
    render: (row) =>
      row.description
        ? row.description.charAt(0).toUpperCase() + row.description.slice(1)
        : "----",
  },
  {
    header: "Holiday type",
    accessor: "holiday_type_display",
  },
  {
    header: "Date",
    accessor: "date",
    render: (row) => formatDate(row.date),
  },
  {
    header: "",
    accessor: "actions",
    sortable: false,
    render: (row) => (
      <DeleteIcon onClick={() => onDeleteClick(row.id)} />
    ),
  },
];