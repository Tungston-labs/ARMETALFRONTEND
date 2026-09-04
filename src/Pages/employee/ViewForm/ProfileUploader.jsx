import React, { useEffect, useState } from "react";
import {
  AvatarShell,
  ProfileImageWrapper,
  ProfileImage,
  ProfileHoverOverlay,
  ProfilePlaceholder,
  CameraBadge,
  RemoveBadge,
  HiddenProfileInput,
  ImageError,
} from "./ProfileUploader.styles";

import {
  PiUserCirclePlusThin,
  PiCameraThin,
} from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";

const MAX_SIZE = 5 * 1024 * 1024;

const ProfileUploader = ({
  profileImageSrc = null,
  editable = false,
  onProfileImageChange,
}) => {
  const [localImage, setLocalImage] = useState(profileImageSrc);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    setLocalImage(profileImageSrc || null);
  }, [profileImageSrc]);

  const handleUploadClick = () => {
    if (!editable) return;

    document
      .getElementById("employee-profile-upload")
      ?.click();
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

    // Allow selecting the same file again
    e.target.value = "";
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editable) return;

    setLocalImage(null);
    setImageError("");

    if (onProfileImageChange) {
      onProfileImageChange(null, null);
    }
  };

  return (
    <AvatarShell>
      <ProfileImageWrapper
        onClick={editable ? handleUploadClick : undefined}
      >
        {localImage ? (
          <ProfileImage
            src={localImage}
            alt="Employee Profile"
          />
        ) : (
          <ProfilePlaceholder>
            <PiUserCirclePlusThin size={45} />
          </ProfilePlaceholder>
        )}

        {editable && (
          <ProfileHoverOverlay>
            <PiCameraThin size={18} />

            <span>
              {localImage ? "Change" : "Upload"}
            </span>
          </ProfileHoverOverlay>
        )}
      </ProfileImageWrapper>

      {editable && (
        <CameraBadge
          onClick={handleUploadClick}
          title="Upload profile photo"
        >
          <PiCameraThin size={15} />
        </CameraBadge>
      )}

      {editable && localImage && (
        <RemoveBadge
          type="button"
          onClick={removeImage}
          title="Remove photo"
        >
          <AiOutlineClose size={11} />
        </RemoveBadge>
      )}

      <HiddenProfileInput
        id="employee-profile-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {imageError && (
        <ImageError>
          {imageError}
        </ImageError>
      )}
    </AvatarShell>
  );
};

export default ProfileUploader;