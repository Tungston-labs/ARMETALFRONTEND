import React, { useState, useEffect } from "react";
import API from "../../services/api";
import {
  PageWrapper,
  Header,
  CardWrapper,
  Card,
  CardTitle,
  CardValue,
  HistoryTable,
  Table,
  Th,
  Td,
  Tr,
  CalendarWrapper,
  TableScrollWrapper,
} from "./AttendanceDetails.Styles";
import { getAccessToken } from "../../hooks/useAccessToken";

const AttendanceDetails = ({
  cardList,
  sessions,
  selectedDate,
  onDateChange,
  formatTime,
  employeeId,
}) => {
  const [hourlyLocationData, setHourlyLocationData] = useState([]);

  const sessionEvents = sessions
    .flatMap((s) => {
      const events = [];

      if (s?.time_in) {
        events.push({
          time: s.time_in,
          action: "Punch In",
          location: s?.punch_in_location,
        });
      }

      if (s?.time_out) {
        events.push({
          time: s.time_out,
          action: "Punch Out",
          location: s?.punch_out_location,
        });
      }

      return events;
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const backgroundEvents = (hourlyLocationData || []).map((item) => ({
    time: item?.logged_at,
    action: "Live Tracking",
    location: item?.location_name,
  }));
  const allEvents = [...sessionEvents, ...backgroundEvents]
    .filter((event) => event.time)
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  useEffect(() => {
    if (!employeeId || !selectedDate) return;

    const fetchEmployeeLocations = async () => {
      try {
        const formattedDate = new Date(selectedDate)
          .toISOString()
          .split("T")[0];

        const response = await API.get(`/background-location/${employeeId}/`, {
          params: { date: formattedDate },
        });

        setHourlyLocationData(response.data?.results || []);
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    };

    fetchEmployeeLocations();
  }, [employeeId, selectedDate]);
  return (
    <PageWrapper>
      <Header>Attendance Details</Header>
      <CardWrapper>
        {cardList.map((card, index) => (
          <Card key={index}>
            <CardTitle>{card.title}</CardTitle>
            <CardValue>{card.value}</CardValue>
          </Card>
        ))}
      </CardWrapper>

      <HistoryTable>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <Header>Sessions</Header>
          <CalendarWrapper>
            <input
              type="date"
              value={selectedDate}
              onChange={onDateChange}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              
              }}
            />
          </CalendarWrapper>
        </div>
        <TableScrollWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Time</Th>
              <Th>Action</Th>
              <Th>Location</Th>
            </tr>
          </thead>
          <tbody>
            {allEvents.length === 0 ? (
              <Tr>
                <Td colSpan={3} style={{ textAlign: "center", color: "#777" }}>
                  No sessions found
                </Td>
              </Tr>
            ) : (
              allEvents.map((event, index) => (
                <Tr key={index}>
                  <Td>{formatTime(event.time)}</Td>

                  <Td>
                    <span
                      style={{
                        color:
                          event.action === "Punch In"
                            ? "#2F822F"
                            : event.action === "Punch Out"
                              ? "#ED2B2B"
                              : "#2563EB",
                        fontWeight: 500,
                      }}
                    >
                      {event.action}
                    </span>
                  </Td>

                  <Td>{event.location || "---"}</Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
        </TableScrollWrapper>
      </HistoryTable>
    </PageWrapper>
  );
};

export default AttendanceDetails;
