import React from "react";
import { Header, Title, SlideButton, NotificationDot } from "./HeaderBar.Styles";
import { MdMenuOpen } from "react-icons/md";
const HeaderBar = ({ onOpen, hasNotification = true }) => {
  return (
    <Header>
      <Title>Dashboard Overview</Title>

      <SlideButton onClick={onOpen}>
        <MdMenuOpen size={20} />
        {hasNotification && <NotificationDot />}
      </SlideButton>
    </Header>
  );
};

export default HeaderBar;