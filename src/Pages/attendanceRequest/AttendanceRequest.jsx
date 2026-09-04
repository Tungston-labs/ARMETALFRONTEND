import React from "react";
import {
  Container,
  Title,
  Table,
  Th,
  Td,
  Tr,
  Status,
  ActionButton,
} from "./AttendanceRequest.styles";
import EmployeeTitle from "../../Components/Employee/Headers/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";
const AttendanceRequestList = () => {
  const attendanceRequests = [
    {
      id: 1,
      employeeName: "John Doe",
      employeeId: "EMP001",
      requestType: "Late Coming",
      date: "22-06-2026",
      reason: "Traffic delay due to heavy rain.",
      status: "Pending",
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      requestType: "Missed Punch Out",
      date: "21-06-2026",
      reason: "Forgot to punch out after an urgent client meeting.",
      status: "Approved",
    },
  ];

  return (
    <Container>
      <EmployeeTitle
              iconSrc={EmployeeIcon}
              showBackArrow={false}
              showTabs={false}
              showDropdown={false}
              showAddButton={false}
              showSearch={true}
             showReportButton={false}
            />
      
      <Title>Attendance Requests</Title>

      <Table>
        <thead>
          <Tr>
                 <Th>Sl no.</Th>
            <Th>Employee</Th>
            <Th>Employee ID</Th>
            <Th>Request Type</Th>
            <Th>Date</Th>
            <Th>Reason</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </thead>

        <tbody>
          {attendanceRequests.map((item, index) => (
    <Tr key={item.id}>
      <Td>{index + 1}</Td>
              <Td>{item.employeeName}</Td>
              <Td>{item.employeeId}</Td>
              <Td>{item.requestType}</Td>
              <Td>{item.date}</Td>
              <Td>{item.reason}</Td>
              <Td>
                <Status status={item.status}>
                  {item.status}
                </Status>
              </Td>
              <Td>
                {item.status === "Pending" && (
                  <>
                    <ActionButton approve>
                      Approve
                    </ActionButton>

                    <ActionButton reject>
                      Reject
                    </ActionButton>
                  </>
                )}
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AttendanceRequestList;