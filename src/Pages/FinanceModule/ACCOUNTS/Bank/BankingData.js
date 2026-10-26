export const formatSAR = (value) =>
  `SAR ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null) ?? "";

export const mapTransaction = (item) => ({
  ...item,
  id: item.id,
  date: firstValue(item.date, item.transaction_date, item.created_at),
  referenceNo: firstValue(
    item.referenceNo,
    item.reference_no,
    item.reference_number,
  ),
  bankAccount: firstValue(
    item.bankAccount,
    item.bank_account_name,
    item.bank_account,
    item.account_name,
  ),
  transactionType: firstValue(item.transactionType, item.transaction_type),
  moneyIn: firstValue(item.moneyIn, item.money_in, item.credit_amount, 0),
  moneyOut: firstValue(item.moneyOut, item.money_out, item.debit_amount, 0),
  balanceAfter: firstValue(
    item.balanceAfter,
    item.balance_after,
    item.balance,
    0,
  ),
  status: firstValue(item.status, "Pending"),
});

export const mapBank = (item) => ({
  ...item,
  id: item.id,
  slNo: item.slNo ?? item.serial_number ?? item.id,
  bankName: firstValue(item.bankName, item.bank_name),
  accountType: firstValue(item.accountType, item.account_type),
  accountNumber: firstValue(item.accountNumber, item.account_number),
  bankType: firstValue(item.bankType, item.bank_type),
  openingBalance: firstValue(item.openingBalance, item.opening_balance, 0),
  outstanding: firstValue(item.outstanding, item.outstanding_balance, 0),
});

export const mapLoan = (item) => ({
  ...item,
  id: item.id,
  slNo: item.slNo ?? item.serial_number ?? item.id,
  bankName: firstValue(item.bankName, item.bank_name),
  loanAmount: firstValue(item.loanAmount, item.loan_amount, 0),
  outstanding: firstValue(item.outstanding, item.outstanding_balance, 0),
  interestRate: firstValue(item.interestRate, item.interest_rate, 0),
  monthlyInstalment: firstValue(
    item.monthlyInstalment,
    item.monthly_instalment,
    item.emi_amount,
    0,
  ),
  tenure: firstValue(item.tenure, item.tenure_months, ""),
  nextDue: firstValue(item.nextDue, item.next_due, ""),
});
