import React from 'react';
import ProductsTable from './_components/ProductsTable';
import { Metadata } from 'next';
import { Breadcrumb } from 'antd';

export const metadata: Metadata = {
  title: "Productos - SGI Tamarindo",
  description: "Panel administrativo del SGI Tamarindo",
};

const breadcrumbItems = [
  { title: 'Productos' },
  { title: 'Listado' },
];

const ProductsPage: React.FC = () => {
  return (
    <>
      <Breadcrumb separator=">" items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <ProductsTable />
    </>
  );
};

export default ProductsPage;