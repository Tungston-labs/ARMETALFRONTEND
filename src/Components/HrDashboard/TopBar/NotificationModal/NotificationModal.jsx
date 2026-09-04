import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getSimpleNotifications,
} from "../../../../Redux/dashboardSlice";

import {
  ModalOverlay,
  NotificationModalContainer,
  Header,
  HeaderLeft,
  BackButton,
  TitleWrapper,
  Title,
  Subtitle,
  HeaderActions,
  ActionButton,
  SearchBox,
  SearchInput,
  NotificationList,
  SectionTitle,
  NotificationItem,
  NotificationIcon,
  Content,
  NotificationTitle,
  Description,
  Time,
  NoResults,
} from "./NotificationModal.styles";

import {
  FiChevronLeft,
  FiSearch,
  FiX,
} from "react-icons/fi";

const NotificationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  const {
    simpleNotifications,
    simpleNotificationsLoading,
    simpleNotificationsError,
  } = useSelector((state) => state.dashboard);

  // Fetch notifications when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getSimpleNotifications());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  // Make sure API response is always treated as an array
  const notifications = Array.isArray(simpleNotifications)
    ? simpleNotifications
    : [];

  // Search notifications
  const filteredNotifications = notifications.filter((notification) => {
    const searchText = search.toLowerCase();

    return (
      String(notification.title || "")
        .toLowerCase()
        .includes(searchText) ||
      String(notification.description || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const todayNotifications = filteredNotifications.filter(
    (item) => item.section === "Today"
  );

  const yesterdayNotifications = filteredNotifications.filter(
    (item) => item.section === "Yesterday"
  );

  const renderNotification = (notification) => (
    <NotificationItem key={notification.id}>
      <NotificationIcon>
        <span>⬢</span>
      </NotificationIcon>

      <Content>
        <NotificationTitle>
          {notification.title}
        </NotificationTitle>

        <Description>
          {notification.description}
        </Description>
      </Content>

      <Time>
        {notification.time}
      </Time>
    </NotificationItem>
  );

  const todayCount = todayNotifications.length;

  return (
    <ModalOverlay onClick={onClose}>
      <NotificationModalContainer
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <HeaderLeft>
            <BackButton onClick={onClose}>
              <FiChevronLeft size={20} />
            </BackButton>

            <TitleWrapper>
              <Title>Notifications</Title>

              <Subtitle>
                You have{" "}
                <strong>
                  {todayCount} Notification
                  {todayCount !== 1 ? "s" : ""}
                </strong>{" "}
                today.
              </Subtitle>
            </TitleWrapper>
          </HeaderLeft>

          <HeaderActions>
            <ActionButton
              onClick={() => {
                setShowSearch((prev) => !prev);
                setSearch("");
              }}
            >
              {showSearch ? (
                <FiX size={15} />
              ) : (
                <FiSearch size={15} />
              )}
            </ActionButton>
          </HeaderActions>
        </Header>

        {showSearch && (
          <SearchBox>
            <FiSearch size={16} />

            <SearchInput
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />

            {search && (
              <button onClick={() => setSearch("")}>
                <FiX size={14} />
              </button>
            )}
          </SearchBox>
        )}

        <NotificationList>
          {simpleNotificationsLoading ? (
            <NoResults>
              Loading notifications...
            </NoResults>
          ) : simpleNotificationsError ? (
            <NoResults>
              Failed to load notifications.
            </NoResults>
          ) : (
            <>
              {todayNotifications.length > 0 && (
                <>
                  <SectionTitle>Today</SectionTitle>

                  {todayNotifications.map(renderNotification)}
                </>
              )}

              {yesterdayNotifications.length > 0 && (
                <>
                  <SectionTitle>Yesterday</SectionTitle>

                  {yesterdayNotifications.map(renderNotification)}
                </>
              )}

              {filteredNotifications.length === 0 && (
                <NoResults>
                  No notifications found
                </NoResults>
              )}
            </>
          )}
        </NotificationList>
      </NotificationModalContainer>
    </ModalOverlay>
  );
};

export default NotificationModal;