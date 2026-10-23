import styled from "styled-components";

export const ProfileContainer = styled.div`
  margin-bottom: 0px;
`;

export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;

  /* Large screens */
  @media (min-width: 1440px) {
    padding: 28px;
  }

  /* Tablets */
  @media (max-width: 1024px) {
    padding: 18px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const BackArrowWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;

  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
  }
`;

export const ProfileImageWrapper = styled.div`
  position: relative;
  align-self: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }

  /* Full HD */
  @media (min-width: 1920px) {
    margin-bottom: 25px;
  }

  /* 2K */
  @media (min-width: 2560px) {
    margin-bottom: 30px;
  }

  /* 4K */
  @media (min-width: 3840px) {
    margin-bottom: 40px;
  }
`;


export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  cursor: ${({ editable }) => (editable ? "pointer" : "default")};
  border: 2px solid #1034ad;


  @media (max-width: 1024px) {
    width: 100px;
    height: 100px;
  }

  
  @media (max-width: 768px) {
    width: 85px;
    height: 85px;
  }


  @media (min-width: 1920px) {
    width: 150px;
    height: 150px;
    border-width: 3px;
  }

 
  @media (min-width: 2560px) {
    width: 180px;
    height: 180px;
    border-width: 3px;
  }


  @media (min-width: 3840px) {
    width: 220px;
    height: 220px;
    border-width: 4px;
  }
`;


export const UserIconWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ editable }) => (editable ? "pointer" : "default")};

  @media (max-width: 1024px) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 768px) {
    width: 85px;
    height: 85px;
  }
`;

export const PlusIconWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #1034ad;
  color: #fff;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 4px;
  }
`;

export const ContentArea = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const LeftColumn = styled.div`
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const RightColumn = styled.div`
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const InputBox = styled.input`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
 color: #111111ff;
  &:focus {
    outline: none;
    border-color: #1034ad;
    box-shadow: 0 0 0 2px rgba(16, 52, 173, 0.2);
  }

  /* 📱 Mobile (0–480px) */
  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 8px 10px;
  }

  /* 📱 Tablet Portrait (481–768px) */
  @media (max-width: 768px) and (min-width: 481px) {
    font-size: 0.9rem;
    padding: 9px 10px;
  }

  /* 💻 Small Laptops (769–1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 0.95rem;
    padding: 10px 12px;
  }
  @media (min-width: 1025px) {
    font-size: 0.9rem;
    padding: 10px 12px;
  }
  /* 🖥 Full HD (1920px) */
  @media (min-width: 1920px) {
    font-size: 1rem;
    padding: 12px 14px;
  }

  /* 🖥 2K (2560px) */
  @media (min-width: 2560px) {
    font-size: 1.25rem;
    padding: 14px 18px;
  }

  /* 🖥 4K (3840px) */
  @media (min-width: 3840px) {
    font-size: 1.5rem;
    padding: 16px 20px;
    border-radius: 10px;
  }
`;


export const BioBox = styled.textarea`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-height: 90px;
  resize: vertical;
  font-size: 1rem;
  color: #111111ff;
  &:focus {
    outline: none;
    border-color: #1034ad;
    box-shadow: 0 0 0 2px rgba(16, 52, 173, 0.2);
  }



  /* 📱 Tablet Portrait (481–768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.9rem;
    padding: 9px 10px;
    min-height: 75px;
  }

  /* 💻 Small Laptops (769–1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 0.95rem;
    padding: 10px 12px;
    min-height: 85px;
  }
  @media (min-width: 1025px) {
    font-size: 0.9rem;
    padding: 10px 12px;
  }
  /* 🖥 Full HD (1920px) */
  @media (min-width: 1920px) {
    font-size: 1.1rem;
    padding: 12px 14px;
    min-height: 110px;
  }

  @media (min-width: 2560px) {
    font-size: 1.25rem;
    padding: 14px 18px;
    min-height: 120px;
  }


  @media (min-width: 3840px) {
    font-size: 1.4rem;
    padding: 16px 20px;
    border-radius: 10px;
    min-height: 150px;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 1250px) {
    flex-direction: column;
    gap: 8px;
  }
`;
