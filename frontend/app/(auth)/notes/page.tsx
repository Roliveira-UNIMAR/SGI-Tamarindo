import React from 'react';
import NotesTable from './_components/NotesTable';
import { Metadata } from 'next';
import { Breadcrumb } from 'antd';

export const metadata: Metadata = {
  title: "Notas de Consumo - SGI Tamarindo",
  description: "Panel administrativo del SGI Tamarindo",
};

const breadcrumbItems = [
  { title: 'Notas de Consumo' },
  { title: 'Listado' },
];

const NotesPage: React.FC = () => {
  return (
    <>
      <Breadcrumb separator=">" items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <NotesTable />
    </>
  );
};

export default NotesPage;