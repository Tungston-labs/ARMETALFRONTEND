import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import API from "../../services/api";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  TableHeader,
  ActionButtons,
  DeclineButton,
} from "./ModalList.Styles";

import ReusableConfirmModal from "../../Components/modals/ReusableConfirmModal";
import { useDispatch } from "react-redux";
import { patchLeaveStatus } from "../../Redux/leaveSlice";
import { BodyCell, BodyRow, HeadCell, HeadRow, StyledTable, TableBody } from "./EmployeeList.styles";

const OnLeaveModal = ({ onClose, employeeId, date, leaveId }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const dispatch = useDispatch();

  const openConfirmModal = (leaveId, type) => {
    console.log("Opening confirm modal for leave ID:", leaveId, "action:", type);
    setSelectedLeaveId(leaveId);
    setActionType(type);
    setShowConfirmModal(true);
  };


  // Fetch leaves for this employee
  useEffect(() => {
    if (!employeeId || !date) return;

    const fetchOnLeaves = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/department/${employeeId}/on-leaves/?date=${date}`
        );
        console.log("API response:", res.data);
        setEmployeesOnLeave(res.data.on_leave || []);
      } catch (error) {
        console.error("Error fetching employees on leave:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnLeaves();
  }, [employeeId, date]);

  const handleConfirm = async () => {
    if (!selectedLeaveId) return;

    const status = actionType === "approve" ? "approved" : "rejected";

    try {
      await dispatch(patchLeaveStatus({ leaveId: selectedLeaveId, status }));
      onClose();
    } catch (error) {
      console.error("Error updating leave status:", error);
    } finally {
      setShowConfirmModal(false);
      setActionType("");
      setSelectedLeaveId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  return ReactDOM.createPortal(
    <>
      <ModalOverlay zIndex={1000}>
        <ModalContainer zIndex={1001}>
          <ModalHeader>
            <h2>Employee Leave Details</h2>
          </ModalHeader>

          <StyledTable>
            <TableHeader>
              <HeadRow>
                <HeadCell>Employee name</HeadCell>
                <HeadCell>Leave type</HeadCell>
                <HeadCell>Email ID</HeadCell>
                <HeadCell>Contact number</HeadCell>
                <HeadCell>Start date to end date</HeadCell>
                <HeadCell></HeadCell>
              </HeadRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : employeesOnLeave.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No leave record found.
                  </td>
                </tr>
              ) : (
                employeesOnLeave.map((emp, index) => (
                  <BodyRow key={index} $highlighted={index % 2 !== 0}>
                    <BodyCell>
                      {/* <ProfileImg src="/images/profile.png" alt="profile" /> */}
                      {emp.employee_name}
                    </BodyCell>
                    <BodyCell>{emp.leave_type}</BodyCell>
                    <BodyCell>{emp.email}</BodyCell>
                    <BodyCell>{emp.phone}</BodyCell>
                    <BodyCell>
                      {formatDate(emp.from_date)} ({emp.from_date_type}) To {" "}
                      {formatDate(emp.to_date)} ({emp.to_date_type})
                    </BodyCell>

                  </BodyRow>
                ))
              )}
            </TableBody>
          </StyledTable>

          <ActionButtons>
            <DeclineButton onClick={onClose}>Close</DeclineButton>
          </ActionButtons>
        </ModalContainer>
      </ModalOverlay>

      {showConfirmModal && selectedLeaveId && (
        <ReusableConfirmModal
          leaveId={selectedLeaveId}
          actionType={actionType}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          zIndex={2000}
        />
      )}

    </>,
    document.body
  );
};

export default OnLeaveModal;
