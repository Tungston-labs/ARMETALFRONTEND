import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 10px;
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;

  /* padding: 1.5rem; */
`;

export const CardHeader = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  /* margin-bottom: 1rem; */
  color: #304EB0;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const ErrorText = styled.p`
  font-size: 0.75rem;
  color: red;
  margin-top: 3px;
`;

// export const FileInput = styled.input`
//   margin-top: 0.5rem;
// `;

export const SaveButton = styled.button`
  padding: 10px 16px;
  background: #304EB0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
`;

export const PreviewBox = styled.div`
  margin: 8px 0;
  width: 220px;
  min-height: 120px;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
`;

export const PdfLink = styled.a`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1d4ed8;
  text-decoration: underline;
`;

export const UploadButton = styled.label`
  display: inline-block;
  padding: 8px 14px;
  background: #0f172a;
  color: #fff;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;

  &:hover {
    background: #020617;
  }
`;

export const FileInput = styled.input`
  display: none;
`;
 export const TableWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px;
  border-bottom: 2px solid #d1d5db;
`;

export const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
`;

// export const Input = styled.input`
//   padding: 6px 10px;
//   border-radius: 6px;
//   border: 1px solid #d1d5db;
//   width: 100%;
//   &:focus {
//     outline: none;
//     border-color: #3b82f6;
//   }
// `;

export const AddButton = styled.button`
  margin-top: 12px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #2563eb;
  }
`;

export const SaveBtn = styled.button`
  padding: 8px 16px;
  background: #304EB0;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #243d8f;
  }
`;