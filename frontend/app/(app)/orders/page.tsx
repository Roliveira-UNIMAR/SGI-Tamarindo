"use client";

import React, { useState } from "react";
import { Badge, Breadcrumb, TableProps } from "antd";
import DataTable from "@/components/DataTable";
import { Order } from "@/types/order";
import OrderFormCreate from "./_components/OrderFormCreate";
import OrderFormUpdate from "./_components/OrderFormUpdate";
import OrderDetail from "./_components/OrderDetail";
import dayjs from "dayjs";
import { useAuth } from "@/hooks/auth";

const breadcrumbItems = [{ title: "Ordenes" }, { title: "Listado" }];

const getStatus = (id: number) => {
  switch (id) {
    case 3:
      return <Badge color="blue" text="Enviada" />;
    case 4:
      return <Badge status="processing" text="Recibida" />;
    case 5:
      return <Badge status="processing" color="yellow" text="Retrasada" />;
    case 6:
      return <Badge status="success" text="Verificada" />;
    case 7:
      return <Badge color="orange" text="Pendiente" />;
    case 8:
      return <Badge status="error" text="Anulada" />;
    default:
      return <Badge status="default" text="Sin Estado" />;
  }
};

const formatDate = (date?: string) =>
  date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A";

const columns: TableProps<Order>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Ordenado por",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "Enviado a",
    dataIndex: "supplier_name",
    key: "supplier_name",
  },
  {
    title: "Creado el",
    dataIndex: "created_at",
    key: "created_at",
    render: (create_at) => formatDate(create_at),
  },
  {
    title: "Estado",
    dataIndex: "status_id",
    key: "status_id",
    render: (status_id) => getStatus(status_id),
  },
];

const OrdersPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth({ middleware: "auth" });

  // Funciones para abrir y cerrar modales
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedOrder(null);
    setRefreshKey((prev) => prev + 1);
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Breadcrumb separator=">" items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <DataTable<Order>
        key={refreshKey}
        endpoint="orders"
        columns={columns}
        filters={[{ key: "supplier_document", label: "RIF" }]}
        createForm={() => (
          <OrderFormCreate user={user} isModalOpen={isCreateModalOpen} closeModal={closeCreateModal} />
        )}
        editForm={(record) => (
          <OrderFormUpdate record={record} isModalOpen={isEditModalOpen} closeModal={closeEditModal} />
        )}
        detailView={(record) => (
          <OrderDetail record={record} isModalOpen={isDetailModalOpen} closeModal={closeDetailModal} />
        )}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onView={openDetailModal}
      />

      {/* Modales fuera de la tabla para persistencia */}
      {isCreateModalOpen && (
        <OrderFormCreate user={user} isModalOpen={isCreateModalOpen} closeModal={closeCreateModal} />
      )}
      {isEditModalOpen && selectedOrder && (
        <OrderFormUpdate record={selectedOrder} isModalOpen={isEditModalOpen} closeModal={closeEditModal} />
      )}
      {isDetailModalOpen && selectedOrder && (
        <OrderDetail record={selectedOrder} isModalOpen={isDetailModalOpen} closeModal={closeDetailModal} />
      )}
    </>
  );
};

export default OrdersPage;

