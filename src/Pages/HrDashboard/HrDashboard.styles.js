import styled from "styled-components";

export const DashboardWrapper = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

export const DashboardContainer = styled.div`
  padding: 20px;

  @media (max-width: 992px) {
    padding: 18px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StatsSection = styled.div`
  /* margin-top: 24px; */
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
export const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.4fr 1.2fr;
  gap: 20px;
  align-items: stretch;

  @media (max-width: 1200px) {
   grid-template-columns: 1fr;  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #edf2f7;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
`;

export const CardBody = styled.div`
  padding: 20px 24px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ gap }) => gap || "12px"};
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #edf2f7;
  margin: 20px 0;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 50px;
  overflow: hidden;
`;

export const Progress = styled.div`
  width: ${({ width }) => width};
  height: 100%;
  background: ${({ color }) => color || "#4F46E5"};
  border-radius: inherit;
`;

export const Percentage = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ color }) => color || "#22C55E"};
`;

export const Label = styled.span`
  font-size: 14px;
  color: #64748b;
`;

export const Value = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
`;

export const SmallText = styled.span`
  font-size: 13px;
  color: #94a3b8;
`;
export const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.4fr 1.2fr;
  gap: 20px;
  align-items: stretch;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;