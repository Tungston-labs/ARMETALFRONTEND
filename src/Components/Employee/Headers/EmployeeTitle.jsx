import React, { useState, useRef } from "react";
import {
  Container,
  TopSection,
  LeftBlock,
  IconWrapper,
  TitleBlock,
  Title,
  Subtitle,
  RightBlock,
  Button,
  SearchSection,
  SearchWrapper,
  Input,
  Dropdown,
  TabsRow,
  TabButton,
  Divider,
  BackArrow,
  TabsRowContainer,
  ScrollLeft,
  ScrollRight,
  ReportButton,
  ReportMenu,
  ReportMenuItem,
  ReportWrapper,
} from "./EmployeeTitle.Styles";
import { LuCirclePlus } from "react-icons/lu";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiBarChart2, FiSearch } from "react-icons/fi";

const EmployeeTitle = ({
  showIcon = true,
  showTitle = true,
  showSubtitle = true,
  showAddButton = true,
  showSearch = true,
  showDropdown = true,
  showTabs = true,
  showBackArrow = true,
  buttonIcon,
  rightElement,
  iconSrc,
  title = "Employee",
  subtitle = "Manage your employees",
  buttonText = "Add Employee",
  searchPlaceholder = "Search Here...",
  searchValue = "",
  showReportButton = true,
  reportButtonText = "Reports",
  onReportClick,

  tabs = [
    { path: "/employee", label: "Total Employee" },
    { path: "/employee-leave-request", label: "Employee Leave Request" },
    { path: "/employee-attendance", label: "Employee Attendance" },
    {
      path: "/employee-Contract-Visa-Expiry",
      label: "Employee Contract & Visa Expiry",
    },
    { path: "/employee-attendance-report", label: "Employee Attendance Report" },
    //  { path: "/request", label: "Employee Attendance Request" },
  ],


  dropdownOptions = [],
  dropdownLoading = false,
  selectedDropdownValue = "",
  dropdownPlaceholder = "All",
  onDropdownChange,
  onAddClick,
  onSearchChange,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(tabs[0]?.path || "");
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const handleTabClick = (path) => {
    setActiveTab(path);
    onTabChange && onTabChange(path);
    navigate(path);
  };

  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scrollLeft = () => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: -150, behavior: "smooth" });
    setTimeout(checkScroll, 120);
  };

  const scrollRight = () => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: 150, behavior: "smooth" });
    setTimeout(checkScroll, 120);
  };

  const renderOption = (option, index) => {
    if (typeof option === "string" || typeof option === "number") {
      return (
        <option key={index} value={String(option)}>
          {String(option)}
        </option>
      );
    }
    const value = option.id ?? option.key ?? option.value ?? option._id ?? "";
    const label =
      option.name ?? option.label ?? option.text ?? option.title ?? String(value);
    const key = value || index;

    return (
      <option key={key} value={String(value)}>
        {label}
      </option>
    );
  };

  return (
    <Container>
      <TopSection>
        <LeftBlock>
          {showBackArrow && (
            <BackArrow onClick={() => navigate(-1)}>
              <IoArrowBackOutline size={22} />
            </BackArrow>
          )}

          {showIcon && iconSrc && (
            <IconWrapper>
              <img src={iconSrc} alt="icon" />
            </IconWrapper>
          )}

          <TitleBlock>
            {showTitle && <Title>{title}</Title>}
            {showSubtitle && <Subtitle>{subtitle}</Subtitle>}
          </TitleBlock>
        </LeftBlock>

        {(showAddButton || showReportButton) && (
          <RightBlock>
            {showAddButton && (
              <>
                {rightElement ? (
                  rightElement
                ) : (
                  <Button
                    onClick={
                      onAddClick ||
                      (() => navigate("/basic-details"))
                    }
                  >
                    {buttonIcon ? (
                      <img
                        src={buttonIcon}
                        alt={`${buttonText} icon`}
                        style={{
                          width: "18px",
                          height: "18px",
                          marginRight: "6px",
                        }}
                      />
                    ) : (
                      <LuCirclePlus
                        size={18}
                        style={{ marginRight: "6px" }}
                      />
                    )}

                    {buttonText}
                  </Button>
                )}
              </>
            )}

            {showReportButton && (
              <ReportButton onClick={() => onReportClick?.("excel")}>
                <FiBarChart2 size={18} />
                Export Excel
              </ReportButton>
            )}
          </RightBlock>
        )}
      </TopSection>

      {(showSearch || showDropdown) && (
        <SearchSection>
          {showSearch && (
            <SearchWrapper>
              <FiSearch />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              />
            </SearchWrapper>
          )}

          {showDropdown && (
            <Dropdown
              value={String(selectedDropdownValue ?? "")}
              onChange={(e) =>
                onDropdownChange && onDropdownChange(String(e.target.value))
              }
            >
              <option value="">{dropdownPlaceholder}</option>

              {dropdownLoading ? (
                <option disabled>Loading...</option>
              ) : dropdownOptions && dropdownOptions.length > 0 ? (
                dropdownOptions.map((opt, idx) => renderOption(opt, idx))
              ) : (
                <option disabled>No options available</option>
              )}
            </Dropdown>
          )}
        </SearchSection>
      )}

      {showTabs && (
        <>
          <TabsRowContainer>
            {/* {canScrollLeft && <ScrollLeft onClick={scrollLeft}></ScrollLeft>} */}
            <TabsRow ref={rowRef} onScroll={checkScroll}>
              {tabs.map((tab) => (
                <NavLink key={tab.path} to={tab.path} style={{ textDecoration: "none" }}>
                  <TabButton $active={location.pathname === tab.path}>{tab.label}</TabButton>
                </NavLink>
              ))}
            </TabsRow>
          </TabsRowContainer>

          <Divider />
        </>
      )}
    </Container>
  );
};

export default EmployeeTitle;
