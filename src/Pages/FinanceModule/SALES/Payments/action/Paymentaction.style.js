import styled from "styled-components";

export const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;

export const IconButton = styled.button`
   width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${({ $danger }) => ($danger ? "#F5C2C4" : "#E5E7EB")};
    border-radius: 6px;
    background: #fff;
    color: ${({ $danger }) => ($danger ? "#E5484D" : "#4B5563")};
    cursor: pointer;
    transition: background 0.15s;

    &:hover:not(:disabled) {
        background: ${({ $danger }) => ($danger ? "#FDECEC" : "#F3F4F6")};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;