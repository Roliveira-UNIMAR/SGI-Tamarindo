"use client";

import React, { useState } from "react";
import { Badge, Breadcrumb, TableProps } from "antd";
import DataTable from "@/components/DataTable";
import { InventoryTransaction } from "@/types/inventoryTransaction";
import TransactionForm from "./_components/TransactionForm";
import TransactionDetail from "./_components/TransactionDetail";

const breadcrumbItems = [{ title: "Inventarios" }, { title: "Transacciones" }];

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("es-ES").format(value);
};

const columns: TableProps<InventoryTransaction>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Producto",
    dataIndex: "product_name",
    key: "product_name",
  },
  {
    title: "Cantidad",
    dataIndex: "quantity",
    key: "quantity",
    render: (value, record) => `${formatNumber(value)} ${record.unit_name}`,
  },
  {
    title: "Tipo",
    dataIndex: "transaction_type",
    key: "transaction_type",
    render: (value) => <Badge color="blue" text={value} />,
  },
  {
    title: "Concepto",
    dataIndex: "notes",
    key: "notes",
  },
  {
    title: "Fecha",
    dataIndex: "transaction_date",
    key: "transaction_date",
  },
];

const TransactionsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<InventoryTransaction | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Funciones para abrir y cerrar modales
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => {
      setIsCreateModalOpen(false);
      setRefreshKey((prev) => prev + 1);
    };

    const openEditModal = (transaction: InventoryTransaction) => {
      setSelectedTransaction(transaction);
      setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
      setRefreshKey((prev) => prev + 1);
    };

    const openDetailModal = (transaction: InventoryTransaction) => {
      setSelectedTransaction(transaction);
      setIsDetailModalOpen(true);
    };
    const closeDetailModal = () => {
      setIsDetailModalOpen(false);
      setSelectedTransaction(null);
      setRefreshKey((prev) => prev + 1);
    };

  return (
    <>
      <Breadcrumb separator=">" items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <DataTable<InventoryTransaction>
        key={refreshKey}
        endpoint="inventory-transactions"
        columns={columns}
        createForm={() => (
          <TransactionForm isModalOpen={isCreateModalOpen} closeModal={closeCreateModal} />
        )}
        editForm={(record) => (
          <TransactionForm record={record} isModalOpen={isEditModalOpen} closeModal={closeEditModal} />
        )}
        detailView={(record) => (
          <TransactionDetail record={record} isModalOpen={isDetailModalOpen} closeModal={closeDetailModal} />
        )}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onView={openDetailModal}
      />

      {/* Modales fuera de la tabla para persistencia */}
      {isCreateModalOpen && (
        <TransactionForm isModalOpen={isCreateModalOpen} closeModal={closeCreateModal} />
      )}
      {isEditModalOpen && selectedTransaction && (
        <TransactionForm record={selectedTransaction} isModalOpen={isEditModalOpen} closeModal={closeEditModal} />
      )}
      {isDetailModalOpen && selectedTransaction && (
        <TransactionDetail record={selectedTransaction} isModalOpen={isDetailModalOpen} closeModal={closeDetailModal} />
      )}
    </>
  );
};

export default TransactionsPage;
