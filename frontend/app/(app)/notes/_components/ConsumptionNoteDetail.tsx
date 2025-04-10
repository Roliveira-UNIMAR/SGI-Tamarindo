"use client";

import { useUpdateResource } from "@/hooks/dataHooks";
import type {
  ConsumptionNote,
  ConsumptionNoteDetail as ConsumptionNoteDetailType,
} from "@/types/consumptionNote";
import {
  Badge,
  Button,
  Descriptions,
  message,
  Modal,
  notification,
  Space,
  Table,
  TableProps,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const getStatus = (id: number) => {
  switch (id) {
    case 7:
      return <Badge color="orange" text="Pendiente" />;
    case 8:
      return <Badge status="error" text="Anulada" />;
    case 9:
      return <Badge color="blue" text="Emitida" />;
    case 10:
      return <Badge status="success" text="Cancelada" />;
    default:
      return <Badge status="default" text="Sin Estado" />;
  }
};

const formatDate = (date?: string) =>
  date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A";

const noteItems = (note: ConsumptionNote) => [
  { key: "1", label: "Id", children: note.id || "N/A" },
  { key: "2", label: "Cliente", children: note.client_name || "N/A" },
  {
    key: "3",
    label: "Documento Cliente",
    children: note.client_document || "N/A",
  },
  { key: "4", label: "Dirección", children: note.address || "N/A" },
  { key: "5", label: "Emitida el", children: formatDate(note.issued_at) },
  { key: "6", label: "Estado", children: getStatus(note.status_id) },
  { key: "7", label: "Anulada el", children: formatDate(note.cancelled_at) },
  {
    key: "8",
    label: "Emitido Por",
    children: note.user_name || "N/A",
  },
];

const columns: TableProps<ConsumptionNoteDetailType>["columns"] = [
  { title: "Nombre", dataIndex: "recipe_name", key: "recipe_name" },
  { title: "Cantidad", dataIndex: "quantity", key: "quantity" },
  {
    title: "Precio Unitario",
    dataIndex: "unit_price",
    key: "unit_price",
    render: (value) => `${(Number(value) || 0).toFixed(2)} $`,
  },
  {
    title: "Total",
    dataIndex: "total_price",
    key: "total_price",
    render: (value) => `${(Number(value) || 0).toFixed(2)} $`,
  },
];

const ConsumptionNoteDetail = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: ConsumptionNote;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/user`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener el usuario");
        }

        const user = await response.json();
        setRoleId(user.role_id);
      } catch (error) {
        message.error("Error al obtener el rol del usuario.");
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const { execute: updateConsumptionNote, loading: updateLoading } =
    useUpdateResource<ConsumptionNote>();

  const handleUpdateStatus = async (status_id: number) => {
    try {
      const updatedConsumptionNote = { ...record, status_id };

      await updateConsumptionNote("consumption-notes", updatedConsumptionNote);
      message.success("Nota de consumo actualizada correctamente");
      closeModal(); // Cerrar el modal después de actualizar
    } catch (error) {
      // Obtener el mensaje de error y convertirlo en array
      const errorMessageString = error instanceof Error ? error.message : "";
      const errorMessages = errorMessageString
        .split(",") // Dividir por comas
        .map((msg) => msg.trim()) // Limpiar espacios
        .filter((msg) => msg.length > 0); // Filtrar vacíos

      notification.error({
        message: "Error al procesar la solicitud",
        description: (
          <div>
            <ul>
              {errorMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        ),
        placement: "topRight",
        duration: 5,
      });
    }
  };

  return (
    <Modal
      title="Detalles de la Nota de Consumo"
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
      footer={
        <>
          {record.status_id === 7 && (
            <Button
              type="primary"
              style={{ marginTop: 16 }}
              loading={updateLoading}
              onClick={() => handleUpdateStatus(9)}
            >
              Emitir
            </Button>
          )}

          {record.status_id === 9 && (
            <Space className="mt-4" style={{ textAlign: "right" }}>
              <Button
                type="primary"
                danger
                onClick={() => handleUpdateStatus(8)}
                loading={updateLoading}
              >
                Anular
              </Button>
              {roleId === 8 && (
                <Button
                  type="primary"
                  onClick={() => handleUpdateStatus(10)}
                  loading={updateLoading}
                >
                  Registrar Pagada
                </Button>
              )}
            </Space>
          )}
        </>
      }
    >
      <Descriptions
        bordered
        column={2}
        items={noteItems(record)}
        style={{ marginBottom: 24 }}
        size="small"
      />

      {/* Sección de Totales */}
      <Descriptions
        bordered
        column={2}
        size="small"
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="Subtotal">
          ${Number(record.subtotal || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="Descuento">
          {Number(record.discount || 0)} %
        </Descriptions.Item>
        <Descriptions.Item label="Total">
          <b>${Number(record.total || 0).toFixed(2)}</b>
        </Descriptions.Item>
      </Descriptions>

      <Table<ConsumptionNoteDetailType>
        dataSource={record.note_details}
        columns={columns}
        rowKey="recipe_id"
        size="small"
      />
    </Modal>
  );
};

export default ConsumptionNoteDetail;
