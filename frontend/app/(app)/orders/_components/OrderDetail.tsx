"use client"

import type { Order, OrderDetail as OrderDetailType } from "@/types/order";
import {
  Badge,
  Button,
  Descriptions,
  Modal,
  Table,
  TableProps,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useUpdateResource } from "@/hooks/dataHooks";

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

const infoBasic = (order: Order) => [
  { key: "1", label: "Nro. de Orden", children: order.id },
  { key: "2", label: "Creada el", children: formatDate(order.created_at) },
];

const orderItems = (order: Order) => [
  {
    key: "1",
    label: "RIF proveedor",
    children: order.supplier_document || "N/A",
  },
  { key: "2", label: "Razón Social", children: order.supplier_name || "N/A" },
  { key: "3", label: "Realizada Por", children: order.user_name || "N/A" },
  { key: "4", label: "Enviada el", children: formatDate(order.ordered_at) },
  { key: "5", label: "Recibida el", children: formatDate(order.received_at) },
];

const columns: TableProps<OrderDetailType>["columns"] = [
  { title: "Nombre", dataIndex: "product_name", key: "product_name" },
  {
    title: "Cant. Ordenada",
    dataIndex: "ordered_quantity",
    key: "ordered_quantity",
  },
  {
    title: "Cant. Recibida",
    dataIndex: "received_quantity",
    key: "received_quantity",
    render: (value) => value ?? 0,
  },
  {
    title: "Diferencia",
    key: "difference",
    render: (_, record) => {
      const received = record.received_quantity ?? 0;
      const ordered = record.ordered_quantity;
      const diff = ordered - received;
      
      // Ocultar si no hay diferencia o si la cantidad recibida es 0
      if (diff === 0 || received === 0) return null;
      
      const sign = diff > 0 ? '-' : '+';
      return `${sign}${Math.abs(diff)}`;
    },
  }
];

const OrderDetail = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: Order;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const router = useRouter();
  const { execute: updateOrder, loading: updateLoading } =
    useUpdateResource<Order>();

  const handleUpdateStatus = async (status_id: number) => {
    try {
      const updatedOrder = { ...record, status_id };

      if (status_id === 3) {
        updatedOrder.ordered_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
      }

      if (status_id === 4) {
        updatedOrder.received_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
      }

      await updateOrder("orders", updatedOrder);
      message.success("Orden actualizada correctamente");
      closeModal(); // Cerrar el modal después de actualizar
    } catch (error) {
      message.error("Error al actualizar la orden");
      console.error(error);
    }
  };

  return (
    <Modal
      title="Detalles de la Orden"
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
          {/* Botón para enviar la orden */}
          {record.status_id === 7 && (
            <Button
              type="primary"
              style={{ marginTop: 16 }}
              loading={updateLoading}
              onClick={() => handleUpdateStatus(3)}
            >
              Enviar
            </Button>
          )}

          {/* Botón para cambiar a "Recibida" */}
          {record.status_id === 3 && (
            <Button
              type="primary"
              style={{ marginTop: 16 }}
              loading={updateLoading}
              onClick={() => handleUpdateStatus(4)}
            >
              Recibir Orden
            </Button>
          )}

          {/* Botón para validar la orden si está "Recibida" */}
          {record.status_id === 4 && (
            <Button
              type="primary"
              style={{ marginTop: 16, marginLeft: 8 }}
              onClick={() => router.push(`/orders/validate?id=${record.id}`)}
            >
              Validar Orden
            </Button>
          )}
        </>
      }
    >
      <Descriptions
        bordered
        size="small"
        style={{ marginBottom: 24 }}
        items={infoBasic(record)}
      />
      <Descriptions
        bordered
        column={2}
        size="small"
        style={{ marginBottom: 24 }}
        items={orderItems(record)}
      />

      <Table<OrderDetailType>
        dataSource={record.order_details}
        columns={columns.filter(col => {
          if (col.key !== 'difference') return true;
          
          // Mostrar columna diferencia solo si hay al menos un registro con diferencia
          return record.order_details?.some(detail => {
            const received = detail.received_quantity ?? 0;
            const diff = detail.ordered_quantity - received;
            return diff !== 0 && received !== 0;
          });
        })}
        rowKey="product_id"
        size="small"
      />

      <Descriptions
        bordered
        column={2}
        items={[
          { key: "1", label: "Status", children: getStatus(record.status_id) },
        ]}
        size="small"
      />
    </Modal>
  );
};

export default OrderDetail;
