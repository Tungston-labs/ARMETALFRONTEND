import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* gap: 40px; */
  padding: 20px;
  background: linear-gradient(
    110deg,
    #E0822D 50%,
    #3352BA 100%
  );

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
`;

export const Greeting = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
    margin: 4px 0;
`;

export const Title = styled.h2`
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin: 4px 0;
`;

export const Description = styled.p`
  color: rgba(255,255,255,.75);
  font-size: 15px;
`;

export const RightSection = styled.div`
  display: flex;
  gap: 50px;

  padding-left: 35px;
  border-left: 1px solid rgba(255,255,255,.2);

  @media (max-width:992px){
    padding-left:0;
    border-left:none;
    width:100%;
  }
`;

export const Summary = styled.div``;

export const Attendance = styled.div``;

export const SummaryTitle = styled.p`
  color: rgba(255,255,255,.8);
  font-size: 13px;
  margin-bottom: 20px;
`;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  color: white;
  font-size: 14px;
`;

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

export const ProgressBar = styled.div`
  width: 170px;
  height: 7px;

  border-radius: 10px;
  overflow: hidden;

  background: rgba(255,255,255,.25);
`;

export const Progress = styled.div`
  width: ${({ width }) => width};
  height: 100%;
  background: ${({ color }) => color};
`;

export const Count = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;