import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  CardsWrapper,
  Card,
  CardTitle,
  CardValue,
  AttendanceTableWrapper,
  AttendanceTable,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
  PrintButton,
} from "./EmployeeAttendanceModal.styles";

const EmployeeAttendanceModal = ({
  employee,
  monthName,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !employee) return null;
  const [records] = useState(employee.daily_records || []);
  const printRef = useRef();

  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${employee.employee_name}-attendance`,
  });

 const workingDays = employee.working_days ?? 0;
const presentCount = employee.present_days ?? 0;
const absentCount = employee.absent_days ?? 0;
const lopCount = employee.lop_days ?? 0;

const getStatusLabel = (status) => {
  const normalized = (status || "")
    .toLowerCase()
    .trim();

  switch (normalized) {
    case "present":
      return { text: "Present", key: "present" };

    case "active":
      return { text: "Working", key: "active" };

    case "half_day":
      return { text: "Half Day", key: "half_day" };

    case "leave":
      return { text: "Leave", key: "leave" };

    case "holiday":
      return { text: "Holiday", key: "holiday" };

    case "off":
    case "company off day":
      return {
        text: "Company Off Day",
        key: "off",
      };

    case "second saturday":
      return {
        text: "Second Saturday",
        key: "holiday",
      };

    case "missed_punchout":
      return {
        text: "Missed Punch Out",
        key: "missed_punchout",
      };

    case "absent":
      return {
        text: "Absent",
        key: "absent",
      };

    default:
      // For custom holidays like
      // "Dilshima Birthday"
      // "Christmas"
      // "Eid"
      return {
        text: status,
        key: "holiday",
      };
  }
};

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";

    const d = new Date(dateStr);

    const day = d
      .getDate()
      .toString()
      .padStart(2, "0");

    const month = d.toLocaleString(
      "en-GB",
      {
        month: "short",
      }
    );

    return `${day} ${month}`;
  };

const formatTime = (timeStr) => {
  if (!timeStr || timeStr === "null") {
    return "—";
  }

  return String(timeStr).trim();
};

const cards = [
  {
    label: "Working Days",
    value: workingDays,
    type: "default",
  },
  {
    label: "Present",
    value: presentCount,
    type: "present",
  },
  {
    label: "Absent",
    value: absentCount,
    type: "absent",
  },
  {
    label: "LOP",
    value: lopCount,
    type: "lop",
  },
];

  return (
    <ModalOverlay
      isOpen={isOpen}
      onClick={onClose}
    >
      <ModalContainer
        ref={printRef}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <ModalHeader>
          <div>
            <ModalTitle>
              {employee.employee_name}
            </ModalTitle>

            <span
              style={{
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              {monthName} —
              Attendance Summary
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <PrintButton
              onClick={handlePrint}
            >
              Print
            </PrintButton>

            <CloseButton
              onClick={onClose}
            >
              &#10005;
            </CloseButton>
          </div>
        </ModalHeader>

        <CardsWrapper>
          {cards.map((c) => (
            <Card
              key={c.label}
              type={c.type}
            >
              <CardTitle>
                {c.label}
              </CardTitle>

              <CardValue
                type={c.type}
              >
                {c.value}
              </CardValue>
            </Card>
          ))}
        </CardsWrapper>

        <AttendanceTableWrapper>
          <AttendanceTable>
            <thead>
              <tr>
                <TableHeader>
                  Date
                </TableHeader>

                <TableHeader>
                  Status
                </TableHeader>

                <TableHeader>
                  Punch In
                </TableHeader>

                <TableHeader>
                  Punch Out
                </TableHeader>

                <TableHeader
                  style={{
                    textAlign:
                      "right",
                  }}
                >
                  Hours
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {records.length ===
              0 ? (
                <tr>
                  <TableCell
                    colSpan={5}
                    style={{
                      textAlign:
                        "center",
                      color:
                        "#6b7280",
                      padding:
                        "2rem",
                    }}
                  >
                    No records
                    available
                  </TableCell>
                </tr>
              ) : (
                records.map(
                  (rec, idx) => {
                    const label =
                      getStatusLabel(
                        rec.status
                      );

                    return (
                      <TableRow
                        key={idx}
                      >
                        <TableCell>
                          {formatDate(
                            rec.date
                          )}
                        </TableCell>

                        <TableCell>
                          <StatusBadge
                            status={
                              label.key
                            }
                          >
                            {
                              label.text
                            }
                          </StatusBadge>
                        </TableCell>

                       <TableCell>
  {formatTime(rec.first_punch_in)}
</TableCell>

<TableCell>
  {formatTime(rec.last_punch_out)}
</TableCell>
                        <TableCell
                          style={{
                            textAlign:
                              "right",
                          }}
                        >
                          {Number(
                            rec.total_hours ||
                              0
                          ).toFixed(
                            2
                          )}
                          h
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              )}
            </tbody>
          </AttendanceTable>
        </AttendanceTableWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeAttendanceModal;