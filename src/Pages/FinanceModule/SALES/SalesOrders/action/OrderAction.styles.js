
import styled from "styled-components";

export const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    position: relative;
    overflow: visible;
`;

export const ActionButton = styled.button`
    width: 25px;
    height: 25px;
    min-width: 25px;
    padding: 0;
    margin: 0;

    border: 1px solid #dedede;
    border-radius: 5px;

    background: #fff;
    color: ${({ $danger }) =>
        $danger ? "#ff0000" : "#333"};

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    flex-shrink: 0;

    transition: all 0.2s ease;

    &:hover {
        background: ${({ $danger }) =>
            $danger ? "#fff0f0" : "#f3f4f6"};

        border-color: ${({ $danger }) =>
            $danger ? "#ff0000" : "#bdbdbd"};
    }

    svg {
        display: block;
    }
`;
