import styled from "styled-components";

export const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EventCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  background: #fff;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  padding: 12px 14px;

  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);
`;

export const IconWrapper = styled.div`
  width: 38px;
  height: 38px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 26px;
  color: #2d2d2d;
`;

export const Content = styled.div`
  flex: 1;
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

export const Date = styled.span`
  font-size: 13px;
  color: #8a8a8a;
`;

export const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #6b7280;
`;

export const CalendarButton = styled.div`
  width: 34px;
  height: 34px;

  border-radius: 50%;
  background: #eef2ff;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #1f2937;
  font-size: 18px;
  cursor: pointer;
`;
