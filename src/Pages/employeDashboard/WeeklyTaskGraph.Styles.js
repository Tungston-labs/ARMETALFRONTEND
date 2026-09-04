import styled, { keyframes } from 'styled-components';

// --- Animation Keyframe ---
const growAnimation = keyframes`
  from {
    height: 0%;
  }
  to {
    height: var(--final-height);
  }
`;

// --- Color Palette & Sizing Variables ---
const $primaryPurple = '#172554';
const $lightPurple = '#3352BA';
const $orangeAccent = '#fd7e14';
const $backgroundColor = '#ffffff';
const $textColorDark = '#333';
const $textColorMedium = '#666';
const $borderColor = '#e9ecef';
const $borderRadius = '20px';
const $cardPadding = '25px';

// MAIN CARD
export const TasksProgressCard = styled.div`
  background: ${$backgroundColor};
  border-radius: ${$borderRadius};
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  padding: ${$cardPadding};
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
cursor: pointer;
  /* 2K screens */
  @media (min-width: 2540px) {
    padding: 40px;
    gap: 30px;
  }

  /* 4K screens (3840px+) */
  @media (min-width: 3840px) {
    padding: 55px;
    gap: 40px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// CARD TITLE
export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${$textColorDark};
  margin: 0;

  @media (min-width: 2540px) {
    font-size: 1.9rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.4rem;
  }
`;

export const Dropdown = styled.select`
  padding: 8px 12px;
  font-size: 0.9rem;

  @media (min-width: 2540px) {
    padding: 12px 18px;
    font-size: 1.2rem;
  }

  @media (min-width: 3840px) {
    padding: 16px 24px;
    font-size: 1.4rem;
  }
`;

export const ChartAndSummaryContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (min-width: 2540px) {
    gap: 35px;
  }

  @media (min-width: 3840px) {
    gap: 50px;
  }
`;

export const ChartContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  flex: 1;
  padding-right: 15px;
  position: relative;

  @media (min-width: 2540px) {
    gap: 16px;
    padding-right: 25px;
  }

  @media (min-width: 3840px) {
    gap: 22px;
    padding-right: 40px;
  }
`;

export const YAxisLabel = styled.div`
  position: absolute;
  left: -20px;
  bottom: 0;
  top: 0;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 25px;
  font-size: 0.8rem;
  color: ${$textColorMedium};

  @media (min-width: 2540px) {
    font-size: 1.2rem;
    left: -35px;
  }

  @media (min-width: 3840px) {
    font-size: 1.6rem;
    left: -50px;
  }
`;

export const ChartColumn = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  flex: 1;
`;

export const HourLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6px;
  color: #333;
`;

// BAR HEIGHT INCREASE FOR BIG SCREEN
export const BarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100px;
  width: 18px;
  background-color: #cfd9f8ff;
  border-radius: 4px;
  overflow: hidden;
 @media (min-width: 1024px) {
    height: 80px;
  }
   @media (min-width: 1440px) {
    height: 100px;
  }
    @media (min-width: 1600px) {
    height: 130px;
    width: 25px;
  }
  @media (min-width: 2540px) {
    height: 200px;
    width: 25px;
  }

  @media (min-width: 3840px) {
    height: 320px;
    width: 32px;
  }
`;

export const BarFill = styled.div`
  width: 100%;
  background: linear-gradient(to top, ${$primaryPurple}, ${$lightPurple});
  border-radius: 4px;
  height: var(--final-height);
  animation: ${growAnimation} 1.9s ease-out;
  --final-height: ${(props) => props.$percentage || 0}%;
`;


export const XAxisLabel = styled.div`
  margin-top: 8px;
  font-size: 0.8rem;
  color: ${$textColorMedium};

  @media (min-width: 2540px) {
    font-size: 1.1rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.4rem;
  }
`;

// SUMMARY SECTION
export const SummarySection = styled.div`
  flex: 0.7;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-left: 20px;
  border-left: 1px solid ${$borderColor};

  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid ${$borderColor};
    padding-left: 0;
    padding-top: 20px;
  }

  @media (min-width: 2540px) {
    gap: 25px;
    padding-left: 30px;
  }

  @media (min-width: 3840px) {
    gap: 35px;
    padding-left: 45px;
  }
`;

export const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SummaryLabel = styled.div`
  font-size: 0.9rem;
  color: ${$textColorMedium};
  margin-bottom: 5px;

  @media (min-width: 2540px) {
    font-size: 1.2rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.5rem;
  }
`;

export const SummaryValueContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 2540px) {
    gap: 14px;
  }

  @media (min-width: 3840px) {
    gap: 18px;
  }
`;

export const SummaryValue = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${$textColorDark};
  padding-left :50px;

  @media (min-width: 2540px) {
    font-size: 1.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.9rem;
  }
`;

export const PercentageTag = styled.span`
  background-color: ${$orangeAccent};
  color: #fff;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: 600;

  @media (min-width: 2540px) {
    padding: 6px 12px;
    font-size: 1rem;
  }

  @media (min-width: 3840px) {
    padding: 8px 16px;
    font-size: 1.2rem;
  }
`;
