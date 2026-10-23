import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  /* min(100%, 200px) stops a card from overflowing on very narrow screens */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 18px;
  margin-bottom: 15px;

  @media (max-width: 1200px) {
    gap: 14px;
  }

  /* Tablet: two cards per row */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    /* If the count is odd, the last card fills the full row */
    & > *:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
  }

  /* Phone: one card per row */
  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: clamp(14px, 2vw, 22px);
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.5vw, 18px);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: 0.25s;

  border: 1px solid #0000001a;
  box-shadow: 0px 2.5px 25px 0px #4545501a;

  min-width: 0;
  width: 100%;
  box-sizing: border-box;

  /* Hover lift only on devices that can hover (not touch screens) */
  @media (hover: hover) {
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    }
  }
`;

export const IconWrapper = styled.div`
  width: clamp(40px, 4vw, 50px);
  height: clamp(40px, 4vw, 50px);
  min-width: clamp(40px, 4vw, 50px);
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: clamp(20px, 2.2vw, 28px);

  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};

  flex-shrink: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 0;
  flex: 1;
  overflow: hidden;
`;

export const Count = styled.div`
  font-size: clamp(18px, 1.8vw, 24px);
  font-weight: 700;
  line-height: 1.2;

  max-width: 100%;
  min-width: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Title = styled.div`
  margin-top: 5px;
  font-size: clamp(12px, 1.1vw, 14px);
  color: #8c89b4;
  font-weight: 400;
  font-family: "poppins";

  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;