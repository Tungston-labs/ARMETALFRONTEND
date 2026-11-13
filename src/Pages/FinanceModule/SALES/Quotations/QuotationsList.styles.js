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
const statusColors = {
    draft: { bg: "#f3f4f6", color: "#4b5563", border: "#e5e7eb" },
    sent: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    pending: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
    approved: { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0" },
    rejected: { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
    converted: { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
};

const getStatus = (status) => statusColors[status] || statusColors.pending;

export const ActionGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

export const ConvertSOButton = styled.button`
    height: 28px;
    padding: 0 10px;

    border: 1px solid #f78926;
    border-radius: 6px;

    background: #fff8f2;
    color: #f78926;

    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;

    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f78926;
        color: #ffffff;
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const SmallIconButton = styled.button`
    width: 28px;
    height: 28px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid #e5e7eb;
    border-radius: 6px;

    background: #ffffff;
    color: ${({ $danger }) => ($danger ? "#dc2626" : "#374151")};

    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${({ $danger }) => ($danger ? "#dc2626" : "#f78926")};
        color: ${({ $danger }) => ($danger ? "#dc2626" : "#f78926")};
        background: ${({ $danger }) => ($danger ? "#fef2f2" : "#fff8f2")};
    }

    &:active {
        transform: scale(0.96);
    }
`;

export const StatusText = styled.span`
    display: inline-block;
    padding: 3px 10px;

    border-radius: 999px;
    border: 1px solid ${({ $status }) => getStatus($status).border};

    background: ${({ $status }) => getStatus($status).bg};
    color: ${({ $status }) => getStatus($status).color};

    font-size: 12px;
    font-weight: 500;
`;

export const InlineStatusSelect = styled.select`
    height: 28px;
    padding: 0 8px;

    border: 1px solid ${({ $status }) => getStatus($status).border};
    border-radius: 999px;
    outline: none;

    background: ${({ $status }) => getStatus($status).bg};
    color: ${({ $status }) => getStatus($status).color};

    font-size: 12px;
    font-weight: 500;

    cursor: pointer;

    &:focus {
        border-color: #f78926;
    }
`;

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;

    padding: 20px 24px;
    box-sizing: border-box;
`;

export const HeaderActionsRow = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
`;

export const ExportOutlineButton = styled.button`
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

    &:hover:not(:disabled) {
        border-color: #f78926;
        color: #f78926;
        background: #fff8f2;
    }

    &:active:not(:disabled) {
        transform: scale(0.98);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const DateRangeGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    height: 38px;
    padding: 0 10px;

    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #ffffff;

    box-sizing: border-box;

    input[type="date"] {
        height: 100%;
        min-width: 0;

        border: none;
        outline: none;
        background: transparent;

        color: #374151;
        font-size: 13px;
        cursor: pointer;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
        cursor: pointer;
    }

    span {
        flex-shrink: 0;
        color: #6b7280;
        font-size: 13px;
        font-weight: 500;
    }
`;

export const GenerateQuoteButton = styled.button`
    height: 38px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    padding: 0 16px;

    border: 1px solid #f78926;
    border-radius: 6px;

    background: #f78926;
    color: #ffffff;

    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;

    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #e07a1f;
        border-color: #e07a1f;
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const CompactStatsWrapper = styled.div`
    width: 100%;

    /* Tighten the shared StatsCards without editing the component */
    & > * {
        margin: 0;
    }
`;

export const CompactTableWrapper = styled.div`
    width: 100%;
    overflow-x: auto;

    table {
        width: 100%;
    }

    th,
    td {
        padding-top: 10px;
        padding-bottom: 10px;
        font-size: 13px;
    }
`;