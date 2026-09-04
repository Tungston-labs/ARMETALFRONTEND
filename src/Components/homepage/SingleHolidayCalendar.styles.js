import styled from "styled-components";

export const CalendarWrapper = styled.div`
  width: 100%;
  max-width: 250px;
  margin: 0 auto;
  padding: 10px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(0,0,0,0.3);

  ;
  @media (min-width: 1920px) { max-width: 350px; padding: 14px; }
  @media (min-width: 2560px) { max-width: 420px; padding: 18px; }
  @media (min-width: 3840px) { max-width: 500px; padding: 24px; }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  @media (min-width: 1920px) { margin-bottom: 16px; }
  @media (min-width: 2560px) { margin-bottom: 20px; }
  @media (min-width: 3840px) { margin-bottom: 24px; }
`;

export const MonthName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;

  @media (max-width: 600px) { font-size: 14px; }
  @media (min-width: 2560px) { font-size: 28px; }
  @media (min-width: 3840px) { font-size: 36px; }
`;

export const NavButtons = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  color: #1e293b;
  transition: transform 0.2s, color 0.2s;

  &:hover {
    color: #000;
    transform: scale(1.2);
  }

  @media (max-width: 600px) { font-size: 14px; padding: 3px 6px; }
  @media (min-width: 1920px) { font-size: 24px; padding: 6px 10px; }
  @media (min-width: 2560px) { font-size: 28px; padding: 8px 12px; }
  @media (min-width: 3840px) { font-size: 36px; padding: 10px 14px; }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;

  @media (min-width: 1920px) { gap: 5px; }
  @media (min-width: 2560px) { gap: 5px; }
  @media (min-width: 3840px) { gap: 8px; }
`;

export const Weekday = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;

  @media (max-width: 600px) { font-size: 10px; }
  @media (min-width: 1920px) { font-size: 16px; }
  @media (min-width: 2560px) { font-size: 18px; }
  @media (min-width: 3840px) { font-size: 22px; }
`;

export const Day = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &.holiday {
    background: #fdecec;
    color: #b91c1c;
    font-weight: 600;
    border: 1px solid #f87171;
  }

  &.today {
    background: #dbeafe;
    color: #1e40af;
    font-weight: 700;
    border: 1px solid #3b82f6;
  }

  &:hover {
    background: #e2e8f0;
  }

  @media (max-width: 600px) { height: 24px; font-size: 10px; }
  @media (min-width: 1920px) { height: 40px; font-size: 16px; }
  @media (min-width: 2560px) { height: 48px; font-size: 18px; }
  @media (min-width: 3840px) { height: 60px; font-size: 22px; }
`;
