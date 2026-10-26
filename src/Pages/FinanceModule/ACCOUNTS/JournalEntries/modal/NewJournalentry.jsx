import React, { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiChevronDown, FiPlus, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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

import {
  addJournalEntry,
  editJournalEntry,
  postJournalEntry,
  getJournalEntryById,
  clearSelectedJournalEntry,
} from "../../../../../Redux/finance/accounts/Journalslice";

// Chart of accounts slice (state.accounting). Adjust the file name if yours differs.
import { getAccounts } from "../../../../../Redux/finance/accounts/Accountingslice";

const LIST_PATH = "/accounts/journal-entries";

// Local date (not UTC), so early-morning entries don't get yesterday's date
const today = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const newLine = () => ({
  id: Date.now() + Math.random(),
  accountId: "",
  description: "",
  debit: "",
  credit: "",
});

// Turns a string / DRF error object (incl. nested line errors) into one string
const getErrorText = (error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error.detail) return error.detail;

  return Object.entries(error)
    .map(
      ([field, message]) =>
        `${field}: ${typeof message === "string" ? message : JSON.stringify(message)}`
    )
    .join(" | ");
};

const NewJournalentry = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // /journal-entries/edit/:id  -> edit mode (drafts only)
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { saving, selectedEntry, detailLoading } = useSelector(
    (state) => state.journalEntry
  );

  const [date, setDate] = useState(today());
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState([newLine(), newLine()]);
  const [formError, setFormError] = useState("");

  // Account dropdown options come from the chart of accounts slice.
  // state.accounting.sections = { asset: [...], liability: [...], equity, revenue, expense }
  const { sections, error: accountingError } = useSelector(
    (state) => state.accounting
  );

  const accountsError = getErrorText(accountingError);

  useEffect(() => {
    // No params = all accounts (the API returns them grouped, not paginated)
    dispatch(getAccounts());
  }, [dispatch]);

  // Load the draft when editing
  useEffect(() => {
    if (!isEdit) return;

    dispatch(clearSelectedJournalEntry());
    dispatch(getJournalEntryById(id));

    return () => {
      dispatch(clearSelectedJournalEntry());
    };
  }, [dispatch, id, isEdit]);

  // Fill the form once the entry arrives
  useEffect(() => {
    if (!isEdit || !selectedEntry || String(selectedEntry.id) !== String(id)) {
      return;
    }

    if (String(selectedEntry.status).toLowerCase() !== "draft") {
      setFormError("Only draft entries can be edited.");
      return;
    }

    setDate(selectedEntry.entry_date || today());
    setReference(selectedEntry.reference_number || "");
    setDescription(selectedEntry.description || "");
    setLines(
      (selectedEntry.lines || []).map((line) => ({
        id: line.id ?? Date.now() + Math.random(),
        accountId: String(line.account),
        description: line.description || "",
        debit: Number(line.debit_amount || 0) > 0 ? String(line.debit_amount) : "",
        credit: Number(line.credit_amount || 0) > 0 ? String(line.credit_amount) : "",
      }))
    );
  }, [selectedEntry, id, isEdit]);

  const isLocked =
    isEdit &&
    selectedEntry &&
    String(selectedEntry.status).toLowerCase() !== "draft";

  // Flatten the groups, skip inactive accounts, sort by code
  const accounts = useMemo(
    () =>
      Object.values(sections || {})
        .flat()
        .filter(
          (account) =>
            account.is_active !== false &&
            String(account.status ?? "active").toLowerCase() !== "inactive"
        )
        .map((account) => ({
          id: account.id,
          code: account.account_code ?? "",
          name: account.account_name ?? account.name ?? "",
        }))
        .sort((a, b) => String(a.code).localeCompare(String(b.code))),
    [sections]
  );

  const totals = useMemo(() => {
    const debit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);

    const credit = lines.reduce(
      (sum, line) => sum + Number(line.credit || 0),
      0
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

  const handleLineChange = (lineId, field, value) => {
    setLines((previous) =>
      previous.map((line) => {
        if (line.id !== lineId) {
          return line;
        }

        const updated = {
          ...line,
          [field]: value,
        };

        // A line is either a debit or a credit, never both
        if (field === "debit" && Number(value) > 0) {
          updated.credit = "";
        }

        if (field === "credit" && Number(value) > 0) {
          updated.debit = "";
        }

        return updated;
      })
    );
  };

  const addLine = () => {
    setLines((previous) => [...previous, newLine()]);
  };

  const removeLine = (lineId) => {
    if (lines.length <= 2) {
      return;
    }

    setLines((previous) => previous.filter((line) => line.id !== lineId));
  };

  const handleCancel = () => {
    navigate(LIST_PATH);
  };

  // Returns an error message, or "" when the form is valid
  const validate = (forPosting) => {
    if (!date) return "Please select a date.";

    if (lines.length < 2) return "A journal entry needs at least two lines.";

    if (lines.some((line) => !line.accountId)) {
      return "Please select an account on every line.";
    }

    if (
      lines.some(
        (line) => Number(line.debit || 0) <= 0 && Number(line.credit || 0) <= 0
      )
    ) {
      return "Every line needs a debit or a credit amount.";
    }

    if (forPosting && !totals.balanced) {
      return "Debit and Credit must be equal.";
    }

    return "";
  };

  const buildPayload = () => ({
    entry_date: date,
    reference_number: reference,
    description,
    lines: lines.map((line) => ({
      account: Number(line.accountId), // the API expects "account" (the account id)
      description: line.description,
      debit_amount: Number(line.debit || 0).toFixed(2),
      credit_amount: Number(line.credit || 0).toFixed(2),
    })),
  });

  // Creates (or updates) the draft, then optionally posts it
  const submit = async (shouldPost) => {
    const message = validate(shouldPost);

    if (message) {
      setFormError(message);
      return;
    }

    setFormError("");

    let saved;

    try {
      saved = isEdit
        ? await dispatch(
            editJournalEntry({ id, data: buildPayload() })
          ).unwrap()
        : await dispatch(addJournalEntry(buildPayload())).unwrap();
    } catch (error) {
      setFormError(getErrorText(error));
      return;
    }

    if (shouldPost) {
      const entryId = saved?.id ?? id;

      if (!entryId) {
        alert(
          "Entry was saved as a draft, but the API did not return its id, so it could not be posted. Post it from the list."
        );
        navigate(LIST_PATH);
        return;
      }

      try {
        await dispatch(postJournalEntry(entryId)).unwrap();
      } catch (error) {
        alert(
          `Entry was saved as a draft, but posting failed: ${getErrorText(error)}`
        );
      }
    }

    navigate(LIST_PATH);
  };

  const handleSaveDraft = () => submit(false);

  const handlePostEntry = () => submit(true);

  return (
    <PageContainer>
      {/* =================================================
          HEADER
      ================================================= */}

      <Header>
        <ReusableHeader
          title={isEdit ? "Edit Journal Entry" : "New Journal Entry"}
          breadcrumbs={["Accounting", "Journal Entries"]}
        ></ReusableHeader>
      </Header>

      {/* =================================================
          FORM
      ================================================= */}

      <FormContainer>
        <FormGrid>
          {/* ENTRY NUMBER (generated by the backend) */}

          <FormGroup>
            <Label>ENTRY NO.</Label>

            <Input
              value={selectedEntry?.entry_number || "Auto-generated"}
              disabled
            />
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
              placeholder="REF-001"
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

        {accountsError && (
          <div style={{ color: "#e01b1b", fontSize: 13, padding: "8px 0" }}>
            Could not load accounts: {accountsError}
          </div>
        )}

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
                        value={line.accountId}
                        onChange={(event) =>
                          handleLineChange(
                            line.id,
                            "accountId",
                            event.target.value
                          )
                        }
                      >
                        <option value="">Select Account</option>

                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.code} - {account.name}
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
                          event.target.value
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
                      placeholder="0.00"
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
                      placeholder="0.00"
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
              Total Debit:{formatAmount(totals.debit)}
            </TotalLabel>
          </TotalItem>

          <TotalDivider />

          <TotalItem>
            <TotalLabel>
              Total Credit: {formatAmount(totals.credit)}
            </TotalLabel>
          </TotalItem>

          <BalancedText $balanced={totals.balanced}>
            {totals.balanced ? "✓ Balanced" : "✕ Not Balanced"}
          </BalancedText>
        </TotalsBar>

        {/* =================================================
            ERROR + BUTTONS
        ================================================= */}

        {formError && (
          <div style={{ color: "#e01b1b", fontSize: 13, padding: "10px 0" }}>
            {formError}
          </div>
        )}

        <FooterButtons>
          <CancelButton type="button" onClick={handleCancel} disabled={saving}>
            CANCEL
          </CancelButton>

          {/* Save Draft is hidden when editing an existing draft */}
          {!isEdit && (
            <SaveDraftButton
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              {saving ? "SAVING..." : "SAVE DRAFT"}
            </SaveDraftButton>
          )}

          <PostButton
            type="button"
            onClick={handlePostEntry}
            disabled={saving || detailLoading || isLocked}
          >
            {saving ? "POSTING..." : "POST ENTRY"}
          </PostButton>
        </FooterButtons>
      </FormContainer>
    </PageContainer>
  );
};

export default NewJournalentry;