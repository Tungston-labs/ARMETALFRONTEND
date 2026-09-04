import React from "react";
import {
  HeaderContainer,
  LeftSection,
  RightSection,
  PageTitle,
  Breadcrumb,
  BreadcrumbItem,
  ActionButton,
  TitleRow,
  BackButton,
  HomeIcon,
  Separator,
} from "./ReusableHeader.styles";

import { IoArrowBack } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ReusableHeader = ({
  title,
  breadcrumbs = [],
  buttonText,
  onButtonClick,
  children,
  showBack = false,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <TitleRow>
          {showBack && (
            <BackButton onClick={handleBack}>
              <IoArrowBack />
            </BackButton>
          )}

          <PageTitle>{title}</PageTitle>
        </TitleRow>

        <Breadcrumb>
          {/* Home */}
          <BreadcrumbItem>
            <HomeIcon>
              <IoHomeOutline />
            </HomeIcon>
            <span>Dashboard</span>
          </BreadcrumbItem>

          {/* Breadcrumb items */}
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <Separator>›</Separator>

              <BreadcrumbItem
                $active={index === breadcrumbs.length - 1}
              >
                {item}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </Breadcrumb>
      </LeftSection>

      <RightSection>
        {children}

        {buttonText && (
          <ActionButton onClick={onButtonClick}>
            {buttonText}
          </ActionButton>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default ReusableHeader;