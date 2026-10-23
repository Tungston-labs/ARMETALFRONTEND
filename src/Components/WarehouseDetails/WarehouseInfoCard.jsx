// import React from "react";

// import {
//   Card,
//   ImageWrapper,
//   WarehouseImage,
//   Content,
//   WarehouseName,
//   CompanyName,
//   Address,
// } from "./WarehouseInfoCard.styles";

// const WarehouseInfoCard = ({
//   image,
//   warehouseName,
//   companyName,
//   addressLine1,
//   addressLine2,
//   city,
// }) => {
//   return (
//     <Card>
//       <ImageWrapper>
//         <WarehouseImage
//           src={image}
//           alt={warehouseName || "Warehouse"}
//         />
//       </ImageWrapper>

//       <Content>
//         <WarehouseName>
//           {warehouseName}
//         </WarehouseName>

//         <CompanyName>
//           {companyName}
//         </CompanyName>

//         <Address>
//           {addressLine1}
//         </Address>

//         <Address>
//           {addressLine2}
//         </Address>

//         <Address>
//           {city}
//         </Address>
//       </Content>
//     </Card>
//   );
// };

// export default WarehouseInfoCard;

import React from "react";

import {
  Card,
  ImageWrapper,
  WarehouseImage,
  Content,
  WarehouseName,
  CompanyName,
  Address,
} from "./WarehouseInfoCard.styles";

const WarehouseInfoCard = ({
  image,
  warehouseName,
  companyName,
  addressLine1,
  addressLine2,
  city,
}) => {
  const getDisplayValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return String(value);
  };

  return (
    <Card>
      <ImageWrapper>
        <WarehouseImage
          src={image || "/warehouse-logo.png"}
          alt={warehouseName || "Warehouse"}
        />
      </ImageWrapper>

      <Content>
        <WarehouseName>{getDisplayValue(warehouseName)}</WarehouseName>

        <CompanyName>{getDisplayValue(companyName)}</CompanyName>

        <Address>{getDisplayValue(addressLine1)}</Address>

        <Address>{getDisplayValue(addressLine2)}</Address>

        <Address>{getDisplayValue(city)}</Address>
      </Content>
    </Card>
  );
};

export default WarehouseInfoCard;
