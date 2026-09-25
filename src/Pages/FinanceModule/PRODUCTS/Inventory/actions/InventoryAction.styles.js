import styled from "styled-components";

export const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    gap: 6px;

    overflow: visible;
`;

export const ActionButton = styled.button`
    width: 25px;
    height: 25px;

    padding: 0;
    margin: 0;

    border: none;
    border-radius: 50%;

    background: #f3f4f6;
    color: #374151;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    flex-shrink: 0;

    position: relative;
    z-index: 10;

    transition: all 0.2s ease;

    &:hover {
        background: #e5e7eb;
        transform: scale(1.08);
    }

    svg {
        display: block;
    }
`;

export const FloatingAction = styled.button`
    width: 24px;
    height: 24px;

    padding: 0;
    margin: 0;

    border: none;
    border-radius: 50%;

    display: ${({ $open }) => ($open ? "flex" : "none")};

    align-items: center;
    justify-content: center;

    cursor: pointer;

    flex-shrink: 0;

    transition:
        transform 0.2s ease,
        opacity 0.2s ease;

    ${({ $position }) =>
        $position === "info" &&
        `
            background: #e8f1ff;
            color: #2563eb;
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