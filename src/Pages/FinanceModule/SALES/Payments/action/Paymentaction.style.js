import styled from "styled-components";

export const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;

export const IconButton = styled.button`
    width: 28px;
    height: 28px;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    border: 1px solid #e5e7eb;
    border-radius: 4px;
    background: #ffffff;
    color: ${({ $danger }) => ($danger ? "#e5484d" : "#111111")};

    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;

    &:hover {
        background: ${({ $danger }) => ($danger ? "#fdecec" : "#f5f7ff")};
        border-color: ${({ $danger }) => ($danger ? "#f5c2c4" : "#3049a3")};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;