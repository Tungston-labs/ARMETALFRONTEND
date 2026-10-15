import React, { useMemo, useState } from "react";
import { FiCalendar, FiChevronDown, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  PageContainer,
  Header,
  FormContainer,
  FormGrid,
  FormGroup,
  Label,
  Required,
  Input,
  DateInputWrapper,
  DateInput,
  AccountLinesHeader,
  AccountLinesTitle,
  AddLineButton,
  TableWrapper,
  JournalLinesTable,
  AccountSelectWrapper,
  AccountSelect,
  SelectArrow,
  LineInput,
  AmountInput,
  DeleteButton,
  TotalsBar,
  TotalItem,
  TotalDivider,
  TotalLabel,
  BalancedText,
  FooterButtons,
  CancelButton,
  SaveDraftButton,
  PostButton,
} from "./NewJournalentry.style";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";

const NewJournalentry = () => {
  const navigate = useNavigate();
  const [entryNumber] = useState("JE-1843");
  const [date, setDate] = useState("2026-04-30");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");

  const [lines, setLines] = useState([
    {
      id: 1,
      account: "",
      description: "Monthly depreciation",
      debit: "5500.00",
      credit: "0.00",
    },
    {
      id: 2,
      account: "Fixed Assets - Equipment",
      description: "Accumulated depreciation",
      debit: "0.00",
      credit: "5500.00",
    },
  ]);

  const accounts = [
    "Select Account",
    "Cash",
    "Petty Cash",
    "Accounts Receivable",
    "Accounts Payable",
    "Fixed Assets - Equipment",
    "Accumulated Depreciation",
    "Depreciation Expense",
    "Office Equipment",
    "Sales Revenue",
    "Purchase Expense",
    "Utility Expense",
  ];

  const totals = useMemo(() => {
    const debit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);

    const credit = lines.reduce(
      (sum, line) => sum + Number(line.credit || 0),
      0,
    );

    return {
      debit,
      credit,
      balanced: Number(debit.toFixed(2)) === Number(credit.toFixed(2)),
    };
  }, [lines]);

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleLineChange = (id, field, value) => {
    setLines((previous) =>
      previous.map((line) => {
        if (line.id !== id) {
          return line;
        }

        const updated = {
          ...line,
          [field]: value,
        };

        if (field === "debit" && value) {
          updated.credit = "0.00";
        }

        if (field === "credit" && value) {
          updated.debit = "0.00";
        }

        return updated;
      }),
    );
  };

  const addLine = () => {
    setLines((previous) => [
      ...previous,
      {
        id: Date.now(),
        account: "",
        description: "",
        debit: "0.00",
        credit: "0.00",
      },
    ]);
  };

  const removeLine = (id) => {
    if (lines.length <= 2) {
      return;
    }

    setLines((previous) => previous.filter((line) => line.id !== id));
  };

  const handleCancel = () => {
    navigate("/accounts/journal-entries");
  };

  const handleSaveDraft = () => {
    console.log("Save Journal Entry as Draft", {
      entryNumber,
      date,
      reference,
      description,
      lines,
    });
  };

  const handlePostEntry = () => {
    if (!totals.balanced) {
      alert("Debit and Credit must be equal.");
      return;
    }

    console.log("Post Journal Entry", {
      entryNumber,
      date,
      reference,
      description,
      lines,
    });
  };

  return (
    <PageContainer>
      {/* =================================================
          HEADER
      ================================================= */}

      <Header>
        <ReusableHeader
          title="New Journal Entries"
          breadcrumbs={["Accounting", "Journal Entries"]}
          buttonText="NEW JOURNAL ENTRY"
          // onButtonClick={handleNewJournalEntry}
        ></ReusableHeader>
      </Header>

      {/* =================================================
          FORM
      ================================================= */}

      <FormContainer>
        <FormGrid>
          {/* ENTRY NUMBER */}

          <FormGroup>
            <Label>ENTRY NO.</Label>

            <Input value={entryNumber} disabled />
          </FormGroup>

          {/* DATE */}

          <FormGroup>
            <Label>
              DATE <Required>*</Required>
            </Label>

            <DateInputWrapper>
              <DateInput
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />

              <FiCalendar />
            </DateInputWrapper>
          </FormGroup>

          {/* REFERENCE */}

          <FormGroup>
            <Label>REFERENCE NO.</Label>

            <Input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="SAR 4,200.00"
            />
          </FormGroup>

          {/* DESCRIPTION */}

          <FormGroup>
            <Label>DESCRIPTION</Label>

            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the purpose of this entry, e.g. 'Depreciation — Office Equipment'"
            />
          </FormGroup>
        </FormGrid>

        {/* =================================================
            ACCOUNT LINES
        ================================================= */}

        <AccountLinesHeader>
          <AccountLinesTitle>ACCOUNT LINES</AccountLinesTitle>

          <AddLineButton type="button" onClick={addLine}>
            <FiPlus />
            ADD LINE
          </AddLineButton>
        </AccountLinesHeader>

        <TableWrapper>
          <JournalLinesTable>
            <thead>
              <tr>
                <th>Account</th>
                <th>Description</th>
                <th>Debit (SAR)</th>
                <th>Credit (SAR)</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {lines.map((line) => (
                <tr key={line.id}>
                  {/* ACCOUNT */}

                  <td data-label="Account">
                    <AccountSelectWrapper>
                      <AccountSelect
                        value={line.account}
                        onChange={(event) =>
                          handleLineChange(
                            line.id,
                            "account",
                            event.target.value,
                          )
                        }
                      >
                        {accounts.map((account) => (
                          <option
                            key={account}
                            value={account === "Select Account" ? "" : account}
                          >
                            {account}
                          </option>
                        ))}
                      </AccountSelect>

                      <SelectArrow>
                        <FiChevronDown />
                      </SelectArrow>
                    </AccountSelectWrapper>
                  </td>

                  {/* DESCRIPTION */}

                  <td data-label="Description">
                    <LineInput
                      value={line.description}
                      onChange={(event) =>
                        handleLineChange(
                          line.id,
                          "description",
                          event.target.value,
                        )
                      }
                      placeholder="Description"
                    />
                  </td>

                  {/* DEBIT */}

                  <td data-label="Debit (SAR)">
                    <AmountInput
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.debit}
                      onChange={(event) =>
                        handleLineChange(line.id, "debit", event.target.value)
                      }
                    />
                  </td>

                  {/* CREDIT */}

                  <td data-label="Credit (SAR)">
                    <AmountInput
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.credit}
                      onChange={(event) =>
                        handleLineChange(line.id, "credit", event.target.value)
                      }
                    />
                  </td>

                  {/* DELETE */}

                  <td>
                    <DeleteButton
                      type="button"
                      aria-label="Remove line"
                      onClick={() => removeLine(line.id)}
                    >
                      <FiX />
                    </DeleteButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </JournalLinesTable>
        </TableWrapper>

        {/* =================================================
            TOTALS
        ================================================= */}

        <TotalsBar>
          <TotalItem>
            <TotalLabel>
              Total Debit: SAR {formatAmount(totals.debit)}
            </TotalLabel>
          </TotalItem>

          <TotalDivider />

          <TotalItem>
            <TotalLabel>
              Total Credit: SAR {formatAmount(totals.credit)}
            </TotalLabel>
          </TotalItem>

          <BalancedText $balanced={totals.balanced}>
            {totals.balanced ? "✓ Balanced" : "✕ Not Balanced"}
          </BalancedText>
        </TotalsBar>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <FooterButtons>
          <CancelButton type="button" onClick={handleCancel}>
            CANCEL
          </CancelButton>

          <SaveDraftButton type="button" onClick={handleSaveDraft}>
            SAVE DRAFT
          </SaveDraftButton>

          <PostButton type="button" onClick={handlePostEntry}>
            POST ENTRY
          </PostButton>
        </FooterButtons>
      </FormContainer>
    </PageContainer>
  );
};

export default NewJournalentry;