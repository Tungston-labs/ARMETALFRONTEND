import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrapper,
  SmallMeta,
  CalendarIcon,
  List,
  ListItem,
  DayBox,
  Info,
  Type,
  ViewAll,
  NoData
} from "./UpcomingHolidays.styles";

import { Header, IconButton, Name, Title } from "./RecentlyAddedEmployees.styles";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function daysFromToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);
  const diff = d - today;
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

const UpcomingHolidays = ({ holidays = [], showCount = 5 }) => {
  const navigate = useNavigate();

  const sorted = [...holidays].sort((a, b) => new Date(a.date) - new Date(b.date));
  const list = sorted.slice(0, showCount);

  const handleViewAll = () => {
    navigate("/holiday");
  };

  return (
    <Wrapper>
      <Header>
        <Title>Upcoming Holidays</Title>


        <IconButton onClick={() => navigate("/holiday")}>
          <BsArrowUpRightCircleFill />
        </IconButton>
      </Header>

      <List>
        {list.length === 0 && <NoData>No upcoming holidays</NoData>}

        {list.map((h, idx) => {
          const days = daysFromToday(h.date);
          const isSoon = days >= 0 && days <= 30;

          return (
            <ListItem key={idx}>
              <DayBox highlight={isSoon}>
                <div className="date">{formatDateShort(h.date)}</div>
                <div className="days">
                  {days === 0 ? "Today" : days > 0 ? `${days}d` : `${Math.abs(days)}d ago`}
                </div>
              </DayBox>

              <Info>
                <Name>{h.name}</Name>
                <Type>{h.type || "Holiday"}</Type>
              </Info>
            </ListItem>
          );
        })}
      </List>

      {/* <ViewAll onClick={handleViewAll}>View all holidays</ViewAll> */}
    </Wrapper>
  );
};

export default UpcomingHolidays;
