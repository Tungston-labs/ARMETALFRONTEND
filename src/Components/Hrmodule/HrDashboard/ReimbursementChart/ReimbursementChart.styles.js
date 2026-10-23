import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`;

export const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CenterCircle = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 10px 24px -6px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const CenterDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin-bottom: 4px;
`;

export const CenterLabel = styled.span`
  font-size: 12px;
  color: ${({ muted }) => (muted ? "#94a3b8" : "#64748b")};
  font-weight: ${({ muted }) => (muted ? 400 : 500)};
`;

export const CenterValue = styled.span`
  font-size: ${({ small }) => (small ? "22px" : "26px")};
  font-weight: 700;
  color: #0f172a;
  line-height: 1.15;
`;

export const DetailRow = styled.div`
  margin-top: 8px;
  margin-bottom: 20px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 150ms ease;
`;

export const DetailName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ color }) => color};
`;

export const DetailSub = styled.div`
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
`;

export const DetailAmount = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
`;

export const Legend = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const LegendItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 8px 10px;
  background: ${({ active }) => (active ? "#f8fafc" : "transparent")};
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 150ms ease;
`;

export const ColorDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
`;

export const LegendLabel = styled.span`
  font-size: 13px;
  color: #475569;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LegendCount = styled.span`
  margin-left: auto;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
`;