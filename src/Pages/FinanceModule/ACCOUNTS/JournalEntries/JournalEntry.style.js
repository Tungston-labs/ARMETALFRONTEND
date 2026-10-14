import styled from "styled-components";

/* =========================================================
   PAGE
========================================================= */

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;

  padding: 0 44px 30px;

  box-sizing: border-box;

  background: #f4f7fd;

  font-family: "Poppins", sans-serif;
`;

/* =========================================================
   HEADER
========================================================= */

export const Header = styled.div`
  width: 100%;

  min-height: 66px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;

  gap: 2px;
`;

export const PageTitle = styled.h1`
  margin: 0;

  color: #3049a3;

  font-size: 16px;
  font-weight: 500;

  line-height: 22px;
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;

  gap: 7px;

  color: #111827;

  font-size: 11px;
`;

export const BreadcrumbItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  color: ${({ active }) =>
        active ? "#3049a3" : "#111827"};

  font-weight: ${({ active }) =>
        active ? 500 : 400};
`;

export const BreadcrumbSeparator = styled.span`
  color: #6b7280;

  font-size: 16px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;

  gap: 10px;
`;

export const HeaderButton = styled.button`
  height: 32px;

  padding: 0 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  border: 1px solid #e5e7eb;
  border-radius: 4px;

  background: #ffffff;

  color: #111827;

  font-family: "Poppins", sans-serif;

  font-size: 10px;
  font-weight: 500;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    border-color: #3049a3;
    color: #3049a3;
  }
`;

export const NewEntryButton = styled.button`
  height: 32px;

  padding: 0 17px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 5px;

  border: none;
  border-radius: 4px;

  background: #3049a3;

  color: #ffffff;

  font-family: "Poppins", sans-serif;

  font-size: 10px;
  font-weight: 600;

  cursor: pointer;

  transition: background 0.2s ease;

  &:hover {
    background: #263d8d;
  }
`;

export const DateRangeButton = styled.button`
  height: 32px;

  min-width: 190px;

  padding: 0 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 8px;

  border: 1px solid #e5e7eb;
  border-radius: 4px;

  background: #ffffff;

  color: #111827;

  font-family: "Poppins", sans-serif;

  font-size: 10px;

  cursor: pointer;
`;

/* =========================================================
   STATS
========================================================= */

export const StatsGrid = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  gap: 24px;

  margin-top: 8px;
`;

export const StatCard = styled.div`
  min-height: 84px;

  padding: 15px 18px;

  box-sizing: border-box;

  display: flex;
  align-items: center;

  gap: 13px;

  background: #ffffff;

  border-radius: 8px;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
`;

export const StatIcon = styled.div`
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: ${({ $background }) =>
        $background || "#e8f8ef"};

  color: ${({ $color }) =>
        $color || "#22a06b"};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const StatContent = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 2px;
`;

export const StatValue = styled.div`
  color: #111111;

  font-size: 17px;
  font-weight: 500;

  line-height: 21px;
`;

export const StatLabel = styled.div`
  color: #858585;

  font-size: 10px;
  font-weight: 400;

  line-height: 15px;
`;

/* =========================================================
   SUMMARY
========================================================= */

export const SummaryBar = styled.div`
  width: 100%;

  height: 65px;

  margin-top: 16px;

  display: grid;

  grid-template-columns:
    1fr 1fr 255px;

  background: #ffffff;

  border-radius: 8px;

  overflow: hidden;
`;

export const SummaryItem = styled.div`
  display: flex;
  align-items: center;

  gap: 13px;

  padding: 0 25px;

  border-right: 1px solid #eeeeee;
`;

export const SummaryIcon = styled.div`
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: ${({ $type }) =>
        $type === "credit"
            ? "#fff0e9"
            : "#e8f8ef"};

  color: ${({ $type }) =>
        $type === "credit"
            ? "#ff4b22"
            : "#1a9b4b"};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;

  gap: 2px;
`;

export const SummaryLabel = styled.span`
  color: #4b5563;

  font-size: 10px;
  font-weight: 400;
`;

export const SummaryValue = styled.strong`
  color: #111111;

  font-size: 15px;
  font-weight: 500;
`;

export const SummaryStatus = styled.div`
  height: 100%;

  padding: 0 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #dcf5e7;
`;

export const StatusLabel = styled.div`
  color: #444444;

  font-size: 10px;
`;

export const StatusValue = styled.div`
  margin-top: 2px;

  color: #188b37;

  font-size: 14px;
  font-weight: 500;
`;

export const StatusCheck = styled.div`
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #35bd5b;

  color: #ffffff;

  svg {
    width: 18px;
    height: 18px;
  }
