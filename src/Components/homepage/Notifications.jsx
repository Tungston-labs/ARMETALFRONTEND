import React from "react";
import {
  NotificationWrapper,
  NotificationTitle,
  NotificationItem,
  NotificationText,
  NotificationTime,
  NoNotification
} from "./Notifications.styles";

const Notifications = ({ items }) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <NotificationWrapper>
      <NotificationTitle>Notifications</NotificationTitle>

      {safeItems.length === 0 ? (
        <NoNotification>No notifications available</NoNotification>
      ) : (
        safeItems.map((note, index) => (
          <NotificationItem key={index} type="info">
            <NotificationText>{note.text}</NotificationText>
            <NotificationTime>{note.time}</NotificationTime>
          </NotificationItem>
        ))
      )}
    </NotificationWrapper>
  );
};

export default Notifications;
