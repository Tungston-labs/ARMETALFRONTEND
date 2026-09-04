import React, { useState, useMemo } from "react";
import {
  CalendarWrapper,
  Header,
  NavButtons,
  MonthName,
  Grid,
  Day,
  Weekday,
} from "./SingleHolidayCalendar.styles";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SingleHolidayCalendar = ({ holidays = [] }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());


  const holidayMap = useMemo(() => {
    const map = {};
    holidays.forEach((h) => {
      map[h.date] = {
        name: h.description,
        type: h.holiday_type
      };
    });
    return map;
  }, [holidays]);

  // --------------------------------------------------------
  // 🔥 Auto-mark Sundays (or Fridays) as holiday if
  // "company_off_day" exists in holiday list
  // --------------------------------------------------------
  const hasCompanyOffDay = holidays.some(h => h.holiday_type === "company_off_day");

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  const renderDays = () => {
    const list = [];
    for (let i = 0; i < firstDay; i++) list.push(<Day key={"e" + i} />);
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;

      const currentDate = new Date(year, month, d);
      const weekday = currentDate.getDay(); 

      let isHoliday = holidayMap[dateStr] || null;
      if (!isHoliday && hasCompanyOffDay && weekday === 0) {
        isHoliday = {
          name: "Company Off Day",
          type: "company_off_day"
        };
      }
      const isToday =
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      let className = "";
      if (isHoliday) className = "holiday";
      if (isToday) className += " today";

      const tooltip = isHoliday
        ? `${isHoliday.name}`
        : "";

      list.push(
        <Day key={d} className={className} title={tooltip}>
          {d}
        </Day>
      );
    }

    return list;
  };

  return (
    <CalendarWrapper>
      <Header>
        <NavButtons onClick={prevMonth}>‹</NavButtons>

        <MonthName>
          {monthNames[month]} {year}
        </MonthName>

        <NavButtons onClick={nextMonth}>›</NavButtons>
      </Header>

      <Grid>
        {weekdays.map((w) => (
          <Weekday key={w}>{w}</Weekday>
        ))}
        {renderDays()}
      </Grid>
    </CalendarWrapper>
  );
};

export default SingleHolidayCalendar;
