import styled from "styled-components";

export const MainReportLayout = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(320px, 1fr);

    gap: 16px;

    margin-top: 16px;

    align-items: stretch;

    /* Tablet and below: stack table and side panel */
    @media (max-width: 1350px) {
        grid-template-columns: minmax(0, 1fr);
    }

    /* Mobile: tighter spacing */
    @media (max-width: 600px) {
        gap: 12px;
        margin-top: 12px;
    }
`;

export const TableSide = styled.div`
    min-width: 0;

    display: flex;
    flex-direction: column;
`;



export const ExportButton = styled.button`
    height: 36px;
    padding: 0 14px;

    display: flex;
    align-items: center;
    gap: 7px;

    background: #ffffff;
    border: 1px solid #dcdcdc;
    border-radius: 5px;

    color: #333;
    font-size: 12px;
    font-weight: 500;

    cursor: pointer;

    transition: all 0.2s ease;

    svg {
        font-size: 16px;
    }

    &:hover {
        background: #f5f5f5;
        border-color: #c8c8c8;
    }
`;
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