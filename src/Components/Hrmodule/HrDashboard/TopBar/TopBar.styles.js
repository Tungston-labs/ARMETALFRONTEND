import styled from "styled-components";

export const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 12px 20px;
`;

export const DateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 9px 14px;

  background: #ffffff;
  border: 1px solid #e4e7ec;
  border-radius: 7px;

  font-size: 14px;
  font-weight: 500;
  color: #344054;

  white-space: nowrap;
`;

export const DateSection = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  svg {
    color: #101828;
    flex-shrink: 0;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: #e4e7ec;
`;

export const TimeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  svg {
    color: #475467;
    flex-shrink: 0;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const NotificationButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
`;

export const NotificationDot = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;

  width: 8px;
  height: 8px;

  border-radius: 50%;
  background: red;
`;

export const Language = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 16px;
  color: #667085;
  cursor: pointer;
`;

export const Profile = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;

  padding: 5px 8px;
  border-radius: 8px;

  &:hover {
    background: #f2f4f7;
  }
`;
export const ProfileDropdown = styled.div`
  position: absolute;

  top: calc(100% + 10px);
  right: 0;

  width: 210px;

  background: #ffffff;

  border: 1px solid #eaecf0;
  border-radius: 10px;

  padding: 6px;

  box-shadow: 0 8px 25px rgba(16, 24, 40, 0.12);

  z-index: 1000;
`;

export const DropdownItem = styled.div`
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 11px 12px;

  border-radius: 7px;

  font-size: 14px;
  font-weight: 500;

  color: ${(props) =>
    props.logout ? "#d92d20" : "#344054"};

  cursor: pointer;

  &:hover {
    background: ${(props) =>
      props.logout ? "#fef3f2" : "#f2f4f7"};
  }

  svg {
    flex-shrink: 0;
  }
`;
export const Avatar = styled.div`
  width: 40px;
  height: 40px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f48211;
  color: #ffffff;

  font-size: 17px;
  font-weight: 700;

  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Name = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

export const Role = styled.span`
  color: #98a2b3;
  font-size: 12px;
`;

export const SwitchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 18px;

  background: #f48211;
  color: #fff;

  border: none;
  border-radius: 8px;

  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #ea580c;
  }
`;