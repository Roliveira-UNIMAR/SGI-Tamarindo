"use client";

import React, { useState } from "react";
import { Breadcrumb, TableProps } from "antd";
import DataTable from "@/components/DataTable";
import { Client } from "@/types/client";
import ClientForm from "./_components/ClientForm";
import ClientDetail from "./_components/ClientDetail";

const breadcrumbItems = [{ title: "Usuarios" }, { title: "Listado" }];

// const getStatus = (id: number) => {
//   switch (id) {
//     case 1:
//       return <Badge status="success" text="Activo" />;
//     case 2:
//       return <Badge status="default" text="Inactivo" />;
//   }
// };

const columns: TableProps<Client>["columns"] = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Nombre",
    dataIndex: "full_name",
    key: "full_name",
  },
  {
    title: "Cédula",
    dataIndex: "document",
    key: "document",
  },
];

const ClientsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Funciones para abrir y cerrar modales
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClient(null);
    setRefreshKey((prev) => prev + 1);
  };

  const openDetailModal = (client: Client) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <>
      <Breadcrumb
        separator=">"
        items={breadcrumbItems}
        style={{ marginBottom: 16 }}
      />
      <DataTable<Client>
        key={refreshKey}
        endpoint="clients"
        columns={columns}
        filters={[
          { key: "full_name", label: "Nombre/Apellido" },
          { key: "document_number", label: "Cédula" },
        ]}
        createForm={() => (
          <ClientForm
            isModalOpen={isCreateModalOpen}
            closeModal={closeCreateModal}
          />
        )}
        editForm={(record) => (
          <ClientForm
            record={record}
            isModalOpen={isEditModalOpen}
            closeModal={closeEditModal}
          />
        )}
        detailView={(record) => (
          <ClientDetail
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
        <ClientForm
          isModalOpen={isCreateModalOpen}
          closeModal={closeCreateModal}
        />
      )}
      {isEditModalOpen && selectedClient && (
        <ClientForm
          record={selectedClient}
          isModalOpen={isEditModalOpen}
          closeModal={closeEditModal}
        />
      )}
      {isDetailModalOpen && selectedClient && (
        <ClientDetail
          record={selectedClient}
          isModalOpen={isDetailModalOpen}
          closeModal={closeDetailModal}
        />
      )}
    </>
  );
};

export default ClientsPage;
