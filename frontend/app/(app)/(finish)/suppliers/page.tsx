"use client";

import React, { useState } from "react";
import { Breadcrumb, TableProps } from "antd";
import DataTable from "@/components/DataTable";
import { Supplier } from "@/types/supplier";
import SupplierForm from "./_components/SupplierForm";
import SupplierDetail from "./_components/SupplierDetail";

const breadcrumbItems = [{ title: "Proveedores" }, { title: "Listado" }];

// const getStatus = (id: number) => {
//   switch (id) {
//     case 1:
//       return <Badge status="success" text="Activo" />;
//     case 2:
//       return <Badge status="default" text="Inactivo" />;
//   }
// };

const columns: TableProps<Supplier>["columns"] = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "RIF",
    dataIndex: "document",
    key: "document",
  },
];

const SuppliersPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Funciones para abrir y cerrar modales
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
    setRefreshKey((prev) => prev + 1);
  };

  const openDetailModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <>
      <Breadcrumb
        separator=">"
        items={breadcrumbItems}
        style={{ marginBottom: 16 }}
      />
      <DataTable<Supplier>
        key={refreshKey}
        endpoint="suppliers"
        columns={columns}
        filters={[
          { key: "name", label: "Nombre" },
          { key: "document_number", label: "RIF" },
        ]}
        createForm={() => (
          <SupplierForm
            isModalOpen={isCreateModalOpen}
            closeModal={closeCreateModal}
          />
        )}
        editForm={(record) => (
          <SupplierForm
            record={record}
            isModalOpen={isEditModalOpen}
            closeModal={closeEditModal}
          />
        )}
        detailView={(record) => (
          <SupplierDetail
            record={record}
            isModalOpen={isDetailModalOpen}
            closeModal={closeDetailModal}
          />
        )}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onView={openDetailModal}
      />

      {/* Modales fuera de la tabla para persistencia */}
      {isCreateModalOpen && (
        <SupplierForm
          isModalOpen={isCreateModalOpen}
          closeModal={closeCreateModal}
        />
      )}
      {isEditModalOpen && selectedSupplier && (
        <SupplierForm
          record={selectedSupplier}
          isModalOpen={isEditModalOpen}
          closeModal={closeEditModal}
        />
      )}
      {isDetailModalOpen && selectedSupplier && (
        <SupplierDetail
          record={selectedSupplier}
          isModalOpen={isDetailModalOpen}
          closeModal={closeDetailModal}
        />
      )}
    </>
  );
};

export default SuppliersPage;
