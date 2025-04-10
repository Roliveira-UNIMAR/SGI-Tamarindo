"use client";

import React, { useState } from "react";
import { Badge, Breadcrumb, TableProps } from "antd";
import DataTable from "@/components/DataTable";
import { Inventory } from "@/types/inventory";
import InventoryForm from "./_components/InventoryForm";
import InventoryDetail from "./_components/InventoryDetail";

const breadcrumbItems = [{ title: "Inventarios" }, { title: "Listado" }];

const getStatus = (is_available: boolean) => {
  return is_available ? (
    <Badge status="success" text="Disponible" />
  ) : (
    <Badge status="error" text="No Disponible" />
  );
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("es-ES").format(value);
};

const columns: TableProps<Inventory>["columns"] = [
  {
    title: "Producto",
    dataIndex: "product_name",
    key: "product_name",
  },
  {
    title: "Cantidad Disponible",
    dataIndex: "available_quantity",
    key: "available_quantity",
    width: 180,
    render: (value, record) => `${formatNumber(value)} ${record.unit_abbr}`,
  },
  {
    title: "Requiere Refrigeración",
    dataIndex: "requires_refrigeration",
    key: "requires_refrigeration",
    width: 180,
    render: (value) =>
      value ? (
        <Badge color="blue" text="Sí" />
      ) : (
        <Badge color="gray" text="No" />
      ),
  },
  {
    title: "Ubicación",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Estado",
    dataIndex: "is_available",
    key: "is_available",
    render: (is_available) => getStatus(is_available),
  },
];

const InventoryPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Funciones para abrir y cerrar modales
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const openEditModal = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedInventory(null);
    setRefreshKey((prev) => prev + 1);
  };

  const openDetailModal = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedInventory(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Breadcrumb separator=">" items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <DataTable<Inventory>
        key={refreshKey}
        endpoint="inventories"
        columns={columns}
        filters={[{ key: "product_name", label: "Producto" }]}
        createForm={() => (
          <InventoryForm isModalOpen={isCreateModalOpen} closeModal={closeCreateModal} />
        )}
        editForm={(record) => (
          <InventoryForm record={record} isModalOpen={isEditModalOpen} closeModal={closeEditModal} />
        )}
        detailView={(record) => (
          <InventoryDetail record={record} isModalOpen={isDetailModalOpen} closeModal={closeDetailModal} />
        )}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onView={openDetailModal}
      />

      {/* Modales fuera de la tabla para persistencia */}
      {isCreateModalOpen && (
        <InventoryForm isModalOpen={isCreateModalOpen} closeModal={closeCreateModal} />
      )}
      {isEditModalOpen && selectedInventory && (
        <InventoryForm record={selectedInventory} isModalOpen={isEditModalOpen} closeModal={closeEditModal} />
      )}
      {isDetailModalOpen && selectedInventory && (
        <InventoryDetail record={selectedInventory} isModalOpen={isDetailModalOpen} closeModal={closeDetailModal} />
      )}
    </>
  );
};

export default InventoryPage;
