import React, { useEffect, useRef, useState } from "react";

import {
  FilterWrapper,
  LeftSection,
  RightSection,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  Select,
  DateInput,
  MoreOptionsWrapper,
  MoreOptionsButton,
  MoreOptionsMenu,
  MenuItem,
  MenuHeader,
  MenuStatusItem,
} from "./ReusableFilter.styles";

import {
  FiSearch,
  FiMinus,
  FiChevronDown,
} from "react-icons/fi";

const ReusableFilter = ({
  // ================= SEARCH =================
  search = "",
  onSearch,
  searchPlaceholder = "Search Employee ID",
  showSearch = true,

  // ================= DEPARTMENT =================
  department = "",
  departments = [],
  onDepartment,
  showDepartment = false,

  // ================= STATUS =================
  status = "",
  statuses = [],
  onStatus,
  showStatus = false,

  // ================= DATE =================
  date = "",
  onDate,
  showDate = false,

  // IMPORTANT:
  // "month" -> YYYY-MM
  // "date"  -> YYYY-MM-DD
  dateType = "month",

  // ================= MORE OPTIONS =================
  showMoreOptions = false,
  moreOptions = [],
  selectedMoreOptions = [],
  onMoreOptionsChange,

  // ================= BULK ACTION =================
  selectedCount = 0,
  bulkStatusOptions = [],
  onBulkStatusChange,

  // ================= RIGHT ACTION =================
  rightAction = null,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const wrapperRef = useRef(null);

  // =========================================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
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

  // =========================================================
  // MORE OPTION CHECKBOX
  // =========================================================

  const toggleOption = (value) => {
    if (!onMoreOptionsChange) return;

    const next = selectedMoreOptions.includes(value)
      ? selectedMoreOptions.filter(
          (item) => item !== value
        )
      : [...selectedMoreOptions, value];

    onMoreOptionsChange(next);
  };

  // =========================================================
  // BULK MODE
  // =========================================================

  const isBulkMode = selectedCount > 0;

  // =========================================================
  // BULK STATUS
  // =========================================================

  const handleBulkPick = (value) => {
    onBulkStatusChange?.(value);
    setMenuOpen(false);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <FilterWrapper>

      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <LeftSection>

        {/* ================= SEARCH ================= */}

        {showSearch && (
          <SearchWrapper>
            <SearchInput
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) =>
                onSearch?.(event.target.value)
              }
            />

            <SearchIcon>
              <FiSearch />
            </SearchIcon>
          </SearchWrapper>
        )}

        {/* ================= DEPARTMENT ================= */}

        {showDepartment && (
          <Select
            value={department}
            onChange={(event) =>
              onDepartment?.(event.target.value)
            }
          >
            <option value="">
              All Departments
            </option>

            {departments.map((item, index) => {
              const isObject =
                typeof item === "object" &&
                item !== null;

              const label = isObject
                ? item.label
                : item;

              const value = isObject
                ? item.value
                : item;

              return (
                <option
                  key={
                    isObject
                      ? `department-${item.value}`
                      : `department-${item}-${index}`
                  }
                  value={value}
                >
                  {label}
                </option>
              );
            })}
          </Select>
        )}

        {/* ================= STATUS ================= */}

        {showStatus && (
          <Select
            value={status}
            onChange={(event) =>
              onStatus?.(event.target.value)
            }
          >
            <option value="">
              All Status
            </option>

            {statuses.map((item, index) => {
              const isObject =
                typeof item === "object" &&
                item !== null;

              const label = isObject
                ? item.label
                : item;

              const value = isObject
                ? item.value
                : item;

              return (
                <option
                  key={
                    isObject
                      ? `status-${item.value}`
                      : `status-${item}-${index}`
                  }
                  value={value}
                >
                  {label}
                </option>
              );
            })}
          </Select>
        )}

      </LeftSection>

      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <RightSection>

        {/* ================= DATE ================= */}

        {showDate && (
          <DateInput
            type={dateType}
            value={date}
            onChange={(event) =>
              onDate?.(event.target.value)
            }
          />
        )}

        {/* ================= CUSTOM ACTION ================= */}

        {rightAction}

        {/* ================= MORE OPTIONS ================= */}

        {showMoreOptions && (
          <MoreOptionsWrapper ref={wrapperRef}>

            <MoreOptionsButton
              type="button"
              onClick={() =>
                setMenuOpen(
                  (previous) => !previous
                )
              }
              $active={isBulkMode}
            >
              <FiMinus />
              <FiChevronDown />
            </MoreOptionsButton>

            {menuOpen && (
              <MoreOptionsMenu>

                {/* ================= BULK MODE ================= */}

                {isBulkMode ? (
                  <>
                    <MenuHeader>
                      {selectedCount} selected — set status
                    </MenuHeader>

                    {bulkStatusOptions.map((option) => (
                      <MenuStatusItem
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handleBulkPick(option.value)
                        }
                      >
                        {option.label}
                      </MenuStatusItem>
                    ))}
                  </>
                ) : (

                  /* ================= NORMAL OPTIONS ================= */

                  moreOptions.map((option) => (
                    <MenuItem key={option.value}>
                      <input
                        type="checkbox"
                        checked={selectedMoreOptions.includes(
                          option.value
                        )}
                        onChange={() =>
                          toggleOption(option.value)
                        }
                      />

                      <span>
                        {option.label}
                      </span>
                    </MenuItem>
                  ))

                )}

              </MoreOptionsMenu>
            )}

          </MoreOptionsWrapper>
        )}

      </RightSection>

    </FilterWrapper>
  );
};

export default ReusableFilter;