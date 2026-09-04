import React, { useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

import {
    Overlay,
    Modal,
    Title,
    FormGroup,
    Label,
    Input,
    ButtonContainer,
    CancelButton,
    SaveButton,
} from "./ChangePasswordModal.styles";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { InputWrapper } from "./ChangePasswordModal.styles";
import { EyeIcon } from "./ChangePasswordModal.styles";
const ChangePasswordModal = ({ onClose }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleSubmit = async () => {
        if (!oldPassword || !newPassword) {
            Swal.fire({
                icon: "warning",
                text: "Both fields are required",
            });
            return;
        }

        if (newPassword.length < 6) {
            Swal.fire({
                icon: "warning",
                text: "Password must be at least 6 characters",
            });
            return;
        }

        try {
            setLoading(true);

            await API.post("/change-password/", {
                old_password: oldPassword,
                new_password: newPassword,
            });

            Swal.fire({
                icon: "success",
                title: "Password Updated",
                text: "Your password has been changed successfully",
            });

            onClose();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text:
                    err.response?.data?.error ||
                    err.response?.data?.detail ||
                    "Failed to change password",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <Title>Change Password</Title>

                <FormGroup>
                    <Label>Old Password</Label>

                    <InputWrapper>
                        <Input
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter old password"
                        />

                        <EyeIcon
                            onClick={() =>
                                setShowOldPassword((prev) => !prev)
                            }
                        >
                            {showOldPassword ? <FiEyeOff /> : <FiEye />}
                        </EyeIcon>
                    </InputWrapper>
                </FormGroup>

                <FormGroup>
                    <Label>New Password</Label>

                    <InputWrapper>
                        <Input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />

                        <EyeIcon
                            onClick={() =>
                                setShowNewPassword((prev) => !prev)
                            }
                        >
                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                        </EyeIcon>
                    </InputWrapper>
                </FormGroup>

                <ButtonContainer>
                    <CancelButton onClick={onClose}>
                        Cancel
                    </CancelButton>

                    <SaveButton
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Password"}
                    </SaveButton>
                </ButtonContainer>
            </Modal>
        </Overlay>
    );
};

export default ChangePasswordModal;