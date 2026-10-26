import styled from "styled-components";

export const BalanceBanner = styled.div`
    background-color: #ddf4ea;
    min-height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    margin-bottom: 10px;
`;

export const BalanceStatus = styled.span`
    color: #018611;
    font-family: "Poppins", sans-serif;
font-weight: 700;
font-style: Bold;
font-size: 14px;
line-height: 100%;
letter-spacing: 0%;

`;

export const BalanceAmount = styled.span`
    color: #222;
    font-family: "Poppins", sans-serif;
font-weight: 500;
font-style: Medium;
font-size: 14px;
line-height: 100%;
letter-spacing: 0%;

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