import styled from "styled-components";

/* ------------------------------------------------------------------
   Layout
   desktop : as many cards per row as fit (min 200px each)
   tablet  : 2 per row (an odd last card spans the full row)
   phone   : 1 per row
------------------------------------------------------------------- */
export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  /* min(100%, 200px) stops a card from overflowing on very narrow screens */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;

    & > *:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 400px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
`;

/* ------------------------------------------------------------------
   Card
------------------------------------------------------------------- */
export const Card = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.4vw, 16px);

  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  padding: clamp(14px, 1.6vw, 20px);

  background: #ffffff;
  border: 1px solid #e9ebf3;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(20, 24, 60, 0.04), 0 4px 16px rgba(20, 24, 60, 0.05);

  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  /* Hover lift only on devices that can hover (not touch screens) */
  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
      border-color: #d9dcec;
      box-shadow: 0 2px 4px rgba(20, 24, 60, 0.04),
        0 12px 28px rgba(20, 24, 60, 0.09);
    }
  }

  &:focus-visible {
    outline: 2px solid #3250bc;
    outline-offset: 2px;
  }

  &:active {
    ${({ $clickable }) => $clickable && "transform: scale(0.99);"}
  }

  @media (max-width: 480px) {
    gap: 12px;
    padding: 14px;
    border-radius: 12px;
  }
`;

/* ------------------------------------------------------------------
   Icon tile
------------------------------------------------------------------- */
export const IconWrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  width: clamp(42px, 3.6vw, 50px);
  height: clamp(42px, 3.6vw, 50px);

  border-radius: 14px;
  font-size: clamp(20px, 1.8vw, 24px);

  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};

  svg {
    flex-shrink: 0;
  }
`;

/* ------------------------------------------------------------------
   Text
------------------------------------------------------------------- */
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;

  flex: 1;
  min-width: 0;
`;

export const Count = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: clamp(15px, 0.6vw + 10px, 19px);
  font-weight: 500;
  line-height: 1.15;
  color: #1f2340;
  font-variant-numeric: tabular-nums;

  max-width: 100%;
  min-width: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Title = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: clamp(12px, 0.5vw + 9px, 14px);
  font-weight: 400;
  line-height: 1.35;
  color: #8c89b4;

  max-width: 100%;

  /* up to two lines instead of cutting long titles to "..." immediately */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
`;