`;

/* =========================================================
   TABLE CARD
========================================================= */

export const ContentCard = styled.div`
  width: 100%;

  margin-top: 14px;

  padding: 15px 0 0;

  box-sizing: border-box;

  background: #ffffff;

  border-radius: 8px;

  overflow: hidden;
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 0 24px 14px;
`;

export const SearchContainer = styled.div`
  position: relative;

  width: 224px;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 32px;

  padding: 0 34px 0 12px;

  box-sizing: border-box;

  border: 1px solid #e1e4e8;
  border-radius: 4px;

  outline: none;

  background: #ffffff;

  color: #333333;

  font-family: "Poppins", sans-serif;

  font-size: 10px;

  &::placeholder {
    color: #555555;
  }

  &:focus {
    border-color: #3049a3;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;

  right: 11px;
  top: 50%;

  transform: translateY(-50%);

  display: flex;

  color: #111111;

  pointer-events: none;

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const FilterWrapper = styled.div`
  position: relative;

  width: 122px;
`;

export const FilterSelect = styled.select`
  width: 100%;
  height: 32px;

  padding: 0 28px 0 12px;

  appearance: none;

  border: 1px solid #e1e4e8;
  border-radius: 4px;

  outline: none;

  background: #ffffff;

  color: #222222;

  font-family: "Poppins", sans-serif;

  font-size: 10px;

  cursor: pointer;

  &:focus {
    border-color: #3049a3;
  }
`;

export const FilterArrow = styled.div`
  position: absolute;

  right: 9px;
  top: 50%;

  transform: translateY(-50%);

  pointer-events: none;

  display: flex;

  color: #111111;

  svg {
    width: 12px;
    height: 12px;
  }
`;

/* =========================================================
   TABLE
========================================================= */

export const TableWrapper = styled.div`
  width: 100%;

  overflow-x: auto;
`;

export const JournalTable = styled.table`
  width: 100%;

  border-collapse: collapse;

  table-layout: fixed;

  font-family: "Poppins", sans-serif;

  thead {
    background: #f7890b;
  }

  th {
    height: 40px;

    padding: 0 12px;

    color: #ffffff;

    font-size: 10px;
    font-weight: 600;

    text-align: left;

    white-space: nowrap;
  }

  td {
    height: 46px;

    padding: 0 12px;

    box-sizing: border-box;

    border-bottom: 1px solid #eeeeee;

    color: #3f3f3f;

    font-size: 10px;
    font-weight: 400;

    vertical-align: middle;

    white-space: nowrap;

    overflow: hidden;
    text-overflow: ellipsis;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 7%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 9%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 9%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 25%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 7%;
  }

  th:nth-child(6),
  td:nth-child(6) {
    width: 9%;
  }

  th:nth-child(7),
  td:nth-child(7) {
    width: 9%;
  }

  th:nth-child(8),
  td:nth-child(8) {
    width: 9%;
  }

  th:nth-child(9),
  td:nth-child(9) {
    width: 9%;
  }

  th:nth-child(10),
  td:nth-child(10) {
    width: 7%;
    text-align: center;
  }
`;

export const SourceText = styled.span`
  color: ${({ $manual }) =>
        $manual ? "#f7890b" : "#444444"};
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 56px;

  height: 20px;

  padding: 0 9px;

  box-sizing: border-box;

  border-radius: 4px;

  background: ${({ $status }) => {
        if ($status === "Draft") {
            return "#f2f2f2";
        }

        if ($status === "Pending") {
            return "#fff4e5";
        }

        if ($status === "Voided") {
            return "#ffe9e9";
        }

        return "#dff5e8";
    }};

  color: ${({ $status }) => {
        if ($status === "Draft") {
            return "#555555";
        }

        if ($status === "Pending") {
            return "#c56b00";
        }

        if ($status === "Voided") {
            return "#d62828";
        }

        return "#16853b";
    }};

  font-size: 9px;
  font-weight: 500;
`;

/* =========================================================
   BOTTOM
========================================================= */

export const BottomBar = styled.div`
  width: 100%;

  margin-top: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ShowingText = styled.span`
  color: #111111;

  font-size: 10px;
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;

  gap: 5px;
`;

export const PaginationButton = styled.button`
  width: 25px;
  height: 25px;

  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e5e7eb;
  border-radius: 4px;

  background: #ffffff;

  color: #111111;

  cursor: ${({ disabled }) =>
        disabled ? "not-allowed" : "pointer"};

  opacity: ${({ disabled }) =>
        disabled ? 0.5 : 1};

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const PaginationNumber = styled.button`
  width: 25px;
  height: 25px;

  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    ${({ $active }) =>
        $active ? "#3049a3" : "#e5e7eb"};

  border-radius: 4px;

  background: ${({ $active }) =>
        $active ? "#3049a3" : "#ffffff"};

  color: ${({ $active }) =>
        $active ? "#ffffff" : "#111111"};

  font-size: 10px;

  cursor: pointer;
`;

/* =========================================================
   RESPONSIVE
========================================================= */

export const ResponsiveStyles = styled.div`
  @media (max-width: 1200px) {
    ${PageContainer} {
      padding-left: 25px;
      padding-right: 25px;
    }

    ${HeaderActions} {
      gap: 6px;
    }

    ${StatsGrid} {
      gap: 12px;
    }
  }

  @media (max-width: 1000px) {
    ${Header} {
      align-items: flex-start;
      flex-direction: column;
      padding: 15px 0;
    }

    ${HeaderActions} {
      width: 100%;
      flex-wrap: wrap;
    }

    ${StatsGrid} {
      grid-template-columns: repeat(2, 1fr);
    }

    ${SummaryBar} {
      grid-template-columns: 1fr;
      height: auto;
    }

    ${SummaryItem} {
      min-height: 60px;
      border-right: none;
      border-bottom: 1px solid #eeeeee;
    }

    ${SummaryStatus} {
      min-height: 60px;
    }
  }

  @media (max-width: 650px) {
    ${PageContainer} {
      padding: 0 15px 25px;
    }

    ${StatsGrid} {
      grid-template-columns: 1fr;
    }

    ${FilterBar} {
      flex-wrap: wrap;
    }

    ${SearchContainer} {
      width: 100%;
    }

    ${FilterWrapper} {
      width: calc(50% - 6px);
    }
  }
`;