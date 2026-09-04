import React from "react";

import {
  SkeletonCardWrapper,
  SkeletonHeader,
  SkeletonCircle,
  SkeletonTitle,
  SkeletonBadge,
  SkeletonLine,
  SkeletonSmallLine,
  SkeletonStats,
  SkeletonStatItem,
  SkeletonStatValue,
  SkeletonStatLabel,
} from "./ SkeletonCard.styles";

const SkeletonCard = () => {
  return (
    <SkeletonCardWrapper>
      {/* Header */}
      <SkeletonHeader>
        <div>
          <SkeletonTitle />
          <SkeletonSmallLine />
        </div>

        <SkeletonBadge />
      </SkeletonHeader>

      {/* Department Head */}
      <SkeletonLine />

      {/* Employee Stats */}
      <SkeletonStats>
        <SkeletonStatItem>
          <SkeletonStatValue />
          <SkeletonStatLabel />
        </SkeletonStatItem>

        <SkeletonStatItem>
          <SkeletonStatValue />
          <SkeletonStatLabel />
        </SkeletonStatItem>

        <SkeletonStatItem>
          <SkeletonStatValue />
          <SkeletonStatLabel />
        </SkeletonStatItem>
      </SkeletonStats>
    </SkeletonCardWrapper>
  );
};

export default SkeletonCard;