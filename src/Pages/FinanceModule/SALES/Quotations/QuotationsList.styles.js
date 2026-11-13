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