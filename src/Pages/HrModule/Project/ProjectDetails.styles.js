import styled from "styled-components";

export const DetailsPage = styled.div`
  width: 100%;
  min-height: 100vh;

  padding: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const DetailsContainer = styled.div`
  width: 100%;
  max-width: 1600px;

  margin: 0 auto;
`;

export const BackButton = styled.button`
  border: none;

  background: transparent;
  color: #3858c8;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  padding: 0;
  margin-bottom: 25px;

  &:hover {
    text-decoration: underline;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 28px;

  background: #ffffff;

  border: 1px solid #e8e8e8;
  border-radius: 16px;

  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.04);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Category = styled.p`
  margin: 0 0 10px;

  color: #666666;

  font-size: 13px;
  font-weight: 400;

  text-transform: uppercase;

  strong {
    color: #111111;
    font-weight: 700;
  }
`;

export const Title = styled.h1`
  margin: 0;

  color: #111111;

  font-size: 26px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 19px;
  }
`;

export const StatusBadge = styled.span`
  padding: 9px 15px;

  border-radius: 5px;

  background: ${({ status }) =>
    status === "Completed"
      ? "#e8f8ed"
      : "#fff2e8"};

  color: ${({ status }) =>
    status === "Completed"
      ? "#13b34a"
      : "#ff7a1a"};

  font-size: 12px;
  font-weight: 500;
`;

export const InfoGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 18px;

  margin-top: 20px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  padding: 20px;

  background: #ffffff;

  border: 1px solid #e8e8e8;
  border-radius: 12px;

  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.03);
`;

export const InfoLabel = styled.p`
  margin: 0 0 8px;

  color: #777777;

  font-size: 12px;
`;

export const InfoValue = styled.p`
  margin: 0;

  color: #111111;

  font-size: 15px;
  font-weight: 600;
`;

export const Section = styled.section`
  margin-top: 25px;

  padding: 25px;

  background: #ffffff;

  border: 1px solid #e8e8e8;
  border-radius: 14px;

  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.03);

  @media (max-width: 480px) {
    padding: 18px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0 0 20px;

  color: #111111;

  font-size: 18px;
  font-weight: 600;
`;

export const Members = styled.div`
  display: flex;
  flex-wrap: wrap;

  gap: 20px;
`;

export const Member = styled.div`
  display: flex;
  align-items: center;

  gap: 10px;
`;

export const MemberImage = styled.img`
  width: 40px;
  height: 40px;

  object-fit: cover;

  border-radius: 50%;

  border: 2px solid #ffffff;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const MemberName = styled.span`
  color: #333333;

  font-size: 13px;
`;