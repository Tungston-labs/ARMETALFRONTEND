import React from "react";

import {
  SkeletonCardWrapper,
  SkeletonIcon,
  SkeletonTitle,
  SkeletonCount,
} from "./SkeletonStatsCard.styles";

const SkeletonStatsCard = () => {
  return (
    <SkeletonCardWrapper>
      <SkeletonIcon />

      <div>
        <SkeletonTitle />
        <SkeletonCount />
      </div>
    </SkeletonCardWrapper>
  );
};

export default SkeletonStatsCard;