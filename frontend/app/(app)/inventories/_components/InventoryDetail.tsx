import { useState } from "react";
import { Badge, Descriptions, Modal, Button, Form, InputNumber, Input } from "antd";
import { Inventory } from "@/types/inventory";
import { useUpdateResource } from "@/hooks/dataHooks";

const getStatus = (isAvailable: boolean) => {
  return isAvailable ? (
    <Badge status="success" text="Disponible" />
  ) : (
    <Badge status="error" text="No Disponible" />
  );
};

const getRefrigerationStatus = (requiresRefrigeration: boolean) => {
  return requiresRefrigeration ? (
    <Badge status="processing" text="Requiere Refrigeración" />
  ) : (
    <Badge status="default" text="No requiere" />
  );
};

const inventoryItems = (inventory: Inventory) => [
  {
    key: "1",
    label: "Producto",
    children: inventory.product_name,
  },
  {
    key: "2",
    label: "Ubicación",
    children: inventory.address || "No especificado",
  },
  {
    key: "3",
    label: "Cantidad Disponible",
    children: inventory.available_quantity,
  },
  {
    key: "4",
    label: "Unidad de Medida",
    children: inventory.unit_abbr || "No especificado",
  },
  {
    key: "5",
    label: "Stock Mínimo",
    children: inventory.min_stock_level ?? "No definido",
  },
  {
    key: "6",
    label: "Stock Máximo",
    children: inventory.max_stock_level ?? "No definido",
  },
  {
    key: "7",
    label: "Punto de Reorden",
    children: inventory.reorder_point ?? "No definido",
  },
  {
    key: "8",
    label: "Dirección",
    children: inventory.address || "No especificada",
  },
  {
    key: "9",
    label: "Estado",
    children: getStatus(inventory.is_available),
  },
  {
    key: "10",
    label: "Refrigeración",
    children: getRefrigerationStatus(inventory.requires_refrigeration),
  },
];

const InventoryDetail = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: Inventory;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { execute: updateInventory, loading: updating } = useUpdateResource<Inventory>();

  const handleAdjustSubmit = async (
    values: Pick<Inventory, "available_quantity" | "concept">
  ) => {
    try {
      await updateInventory("inventories", {
        ...record,
        available_quantity: values.available_quantity,
        transaction_type: "ajuste",
        concept: values.concept,
      });

      setIsAdjustModalOpen(false);
      form.resetFields(); // Solo se resetea si la operación fue exitosa
    } catch (error) {
      console.error("Error al ajustar inventario:", error);
    }
  };


  return (
    <>
      {/* Modal de Detalles */}
      <Modal
        title="Detalles del Inventario"
        centered
        open={isModalOpen}
        onCancel={closeModal}
        destroyOnClose
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
        footer={[
          <Button
            key="adjust"
            type="primary"
            onClick={() => setIsAdjustModalOpen(true)}
          >
            Ajustar Inventario
          </Button>,
        ]}
      >
        <Descriptions bordered column={2} items={inventoryItems(record)} />
      </Modal>

      {/* Modal de Ajuste */}
      <Modal
        title="Ajustar Inventario"
        centered
        open={isAdjustModalOpen}
        onCancel={() => {
          setIsAdjustModalOpen(false);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsAdjustModalOpen(false)}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={updating}
          >
            Guardar
          </Button>,
        ]}
        destroyOnClose
      >
        <Form
          form={form}
          initialValues={{ available_quantity: record.available_quantity }}
          onFinish={handleAdjustSubmit}
        >
          <Form.Item label="Producto">
            <span>{record.product_name}</span>
          </Form.Item>

          <Form.Item label="Cantidad Actual">
            <span>{record.available_quantity}</span>
          </Form.Item>

          <Form.Item
            label="Nueva Cantidad"
            name="available_quantity"
            rules={[
              { required: true, message: "Ingrese la nueva cantidad" },
              {
                type: "number",
                min: 0,
                message: "La cantidad no puede ser negativa",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="concept" label="Razón del Ajuste">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default InventoryDetail;
