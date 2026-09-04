import styled from "styled-components";

export const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  /* ---------- LARGE SCREENS ---------- */

  /* 1920px full HD */
  @media (min-width: 1920px) {
    grid-template-columns: 2.2fr 1fr;
    gap: 30px;
  }

  /* 2560px (2K monitors) */
  @media (min-width: 2560px) {
    grid-template-columns: 2.2fr 1fr;
    gap: 35px;
  }

  /* 3840px (4K monitors) */
  @media (min-width: 3840px) {
    grid-template-columns: 2.3fr 1fr;
    gap: 40px;
  }

  /* ---------- MEDIUM SCREENS ---------- */

  @media (max-width: 1600px) {
    grid-template-columns: 2fr 1fr;
    gap: 25px;
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1.5fr 1fr;
    gap: 20px;
  }

  /* ---------- SMALL SCREENS ---------- */

  @media (max-width: 992px) {
    /* grid-template-columns: 1fr; */
    gap: 18px;
  }
`;

export const LeftChart = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
`;

export const RightCards = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 992px) {
    justify-content: stretch;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;

  @media (min-width: 1920px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  @media (min-width: 2560px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 35px;
  }
  @media (min-width: 3840px) {
   grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
 
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const CardBox = styled.div`
  border-radius: 14px;
  padding: 25px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  border: 1px solid #eaeaea;
  transition: 0.3s ease;
  border-top: 6px solid #3352BA;
  /* height: 175px; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #3352BA;
  background: white;

  @media (max-width: 768px) {
    height: auto;
    padding: 18px;
  }

  /* @media (min-width: 2560px) { 
  }
      @media (min-width: 3840px) {
    height: 345px;
  
  } */
`;

export const Title = styled.h4`
  font-size: 15px;
  color: #3352BA;
  margin-bottom: 8px;

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }
     @media (min-width: 3840px) {
    font-size: 2rem;
  }
`;

export const Count = styled.h2`
  font-size: 34px;
  font-weight: 700;
  margin: 0;
  color: #3352BA;

  @media (min-width: 2560px) {
    font-size: 2.8rem;
  }
     @media (min-width: 3840px) {
    font-size: 2.8rem;
  }
`;

export const Subtext = styled.p`
  font-size: 13px;
  color: #3352BA;
  margin-top: 10px;

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }
     @media (min-width: 3840px) {
    font-size: 1.5rem;
  }
`;

export const Heading = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;

  @media (min-width: 2560px) {
    font-size: 22px;
  }
     @media (min-width: 2560px) {
    font-size: 25px;
  }
`;


export const ChartWrapper = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 100%;


  @media (min-width:2560px) {
   padding: 20px;
  }
`;

export const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    font-size: 16px;
  }

  @media (min-width: 1920px) {
    font-size: 22px;
  }
    @media (min-width: 2540px) {
    font-size: 2rem;
  }
`;
export const IconButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    color: #3352ba;
    font-size: 22px;
  }

  &:hover svg {
    opacity: 0.8;
    transform: scale(1.05);
    transition: 0.2s;
  }
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 200px;     

  @media (min-width: 768px) {
    height: 280px;
  }
  @media (min-width: 1024px) {
    height: 300px;
  }

 @media (min-width: 1440px) {
    height: 280px;
  }

  @media (min-width: 1920px) {
    height: 250px;
  }

 
  /* @media (min-width: 2560px) {
    height: 25vh;
  }

  @media (min-width: 3840px) {
    height: 28vh;
  } */
`
const MonthTickText = styled.text`
  fill: #475569;
  font-weight: 600;
  letter-spacing: 0.3px;

  font-size: 12px;

  @media (max-width: 500px) {
    font-size: 9px;    /* small text on mobile */
  }
`;