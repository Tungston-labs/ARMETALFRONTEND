import styled from "styled-components";

export const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 6px;
    overflow: visible;
    position: relative;
`;

export const ActionButton = styled.button`
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

export const FloatingAction = styled.button`
    width: 24px;
    height: 24px;

    padding: 0;
    margin: 0;

    border: none;
    border-radius: 50%;

    display: ${({ $open }) =>
        $open ? "flex" : "none"};

    align-items: center;
    justify-content: center;

    cursor: pointer;
    flex-shrink: 0;

    transition:
        transform 0.2s ease,
        opacity 0.2s ease;

    ${({ $position }) =>
        $position === "view" &&
        `
            background: #e8f1ff;
            color: #3478f6;
        `}

    ${({ $position }) =>
        $position === "edit" &&
        `
            background: #fef3c7;
            color: #d97706;
        `}

    ${({ $position }) =>
        $position === "delete" &&
        `
            background: #ffe8e8;
            color: #dc2626;
        `}

    &:hover {
        transform: scale(1.12);
    }

    svg {
        display: block;
    }
`;