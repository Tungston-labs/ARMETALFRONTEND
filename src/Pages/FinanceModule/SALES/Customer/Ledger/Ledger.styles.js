import styled, { css } from "styled-components";

export const LedgerTableWrapper = styled.div`
  width: 100%;
  overflow: hidden;

  .ledgerTotalRow {
    display: grid;
    grid-template-columns: 110px 120px 1.4fr 1fr 1fr 1fr 1.1fr;
    align-items: center;

    min-height: 35px;
    background: #f8e5d1;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #d5d5d5;

    font-size: 12px;
    font-weight: 600;
  }

  .ledgerTotalRow span {
    padding: 9px 12px;
  }

  .totalLabel {
    font-weight: 700;
  }

  .totalDebit {
    color: #ff2b2b;
  }

  .totalCredit {
    color: #159947;
  }

  .totalBalance {
    color: #f59e0b;
  }
`;