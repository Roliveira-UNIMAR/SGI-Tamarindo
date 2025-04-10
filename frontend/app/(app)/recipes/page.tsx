"use client";

import React, { useState } from "react";
import { Breadcrumb, TableProps } from "antd";
import DataTable from "@/components/DataTable";
import { Recipe } from "@/types/recipe";
import RecipeFormUpdate from "./_components/RecipeFormUpdate";
import RecipeDetail from "./_components/RecipeDetail";
import RecipeFormCreate from "./_components/RecipeFormCreate";

const breadcrumbItems = [{ title: "Recetas" }, { title: "Listado" }];

const columns: TableProps<Recipe>["columns"] = [
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
    title: "Descripción",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Precio",
    dataIndex: "price",
    key: "price",
    align: "center",
    render: (value) => `${Number(value).toFixed(2)} $`,
  },
];

const RecipesPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Funciones para abrir y cerrar modales
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const openEditModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRecipe(null);
    setRefreshKey((prev) => prev + 1);
  };

  const openDetailModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRecipe(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Breadcrumb
        separator=">"
        items={breadcrumbItems}
        style={{ marginBottom: 16 }}
      />
      <DataTable<Recipe>
        key={refreshKey}
        endpoint="recipes"
        columns={columns}
        filters={[{ key: "name", label: "Nombre de la receta" }]}
        createForm={() => (
          <RecipeFormCreate
            isModalOpen={isCreateModalOpen}
            closeModal={closeCreateModal}
          />
        )}
        editForm={(record) => (
          <RecipeFormUpdate
            record={record}
            isModalOpen={isEditModalOpen}
            closeModal={closeEditModal}
          />
        )}
        detailView={(record) => (
          <RecipeDetail
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
        <RecipeFormCreate
          isModalOpen={isCreateModalOpen}
          closeModal={closeCreateModal}
        />
      )}
      {isEditModalOpen && selectedRecipe && (
        <RecipeFormUpdate
          record={selectedRecipe}
          isModalOpen={isEditModalOpen}
          closeModal={closeEditModal}
        />
      )}
      {isDetailModalOpen && selectedRecipe && (
        <RecipeDetail
          record={selectedRecipe}
          isModalOpen={isDetailModalOpen}
          closeModal={closeDetailModal}
        />
      )}
    </>
  );
};

export default RecipesPage;
