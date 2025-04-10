"use client";

import React, { useState } from "react";
import { Badge, Breadcrumb, TableProps } from "antd";
import DataTable from "@/components/DataTable";
import ConsumptionNoteFormCreate from "./_components/ConsumptionNoteFormCreate";
import ConsumptionNoteFormUpdate from "./_components/ConsumptionNoteFormUpdate";
import { ConsumptionNote } from "@/types/consumptionNote";
import ConsumptionNoteDetail from "./_components/ConsumptionNoteDetail";

const breadcrumbItems = [{ title: "Notas de Consumo" }, { title: "Listado" }];

const getStatusBadge = (status: number) => {
  switch (status) {
    case 10:
      return <Badge status="success" text="Cancelada" />;
    case 9:
      return <Badge color="blue" text="Emitida" />;
    case 7:
      return <Badge color="orange" text="Pendiente" />;
    case 8:
      return <Badge status="error" text="Anulada" />;
    default:
      return <Badge status="default" text="Desconocido" />;
  }
};

const columns: TableProps<ConsumptionNote>["columns"] = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Lugar de emisión",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Cédula del cliente",
    dataIndex: "client_document",
    key: "client_document",
  },
  {
    title: "Status",
    dataIndex: "status_id",
    key: "status_id",
    render: (status_id) => getStatusBadge(status_id),
  },
];

const ConsumptionNotesPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedConsumptionNote, setSelectedConsumptionNote] = useState<ConsumptionNote | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Funciones para abrir y cerrar modales
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const openEditModal = (note: ConsumptionNote) => {
    setSelectedConsumptionNote(note);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedConsumptionNote(null);
    setRefreshKey((prev) => prev + 1);
  };

  const openDetailModal = (note: ConsumptionNote) => {
    setSelectedConsumptionNote(note);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedConsumptionNote(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Breadcrumb
        separator=">"
        items={breadcrumbItems}
        style={{ marginBottom: 16 }}
      />
      <DataTable<ConsumptionNote>
        key={refreshKey}
        endpoint="consumption-notes"
        columns={columns}
        filters={[{ key: "client_document", label: "Cédula" }]}
        createForm={() => (
          <ConsumptionNoteFormCreate
            isModalOpen={isCreateModalOpen}
            closeModal={closeCreateModal}
          />
        )}
        detailView={(record) => (
          <ConsumptionNoteDetail
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
        <ConsumptionNoteFormCreate
          isModalOpen={isCreateModalOpen}
          closeModal={closeCreateModal}
        />
      )}
      {isEditModalOpen && selectedConsumptionNote && (
        <ConsumptionNoteFormUpdate
          record={selectedConsumptionNote}
          isModalOpen={isEditModalOpen}
          closeModal={closeEditModal}
        />
      )}
      {isDetailModalOpen && selectedConsumptionNote && (
        <ConsumptionNoteDetail
          record={selectedConsumptionNote}
          isModalOpen={isDetailModalOpen}
          closeModal={closeDetailModal}
        />
      )}
    </>
  );
};

export default ConsumptionNotesPage;
