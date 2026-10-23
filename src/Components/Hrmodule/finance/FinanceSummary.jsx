import React from "react";
import {
  SummaryWrapper,
  SummaryCard,
  SummaryLabel,
  SummaryValue,
} from "../../Pages/finance/FinancePage.Styles";

const FinanceSummary = ({
  income = 0,
  expense = 0,
  cashBalance = 0,
}) => {
  const formatAmount = (val) =>
    Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <SummaryWrapper>
      <SummaryCard>
        <SummaryLabel>Total Income</SummaryLabel>
        <SummaryValue>
           {formatAmount(income)}
        </SummaryValue>
      </SummaryCard>

      <SummaryCard>
        <SummaryLabel>Total Expense</SummaryLabel>
        <SummaryValue>
           {formatAmount(expense)}
        </SummaryValue>
      </SummaryCard>

      <SummaryCard>
        <SummaryLabel>Cash Balance</SummaryLabel>
        <SummaryValue
          style={{
            color: cashBalance >= 0 ? "#0b6623" : "#b91c1c",
          }}
        >
           {formatAmount(cashBalance)}
        </SummaryValue>
      </SummaryCard>
    </SummaryWrapper>
  );
};

export default FinanceSummary;