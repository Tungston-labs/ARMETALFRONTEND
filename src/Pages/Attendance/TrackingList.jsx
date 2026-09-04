import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceDetail } from "../../Redux/attendanceSlice";
import API from "../../services/api";
import {
  PageWrapper,
  Header,
  CardWrapper,
  Card,
  CardTitle,
  CardValue,
  HistoryTable,
  CalendarWrapper,
} from "../../Components/attendance/AttendanceDetails.Styles";
import { getAccessToken } from "../../hooks/useAccessToken";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import EmployeeHeader from "../../Components/header/EmployeeHeader";
import Loader from "../../Components/Loader/Loader";

const ACTION_COLORS = {
  "Punch In": "#2F822F",
  "Punch Out": "#ED2B2B",
  "Live Tracking": "#2563EB",
};

const defaultFormatTime = (datetimeStr) => {
  if (!datetimeStr) return "---";

  if (/^\d{2}:\d{2}$/.test(datetimeStr)) {
    const [hours, minutes] = datetimeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const parsedDate = new Date(String(datetimeStr).replace(" ", "T"));
  if (isNaN(parsedDate.getTime())) return datetimeStr;

  return parsedDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const TrackingList = ({
  cardList: cardListProp,
  sessions: sessionsProp,
  selectedDate: selectedDateProp,
  onDateChange: onDateChangeProp,
  formatTime: formatTimeProp,
  employeeId: employeeIdProp,
}) => {
  const { id: paramId } = useParams();
  const dispatch = useDispatch();

  const { attendanceDetail, detailLoading, error } = useSelector(
    (state) => state.attendance
  );

  const targetEmployeeId = employeeIdProp || paramId;

  const [selectedDateState, setSelectedDateState] = useState("");
  const [hourlyLocationData, setHourlyLocationData] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const effectiveDate =
    selectedDateProp !== undefined
      ? selectedDateProp
      : selectedDateState || attendanceDetail?.date || new Date().toISOString().split("T")[0];

  // Dispatch getAttendanceDetail via Redux on mount and date/id change
  useEffect(() => {
    if (!targetEmployeeId) return;
    dispatch(
      getAttendanceDetail({
        attendanceId: targetEmployeeId,
        date: selectedDateState,
      })
    );
  }, [dispatch, targetEmployeeId, selectedDateState]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDateState(newDate);
    if (onDateChangeProp) {
      onDateChangeProp(e);
    }
  };

  const actualFormatTime = formatTimeProp || defaultFormatTime;
  const sessions =
    sessionsProp && sessionsProp.length > 0
      ? sessionsProp
      : attendanceDetail?.sessions || [];

  const employee = attendanceDetail?.employee || {};

  // Background location tracking
  useEffect(() => {
    const activeId = employee?.id || targetEmployeeId;
    if (!activeId || !effectiveDate) return;

    const fetchEmployeeLocations = async () => {
      setLoadingLocations(true);
      try {
        const formattedDate = new Date(effectiveDate)
          .toISOString()
          .split("T")[0];

        const response = await API.get(`/background-location/${activeId}/`, {
          params: { date: formattedDate },
        });

        setHourlyLocationData(response.data?.results || []);
      } catch (err) {
        console.error("Error fetching location:", err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchEmployeeLocations();
  }, [employee?.id, targetEmployeeId, effectiveDate]);

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
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .map((event, index) => ({
      ...event,
      id: `${event.action}-${event.time}-${index}`,
    }));

  const todayFirstPunchIn = attendanceDetail?.today_first_punch_in
    ? actualFormatTime(attendanceDetail.today_first_punch_in)
    : sessions.length > 0 && sessions[0]?.time_in
    ? actualFormatTime(sessions[0].time_in)
    : "---";

  const todayLastPunchOut = attendanceDetail?.today_last_punch_out
    ? actualFormatTime(attendanceDetail.today_last_punch_out)
    : sessions.length > 0 && sessions[sessions.length - 1]?.time_out
    ? actualFormatTime(sessions[sessions.length - 1].time_out)
    : "---";

  const computedCardList =
    cardListProp && cardListProp.length > 0
      ? cardListProp
      : [
          { title: "Today Punch In", value: todayFirstPunchIn },
          { title: "Today Punch Out", value: todayLastPunchOut },
          {
            title: "Weekly Hours",
            value: attendanceDetail?.weekly_hours_formatted || "00:00",
          },
          {
            title: "Monthly Hours",
            value: attendanceDetail?.monthly_hours_formatted || "00:00",
          },
        ];

  const eventColumns = [
    {
      header: "Time",
      accessor: "time",
      render: (row) => actualFormatTime(row.time),
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <span
          style={{
            color: ACTION_COLORS[row.action] || "#333",
            fontWeight: 500,
          }}
        >
          {row.action}
        </span>
      ),
    },
    {
      header: "Location",
      accessor: "location",
      render: (row) => row.location || "---",
    },
  ];

  if (detailLoading && !attendanceDetail) {
    return <Loader />;
  }

  return (
    <PageWrapper>
      <ReusableHeader
        title="Employees"
        breadcrumbs={["Employees", "Live Tracking"]}
        showBack
      />

      {employee && (employee.name || employee.employee_id) && (
        <EmployeeHeader employee={employee} editable={false} />
      )}

      {/* <CardWrapper>
        {computedCardList.map((card, index) => (
          <Card key={index}>
            <CardTitle>{card.title}</CardTitle>
            <CardValue>{card.value}</CardValue>
          </Card>
        ))}
      </CardWrapper> */}

      <HistoryTable>
        <div style={{ marginBottom: "15px" }}>
          {/* <Header>Sessions</Header> */}
          <CalendarWrapper>
            <input
              type="date"
              value={effectiveDate}
              onChange={handleDateChange}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </CalendarWrapper>
        </div>

        {error && <p style={{ color: "red" }}>{String(error)}</p>}

        <ReusableTable
          columns={eventColumns}
          data={allEvents}
          loading={loadingLocations}
        />
      </HistoryTable>
    </PageWrapper>
  );
};

export default TrackingList;