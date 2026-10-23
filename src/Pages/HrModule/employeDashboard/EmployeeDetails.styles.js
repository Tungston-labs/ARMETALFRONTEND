import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
  cursor: pointer;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 520px) {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
`;

export const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  h3 {
    margin: 0;

    @media (min-width: 2560px) {
      font-size: 1.2rem;
    }
    @media (min-width: 3840px) {
      font-size: 1.8rem;
    }
  }
`;

export const EditIcon = styled.div`
  cursor: pointer;
  color: #555;
`;

export const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;

  .dot {
    width: 15px;
    height: 15px;
    background: #22c55e;
    border-radius: 50%;
  }
  @media (min-width: 2560px) {
    font-size: 1.2rem;
  }
  @media (min-width: 3840px) {
    font-size: 1.8rem;
  }
`;
export const MailButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2563eb; 
  }
`;

export const TopSection = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 25px;

  @media (max-width: 1024px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

export const ProfileLeft = styled.div`
  width: 20%;

  @media (max-width: 1024px) {
    width: 35%;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #94a3b8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;
export const Info = styled.div`
  text-align: center;
  margin-top: 10px;
`;

export const Name = styled.h2`
  margin: 5px 0;
  font-family: "Poppins";
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
  @media (max-width: 1024px) {
    font-size: 1rem;
  }
  @media (min-width: 2560px) {
    font-size: 1.6rem;
  }
`;

export const Role = styled.p`
  margin: 0;
  color: gray;
  font-family: "Poppins";
    font-size: 0.9rem;
  @media (max-width: 1024px) {
    font-size: 0.9rem;
  }
  @media (min-width: 2560px) {
    font-size: 1.3rem;
  }
  @media (min-width: 3840px) {
    font-size: 1.5rem;
  }
`;

export const RightCards = styled.div`
  width: 80%;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  cursor: pointer;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 12px;
  position: relative;

`;

export const StatNumber = styled.h2`
  margin: 0;
  font-family: "Poppins";
   font-size: 1rem;

`;

export const StatLabel = styled.p`
  margin: 5px 0 0 0;
  color: gray;
  font-family: "Poppins";
    font-size: 0.9rem;
  
`;

export const IconRight = styled.div`
  position: absolute;
  right: 18px;
  top: 18px;
  opacity: 0.7;
`;

export const Tabs = styled.div`
  display: flex;
  margin-top: 30px;
  border: 1px solid #f5f0f0ff;
  background: white;
  border-radius: 10px;
  padding: 5px;
  gap: 50px;
  justify-content: center;

  @media (max-width: 600px) {
    gap: 15px;
    flex-wrap: wrap;
  }

  @media (min-width: 2560px) {
    padding: 10px 15px;
  }

  @media (min-width: 3840px) {
    padding: 20px 15px;
  }
`;

export const TabButton = styled.button`
  padding: 10px 25px;
  border: none;
  background: ${({ active }) => (active ? "#3b82f6" : "transparent")};
  color: ${({ active }) => (active ? "white" : "#555")};
  cursor: pointer;
  border-radius: 6px;
  font-family: "Poppins";
  white-space: nowrap;
font-size: 0.8rem;
`;

export const ContentSection = styled.div`
  padding: 20px 5px;
`;

export const InfoGrid = styled.div`
  display: grid;
  cursor: pointer;
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 170px 1fr 170px 1fr;
  padding: 8px 0;
  align-items: center;
  row-gap: 10px;
  @media (min-width: 3840px) {
    grid-template-columns: 270px 1fr 270px 1fr;
    row-gap: 10px;
  }
  @media (min-width: 2560px) {
    grid-template-columns: 270px 1fr 270px 1fr;
    row-gap: 10px;
  }
  @media (max-width: 1600px) {
    grid-template-columns: 1fr 1fr;
    row-gap: 10px;
  }

  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1fr;
    row-gap: 10px;
  }

  @media (max-width: 768px) {
    /* grid-template-columns: 1fr; */
    gap: 8px;

    padding: 10px 0;
    background: #fafafa;
    border-radius: 8px;
  }
`;

export const InfoTitle = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  font-family: "Poppins";

`;

export const InfoValue = styled.div`
  font-size: 0.9rem;
  font-family: "Poppins";

`;

export const Title = styled.h3`
  font-weight: 600;
  font-size: 1rem;
  font-family: "Poppins";

`;
export const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-top: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const DocumentCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const DocumentPreview = styled.img`
  width: 100%;
  height: 140px;
  display: block;
  object-fit: cover;
  background: #f3f4f6;
  cursor: pointer;

  @media (max-width: 500px) {
    height: 180px;
  }

  @media (min-width: 2560px) {
    height: 200px;
  }
`;

export const DocumentName = styled.div`
  padding: 10px 12px;
  font-family: "Poppins";
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
`;