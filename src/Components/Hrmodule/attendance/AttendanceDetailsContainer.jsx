import React from "react";
import AttendanceDetails from "./AttendanceDetails";

const formatTime = (datetimeStr) => {
  if (!datetimeStr) return "---";

  const date = new Date(datetimeStr.replace(" ", "T"));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const AttendanceDetailsContainer = ({
  attendanceDetail,
  selectedDate,
  setSelectedDate,
}) => {
const sessions = attendanceDetail?.sessions || [];

const todayDate = new Date().toISOString().split("T")[0];

const todaysSessions = sessions.filter((session) => {
  if (!session?.time_in) return false;
  return session.time_in.split(" ")[0] === todayDate;
});

const sortedSessions = [...todaysSessions].sort(
  (a, b) => new Date(a.time_in) - new Date(b.time_in)
);

const firstPunchIn =
  sortedSessions.length > 0
    ? formatTime(sortedSessions[0].time_in)
    : "---";

// Last Punch Out
const lastPunchOut =
  sortedSessions.length > 0 &&
  sortedSessions[sortedSessions.length - 1].time_out
    ? formatTime(sortedSessions[sortedSessions.length - 1].time_out)
    : "---";


  const weeklyHours =
    attendanceDetail?.weekly_hours_formatted || "00:00";

  const monthlyHours =
    attendanceDetail?.monthly_hours_formatted || "00:00";

  const cardList = [
    { title: "Today Punch In", value: firstPunchIn },
    { title: "Today Punch Out", value: lastPunchOut },
    
    { title: "Weekly Hours", value: weeklyHours },
    { title: "Monthly Hours", value: monthlyHours },
  ];

  return (
    <AttendanceDetails
      cardList={cardList}
      sessions={sessions}
      selectedDate={selectedDate}
      onDateChange={(e) => setSelectedDate(e.target.value)}
      formatTime={formatTime}
      employeeId={attendanceDetail?.employee?.id}
    />
  );
};

export default AttendanceDetailsContainer;