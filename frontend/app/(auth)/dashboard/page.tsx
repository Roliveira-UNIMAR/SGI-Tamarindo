import { Col, Row } from 'antd';
import React from 'react';
import DashboardCard from './_components/DashboardCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard - SGI Tamarindo",
  description: "Panel administrativo del SGI Tamarindo",
};

const App: React.FC = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <DashboardCard title="Total Productos" value="5000" />
      </Col>
      <Col span={6}>
        <DashboardCard title="Proveedores" value="200" />
      </Col>
      <Col span={6}>
        <DashboardCard title="Órdenes Pendientes" value="150" />
      </Col>
      <Col span={6}>
        <DashboardCard title="Valor Total del Inventario" value="$1,000,000" />
      </Col>
      <Col span={6}>
        <DashboardCard title="Usuarios" value="1500" />
      </Col>
      <Col span={6}>
        <DashboardCard title="Ventas" value="$20,000" />
      </Col>
      <Col span={6}>
        <DashboardCard title="Pedidos" value="300" />
      </Col>
    </Row>
  );
};

export default App;