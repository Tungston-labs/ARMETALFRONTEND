import React, { useEffect, useState, useRef } from "react";

import { useSelector } from "react-redux";

import { FaRegBell } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { PiSwap } from "react-icons/pi";
import { LuSunMedium } from "react-icons/lu";
import { FiSettings, FiLock, FiLogOut } from "react-icons/fi";

import NotificationModal from "./NotificationModal/NotificationModal";
import ChangePasswordModal from "../../ChangePasswordModal/ChangePasswordModal";

import {
  Container,
  DateBox,
  DateSection,
  TimeSection,
  RightSection,
  NotificationButton,
  NotificationDot,
  Language,
  Profile,
  Avatar,
  UserInfo,
  Name,
  Role,
  SwitchButton,
  ProfileDropdown,
  DropdownItem,
} from "./TopBar.styles";


// =====================================================
// ROLE LABEL
// =====================================================

const getRoleLabel = (user) => {
  if (!user) return "";

  if (user.is_superadmin) return "Super Admin";

  if (user.is_hr_admin) return "HR Admin";

  if (user.is_hr) return "HR";

  if (user.is_employee) return "Employee";

  return "";
};


const TopBar = () => {

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [showNotifications, setShowNotifications] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);


  // =====================================================
  // GET LOGGED-IN USER FROM REDUX
  // =====================================================

  const user = useSelector((state) => state.auth.user);


  // =====================================================
  // COMPANY NAME
  // =====================================================

  const companyName = user?.company?.name || "";


  // =====================================================
  // DISPLAY NAME
  //
  // HR / Employee -> Employee name
  // Company Admin -> Company name
  // =====================================================

  const displayName =
    user?.name ||
    companyName ||
    user?.username ||
    "";


  // =====================================================
  // ROLE
  // =====================================================

  const roleLabel = getRoleLabel(user);


  // =====================================================
  // AVATAR INITIAL
  // =====================================================

  const displayInitial = displayName
    ? displayName.charAt(0).toUpperCase()
    : "";


  const profileRef = useRef(null);


  // =====================================================
  // CLOCK
  // =====================================================

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentDateTime(new Date());

    }, 1000);

    return () => clearInterval(timer);

  }, []);


  // =====================================================
  // CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  // =====================================================

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {

        setShowProfileMenu(false);

      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = () => {

    setShowProfileMenu(false);

    setShowChangePassword(true);

  };


  // =====================================================
  // CONFIGURE
  // =====================================================

  const handleConfigure = () => {

    setShowProfileMenu(false);

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    setShowProfileMenu(false);

    localStorage.clear();

    sessionStorage.clear();

    window.location.href = "/login";

  };


  // =====================================================
  // DATE
  // =====================================================

  const formattedDate =
    currentDateTime.toLocaleDateString("en-IN", {

      weekday: "long",

      day: "2-digit",

      month: "long",

      year: "numeric",

    });


  // =====================================================
  // TIME
  // =====================================================

  const formattedTime =
    currentDateTime.toLocaleTimeString("en-IN", {

      hour: "2-digit",

      minute: "2-digit",

      hour12: true,

    });


  return (

    <>

      <Container>

        {/* =================================================
            DATE
        ================================================= */}

        <DateBox>

          <DateSection>

            <CiCalendarDate size={20} />

            <span>
              {formattedDate}
            </span>

          </DateSection>


          <TimeSection>

            <LuSunMedium size={16} />

            <span>
              {formattedTime}
            </span>

          </TimeSection>

        </DateBox>


        <RightSection>


          {/* =================================================
              NOTIFICATION
              Hidden for Super Admins.
          ================================================= */}

          {!user?.is_superadmin && (
            <NotificationButton
              onClick={() => setShowNotifications(true)}
            >

              <FaRegBell size={25} />

              <NotificationDot />

            </NotificationButton>
          )}


          {/* =================================================
              LANGUAGE
          ================================================= */}

          <Language>

            🇬🇧 English

            <FaChevronDown size={14} />

          </Language>


          {/* =================================================
              PROFILE
          ================================================= */}

          <Profile

            ref={profileRef}

            onClick={() =>
              setShowProfileMenu((prev) => !prev)
            }

          >

            {/* Avatar */}

            <Avatar>

              {displayInitial}

            </Avatar>


            {/* User Information */}

            <UserInfo>

              <Name>

                {displayName}

              </Name>

              <Role>

                {roleLabel}

              </Role>

            </UserInfo>


            <FaChevronDown size={12} />


            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {showProfileMenu && (

              <ProfileDropdown>


                {/* =================================================
                    CHANGE PASSWORD
                ================================================= */}

                <DropdownItem

                  onClick={(e) => {

                    e.stopPropagation();

                    handleChangePassword();

                  }}

                >

                  <FiLock size={17} />

                  <span>
                    Change Password
                  </span>

                </DropdownItem>


                {/* =================================================
                    LOGOUT
                ================================================= */}

                <DropdownItem

                  logout

                  onClick={(e) => {

                    e.stopPropagation();

                    handleLogout();

                  }}

                >

                  <FiLogOut size={17} />

                  <span>
                    Logout
                  </span>

                </DropdownItem>


              </ProfileDropdown>

            )}

          </Profile>


          {/* =================================================
              SWITCH FINANCE
          ================================================= */}

          {/*
          <SwitchButton>

            <PiSwap size={15} />

            SWITCH FINANCE

          </SwitchButton>
          */}


        </RightSection>

      </Container>


      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      <NotificationModal

        isOpen={showNotifications}

        onClose={() =>
          setShowNotifications(false)
        }

      />


      {/* =====================================================
          CHANGE PASSWORD
      ===================================================== */}

      {showChangePassword && (

        <ChangePasswordModal

          onClose={() =>
            setShowChangePassword(false)
          }

        />

      )}

    </>

  );

};


export default TopBar;