import styled from "styled-components";
import bannerBg from "../../assets/superadmin.svg";
export const DashboardWrapper = styled.div`
  font-family: "Satoshi", sans-serif;
  background: #f3f3f3;
  color: #111;
  min-height: 100vh;
  padding: clamp(1rem, 2vw, 2rem);
`;

export const Header = styled.header`
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
  margin: 0;
`;

export const Subtitle = styled.p`
  color: #666;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  margin: 0.25rem 0 0;
`;

export const BlueBanner = styled.section`
  background: url(${bannerBg}) no-repeat center;
  background-size: cover;
  border-radius: 10px;
  padding: clamp(1rem, 2vw, 2rem);
  color: #fff;
  margin-bottom: 6rem;
  position: relative;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const BannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5rem;

  h2 {
    margin: 0 0 15px 0;
    font-family: Satoshi;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 0%;
    font-size: 1.8rem; 
  }

  p {
    margin: 0.25rem 0 0;
    font-family: Satoshi;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0%;
    font-size: 1.4rem; 
  }

  span {
    font-family: Satoshi;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 0%;
    font-size:1.4rem; 
  }

  @media (max-width: 1440px) {
    h2 {
      font-size: 28px;
    }

    p {
      font-size: 20px;
    }

    span {
      font-size: 28px;
    }
  }
  @media (max-width: 1024px) {
    h2 {
      font-size: 28px;
    }

    p {
      font-size: 20px;
    }

    span {
      font-size: 28px;
    }
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 22px;
    }

    p {
      font-size: 16px;
    }

    span {
      font-size: 22px;
    }
  }


  @media (max-width: 480px) {
    h2 {
      font-size: 18px;
    }

    p {
      font-size: 14px;
    }

    span {
      font-size: 18px;
    }
  }
`;


export const CardContainer = styled.div`
  position: absolute;
  bottom: -3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 95%;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 2;
`;

export const CardSlider = styled.div`
  display: flex;
  gap: 1rem;
  animation: slide 20s linear infinite;

  &:hover {
    animation-play-state: paused;
  }

  @keyframes slide {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

export const CompanyCard = styled.div`
  flex: 0 0 auto;
  background: #fff;
  color: #111;
  border-radius: 6px;
  padding: 1rem;
  min-width: 350px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .card-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .company-logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .company-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #444;

      span:last-child {
        font-weight: bold;
        color: #111;
      }

      margin-bottom: 0.25rem;
    }
  }
`;

export const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const CompanyLogo = styled.img`
  width: 90px;
  height: 90px;
  object-fit: contain; /* fit entire image inside box */
  flex-shrink: 0;
  border-radius: 6px; /* optional: match card style */
  background-color: #fff; /* optional: for transparent logos */
  padding: 4px; /* optional: give some spacing inside */
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  color: #444;
`;

export const CardSubtitle = styled.p`
  margin: 0.25rem 0;
  font-weight: bold;
  font-size: 1rem;
  color: #000;
`;

/* Table Section */
export const TableSection = styled.section`
  background: #fff;
  border-radius: 10px;
  padding: clamp(1rem, 2vw, 2rem);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    font-size: clamp(1rem, 2vw, 1.5rem);
    font-family: Satoshi;
    font-weight: 700;
    font-style: Bold;
    font-size: 32px;
    line-height: 100%;
    letter-spacing: 0%;
    margin-bottom: 20px;
  }

  p {
    margin: 0.25rem 0 0;
    color: #666;
    font-size: 0.9rem;
    font-family: Satoshi;
    font-weight: 400;
    font-style: Regular;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: 0%;
  }

  span {
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: bold;
    color: #000;
    font-family: Satoshi;
    font-weight: 700;
    font-style: Bold;
    font-size: 32px;
    line-height: 100%;
    letter-spacing: 0%;
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  padding: 10px;
  border-radius: 7px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    font-size: clamp(0.8rem, 1vw, 0.95rem);
    transition:
      background 0.3s,
      color 0.3s; /* smooth transition */
  }

  thead {
    background: #2a5bd7;
    color: #fff;
  }

  tbody tr:nth-child(even) {
    background: #f9f9f9;
  }

  /* Hover effect */
  tbody tr td:hover {
    color: #2a5bd7; /* white text for contrast */
    cursor: pointer;
  }
`;
