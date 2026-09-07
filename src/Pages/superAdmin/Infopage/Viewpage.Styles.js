import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  background-color: white;
  padding: 20px;
`;

export const HRManager = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
export const SearchInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;


export const Header = styled.div`
  // display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  font-size: 22px;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
`;

export const FormWrapper = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  // margin-top: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  h4{
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
font-size: 22px;

line-height: 100%;
letter-spacing: 0%;

  }
`;

// export const FormSection = styled.div`
//   display: flex;
//   gap: 40px;
//   flex-wrap: wrap;
//   margin-bottom: 20px;

//   & > div {
//     flex: 1;
//     min-width: 250px;
//   }
// `;

// export const Input = styled.input`
//   display: block;
//   margin-bottom: 15px;
//   padding: 10px;
//   width: 100%;
//   border-radius: 4px;
//   border: 1px solid #ccc;
// `;

export const CheckboxGroup = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;

  input {
    margin-right: 8px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  padding: 10px 25px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  background-color: ${props => props.cancel ? '#FF230480' : '#5c5c8a'};

  &:hover {
    opacity: 0.9;
  }
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;


export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  img {
    height: 50px;
  }

  .left > div {
    display: flex;
    flex-direction: column;
  }
`;
export const BackHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px; /* space between icon and text */
  font-size: 20px;
  font-weight: 600;

  svg {
    font-size: 22px;
  }
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  
`;

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80%;
`;

export const FormSection = styled.div`
  display: flex;
  gap: 100px;
  margin-top: 2rem;

  > div {
    width: 50%;
  }
`;
export const BlockSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const BlockText = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme, blocked }) => (blocked ? "#d32f2f" : "#2e7d32")};
`;

export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 58px;
  height: 30px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #4caf50;
    transition: 0.3s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #f44336;
  }

  input:checked + .slider:before {
    transform: translateX(28px);
  }
`;