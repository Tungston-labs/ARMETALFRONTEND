import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 20px 30px;
  min-height: 100vh;
`;

export const Card = styled.div`
background: #F7F8FC;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  margin-bottom: 25px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;

  /* Large laptops / desktops */
  @media (min-width: 1440px) {
    font-size: 20px;
  }

  /* 2K Screens (2560px) */
  @media (min-width: 2560px) {
    font-size: 24px;
  }

  /* 4K Screens (3840px) */
  @media (min-width: 3840px) {
    font-size: 28px;
  }
`;


export const ProfileRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const ProfileImage = styled.img`
  width: 85px;
  height: 85px;
  border-radius: 10%;
  object-fit: cover;
  border: 3px solid #eee;

  /* Large laptops / desktops */
  @media (min-width: 1440px) {
    width: 95px;
    height: 95px;
  }

  /* 2K screens (2560px) */
  @media (min-width: 2560px) {
    width: 110px;
    height: 110px;
  }

  /* 4K screens (3840px) */
  @media (min-width: 3840px) {
    width: 130px;
    height: 130px;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

export const Label = styled.div`
  width: 130px;      /* Base width */
  font-size: 14px;
  color: #666;
  font-weight: 500;

  /* Large laptops / desktops */
  @media (min-width: 1440px) {
    width: 150px;
    font-size: 15px;
  }

  /* 2K screens (2560px) */
  @media (min-width: 2560px) {
    width: 180px;
    font-size: 17px;
  }

  /* 4K screens (3840px) */
  @media (min-width: 3840px) {
    width: 220px;
    font-size: 1.5rem;
  }
`;


export const Value = styled.div`
  flex: 1;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  color: #222;

  /* Large laptops / desktops */
  @media (min-width: 1440px) {
    font-size: 1rem;
  }

  /* 2K screens (2560px) */
  @media (min-width: 2560px) {
    font-size: 1.2rem;
  }

  /* 4K screens (3840px) */
  @media (min-width: 3840px) {
    font-size: 1.5rem;
  }
`;



export const StatusSelect = styled.select`
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) => props.statusColor};
  outline: none;
`;

export const Divider = styled.div`
  height: 1px;
  background: #e5e5e5;
  margin: 20px 0;
`;

export const NoteBox = styled.div`
  background: #f8f9fc;
  border: 1px solid #e3e6ee;
  padding: 14px;
  border-radius: 10px;
  font-size: 14px;
  color: #444;
  line-height: 1.5;
  margin-top: 10px;

  /* Large laptops / desktops */
  @media (min-width: 1440px) {
    padding: 16px;
    font-size: 1rem;
  }

  /* 2K screens (2560px) */
  @media (min-width: 2560px) {
    padding: 20px;
    font-size: 1.2rem;
  }

  /* 4K screens (3840px) */
  @media (min-width: 3840px) {
    padding: 24px;
    font-size: 1.5rem;
  }
`;


export const BillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 15px;
  margin-top: 10px;

  /* Large Laptops (1440px) */
  @media (min-width: 1440px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 18px;
  }

  /* 2K Screens (2560px) */
  @media (min-width: 2560px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }

  /* 4K Screens (3840px) */
  @media (min-width: 3840px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
  }
`;


export const BillImageWrapper = styled.div`
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  height: 180px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.09);

  /* Large Laptop */
  @media (min-width: 1440px) {
    height: 200px;
  }

  /* 2K Screen */
  @media (min-width: 2560px) {
    height: 240px;
  }

  /* 4K Screen */
  @media (min-width: 3840px) {
    height: 300px;
  }
`;


export const BillImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
  padding: 8px;

  /* Large Laptop */
  @media (min-width: 1440px) {
    padding: 10px;
  }

  /* 2K Screen */
  @media (min-width: 2560px) {
    padding: 12px;
  }

  /* 4K Screen */
  @media (min-width: 3840px) {
    padding: 16px;
  }
`;


export const NoteCard = styled.div`
  background: #fdfdff;
  border: 1px solid #e6e9f1;
  border-radius: 10px;
  padding: 12px 16px;
  margin-top: 10px;

  /* Large laptops / desktops */
  @media (min-width: 1440px) {
    padding: 14px 18px;
  }

  /* 2K screens */
  @media (min-width: 2560px) {
    padding: 18px 22px;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    padding: 22px 28px;
  }
`;


export const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #333;

  &:hover {
    opacity: 0.7;
  }

  /* Large laptops */
  @media (min-width: 1440px) {
    font-size: 18px;
  }

  /* 2K screens */
  @media (min-width: 2560px) {
    font-size: 1.4rem;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    font-size: 1.5rem;
  }
`;


export const Arrow = styled.span`
  font-size: 18px;
  transition: 0.3s;

  /* Large laptops */
  @media (min-width: 1440px) {
    font-size: 20px;
  }

  /* 2K screens */
  @media (min-width: 2560px) {
    font-size: 22px;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    font-size: 26px;
  }
`;

export const TopStatusBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    justify-content: space-between;
  }
`;

export const TopStatusLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #666;

  @media (min-width: 1440px) {
    font-size: 15px;
  }
`;