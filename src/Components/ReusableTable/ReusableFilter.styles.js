import styled from "styled-components";

/* =========================================================
   MAIN FILTER WRAPPER
========================================================= */

export const FilterWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;

  background: #ffffff;
  border-radius: 10px;

  padding: 10px 24px;
  margin-bottom: 15px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;
  flex-wrap: wrap;

  /* Large Desktop */
  @media (min-width: 1440px) {
    padding: 12px 24px;
  }

  /* Tablet */
  @media (max-width: 992px) {
    padding: 12px 18px;

    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  /* Mobile */
  @media (max-width: 576px) {
    padding: 12px;
    border-radius: 8px;
    gap: 10px;
  }
`;


/* =========================================================
   LEFT SECTION
========================================================= */

export const LeftSection = styled.div`
  display: flex;
  align-items: center;

  gap: 12px;
  flex-wrap: wrap;

  flex: 1;
  min-width: 0;

  /* Tablet */
  @media (max-width: 992px) {
    width: 100%;
    flex: none;
  }

  /* Mobile */
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;


/* =========================================================
   RIGHT SECTION
========================================================= */

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 10px;

  flex-shrink: 0;

  @media (max-width: 992px) {
    width: 100%;
    justify-content: flex-start;
  }

  @media (max-width: 576px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: 10px;
  }
`;


/* =========================================================
   SEARCH
========================================================= */

export const SearchWrapper = styled.div`
  position: relative;

  width: 280px;
  max-width: 100%;
  flex-shrink: 1;

  @media (max-width: 1200px) {
    width: 250px;
  }

  @media (max-width: 992px) {
    width: 280px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 46px;

  box-sizing: border-box;

  border: 1px solid #e5e7eb;
  border-radius: 5px;

  padding: 0 40px 0 15px;

  font-size: 14px;
  font-family: inherit;

  outline: none;

  background: #ffffff;

  transition: border-color 0.2s ease;

  &:focus {
    border-color: #f78926;
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 576px) {
    height: 44px;
    font-size: 13px;
  }
`;


/* =========================================================
   SEARCH ICON
========================================================= */

export const SearchIcon = styled.div`
  position: absolute;

  right: 14px;
  top: 50%;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #666;

  pointer-events: none;

  svg {
    font-size: 17px;
  }
`;


/* =========================================================
   SELECT
========================================================= */

export const Select = styled.select`
  width: 180px;
  height: 46px;

  box-sizing: border-box;

  border: 1px solid #e5e7eb;
  border-radius: 5px;

  padding: 0 15px;

  font-size: 14px;
  font-family: inherit;

  outline: none;

  background: #ffffff;
  color: #333;

  cursor: pointer;

  transition: border-color 0.2s ease;

  &:focus {
    border-color: #f78926;
  }

  @media (max-width: 1200px) {
    width: 170px;
  }

  @media (max-width: 992px) {
    width: 180px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 576px) {
    height: 44px;
    font-size: 13px;
  }
`;


/* =========================================================
   DATE INPUT
========================================================= */

export const DateInput = styled.input`
  width: 180px;
  height: 46px;

  box-sizing: border-box;

  border: 1px solid #e5e7eb;
  border-radius: 5px;

  padding: 0 15px;

  font-size: 14px;
  font-family: inherit;

  outline: none;

  background: #ffffff;
  color: #333;

  cursor: pointer;

  transition: border-color 0.2s ease;

  &:focus {
    border-color: #f78926;
  }

  @media (max-width: 1200px) {
    width: 170px;
  }

  @media (max-width: 992px) {
    width: 180px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 576px) {
    height: 44px;
    font-size: 13px;
  }
`;


/* =========================================================
   MORE OPTIONS WRAPPER
========================================================= */

export const MoreOptionsWrapper = styled.div`
  position: relative;

  display: inline-block;

  flex-shrink: 0;

  @media (max-width: 576px) {
    width: 100%;
  }
`;


/* =========================================================
   MORE OPTIONS BUTTON
========================================================= */

export const MoreOptionsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 5px;

  height: 46px;

  min-width: 48px;

  padding: 0 10px;

  border: 1px solid
    ${({ $active }) =>
      $active ? "#16a34a" : "#2563eb"};

  border-radius: 8px;

  background: ${({ $active }) =>
    $active ? "#ecfdf5" : "#ffffff"};

  cursor: pointer;

  color: #1a1a1a;

  font-size: 14px;

  transition: all 0.2s ease;

  svg {
    font-size: 14px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ $active }) =>
      $active ? "#dcf5e6" : "#f7f8fa"};
  }

  &:focus-visible {
    outline: 2px solid #f78926;
    outline-offset: 2px;
  }

  @media (max-width: 576px) {
    width: 100%;
    height: 44px;
  }
`;


/* =========================================================
   MORE OPTIONS MENU
========================================================= */

export const MoreOptionsMenu = styled.div`
  position: absolute;

  top: calc(100% + 6px);
  right: 0;

  width: max-content;
  min-width: 160px;
  max-width: calc(100vw - 24px);

  box-sizing: border-box;

  background: #ffffff;

  border: 1px solid #eeeeee;
  border-radius: 8px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  padding: 8px;

  z-index: 100;

  overflow: hidden;

  @media (max-width: 576px) {
    left: 0;
    right: auto;

    width: 100%;
    max-width: 100%;
  }
`;


/* =========================================================
   MENU ITEM
========================================================= */

export const MenuItem = styled.label`
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 8px;

  font-size: 14px;

  color: #1a1a1a;

  cursor: pointer;

  border-radius: 6px;

  white-space: nowrap;

  &:hover {
    background: #f7f8fa;
  }

  input {
    width: 15px;
    height: 15px;

    margin: 0;

    cursor: pointer;

    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 576px) {
    font-size: 13px;
  }
`;


/* =========================================================
   MENU HEADER
========================================================= */

export const MenuHeader = styled.div`
  padding: 6px 8px 8px;

  font-size: 12px;

  font-weight: 600;

  color: #6b7280;

  text-transform: uppercase;

  letter-spacing: 0.4px;

  border-bottom: 1px solid #eeeeee;

  margin-bottom: 4px;

  white-space: nowrap;

  @media (max-width: 576px) {
    font-size: 11px;
  }
`;


/* =========================================================
   BULK STATUS ITEM
========================================================= */

export const MenuStatusItem = styled.button`
  display: block;

  width: 100%;

  box-sizing: border-box;

  text-align: left;

  padding: 8px;

  font-size: 14px;

  color: #1a1a1a;

  background: transparent;

  border: none;

  border-radius: 6px;

  cursor: pointer;

  font-family: inherit;

  white-space: nowrap;

  transition: background 0.2s ease;

  &:hover {
    background: #f7f8fa;
  }

  &:focus-visible {
    outline: 2px solid #f78926;
    outline-offset: -2px;
  }

  @media (max-width: 576px) {
    font-size: 13px;
  }
`;