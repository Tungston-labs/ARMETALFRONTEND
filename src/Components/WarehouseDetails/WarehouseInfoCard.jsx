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
  return (
    <Card>
      <ImageWrapper>
        <WarehouseImage
          src={image}
          alt={warehouseName || "Warehouse"}
        />
      </ImageWrapper>

      <Content>
        <WarehouseName>
          {warehouseName}
        </WarehouseName>

        <CompanyName>
          {companyName}
        </CompanyName>

        <Address>
          {addressLine1}
        </Address>

        <Address>
          {addressLine2}
        </Address>

        <Address>
          {city}
        </Address>
      </Content>
    </Card>
  );
};

export default WarehouseInfoCard;