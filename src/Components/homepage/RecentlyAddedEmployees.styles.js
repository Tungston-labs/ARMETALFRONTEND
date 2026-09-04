import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;

 
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  align-items: center;

  @media (min-width: 2540px) {
  margin-bottom: 2rem;
  }
  
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 16px;
  color: #0b2d7cff;
  font-weight: 700;

  @media (max-width: 600px) {
    font-size: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 16px;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }
     @media (min-width: 3840px) {
    font-size: 2rem;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;


     @media (min-width: 3840px) {
     gap: 30px;
  }
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  transition: background 0.2s, transform 0.2s;
   cursor: pointer;

  &:hover {
    background: #f8fafc;
    transform: translateY(-2px);
  }

  @media (min-width: 1920px) {
    padding: 10px 16px;
    border-radius: 12px;
  }
       @media (min-width: 2560px) {
     gap: 20px;
     margin-bottom: 15px;
  }
     @media (min-width: 3840px) {
     gap: 20px;
     margin-bottom: 15px;
  }
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;

  @media (min-width: 1920px) {
    width: 40px;
    height: 40px;
  }
`;

export const AvatarFallback = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f2f4f7;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #98a2b3;
  }
`;
export const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* for text overflow */
`;

export const Name = styled.span`
  font-weight: 600;
  color: #0f172a;
  font-size:0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 600px) {
    font-size: 13px;
  }

  @media (min-width: 1920px) {
    font-size: 16px;
  }
     @media (min-width: 2560px) {
    font-size: 1.5rem;
  }
     @media (min-width: 3840px) {
    font-size: 1.8rem;
  }
`;

export const Dept = styled.span`
  color: #475569;
  font-size: 0.8rem;
  margin-top: 2px;

  @media (max-width: 600px) {
    font-size: 11px;
  }

  @media (min-width: 1920px) {
    font-size: 12px;
  }
    @media (min-width: 2560px) {
    font-size: 20px;
  }
    @media (min-width: 3840px) {
    font-size: 25px;
  }
`;

export const IdText = styled.span`
  color: #94a3b8;
  font-size: 0.7rem;
  margin-top: 2px;

  @media (max-width: 600px) {
    font-size: 10px;
  }

  @media (min-width: 1920px) {
    font-size: 12px;
  }
       @media (min-width: 2560px) {
    font-size: 18px;
  }
    @media (min-width: 3840px) {
    font-size: 22px;
  }
`;

export const DateBox = styled.div`
  min-width: 90px;
  text-align: center;
  padding: 6px 8px;
  border-radius: 8px;
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
  font-size: 12px;

  @media (max-width: 600px) {
    font-size: 10px;
    padding: 4px 6px;
  }
  @media (min-width: 1440px) {
    font-size: 10px;
    min-width: 80px;
    padding: 8px 10px;
  }
  @media (min-width: 1920px) {
    font-size: 14px;
    min-width: 110px;
    padding: 8px 10px;
  }
       @media (min-width: 2560px) {
   font-size: 1.2rem;
    min-width: 110px;
    padding: 8px 10px;
  }
    @media (min-width: 3840px) {
     font-size: 1.2rem;
     padding: 10px 12px;
       min-width: 150px;
  }
`;

export const NoData = styled.div`
  text-align: center;
  padding: 20px 0;
  color: #94a3b8;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 12px 0;
  }

  @media (min-width: 1920px) {
    font-size: 18px;
    padding: 28px 0;
  }
`;
export const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: 8px;
  display: flex;
  align-items: center;

  svg {
    font-size: 20px;
    color: #3352BA;
  }

  &:hover svg {
    transform: scale(1.1);
    transition: 0.2s;
  }
`;
