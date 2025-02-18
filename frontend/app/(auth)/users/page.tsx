import React from 'react';
import UsersTable from './_components/UsersTable';
import { Metadata } from 'next';
import { Breadcrumb } from 'antd';

export const metadata: Metadata = {
  title: "Usuarios - SGI Tamarindo",
  description: "Panel administrativo del SGI Tamarindo",
};

const breadcrumbItems = [
  { title: 'Usuarios' },
  { title: 'Listado' },
];

const UsersPage: React.FC = () => {
  return (
    <>
      <Breadcrumb separator=">" items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <UsersTable />
    </>
  );
};

export default UsersPage;