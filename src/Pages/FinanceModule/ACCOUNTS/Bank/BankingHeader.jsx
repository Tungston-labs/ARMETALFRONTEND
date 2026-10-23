import React from "react";
import { FiPlus } from "react-icons/fi";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import {
  BankingHeaderActions,
  AddBankButton,
  DateRangeWrapper,
  DatePickerContainer,
  DateInput,
  DateSeparator,
} from "./Banking.styles";

export default function BankingHeader({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onAddBank,
}) {
  return (
    <ReusableHeader
      title="Banking"
      breadcrumbs={["Dashboard", "Accounting", "Banking"]}
    >
      <BankingHeaderActions>
        <AddBankButton type="button" onClick={onAddBank}>
          <FiPlus /> ADD BANK
        </AddBankButton>
        <DateRangeWrapper>
          <DatePickerContainer>
            <DateInput
              type="date"
              aria-label="Start date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
            <DateSeparator>-</DateSeparator>
            <DateInput
              type="date"
              aria-label="End date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </DatePickerContainer>
        </DateRangeWrapper>
      </BankingHeaderActions>
    </ReusableHeader>
  );
}
