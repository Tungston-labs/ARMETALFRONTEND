import styled from "styled-components";

export const Card = styled.div`
  width: 100%;
  min-height: 232px;
  padding: 36px 26px 26px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.05);
cursor: pointer;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background: #3858c8;
    border-color: #3858c8;

    box-shadow: 0 12px 28px rgba(56, 88, 200, 0.25);

    transform: translateY(-3px);
  }

  @media (max-width: 1200px) {
    min-height: 225px;
    padding: 30px 22px 24px;
  }

  @media (max-width: 768px) {
    min-height: 215px;
    padding: 28px 20px 22px;
  }

  @media (max-width: 480px) {
    min-height: 210px;
    padding: 25px 18px 20px;
    border-radius: 14px;
  }
`;

export const CardCategory = styled.p`
  margin: 0 0 10px;

  color: #111111;

  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;

  transition: color 0.3s ease;

  strong {
    font-weight: 700;
  }

  ${Card}:hover & {
    color: #ffffff;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const CardTitle = styled.h3`
  margin: 0;

  color: #111111;

  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: color 0.3s ease;

  ${Card}:hover & {
    color: #ffffff;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const TagsRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  margin-top: 15px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const DateTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 30px;
  padding: 0 11px;

  border-radius: 4px;

  background: #e8e8e8;
  color: #222222;

  font-size: 12px;

  transition: all 0.3s ease;

  ${Card}:hover & {
    /* background: rgba(255, 255, 255, 0.12); */
    background-color: white;
    color: black;
  }

  @media (max-width: 480px) {
    min-height: 28px;
    padding: 0 8px;
    font-size: 10px;
  }
`;

export const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 30px;
  padding: 0 12px;

  border-radius: 4px;

  color: ${({ status }) =>
    status === "Completed"
      ? "#13b34a"
      : "#ff7a1a"};

  background: ${({ status }) =>
    status === "Completed"
      ? "#e8f8ed"
      : "#fff2e8"};

  font-size: 12px;

  transition: all 0.3s ease;

  ${Card}:hover & {
    /* background: rgba(255, 255, 255, 0.12); */
background-color: white;
    color: ${({ status }) =>
      status === "Completed"
        ? "#13b34a"
        : "#ff7a1a"};
  }

  @media (max-width: 480px) {
    min-height: 28px;
    padding: 0 8px;
    font-size: 10px;
  }
`;

export const PriorityTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 30px;
  padding: 0 12px;

  border-radius: 4px;

  background: #ffe9e8;
  color: #ff4b45;

  font-size: 12px;

  transition: all 0.3s ease;

  ${Card}:hover & {
    /* background: rgba(255, 255, 255, 0.12); */
    background-color: white;
    color: #ff4b45;
  }

  @media (max-width: 480px) {
    min-height: 28px;
    padding: 0 8px;
    font-size: 10px;
  }
`;

export const BottomSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-top: 25px;

  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 20px;
  }
`;

export const Members = styled.div`
  display: flex;
  align-items: center;
`;

export const MemberImage = styled.img`
  width: 32px;
  height: 32px;

  object-fit: cover;

  border-radius: 50%;
  border: 2px solid #ffffff;

  margin-left: -7px;

  &:first-child {
    margin-left: 0;
  }

  @media (max-width: 480px) {
    width: 29px;
    height: 29px;
  }
`;

export const MemberCount = styled.div`
  width: 32px;
  height: 32px;

  margin-left: -7px;

  border-radius: 50%;
  border: 2px solid #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ff8b2c;
  color: #ffffff;

  font-size: 10px;
  font-weight: 600;

  box-sizing: border-box;
  flex-shrink: 0;

  position: relative;
  z-index: 2;

  transition: transform 0.3s ease;

  ${Card}:hover & {
    background: #ff8b2c;
    color: #ffffff;
  }

  &:hover {
    transform: translateY(-3px) scale(1.08);
    z-index: 10;
  }

  @media (max-width: 480px) {
    width: 29px;
    height: 29px;
  }
`;

export const AddMember = styled.button`
  width: 32px;
  height: 32px;

  margin-left: -7px;

  border: 2px solid #ffffff;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #3858c8;
  color: #ffffff;

  font-size: 22px;
  font-weight: 300;
  line-height: 1;

  cursor: pointer;

  box-sizing: border-box;
  flex-shrink: 0;

  position: relative;
  z-index: 2;

  transition:
    background 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;

  /* When card is hovered */
  ${Card}:hover & {
    background: #ffffff;
    color: #3858c8;

    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  }

  /* When + button itself is hovered */
  &:hover {
    transform: translateY(-3px) scale(1.08);

    background: #ff8b2c;
    color: #ffffff;

    border-color: #ffffff;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

    z-index: 10;
  }

  &:active {
    transform: translateY(-1px) scale(1.03);
  }

  @media (max-width: 480px) {
    width: 29px;
    height: 29px;

    font-size: 19px;
  }
`;

export const ViewMoreButton = styled.button`
  height: 31px;
  padding: 0 15px;

  border: 1px solid #ff7418;
  border-radius: 4px;

  background: #ffffff;
  color: #111111;

  font-size: 11px;
  font-weight: 500;

  cursor: pointer;

  transition: all 0.3s ease;

  ${Card}:hover & {
    background: #ff8b2c;
    border-color: #ff8b2c;
    color: #ffffff;
  }

  @media (max-width: 480px) {
    height: 29px;
    padding: 0 10px;
    font-size: 9px;
  }
`;

export const MemberAvatar = styled.div`
  width: 32px;
  height: 32px;

  margin-left: -7px;

  border-radius: 50%;
  border: 2px solid #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #e8ecff;
  color: #3858c8;

  font-size: 11px;
  font-weight: 700;

  box-sizing: border-box;
  flex-shrink: 0;

  position: relative;
  z-index: 1;

  transition:
    background 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:first-child {
    margin-left: 0;
  }

  /* Hover card */
  ${Card}:hover & {
    background: #ffffff;
    color: #3858c8;

    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  }

  /* Individual avatar hover */
  &:hover {
    transform: translateY(-3px) scale(1.08);
    z-index: 10;

    background: #ff8b2c;
    color: #ffffff;

    border-color: #ffffff;
  }

  @media (max-width: 480px) {
    width: 29px;
    height: 29px;

    font-size: 10px;
  }
`;