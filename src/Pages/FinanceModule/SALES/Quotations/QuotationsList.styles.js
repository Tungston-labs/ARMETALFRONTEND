// import styled from "styled-components";

// /* =========================================================
//    PAGE
// ========================================================= */

// export const PageContainer = styled.div`
//   width: 100%;
//   min-height: 100vh;
//   padding: 0 38px 25px;
//   box-sizing: border-box;
//   background: #ffffff;

//   @media (max-width: 1100px) {
//     padding: 0 20px 25px;
//   }

//   @media (max-width: 700px) {
//     padding: 0 12px 20px;
//   }
// `;

// /* =========================================================
//    HEADER
// ========================================================= */

// export const HeaderActions = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   flex-wrap: nowrap;

//   @media (max-width: 1100px) {
//     flex-wrap: wrap;
//   }

//   @media (max-width: 700px) {
//     width: 100%;
//   }
// `;

// /* =========================================================
//    DATE RANGE
// ========================================================= */

// export const DateRangeWrapper = styled.div`
//   position: relative;
//   width: 190px;
//   height: 32px;

//   @media (max-width: 700px) {
//     width: 180px;
//   }
// `;

// export const DateInput = styled.input`
//   width: 100%;
//   height: 32px;

//   padding: 0 32px 0 10px;
//   box-sizing: border-box;

//   border: 1px solid #e1e1e1;
//   border-radius: 4px;

//   background: #ffffff;
//   color: #222222;

//   font-family: inherit;
//   font-size: 11px;

//   outline: none;
//   cursor: pointer;
// `;

// export const CalendarIcon = styled.span`
//   position: absolute;

//   top: 50%;
//   right: 9px;

//   display: flex;
//   align-items: center;
//   justify-content: center;

//   transform: translateY(-50%);

//   color: #333333;

//   pointer-events: none;

//   svg {
//     width: 14px;
//     height: 14px;
//   }
// `;

// /* =========================================================
//    FILTER
// ========================================================= */

// export const FilterSection = styled.div`
//   margin-bottom: 0;

//   border: 1px solid #e3e3e3;
//   border-bottom: none;

//   border-radius: 4px 4px 0 0;
// `;

// /* =========================================================
//    TABLE
// ========================================================= */

// export const TableSection = styled.div`
//   width: 100%;
//   overflow-x: auto;

//   border: 1px solid #e3e3e3;
//   border-top: none;
// `;

// export const QuotationNumber = styled.span`
//   color: #304ba3;
//   font-size: 13px;
//   font-weight: 600;
//   cursor: pointer;

//   &:hover {
//     text-decoration: underline;
//   }
// `;

// /* =========================================================
//    STATUS
// ========================================================= */

// export const StatusBadge = styled.span`
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;

//   min-width: 75px;
//   padding: 5px 10px;

//   border-radius: 4px;

//   font-size: 11px;
//   font-weight: 500;

//   ${({ $status }) => {
//     if ($status === "Approved") {
//       return `
//         color: #16834b;
//         background: #e7f7ee;
//       `;
//     }

//     if ($status === "Pending") {
//       return `
//         color: #c47b00;
//         background: #fff4dc;
//       `;
//     }

//     if ($status === "Rejected") {
//       return `
//         color: #d64545;
//         background: #fdeaea;
//       `;
//     }

//     return `
//       color: #555555;
//       background: #f1f1f1;
//     `;
//   }}
// `;

// /* =========================================================
//    ACTIONS
// ========================================================= */

// export const ActionButtons = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 6px;
// `;

// export const IconButton = styled.button`
//   width: 30px;
//   height: 30px;

//   display: inline-flex;
//   align-items: center;
//   justify-content: center;

//   padding: 0;

//   border: 1px solid #e1e1e1;
//   border-radius: 4px;

//   background: #ffffff;
//   color: #555555;

//   cursor: pointer;

//   transition:
//     background 0.2s ease,
//     color 0.2s ease,
//     border-color 0.2s ease;

//   svg {
//     width: 15px;
//     height: 15px;
//   }

//   &:hover {
//     background: #f5f6fb;
//     color: #304ba3;
//     border-color: #304ba3;
//   }
// `;