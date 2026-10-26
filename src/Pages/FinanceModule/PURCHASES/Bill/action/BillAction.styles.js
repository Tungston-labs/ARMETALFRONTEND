import styled from "styled-components";

export const ActionWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;
`;

export const ActionButton = styled.button`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e1e1e1;
  border-radius: 5px;

  background: #ffffff;

  color: #111111;

  cursor: pointer;

  padding: 0;

  transition: all 0.2s ease;

  &:hover {
    border-color: #2f4da8;
    color: #2f4da8;
  }
`;

export const FloatingAction = styled.button`
  position: absolute;

  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #dddddd;
  border-radius: 50%;

  background: #ffffff;

  cursor: pointer;

  padding: 0;

  opacity: ${({ $open }) => ($open ? 1 : 0)};

  pointer-events: ${({ $open }) =>
        $open ? "auto" : "none"};

  transform: ${({ $open, $position }) => {
        if (!$open) {
            return "translate(0, 0) scale(0.7)";
        }

        if ($position === "edit") {
            return "translate(-35px, 0) scale(1)";
        }

        return "translate(35px, 0) scale(1)";
    }};

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  color: ${({ $position }) =>
        $position === "delete"
            ? "#ff0000"
            : "#2f4da8"};

  &:hover {
    background: #f7f7f7;
  }
`;