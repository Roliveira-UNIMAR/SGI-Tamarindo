"use client";

import React, { useState } from "react";
import { Badge, Breadcrumb, TableProps } from "antd";
import DataTable from "@/components/DataTable";
import { User } from "@/types/user";
import UserForm from "./_components/UserForm";
import UserDetail from "./_components/UserDetail";
// import UserDetail from "./_components/UserDetail";

const breadcrumbItems = [
  { title: 'Usuarios' },
  { title: 'Listado' },
];

const getStatus = (id: number) => {
  switch (id) {
    case 1:
      return <Badge status="success" text="Activo" />;
    case 2:
      return <Badge status="default" text="Inactivo" />;
  }
};

const columns: TableProps<User>["columns"] = [
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
  {
    title: "Status",
    dataIndex: "status_id",
    key: "status_id",
    render: (status_id) => getStatus(status_id),
  },
];

const UsersPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Funciones para abrir y cerrar modales
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setRefreshKey((prev) => prev + 1);
  };

  const openDetailModal = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <Breadcrumb
        separator=">"
        items={breadcrumbItems}
        style={{ marginBottom: 16 }}
      />
      <DataTable<User>
        key={refreshKey}
        endpoint="users"
        columns={columns}
        filters={[
          { key: "full_name", label: "Nombre/Apellido" },
          { key: "document_number", label: "Cédula" },
        ]}
        createForm={() => (
          <UserForm
            isModalOpen={isCreateModalOpen}
            closeModal={closeCreateModal}
          />
        )}
        editForm={(record) => (
          <UserForm
            record={record}
            isModalOpen={isEditModalOpen}
            closeModal={closeEditModal}
          />
        )}
        detailView={(record) => (
          <UserDetail
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
        <UserForm
          isModalOpen={isCreateModalOpen}
          closeModal={closeCreateModal}
        />
      )}
      {isEditModalOpen && selectedUser && (
        <UserForm
          record={selectedUser}
          isModalOpen={isEditModalOpen}
          closeModal={closeEditModal}
        />
      )}
      {isDetailModalOpen && selectedUser && (
        <UserDetail
          record={selectedUser}
          isModalOpen={isDetailModalOpen}
          closeModal={closeDetailModal}
        />
      )}
    </>
  );
};

export default UsersPage;

