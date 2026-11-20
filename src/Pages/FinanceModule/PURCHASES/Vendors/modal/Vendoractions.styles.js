import styled from "styled-components";

export const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
`;

export const ActionButton = styled.button`
    width: 28px;
    height: 28px;
    padding: 0;
    margin: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: ${({ $danger }) => ($danger ? "#ef4444" : "#1f2937")};

    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;

    &:hover:not(:disabled) {
        background: ${({ $danger }) => ($danger ? "#fef2f2" : "#f3f4f6")};
        border-color: ${({ $danger }) => ($danger ? "#fecaca" : "#d1d5db")};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    svg {
        display: block;
    }

    .spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;