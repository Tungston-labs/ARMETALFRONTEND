import React from "react";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiPackage,
} from "react-icons/fi";

import {
  Card,
  Item,
  Icon,
  Content,
  Label,
  Value,
} from "./WarehouseContactCard.styles";

const WarehouseContactCard = ({
  manager,
  phoneNumber,
  email,
  storageCapacity,
}) => {
  return (
    <Card>
      <Item>
        <Icon>
          <FiUser size={16} />
        </Icon>

        <Content>
          <Label>Manager</Label>
          <Value>{manager}</Value>
        </Content>
      </Item>

      <Item>
        <Icon>
          <FiPhone size={16} />
        </Icon>

        <Content>
          <Label>Phone Number</Label>
          <Value>{phoneNumber}</Value>
        </Content>
      </Item>

      <Item>
        <Icon>
          <FiMail size={16} />
        </Icon>

        <Content>
          <Label>Email ID</Label>
          <Value>{email}</Value>
        </Content>
      </Item>

      <Item>
        <Icon>
          <FiPackage size={16} />
        </Icon>

        <Content>
          <Label>Storage Capacity</Label>
          <Value>{storageCapacity}</Value>
        </Content>
      </Item>
    </Card>
  );
};

export default WarehouseContactCard;