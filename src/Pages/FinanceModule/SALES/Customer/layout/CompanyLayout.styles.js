import styled from "styled-components";

export const LayoutWrapper = styled.div`
padding: 20px;
`;

export const HeaderSection = styled.header`
  width: 100%;
`;

export const ContentSection = styled.main`
  width: 100%;

`;
export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #3b4ce2; /* adjust to match your exact brand blue */
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #2f3ec7;
  }
`;

export const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
 margin-right: 16px;
  padding: 8px 12px;

  border: 1px solid #d9d9d9;
  border-radius: 6px;

  background: #ffffff;

  cursor: pointer;

  &:hover {
    border-color: #f28c28;
  }

  svg {
    font-size: 18px;
    flex-shrink: 0;
  }
`;

export const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const DateInput = styled.input`
  border: none;
  outline: none;
  background: transparent;

  font-size: 14px;
  color: #333;

  cursor: pointer;

  width: 125px;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

export const DateSeparator = styled.span`
  color: #777;
  font-size: 14px;
`;

/* Active / Inactive toggle shown beside the status badge */
export const ToggleSwitch = styled.button`
  position: relative;
  flex-shrink: 0;

  width: 40px;
  height: 22px;
  padding: 0;

  border: none;
  border-radius: 999px;

  background: ${({ $on }) => ($on ? "#3250BC" : "#D0D5DD")};

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  transition: background 0.2s ease, opacity 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${({ $on }) => ($on ? "20px" : "2px")};

    width: 18px;
    height: 18px;

    border-radius: 50%;
    background: #ffffff;

    transition: left 0.2s ease;
  }

  &:focus-visible {
    outline: 2px solid #3250bc;
    outline-offset: 2px;
  }
`;

export const StatusError = styled.span`
  color: #e53935;
  font-size: 12px;
`;