import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  background-color: white;
`;

export const Section = styled.div`
  margin-top: 15px;
`;

export const Label = styled.label`
  color: #333;
  margin-bottom: 5px;
  display: block;
    font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 14px;
line-height: 100%;
letter-spacing: 0%;

`;


export const Hr = styled.hr`
  margin: 10px 0;
  border: 0.5px solid #ccc;
`;

export const Rowes = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  /* margin-bottom: 10px; */
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Input = styled.input`
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  padding: 6px 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: white;
`;

export const FullPageLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export const ResponsiveH3 = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 20px;
`;

/* ---------------- Cards ---------------- */
export const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  /* padding: 20px; */
  margin-bottom: 20px;
`;

export const CardHeader = styled.div`
 font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 100%;
letter-spacing: 0%;
margin-bottom: 15px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
export const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// export const Label = styled.label`
//   font-size: 0.9rem;
//   font-weight: 600;
//   color: #334155;
// `;

export const PreviewBox = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    width: 100px;
    height: 70px;
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UploadButton = styled.label`
  display: inline-block;
  padding: 8px 14px;
  background: #1e293b;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;
  transition: all 0.2s ease;

  &:hover {
    background: #0f172a;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;