import styled from "styled-components";

export const ProjectsPage = styled.main`
  width: 100%;
  min-height: 100vh;

  background: #f7f8fc;

  padding: 20px;

  box-sizing: border-box;

  @media (max-width: 1200px) {
    padding: 25px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const ProjectsContainer = styled.div`
  width: 100%;
  max-width: 1800px;

  margin: 0 auto;
`;

export const ProjectsGrid = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 36px 30px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 28px 24px;
  }
 @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 28px 24px;
  }
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 24px 20px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    gap: 18px;
  }
`;
export const EmptyState = styled.div`
  width: 100%;
  min-height: 280px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;

  box-sizing: border-box;

  background: #ffffff;

  border-radius: 14px;

  border: 1px solid #eeeeee;

  text-align: center;

  font-family: "Poppins", sans-serif;

  grid-column: 1 / -1;
`;

export const EmptyStateIcon = styled.div`
  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 16px;

  border-radius: 50%;

  background: #eef3ff;

  color: #3154d8;

  font-size: 26px;
`;

export const EmptyStateTitle = styled.h3`
  margin: 0 0 6px;

  color: #222222;

  font-size: 16px;

  font-weight: 600;

  font-family: "Poppins", sans-serif;
`;

export const EmptyStateText = styled.p`
  margin: 0;

  max-width: 400px;

  color: #8a8a8a;

  font-size: 12px;

  font-weight: 400;

  line-height: 1.6;

  font-family: "Poppins", sans-serif;
`;