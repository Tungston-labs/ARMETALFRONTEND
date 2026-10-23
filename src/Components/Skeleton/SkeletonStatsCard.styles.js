import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
`;

const skeletonBackground = `
  linear-gradient(
    90deg,
    #eeeeee 25%,
    #f7f7f7 50%,
    #eeeeee 75%
  )
`;

const SkeletonBase = styled.div`
  background: ${skeletonBackground};
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

export const SkeletonCardWrapper = styled.div`
  width: 100%;
  min-height: 105px;

  padding: 18px;

  display: flex;
  align-items: center;

  gap: 14px;

  box-sizing: border-box;

  background: #ffffff;

  border-radius: 12px;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
`;

export const SkeletonIcon = styled(SkeletonBase)`
  width: 45px;
  height: 45px;

  flex-shrink: 0;

  border-radius: 10px;
`;

export const SkeletonTitle = styled(SkeletonBase)`
  width: 90px;
  height: 11px;

  margin-bottom: 9px;

  border-radius: 4px;
`;

export const SkeletonCount = styled(SkeletonBase)`
  width: 50px;
  height: 22px;

  border-radius: 5px;
`;