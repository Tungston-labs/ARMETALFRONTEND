import React, { useState, useMemo } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

import {
  Overlay,
  ModalCard,
  Header,
  HeaderTitle,
  NavButton,
  CloseButton,
  WeekdayRow,
  Weekday,
  DayGrid,
  Day,
  Footer,
  TodayButton,
} from "./Calendermodal.styles";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const buildMonthGrid = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

const CalendarModal = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  holidays = [],
}) => {
  const today = useMemo(() => new Date(), []);

  const [viewDate, setViewDate] = useState(
    selectedDate || today
  );

  if (!isOpen) return null;

  const cells = buildMonthGrid(viewDate);

  const goToPrevMonth = () => {
    setViewDate(
      (date) =>
        new Date(
          date.getFullYear(),
          date.getMonth() - 1,
          1
        )
    );
  };

  const goToNextMonth = () => {
    setViewDate(
      (date) =>
        new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          1
        )
    );
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getHoliday = (date) => {
    if (!date) return null;

    const dateString = formatDate(date);

    return holidays.find(
      (holiday) => holiday.date === dateString
    );
  };

  const handleDateClick = (date) => {
    const holiday = getHoliday(date);

    if (holiday) {
      console.log("Holiday selected:", holiday);
    }

    onSelectDate?.(date);
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalCard
        role="dialog"
        aria-modal="true"
        aria-label="Calendar"
      >
        <Header>
          <NavButton
            onClick={goToPrevMonth}
            aria-label="Previous month"
          >
            <FiChevronLeft />
          </NavButton>

          <HeaderTitle>
            {MONTH_NAMES[viewDate.getMonth()]}{" "}
            {viewDate.getFullYear()}
          </HeaderTitle>

          <NavButton
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <FiChevronRight />
          </NavButton>

          <CloseButton
            onClick={onClose}
            aria-label="Close calendar"
          >
            <FiX />
          </CloseButton>
        </Header>

        <WeekdayRow>
          {WEEKDAYS.map((weekday, index) => (
            <Weekday key={`${weekday}-${index}`}>
              {weekday}
            </Weekday>
          ))}
        </WeekdayRow>

        <DayGrid>
          {cells.map((date, index) => {
            if (!date) {
              return <Day key={index} empty />;
            }

            const holiday = getHoliday(date);

            return (
              <Day
                key={index}
                isToday={isSameDay(date, today)}
                isSelected={isSameDay(
                  date,
                  selectedDate
                )}
                isHoliday={Boolean(holiday)}
                title={
                  holiday
                    ? `${holiday.description} (${holiday.holiday_type})`
                    : ""
                }
                onClick={() =>
                  handleDateClick(date)
                }
              >
                {date.getDate()}

                {holiday && (
                  <span>•</span>
                )}
              </Day>
            );
          })}
        </DayGrid>

        <Footer>
          <TodayButton
            onClick={() => {
              setViewDate(today);
              onSelectDate?.(today);
            }}
          >
            Today
          </TodayButton>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};

export default CalendarModal;