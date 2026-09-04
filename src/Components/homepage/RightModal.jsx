import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Panel,
  CloseIcon,
  Columns,
  BottomActions,
  ActionButton,
  LogoutButton,
  TopActions,
  EditProfileButton,
} from "./RightModal.Styles";
import AttendanceCircle from "./AttendanceCircle";
import SingleHolidayCalendar from "./SingleHolidayCalendar.jsx";
import Notifications from "./Notifications";
import API from "../../services/api";
import Swal from "sweetalert2";
import { useLogout } from "../../services/logout";
import {
  getHolidaySummary,
  getTodayEmployeeStats,
  getSimpleNotifications,
} from "../../Redux/dashboardSlice";
import EditProfileModal from "../../Components/homepage/EditProfileModal.jsx";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal.jsx";
const RightModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const logout = useLogout();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showPasswordModal, setShowPasswordModal] =
    useState(false);
  const { notifications, todayStats, holidaySummary, loading } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    if (open) {
      dispatch(getSimpleNotifications());
      dispatch(getTodayEmployeeStats());
      dispatch(getHolidaySummary());
    }
  }, [open, dispatch]);

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
      onClose();
    }
  };



  return (
    <Panel className={open ? "open" : ""}>
      <CloseIcon onClick={onClose}>×</CloseIcon>
      <TopActions>
        <EditProfileButton
          onClick={() => {
            setIsEditMode(true);
            setSelectedCompany(null);
            setShowCompanyModal(true);
          }}
        >
          Edit Profile
        </EditProfileButton>

        <CloseIcon onClick={onClose}>×</CloseIcon>
      </TopActions>
      <Columns>
        {loading.notifications ? (
          <p>Loading notifications...</p>
        ) : (
          <Notifications items={notifications?.notifications || []} />
        )}
      </Columns>
      <Columns>
        {loading.todayStats ? (
          <p>Loading attendance...</p>
        ) : todayStats ? (
          <AttendanceCircle
            present={todayStats?.present_percentage}
            leave={todayStats?.leave_percentage}
          />
        ) : (
          <p>No stats found</p>
        )}
      </Columns>

      <Columns>
        {loading.holidaySummary ? (
          <p>Loading holidays...</p>
        ) : holidaySummary ? (
          <SingleHolidayCalendar
            holidays={holidaySummary?.all_holidays?.list || []}
          />
        ) : (
          <p>No holidays found</p>
        )}
      </Columns>

      <BottomActions>
        <ActionButton
          onClick={() =>
            setShowPasswordModal(true)
          }
        >
          Change Password
        </ActionButton>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </BottomActions>

      {showCompanyModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "900px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <EditProfileModal
              isEdit={isEditMode}
              selectedCompany={selectedCompany}
              showPrivileges={false}
              onClose={() => setShowCompanyModal(false)}
            />
          </div>
        </div>
      )}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() =>
            setShowPasswordModal(false)
          }
        />
      )}
    </Panel>
  );
};

export default RightModal;
