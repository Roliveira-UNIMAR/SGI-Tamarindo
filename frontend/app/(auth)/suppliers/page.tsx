import React from 'react';
import SuppliersTable from './_components/SuppliersTable';
import { Metadata } from 'next';
import { Breadcrumb } from 'antd';

export const metadata: Metadata = {
  title: "Proveedores - SGI Tamarindo",
  description: "Panel administrativo del SGI Tamarindo",
};

const breadcrumbItems = [
  { title: 'Proveedores' },
  { title: 'Listado' },
];

const SuppliersPage: React.FC = () => {
  return (
    <>
      <Breadcrumb separator=">" items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <SuppliersTable />
    </>
  );
};

export default SuppliersPage;