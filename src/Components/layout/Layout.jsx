// src/Pages/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { Container, ContentArea } from './Layout.styles';

const LayOut = () => {
  return (
    <Container>
      <Sidebar />
      <ContentArea>
        <Outlet />
      </ContentArea>
    </Container>
  );
};

export default LayOut;
