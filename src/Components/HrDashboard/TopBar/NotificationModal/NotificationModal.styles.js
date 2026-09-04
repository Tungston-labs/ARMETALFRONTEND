import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;

  display: flex;
  justify-content: flex-end;
  align-items: flex-start;

  padding-top: 70px;
  padding-right: 30px;

  background: rgba(16, 24, 40, 0.08);

  z-index: 9999;
`;

export const NotificationModalContainer = styled.div`
  width: 400px;
  max-height: calc(100vh - 90px);

  background: #f4f7fc;

  border-radius: 8px;

  box-shadow: 0 12px 40px rgba(16, 24, 40, 0.2);

  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding: 16px;

  background: #f4f7fc;

  border-bottom: 1px solid #e4e7ec;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 7px;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  margin-top: 1px;

  background: transparent;
  border: none;

  color: #344054;

  cursor: pointer;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  margin: 0;

  font-size: 16px;
  font-weight: 700;

  color: #101828;
`;

export const Subtitle = styled.span`
  margin-top: 4px;

  font-size: 10px;

  color: #667085;

  strong {
    color: #175cd3;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  background: #ffffff;

  border: none;
  border-radius: 50%;

  color: #175cd3;

  cursor: pointer;

  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.08);
`;

export const NotificationList = styled.div`
  padding: 0 14px 14px;

  max-height: calc(100vh - 170px);

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c4cbd5;
    border-radius: 10px;
  }
`;

export const SectionTitle = styled.div`
  padding: 14px 0 9px;

  font-size: 10px;
  font-weight: 600;

  color: #344054;

  border-bottom: 1px solid #e4e7ec;
`;

export const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;

  gap: 9px;

  margin-top: 8px;

  padding: 10px;

  background: #ffffff;

  min-height: 58px;

  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

export const NotificationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  flex-shrink: 0;

  background: #fff1ed;

  border-radius: 50%;

  color: #f97316;

  font-size: 12px;
`;

export const Content = styled.div`
  flex: 1;
`;

export const NotificationTitle = styled.div`
  margin-bottom: 3px;

  font-size: 10px;
  font-weight: 600;

  color: #101828;
`;

export const Description = styled.div`
  font-size: 9px;
  line-height: 13px;

  color: #667085;
`;

export const Time = styled.span`
  font-size: 8px;

  color: #344054;

  white-space: nowrap;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  margin: 10px 14px;

  padding: 8px 10px;

  background: #ffffff;

  border: 1px solid #d0d5dd;
  border-radius: 7px;

  color: #667085;

  &:focus-within {
    border-color: #175cd3;
  }
`;

export const SearchInput = styled.input`
  flex: 1;

  border: none;
  outline: none;

  background: transparent;

  font-size: 12px;
  color: #344054;

  &::placeholder {
    color: #98a2b3;
  }
`;

export const SearchBoxButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  background: transparent;
  border: none;

  color: #667085;

  cursor: pointer;
`;

export const NoResults = styled.div`
  padding: 40px 10px;

  text-align: center;

  font-size: 12px;

  color: #98a2b3;
`;