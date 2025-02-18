import React from 'react';
import OrdersTable from './_components/OrdersTable';
import { Metadata } from 'next';
import { Breadcrumb } from 'antd';

export const metadata: Metadata = {
  title: "Ordenes - SGI Tamarindo",
  description: "Panel administrativo del SGI Tamarindo",
};

const breadcrumbItems = [
  { title: 'Ordenes' },
  { title: 'Listado' },
];

const OrdersPage: React.FC = () => {
  return (
    <>
      <Breadcrumb separator=">" items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <OrdersTable />
    </>
  );
};

export default OrdersPage;