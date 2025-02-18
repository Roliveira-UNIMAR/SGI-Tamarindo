import React from 'react';
import ClientsTable from './_components/ClientsTable';
import { Metadata } from 'next';
import { Breadcrumb } from 'antd';

export const metadata: Metadata = {
  title: "Clientes - SGI Tamarindo",
  description: "Panel administrativo del SGI Tamarindo",
};

const breadcrumbItems = [
  { title: 'Clientes' },
  { title: 'Listado' },
];

const ClientsPage: React.FC = () => {
  return (
    <>
      <Breadcrumb separator=">" items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <ClientsTable />
    </>
  );
};

export default ClientsPage;