"use client";

import React from "react";
import { Descriptions, Modal, Table } from "antd";
import { Recipe } from "@/types/recipe";

const RecipeDetail  = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: Recipe;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  // Asegurarnos de que la receta tenga ingredientes
  const ingredientsColumns = [
    { title: "Nombre", dataIndex: "product_name" },
    { title: "Cantidad", dataIndex: "quantity" },
    { title: "Unidad", dataIndex: "unit_name" },
  ];

  return (
    <Modal
      title="Detalles de la Receta"
      centered
      open={isModalOpen}
      onCancel={closeModal} // Cierra el modal correctamente
      destroyOnClose
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Id">{record.id}</Descriptions.Item>
        <Descriptions.Item label="Nombre">{record.name}</Descriptions.Item>
        <Descriptions.Item label="Descripción">
          {record.description || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Precio">
          ${Number(record.price).toFixed(2)}
        </Descriptions.Item>
      </Descriptions>

      {/* Tabla de Ingredientes */}
      <Table
        dataSource={record.recipe_ingredients || []} // Asegurarse de que los ingredientes existan
        columns={ingredientsColumns}
        rowKey="product_id"
        pagination={false}
        size="small"
        className="mt-4"
      />
    </Modal>
  );
};

export default RecipeDetail;
