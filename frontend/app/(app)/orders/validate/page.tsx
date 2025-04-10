"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, Button, Modal, InputNumber, message, Alert, Space, Popconfirm } from "antd";
import dayjs from "dayjs";
import { Order, OrderDetail } from "@/types/order";
import { useFetchResource, useUpdateResource } from "@/hooks/dataHooks";
import Title from "antd/es/typography/Title";

const formatDate = (date?: string) =>
  date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A";

const OrdenValidate = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [validationModal, setValidationModal] = useState(false);
  const [modifiedDetails, setModifiedDetails] = useState<OrderDetail[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  // Paso 1: Obtener función de refresco desde useFetchResource
  const { data: orderData, loading: orderLoading, refetch: refetchOrders } = useFetchResource<Order[]>("orders?status_id=4");

  useEffect(() => {
    if (orderData) {
      setOrders(orderData);
    }
  }, [orderData]);

  useEffect(() => {
    if (orderId && orders) {
      const order = orders.find((o) => o.id.toString() === orderId);
      if (order) {
        setSelectedOrder(order);
        setModifiedDetails(order.order_details.map((detail) => ({ ...detail })));
        setValidationModal(true);
      }
    }
  }, [orderId, orders]);

  const handleQuantityChange = (productId: number, newValue: number | null) => {
    setModifiedDetails((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, received_quantity: newValue ?? 0 }
          : item
      )
    );
  };

  const hasDiscrepancy = modifiedDetails.some(
    (d) => d.received_quantity !== d.ordered_quantity
  );

  const { execute: updateOrder, loading: updateLoading } =
    useUpdateResource<Order>();

  const handleValidation = async () => {
    if (!selectedOrder) return;

    try {
      selectedOrder.order_details = modifiedDetails;
      selectedOrder.status_id = 6;

      await updateOrder("orders", selectedOrder);

      // Paso 2: Refrescar datos y limpiar parámetro de URL
      await refetchOrders(); // Actualiza la lista de órdenes
      message.success("Orden validada exitosamente.");
      closeModal();
    } catch (error) {
      message.error("Error al validar la orden.");
      console.error(error);
    }
  };

  const closeModal = () => {
    // Paso 3: Limpiar query params al cerrar
    router.replace("/orders/validate"); // Ajusta la ruta según tu estructura
    setValidationModal(false);
    setSelectedOrder(null);
    setModifiedDetails([]);
  };

  // Aquí es donde se agrega la confirmación de Popconfirm
  const handleConfirmValidation = () => {
    const hasZeroReceived = modifiedDetails.some(
      (detail) => detail.received_quantity === 0
    );
    if (hasZeroReceived) {
      Modal.confirm({
        title: "Alerta",
        content: "Existen productos con cantidad recibida igual a 0. ¿Deseas continuar con la validación?",
        onOk: handleValidation,
        onCancel: () => {
          message.info("Validación cancelada.");
        },
      });
    } else {
      handleValidation();
    }
  };

  return (
    <>
      <Title level={4} style={{ marginBottom: 24, textAlign: "start" }}>
        Validar Recepción de Insumos
      </Title>

      <Table
        dataSource={orders || []}
        rowKey="id"
        size="small"
        loading={orderLoading}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Proveedor", dataIndex: "supplier_name" },
          {
            title: "Fecha Orden",
            dataIndex: "ordered_at",
            render: (date) => formatDate(date),
          },
          {
            title: "Acciones",
            render: (_, record) => (
              <Button
                type="primary"
                onClick={() => router.push(`/orders/validate?id=${record.id}`)}
              >
                Validar
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title="Validar Recepción"
        open={validationModal}
        onCancel={closeModal}
        width={800}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={closeModal}>Cerrar</Button>
            <Popconfirm
              title="¿Estás seguro de que deseas validar esta orden?"
              onConfirm={handleConfirmValidation}
              onCancel={() => message.info("La validación ha sido cancelada.")}
            >
              <Button type="primary" loading={updateLoading}>
                Validar
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        {hasDiscrepancy && (
          <Alert
            message="Hay discrepancias en la cantidad recibida. Por favor notificarlas."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          dataSource={modifiedDetails}
          rowKey="product_id"
          pagination={false}
          size="small"
          columns={[
            {
              title: "Producto",
              dataIndex: "product_name",
              width: "40%",
            },
            {
              title: "Cant. Ordenada",
              dataIndex: "ordered_quantity",
              width: "20%",
            },
            {
              title: "Medida",
              dataIndex: "unit_name",
              width: "20%",
            },
            {
              title: "Cant. Recibida",
              width: "20%",
              render: (_, record) => (
                <InputNumber
                  min={0}
                  value={record.received_quantity}
                  className="w-full"
                  inputMode="numeric"
                  keyboard
                  onChange={(value) => handleQuantityChange(record.product_id, value)}
                />
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default OrdenValidate;
