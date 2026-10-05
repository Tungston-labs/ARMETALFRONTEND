import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  DateRangeWrapper,
  DatePickerContainer,
  DateInput,
  DateSeparator,
} from "./CompanyLayout.styles";

const toDate = (value) => {
  if (!value) return null;

  const [year, month, day] = value.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );
};

const toStr = (date) => {
  if (!date) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const DateRangeFilter = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}) => {
  const handleStartChange = (date) => {
    onStartChange({
      target: {
        value: toStr(date),
      },
    });
  };

  const handleEndChange = (date) => {
    onEndChange({
      target: {
        value: toStr(date),
      },
    });
  };

  return (
    <DateRangeWrapper>
      <DatePickerContainer>

        {/* Start Date */}
        <DatePicker
          selected={toDate(startDate)}
          onChange={handleStartChange}
          maxDate={toDate(endDate)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Start date"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          yearDropdownItemNumber={15}
          scrollableYearDropdown
          isClearable
          popperPlacement="bottom-start"
          portalId="root"
          customInput={
            <DateInput
              aria-label="Start date"
              placeholder="Start date"
            />
          }
        />

        <DateSeparator>–</DateSeparator>

        {/* End Date */}
        <DatePicker
          selected={toDate(endDate)}
          onChange={handleEndChange}
          minDate={toDate(startDate)}
          dateFormat="dd/MM/yyyy"
          placeholderText="End date"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          yearDropdownItemNumber={15}
          scrollableYearDropdown
          isClearable
          popperPlacement="bottom-end"
          portalId="root"
          customInput={
            <DateInput
              aria-label="End date"
              placeholder="End date"
            />
          }
        />

      </DatePickerContainer>
    </DateRangeWrapper>
  );
};

export default DateRangeFilter;