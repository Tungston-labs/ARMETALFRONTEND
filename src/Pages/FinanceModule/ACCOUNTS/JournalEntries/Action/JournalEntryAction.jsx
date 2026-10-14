import React from "react";

import { FiInfo } from "react-icons/fi";

import { ActionWrapper, ActionButton } from "./JournalEntryAction.style";

const JournalEntryAction = ({ row }) => {
  const handleView = () => {
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
