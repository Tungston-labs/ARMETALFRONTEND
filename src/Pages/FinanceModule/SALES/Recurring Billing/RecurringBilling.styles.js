import styled from "styled-components";

export const DateRangeWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const DatePickerContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    width: 280px;
    height: 38px;
    padding: 0 10px;

    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #ffffff;

    box-sizing: border-box;
`;

export const DateInput = styled.input`
    flex: 1;
    min-width: 0;
    width: 100%;
    height: 100%;

    border: none;
    outline: none;
    background: transparent;

    color: #374151;
    font-size: 13px;
    cursor: pointer;

    &::-webkit-calendar-picker-indicator {
        cursor: pointer;
    }
`;

export const DateSeparator = styled.span`
    flex-shrink: 0;

    color: #6b7280;
    font-size: 13px;
    font-weight: 500;
`;

export const ExportButton = styled.button`
    height: 38px;
    min-width: 90px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    padding: 0 14px;

    border: 1px solid #e5e7eb;
    border-radius: 6px;

    background: #ffffff;
    color: #374151;

    font-size: 13px;
    font-weight: 500;

    cursor: pointer;

    transition: all 0.2s ease;

    svg {
        width: 16px;
        height: 16px;
    }

    &:hover {
        border-color: #f78926;
        color: #f78926;
        background: #fff8f2;
    }

    &:active {
        transform: scale(0.98);
    }

    @media (max-width: 900px) {
        min-width: 38px;
        width: 38px;
        padding: 0;

        span {
            display: none;
        }
    }
`;
export const ToggleSwitch = styled.button`
    position: relative;
    width: 44px;
    height: 24px;
    padding: 0;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    background: ${({ $on }) => ($on ? "#16a34a" : "#e5e7eb")};
    transition: background 0.2s ease;
    flex-shrink: 0;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:focus-visible {
        outline: 2px solid #f78926;
        outline-offset: 2px;
    }

    &::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
        transform: translateX(${({ $on }) => ($on ? "20px" : "0")});
        transition: transform 0.2s ease;
    }
`;