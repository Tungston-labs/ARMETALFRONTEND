// VerificationCircles.jsx
import React from "react";
import styled from "styled-components";
import { FaCheck } from "react-icons/fa";

const CircleContainer = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 4px;
  }

  /* ✅ Bigger gap for 4K+ */
  @media (min-width: 2560px) {
    gap: 12px;
  }
`;

const Circle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
  }

  /* ✅ Scale up for QHD (2K / 2560px wide) */
  @media (min-width: 2560px) {
    width: 2.5rem;
    height: 2.5rem;
  }

  /* ✅ Scale up more for 4K (3840px wide) */
  @media (min-width: 3840px) {
    width: 3rem;
    height: 3rem;
  }

  /* ✅ Scale up for 8K (7680px wide) */
  @media (min-width: 7680px) {
    width: 3.5rem;
    height: 3.5rem;
  }

  svg {
    font-size: 10px;

    @media (max-width: 768px) {
      font-size: 9px;
    }
    @media (max-width: 480px) {
      font-size: 8px;
    }

    /* ✅ Bigger icons on larger displays */
    @media (min-width: 2560px) {
      font-size: 20px;
    }
    @media (min-width: 3840px) {
      font-size: 20px;
    }
    @media (min-width: 7680px) {
      font-size: 20px;
    }
  }
`;

const VerificationCircles = ({
  emp,
  verificationStatus,
  handleCircleClick,
}) => (
  <CircleContainer>
    <Circle
      disabled={verificationStatus[emp.id]?.first}
      onClick={(e) =>
        !verificationStatus[emp.id]?.first && handleCircleClick(e, emp, "first")
      }
    >
      {verificationStatus[emp.id]?.first && (
        <FaCheck style={{ color: "blue" }} />
      )}
    </Circle>
    <Circle
      disabled={verificationStatus[emp.id]?.second}
      onClick={(e) =>
        !verificationStatus[emp.id]?.second &&
        handleCircleClick(e, emp, "second")
      }
    >
      {verificationStatus[emp.id]?.second && (
        <FaCheck style={{ color: "blue" }} />
      )}
    </Circle>
  </CircleContainer>
);

export default VerificationCircles;
