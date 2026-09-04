import styled from "styled-components";

export const CardBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 6px solid #3352BA;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.12);
  }


  
  @media (max-width: 1024px) {
    /* flex-direction: column; */
    align-items: flex-start;
    /* gap: 12px; */
  }

  @media (min-width: 2560px) {
    padding: 30px;
  }

  @media (min-width: 3840px) {
    padding: 30px;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 12px;
  }
`;

export const RightSection = styled.div`
  @media (max-width: 1024px) {
    align-self: flex-end;
  }
`;

export const IconBox = styled.div`
  width: 45px;
  height: 45px;
  background: #e9efff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3352BA;

  @media (min-width: 2560px) {
    width: 90px;
    height: 100px;
  }

   @media (min-width: 3840px) {
    width: 90px;
    height: 100px;
  }
`;

export const StatNumber = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #3352BA;

  @media (min-width: 2560px) {
    font-size: 2.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 15px;
  color: #202020ff;
  margin-top: 10px;

  @media (min-width: 2560px) {
    font-size: 1.5rem
  }

  @media (min-width: 3840px) {
    font-size: 30px;
  }
`;

export const Arrow = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #3352BA;

  @media (min-width: 2560px) {
    font-size: 28px;
  }

  @media (min-width: 3840px) {
    font-size: 40px;
  }
`;
