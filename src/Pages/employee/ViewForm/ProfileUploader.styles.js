import styled from "styled-components";

/* =====================================================
   STEPPER HEADER (the gradient bar from the screenshot)
===================================================== */

export const StepperHeader = styled.div`
  display: flex;
  align-items: center;
margin-bottom: 30px;
  gap: 24px;

  padding: 0 32px;
  height: 130px;

  border-radius: ${({ $embedded }) => ($embedded ? "12px 12px 0 0" : "14px")};

  /* IMPORTANT: don't clip the avatar as it overhangs the bottom edge */
  overflow: visible;

  /* orange -> purple/blue diagonal gradient */
  background: linear-gradient(
    100deg,
    #f0872f 0%,
    #d97757 28%,
    #b06a8f 55%,
    #6a5fb8 100%
  );

  @media (max-width: 768px) {
    height: 110px;
    padding: 0 20px;
    gap: 16px;
  }
`;

export const StepperTrack = styled.div`
  display: flex;
  align-items: flex-start;

  flex: 1;
`;

/* =====================================================
   STEP ITEM (one node + its trailing connector)
===================================================== */

export const StepItem = styled.div`
  display: flex;
  align-items: center;

  flex: 1;

  &:last-child {
    flex: 0 0 auto;
  }
`;

/* =====================================================
   STEP NODE (circle + label, stacked)
===================================================== */

export const StepNode = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;

  flex-shrink: 0;

  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  outline: none;

  border-radius: 8px;

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7);
  }
`;

export const StepCircle = styled.div`
  width: 36px;
  height: 36px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  transition: background 0.2s ease, border-color 0.2s ease;

  ${({ $active }) =>
    $active
      ? `
        background: #3c5dcc;
        border: 2px solid #3c5dcc;
        color: #ffffff;
      `
      : `
        background: transparent;
        border: 1.5px solid rgba(255, 255, 255, 0.5);
        color: rgba(255, 255, 255, 0.6);
      `}

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;

export const StepLabel = styled.span`
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active }) =>
    $active ? "#ffffff" : "rgba(255, 255, 255, 0.6)"};
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

/* underline that sits under the active step, anchored to the header's bottom edge */
export const StepProgressBar = styled.div`
  position: absolute;
  bottom: -4px;
  left: 0;

  height: 4px;
  width: 100%;

  border-radius: 2px;

  background: #3c5dcc;
`;

/* =====================================================
   CONNECTOR (dashed line between step nodes)
===================================================== */

export const StepConnector = styled.div`
  flex: 1;

  height: 0;

  margin: 0 12px;
  align-self: flex-start;

  /* sit at the vertical center of the circle, not the label */
  margin-top: 17px;

  border-top: 2px dashed
    ${({ $active }) => ($active ? "#ffffff" : "rgba(255, 255, 255, 0.45)")};

  @media (max-width: 768px) {
    margin-top: 14px;
  }
`;

/* =====================================================
   PROFILE UPLOADER
   Sits inline in the header, overhanging the bottom edge
===================================================== */

export const AvatarShell = styled.div`
  position: relative;
  width: 120px;
  height: 120px;

  flex-shrink: 0;
  z-index: 5;

  /* pull the circle down so it "pops" out of the bottom of the bar */
  margin-bottom: -34px;

  @media (max-width: 1200px) {
    width: 105px;
    height: 105px;
    margin-bottom: -28px;
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    margin-bottom: -22px;
  }

  @media (max-width: 480px) {
    width: 78px;
    height: 78px;
    margin-bottom: -18px;
  }
`;

/* =====================================================
   PROFILE IMAGE WRAPPER
===================================================== */

export const ProfileImageWrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  border: 5px solid #ffffff;

  border-radius: 50%;

  background: #eeeeee;

  overflow: hidden;

  box-sizing: border-box;

  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};

  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);

  @media (max-width: 768px) {
    border-width: 4px;
  }
`;

/* =====================================================
   PROFILE IMAGE
===================================================== */

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
`;

/* =====================================================
   PLACEHOLDER
===================================================== */

export const ProfilePlaceholder = styled.div`
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #a3a3a3;

  background: #eeeeee;
`;

/* =====================================================
   HOVER OVERLAY
===================================================== */

export const ProfileHoverOverlay = styled.div`
  position: absolute;

  inset: 0;

  background: rgba(15, 23, 42, 0.55);

  color: #ffffff;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 2px;

  font-size: 10px;

  font-weight: 500;

  opacity: 0;

  transition: opacity 0.2s ease;

  pointer-events: none;

  ${ProfileImageWrapper}:hover & {
    opacity: 1;
  }

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

/* =====================================================
   CAMERA BADGE
===================================================== */

export const CameraBadge = styled.button`
  position: absolute;

  right: -2px;
  bottom: -2px;

  width: 32px;
  height: 32px;

  border-radius: 50%;

  background: #3c5dcc;

  border: 2px solid #ffffff;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #ffffff;

  cursor: pointer;

  padding: 0;

  z-index: 15;

  transition:
    background 0.15s ease,
    transform 0.1s ease;

  &:hover {
    background: #33509c;

    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

/* =====================================================
   REMOVE BADGE
===================================================== */

export const RemoveBadge = styled.button`
  position: absolute;

  top: -2px;
  right: -2px;

  width: 22px;
  height: 22px;

  border-radius: 50%;

  background: #ef3434;

  border: 2px solid #ffffff;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #ffffff;

  cursor: pointer;

  padding: 0;

  z-index: 15;

  transition: background 0.15s ease;

  &:hover {
    background: #d62828;
  }

  @media (max-width: 768px) {
    width: 19px;
    height: 19px;
  }

  @media (max-width: 480px) {
    width: 17px;
    height: 17px;
  }
`;

/* =====================================================
   HIDDEN INPUT
===================================================== */

export const HiddenProfileInput = styled.input`
  display: none;
`;

/* =====================================================
   ERROR
===================================================== */

export const ImageError = styled.span`
  position: absolute;

  top: calc(100% + 8px);

  left: 50%;

  transform: translateX(-50%);

  width: 180px;

  color: #ef3434;

  font-size: 10px;

  line-height: 14px;

  text-align: center;
`;