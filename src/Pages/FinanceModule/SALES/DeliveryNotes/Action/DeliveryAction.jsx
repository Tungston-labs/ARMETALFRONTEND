import React from "react";
import { FiEye, FiEdit2, FiDownload, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const IconBtn = styled.button`
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #ffffff;
  color: #4b5563;
  cursor: pointer;
  padding: 0;
  transition: all 0.15s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #111827;
  }

  &.danger {
    color: #ef4444;
    &:hover {
      background: #fef2f2;
      border-color: #fca5a5;
      color: #dc2626;
    }
  }
`;

const DeliveryAction = ({ row, onDelete }) => {
  const navigate = useNavigate();

  const handleView = (e) => {
    e.stopPropagation();
    if (!row?.id) return;
    navigate(`/delivery/notes/edit/${row.id}`, {
      state: { deliveryNoteData: row },
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (!row?.id) return;
    navigate(`/delivery/notes/edit/${row.id}`, {
      state: { deliveryNoteData: row },
    });
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "DN No,Customer,Order Ref,Dispatch Date,Delivery Date,Status",
        `"${row.delivery_note_number || row.dn_number || ""}","${row.customer_name || ""}","${row.so_ref || ""}","${row.dispatch_date || ""}","${row.delivery_date || ""}","${row.delivery_status || row.status || ""}"`,
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `delivery_note_${row.dn_number || row.id}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(row);
  };

  const statusStr = String(
    row.delivery_status || row.status || "",
  ).toLowerCase();
  const showCancel = statusStr !== "delivered" && statusStr !== "fully_delivered";

  return (
    <ActionContainer>
      <IconBtn type="button" title="View" onClick={handleView}>
        <FiEye size={14} />
      </IconBtn>
      <IconBtn type="button" title="Edit" onClick={handleEdit}>
        <FiEdit2 size={14} />
      </IconBtn>
      <IconBtn type="button" title="Download" onClick={handleDownload}>
        <FiDownload size={14} />
      </IconBtn>
      {showCancel && (
        <IconBtn
          type="button"
          className="danger"
          title="Cancel / Delete"
          onClick={handleDelete}
        >
          <FiX size={14} />
        </IconBtn>
      )}
    </ActionContainer>
  );
};

export default DeliveryAction;
