import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const TableCard = styled.div`
  border-radius: 6px;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  border-bottom: 1px solid #d9d9d9;
  margin-bottom: 15px;
  padding-bottom: 14px;

  .header-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .title-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
  }

  .view-switcher {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 4px;
    background: #f5f5f5;
    border: 1px solid #dedede;
    border-radius: 7px;
    margin-left: auto;
  }

  .view-switcher button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    height: 32px;
    padding: 0 12px;

    border: none;
    border-radius: 5px;

    background: transparent;
    color: #777;

    font-family: "Poppins", sans-serif;
    font-size: 12px;
    font-weight: 500;

    cursor: pointer;

    transition:
      background 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .view-switcher button svg {
    font-size: 16px;
  }

  .view-switcher button:hover {
    color: #ff8a1f;
  }

  .view-switcher button.active {
    background: #ffffff;
    color: #ff8a1f;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 600px) {
    .header-content {
      align-items: flex-start;
    }

    .view-switcher {
      flex-shrink: 0;
    }

    .view-switcher button {
      width: 34px;
      padding: 0;
    }

    .view-switcher button span {
      display: none;
    }
  }
`;

export const Title = styled.h3`
  display: flex;
  align-items: center;

  margin: 0;

  color: #222;

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0;
`;

export const TitleUnderline = styled.div`
  width: 110px;
  height: 3px;

  margin-top: 10px;

  background: #ff8a1f;
`;