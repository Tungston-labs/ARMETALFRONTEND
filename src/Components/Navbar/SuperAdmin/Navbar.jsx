import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import API from "../../../services/api";
import { useLogout } from "../../../services/logout";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../../Redux/authSlice";
import Swal from "sweetalert2";

function Navbar({ bgColor = "transparent" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const logout = useLogout();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openModal = () => {
    setMenuOpen(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setOldPassword("");
    setNewPassword("");
    setMessage({ text: "", type: "" });
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      await logout();
      dispatch(logoutAction());
      setMenuOpen(false);
    }
  };

  const handlePasswordChange = async () => {
    // Client-side validation
    if (!oldPassword.trim() || !newPassword.trim()) {
      setMessage({ text: "Please fill in both fields.", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await API.post("/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMessage({ text: "Password changed successfully.", type: "success" });
      setTimeout(closeModal, 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.detail || "Password change failed.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar bgColor={bgColor}>
        <DropdownWrapper ref={dropdownRef}>
          <Trigger onClick={() => setMenuOpen((p) => !p)}>
            <Avatar>HR</Avatar>
            <Name>HR Manager</Name>
            <Chevron open={menuOpen} />
          </Trigger>

          {menuOpen && (
            <DropdownMenu>
              <MenuItem onClick={openModal}>
                <MenuIcon>🔑</MenuIcon> Change password
              </MenuItem>
              <Divider />
              <MenuItem danger onClick={handleLogout}>
                <MenuIcon>→</MenuIcon> Logout
              </MenuItem>
            </DropdownMenu>
          )}
        </DropdownWrapper>
      </NavBar>

      {showModal && (
        <Overlay>
          <ModalBox>
            <CloseBtn onClick={closeModal}>✕</CloseBtn>
            <ModalTitle>Change password</ModalTitle>

            <FieldLabel>Current password</FieldLabel>
            <InputWrap>
              <PasswordInput
                type={showOld ? "text" : "password"}
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <EyeBtn type="button" onClick={() => setShowOld((p) => !p)}>
                {showOld ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </EyeBtn>
            </InputWrap>

            <FieldLabel>New password</FieldLabel>
            <InputWrap>
              <PasswordInput
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <EyeBtn type="button" onClick={() => setShowNew((p) => !p)}>
                {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </EyeBtn>
            </InputWrap>

            <SubmitBtn onClick={handlePasswordChange} disabled={loading}>
              {loading ? (
                <><ClipLoader size={14} color="#fff" /> Changing...</>
              ) : (
                "Change password"
              )}
            </SubmitBtn>

            {message.text && (
              <Message success={message.type === "success"}>
                {message.text}
              </Message>
            )}
          </ModalBox>
        </Overlay>
      )}
    </>
  );
}

export default Navbar;

// ── Styled Components ──────────────────────────────────────

const NavBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1.5rem;
  height: 60px;
  position: relative;   
  z-index: 1000;
`;
const DropdownWrapper = styled.div`
  position: relative;
`;

const Trigger = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  border: 0.5px solid transparent;
  transition: background 0.15s, border-color 0.15s;
  user-select: none;
  &:hover {
    background: #f5f5f5;
    border-color: #e0e0e0;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e8f0fd;
  color: #2a5bd7;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #111;
`;

const Chevron = styled(IoIosArrowDown)`
  font-size: 14px;
  color: #666;
  transition: transform 0.2s;
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: #fff;
  border: 0.5px solid #ddd;
  border-radius: 10px;
  min-width: 175px;
  z-index: 200;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  animation: fadeDown 0.15s ease;

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 13px;
  cursor: pointer;
  color: ${({ danger }) => (danger ? "#d33" : "#111")};
  transition: background 0.1s;
  &:hover { background: #f5f5f5; }
`;

const MenuIcon = styled.span`
  font-size: 14px;
  width: 16px;
  text-align: center;
`;

const Divider = styled.div`
  height: 0.5px;
  background: #eee;
  margin: 4px 0;
`;

// ── Modal ──────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.75rem;
  width: 360px;
  position: relative;
  animation: fadeDown 0.18s ease;

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  font-size: 15px;
  color: #888;
  cursor: pointer;
  line-height: 1;
  &:hover { color: #111; }
`;

const ModalTitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin-bottom: 1.25rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
`;

const InputWrap = styled.div`
  position: relative;
  margin-bottom: 14px;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 9px 38px 9px 12px;
  font-size: 14px;
  border: 0.5px solid #ddd;
  border-radius: 8px;
  outline: none;
  color: #111;
  transition: border-color 0.15s;
  &:focus { border-color: #aaa; }
  &::placeholder { color: #bbb; }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 0;
  display: flex;
  align-items: center;
  &:hover { color: #111; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 4px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.15s;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Message = styled.p`
  font-size: 13px;
  font-weight: 500;
  margin-top: 10px;
  color: ${({ success }) => (success ? "#2e7d32" : "#c62828")};
`;