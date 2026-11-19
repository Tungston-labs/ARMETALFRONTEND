import styled from "styled-components";

export const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
`;

export const IconButton = styled.button`
    width: 28px;
    height: 28px;
    padding: 0;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    border: 1px solid #e5e7eb;
    border-radius: 4px;
    background: #ffffff;
    color: ${({ $danger }) => ($danger ? "#e5484d" : "#374151")};

    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

    &:hover {
        background: ${({ $danger }) => ($danger ? "#fdecec" : "#f9fafb")};
        border-color: ${({ $danger }) => ($danger ? "#fca5a5" : "#d1d5db")};
        color: ${({ $danger }) => ($danger ? "#dc2626" : "#111827")};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
