import React from "react";
import { useNavigate } from "react-router-dom";
import { FiInfo } from "react-icons/fi";

import { ActionWrapper, ActionButton } from "./JournalEntryAction.style";

const JournalEntryAction = ({ row }) => {
  const navigate = useNavigate();

  const handleView = () => {
    const status = String(row.status || "").toLowerCase();

    // Draft -> open the form in edit mode (Cancel + Post Entry only)
    if (status === "draft") {
      navigate(`/accounts/journal-entries/edit/${row.id}`);
      return;
    }

    // posted / voided: a view-only page can be added here later
    console.log("View Journal Entry:", row);
  };

  return (
    <ActionWrapper>
      <ActionButton
        type="button"
        title="View Journal Entry"
        onClick={handleView}
      >
        <FiInfo />
      </ActionButton>
    </ActionWrapper>
  );
};

export default JournalEntryAction;