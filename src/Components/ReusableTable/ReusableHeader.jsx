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
  Subtitle,
  Badge,
} from "./ReusableHeader.styles";

import { IoArrowBack, IoHomeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ReusableHeader = ({
  title,
  subtitle,
  badge,
  badgeVariant = "success",
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

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formattedSubtitle = subtitle
    ? subtitle.replace(
        /Created On:\s*([^\s,]+)/,
        (_, date) => `Created On: ${formatDate(date)}`
      )
    : "";

  return (
    <HeaderContainer>
      <LeftSection>
        <TitleRow>
          {showBack && (
            <BackButton
              type="button"
              onClick={handleBack}
              aria-label="Go back"
            >
              <IoArrowBack />
            </BackButton>
          )}

          <PageTitle>{title}</PageTitle>
        </TitleRow>

        {formattedSubtitle && (
          <Subtitle>
            <span>{formattedSubtitle}</span>

            {badge && (
              <Badge $variant={badgeVariant}>
                {badge}
              </Badge>
            )}
          </Subtitle>
        )}

        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbItem>
              <HomeIcon>
                <IoHomeOutline />
              </HomeIcon>

              <span>Dashboard</span>
            </BreadcrumbItem>

            {breadcrumbs.map((item, index) => (
              <React.Fragment key={`${item}-${index}`}>
                <Separator>›</Separator>

                <BreadcrumbItem
                  $active={
                    index === breadcrumbs.length - 1
                  }
                >
                  {item}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </Breadcrumb>
        )}
      </LeftSection>

      <RightSection>
        {children}

        {buttonText && (
          <ActionButton
            type="button"
            onClick={onButtonClick}
          >
            {buttonText}
          </ActionButton>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default ReusableHeader;