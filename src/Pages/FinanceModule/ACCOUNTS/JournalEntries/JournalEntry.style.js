import styled from "styled-components";

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
export const JournalSummaryContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 236px;
    align-items: stretch;
    width: 100%;
    min-height: 62px;
    margin: 12px 0 16px;
    background: #ffffff;
    border-radius: 9px;
    overflow: hidden;
    border: 1px solid #f0f2f5;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const JournalSummaryItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 24px;
    border-right: 1px solid #e8e8e8;

    @media (max-width: 768px) {
        border-right: none;
        border-bottom: 1px solid #e8e8e8;
        padding: 12px 16px;
    }
`;

export const JournalSummaryIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 43px;
    height: 43px;
    border-radius: 50%;
    background: ${({ $background }) => $background};
    color: ${({ $color }) => $color};

    svg {
        width: 21px;
        height: 21px;
        stroke-width: 1.8;
    }
`;

export const JournalSummaryContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;

export const JournalSummaryLabel = styled.span`
    color: #555555;
    font-weight: 400;
    font-family: "Poppins",sans-serif;
font-weight: 300;
font-style: Light;
font-size: 12px;
line-height: 18px;
letter-spacing: 0%;

`;

export const JournalSummaryAmount = styled.span`
    color: #111111;
    font-size: 16px;
    font-weight: 600;
    font-family: "Poppins",sans-serif;
font-weight: 500;
font-style: Medium;
line-height: 18px;
letter-spacing: 0%;

`;

export const JournalStatusContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding: 10px 16px;
    background: #e0f5e9;

    @media (max-width: 768px) {
        min-height: 62px;
    }
`;

export const JournalStatusLabel = styled.span`
    color: #444444;
 font-size: 12px;
    font-weight: 400;
`;

export const JournalStatusValue = styled.span`
    color: #00852d;
       font-size: 16px;
    font-weight: 500;
`;