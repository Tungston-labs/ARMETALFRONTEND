// AddEmployee.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
 font-family: Satoshi;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
  }

  p {
    font-size: 0.9rem;
    color: #888;
  }
`;

export const RoleBadge = styled.div`
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.85rem;
  box-shadow: 0 0 3px rgba(0,0,0,0.1);
`;

export const TopRightButton = styled.button`
  background-color: #2c3e94;
  color: white;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
`;

export const ProfileSection = styled.div`
  margin: 1rem 0;
`;

export const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

export const Row = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Input = styled.input`
  padding: 0.6rem 1rem;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #aaa;
  font-size: 0.9rem;
  
`;

export const Select = styled.select`
  padding: 0.6rem 1rem;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #aaa;
  font-size: 0.9rem;
`;

export const Tabs = styled.div`
  display: flex;
  margin: 2rem 0 1rem;
  border-bottom: 1px solid #ccc;
`;

export const Tab = styled.div`
  padding: 0.8rem 1.5rem;
  border-bottom: ${({ active }) => (active ? '3px solid #2c3e94' : 'none')};
  color: ${({ active }) => (active ? '#2c3e94' : '#444')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  cursor: pointer;
`;

export const SectionTitle = styled.h4`
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #222;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export const NextButton = styled.button`
  background-color: #1e244d;
  color: white;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #101738;
  }
`;
