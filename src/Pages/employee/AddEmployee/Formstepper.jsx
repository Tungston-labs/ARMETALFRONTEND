import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  StepperWrapper,
  AvatarShell,
  ProfileImageWrapper,
  ProfileImage,
  ProfileHoverOverlay,
  ProfilePlaceholder,
  CameraBadge,
  RemoveBadge,
  HiddenProfileInput,
  StepperContent,
  StepItem,
  StepIcon,
  StepTitle,
  StepLine,
  ActiveUnderline,
} from "./EmployeeForm.styles";

import {
  PiUser,
  PiUserCirclePlusThin,
  PiCameraThin,
} from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";

const MAX_SIZE = 5 * 1024 * 1024;

const FormStepper = ({
  steps = ["Basic Details", "Bank Details", "Documents"],
  activeStep = 0,
  profileImageSrc = null,
  onProfileImageChange,
  readOnly = false,
  routes = [
    "/basic-details",
    "/bank-payment",
    "/documents",
  ],
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [localImage, setLocalImage] = useState(profileImageSrc);
  const [imageError, setImageError] = useState("");

  /*
   * Keep the displayed image in sync if the prop changes after mount
   * (e.g. navigating to a later step where the image is passed in
   * from Redux instead of picked locally).
   */
  useEffect(() => {
    setLocalImage(profileImageSrc);
  }, [profileImageSrc]);

  /*
   * Find active step from current URL
   */
  const currentStep = routes.findIndex((route) => {
    return location.pathname === route;
  });

  /*
   * Use URL step if found.
   * Otherwise fallback to activeStep prop.
   */
  const selectedStep =
    currentStep !== -1 ? currentStep : activeStep;

  const handleStepClick = (index) => {
    const route = routes[index];

    if (route) {
      navigate(route);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setImageError("Image size must be less than 5 MB.");
      return;
    }

    setImageError("");

    const previewUrl = URL.createObjectURL(file);

    setLocalImage(previewUrl);

    if (onProfileImageChange) {
      onProfileImageChange(file, previewUrl);
    }
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLocalImage(null);
    setImageError("");

    if (onProfileImageChange) {
      onProfileImageChange(null, null);
    }
  };

  return (
    <StepperWrapper>
      {/* Profile Image */}
      <AvatarShell>
        <ProfileImageWrapper>
          {localImage ? (
            <ProfileImage
              src={localImage}
              alt="Employee"
            />
          ) : (
            <ProfilePlaceholder>
              <PiUserCirclePlusThin size={40} />
            </ProfilePlaceholder>
          )}

          {!readOnly && (
            <ProfileHoverOverlay
              onClick={() =>
                document
                  .getElementById("stepper-profile-upload")
                  ?.click()
              }
            >
              <PiCameraThin size={16} />
              <span>
                {localImage ? "Change" : "Upload"}
              </span>
            </ProfileHoverOverlay>
          )}
        </ProfileImageWrapper>

        {!readOnly && (
          <CameraBadge
            onClick={() =>
              document
                .getElementById("stepper-profile-upload")
                ?.click()
            }
          >
            <PiCameraThin size={14} />
          </CameraBadge>
        )}

        {!readOnly && localImage && (
          <RemoveBadge
            type="button"
            onClick={removeImage}
            title="Remove photo"
          >
            <AiOutlineClose size={11} />
          </RemoveBadge>
        )}

        {!readOnly && (
          <HiddenProfileInput
            id="stepper-profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        )}
      </AvatarShell>

      {/* Stepper */}
      <StepperContent>
        {steps.map((label, index) => {
          const isActive = index === selectedStep;

          return (
            <React.Fragment key={label}>
              {/* Line */}
              {index > 0 && <StepLine />}

              {/* Step */}
              <StepItem
                $active={isActive}
                $clickable
                onClick={() => handleStepClick(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleStepClick(index);
                  }
                }}
              >
                <StepIcon $active={isActive}>
                  <PiUser size={23} />
                </StepIcon>

                <StepTitle $active={isActive}>
                  {label}
                </StepTitle>

                {isActive && <ActiveUnderline />}
              </StepItem>
            </React.Fragment>
          );
        })}
      </StepperContent>
    </StepperWrapper>
  );
};

export default FormStepper;