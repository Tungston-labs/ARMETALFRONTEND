import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -450px 0;
  }

  100% {
    background-position: 450px 0;
  }
`;

const skeletonBackground = `
  linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e8e8e8 37%,
    #f0f0f0 63%
  )
`;

const SkeletonBase = styled.div`
  background: ${skeletonBackground};
  background-size: 900px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

export const SkeletonCardWrapper = styled.div`
  width: 100%;
  min-height: 210px;
  padding: 20px;

  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 14px;

  box-sizing: border-box;
  overflow: hidden;
`;

export const SkeletonHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
`;

export const SkeletonCircle = styled(SkeletonBase)`
  width: 42px;
  height: 42px;
  border-radius: 50%;
`;

export const SkeletonTitle = styled(SkeletonBase)`
  width: 140px;
  height: 18px;
  border-radius: 5px;
`;

export const SkeletonSmallLine = styled(SkeletonBase)`
  width: 95px;
  height: 12px;
  margin-top: 8px;
  border-radius: 4px;
`;

export const SkeletonBadge = styled(SkeletonBase)`
  width: 65px;
  height: 25px;
  border-radius: 20px;
`;

export const SkeletonLine = styled(SkeletonBase)`
  width: 180px;
  height: 13px;
  margin-top: 24px;
  border-radius: 4px;
`;

export const SkeletonStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 12px;
  margin-top: 28px;
`;

export const SkeletonStatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const SkeletonStatValue = styled(SkeletonBase)`
  width: 45px;
  height: 22px;
  border-radius: 4px;
`;

export const SkeletonStatLabel = styled(SkeletonBase)`
  width: 65px;
  height: 11px;
  border-radius: 4px;
`;

