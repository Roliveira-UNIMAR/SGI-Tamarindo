"use client";
import React, { useRef, useState } from "react";
import {
  Steps,
  Form,
  Input,
  Button,
  Table,
  Modal,
  Alert,
  Typography,
  InputNumber,
  message,
  Space,
  TableProps,
} from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useStoreResource } from "@/hooks/dataHooks";
import { pdf } from "@react-pdf/renderer";
import OrderPDF from "./OrderPDF";
import FileSaver from "file-saver";
import { User } from "@/types/user";

const { Step } = Steps;
const { Text } = Typography;

interface Supplier {
  id: number;
  name: string;
  document: string;
  phone: string;
  email: string;
}

interface Inventory {
  id: number;
  product_name: string;
  available_quantity: number;
  max_stock_level: number;
  unit_abbr: string;
  ordered_quantity: number;
  unit_name: string;
}

interface OrderFormValues {
  supplier_id: number;
  ordered_at: string;
  status_id: number;
  order_details: Array<{
    product_id: string;
    product_name: string;
    ordered_quantity: number;
    unit_name: string;
  }>;
}

const OrderCreatePage = ({
  isModalOpen,
  closeModal,
  user,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  user: User;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<OrderFormValues>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Inventory[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Inventory[]>([]);
  const [searchSupplierDoc, setSearchSupplierDoc] = useState("");
  const [showCreateSupplier, setShowCreateSupplier] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const pendingConfirmations = useRef<Set<string>>(new Set());

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSupplierSearch = async (value: string) => {
    try {
      const response = await fetch(
        `${baseURL}/api/suppliers?name=${value}`
      );
      if (!response.ok) throw new Error("Proveedor no encontrado");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      setSuppliers([]);
      console.log(error);
    }
  };

  const handleProductSearch = async (value: string) => {
    try {
      const response = await fetch(
        `${baseURL}/api/inventories?product_name=${value}`
      );
      if (!response.ok) throw new Error("No se encontraron productos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setProducts([]);
      console.log(error);
    }
  };

  const productColumns: TableProps<Inventory>["columns"] = [
    {
      title: "ID",
      dataIndex: "product_id",
      key: "product_id",
      width: 40,
    },
    {
      title: "Nombre",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Stock Disp.",
      dataIndex: "available_quantity",
      key: "available_quantity",
      render: (_, record) => `${record.available_quantity} ${record.unit_abbr}`,
    },
    {
      title: "Stock Max.",
      dataIndex: "max_stock_level",
      key: "max_stock_level",
      render: (_, record) => `${record.max_stock_level} ${record.unit_abbr}`,
    },
    {
      title: "Acción",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleAddProduct(record)}>Añadir</Button>
      ),
    },
  ];

  const handleAddProduct = (product: Inventory) => {
    if (selectedProducts.some((p) => p.id === product.id)) {
      message.warning("Este producto ya está agregado.");
      return;
    }
    setSelectedProducts([
      ...selectedProducts,
      { ...product, ordered_quantity: 1 },
    ]);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (pendingConfirmations.current.has(productId.toString())) return;

    const product = selectedProducts.find((p) => p.id === productId);

    if (product) {
      const maxAllowed = product.max_stock_level - product.available_quantity;

      if (newQuantity > maxAllowed) {
        pendingConfirmations.current.add(productId.toString());
        showConfirmModal(productId, newQuantity);
      } else {
        updateProductQuantity(productId, newQuantity);
      }
    }
  };

  const showConfirmModal = (productId: number, newQuantity: number) => {
    modal.confirm({
      title: "Confirmar Cambio",
      icon: <ExclamationCircleOutlined />,
      content:
        "La cantidad solicitada supera el stock máximo recomendado. ¿Desea continuar?",
      okText: "Confirmar",
      cancelText: "Cancelar",
      onOk: () => {
        updateProductQuantity(productId, newQuantity);
        pendingConfirmations.current.delete(productId.toString());
      },
      onCancel: () => {
        pendingConfirmations.current.delete(productId.toString());
      },
    });
  };

  const updateProductQuantity = (productId: number, newQuantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, ordered_quantity: newQuantity } : p
      )
    );
  };

  const { execute: storeOrder, loading: storeLoading } =
    useStoreResource<OrderFormValues>();

  const handleSubmit = async (statusId: number) => {
    try {
      const values = await form.validateFields();
      const supplierId = form.getFieldValue("supplier_id");

      if (!supplierId) {
        message.error("Debe seleccionar un proveedor.");
        return;
      }

      const payload = {
        ...values,
        supplier_id: supplierId,
        status_id: statusId,
        ordered_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        order_details: selectedProducts.map((p) => ({
          product_id: p.id.toString(),
          product_name: p.product_name,
          ordered_quantity: p.ordered_quantity,
          unit_name: p.unit_name,
        })),
      };

      await storeOrder("orders", payload);
      message.success("Orden creada exitosamente");

      if (statusId === 3) {
        const supplier = suppliers.find((s) => s.id === supplierId);
        if (supplier) {
          const doc = (
            <OrderPDF
              userFullName={user.full_name}
              supplier={supplier}
              order={payload}
            />
          );
          const blob = await pdf(doc).toBlob();
          FileSaver.saveAs(
            blob,
            `Orden_${supplier.id}_${new Date().toLocaleDateString()}.pdf`
          );
        }
      }

      closeModal();
    } catch (error) {
      message.error("Error al crear la orden");
      console.error("Error creando la orden: ", error);
    }
  };

  return (
    <Modal
      title="Crear Orden de Compra"
      centered
      open={isModalOpen}
      onCancel={closeModal}
      destroyOnClose
      width={{
        xs: "90%",
        sm: "90%",
        md: "90%",
        lg: "80%",
        xl: "70%",
        xxl: "60%",
      }}
      footer={
        <>
          <div className="mt-4 flex justify-between">
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Anterior
              </Button>
            )}
            {currentStep === 1 && (
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Siguiente
              </Button>
            )}
            {currentStep === 2 && (
              <Space>
                <Button onClick={() => handleSubmit(7)} loading={storeLoading}>
                  Guardar Pendiente
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleSubmit(3)}
                  loading={storeLoading}
                >
                  Enviar Orden
                </Button>
              </Space>
            )}
          </div>
        </>
      }
    >
      <div className="max-w-6xl mx-auto p-4">
        {contextHolder}
        <Steps current={currentStep} className="mb-8">
          <Step title="Seleccionar Proveedor" />
          <Step title="Agregar Productos" />
          <Step title="Revisar Orden" />
        </Steps>

        <Form form={form} layout="vertical">
          {currentStep === 0 && (
            <div className="space-y-4">
              <Input.Search
                placeholder="Buscar proveedor por nombre"
                enterButton={<SearchOutlined />}
                onSearch={handleSupplierSearch}
                onChange={(e) => {
                  setSearchSupplierDoc(e.target.value);
                  if (!e.target.value.trim()) setSuppliers([]);
                }}
                className="w-full"
                autoFocus
              />

              {suppliers.length > 0
                ? suppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className="p-4 border rounded flex justify-between items-center"
                    >
                      <div>
                        <Text strong>{supplier.name}</Text>
                        <div>RIF: {supplier.document}</div>
                        <div>
                          Contacto: {supplier.phone} | {supplier.email}
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          form.setFieldValue("supplier_id", supplier.id);
                          setCurrentStep(1);
                        }}
                      >
                        Seleccionar
                      </Button>
                    </div>
                  ))
                : searchSupplierDoc && (
                    <Alert
                      message="Proveedor no encontrado"
                      type="info"
                    />
                  )}

              <Modal
                title="Nuevo Proveedor"
                open={showCreateSupplier}
                onCancel={() => setShowCreateSupplier(false)}
                footer={null}
              >
                <p>Trabajando en ello</p>
              </Modal>
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex gap-4">
              <div className="flex-1">
                <Input.Search
                  placeholder="Buscar producto por nombre"
                  className="mb-4"
                  onSearch={handleProductSearch}
                  onChange={(e) => {
                    if (!e.target.value.trim()) setProducts([]);
                  }}
                  autoFocus
                />
                <Table
                  dataSource={products}
                  columns={productColumns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{ y: 150 }}
                />
              </div>

              <div className="flex-1">
                <Table
                  dataSource={selectedProducts}
                  columns={[
                    {
                      title: "Producto",
                      dataIndex: "product_name",
                      key: "product_name",
                    },
                    {
                      title: "Cantidad",
                      dataIndex: "ordered_quantity",
                      render: (value: number, record: Inventory) => (
                        <InputNumber
                          min={1}
                          value={value}
                          className="w-full"
                          onChange={(newValue) =>
                            handleQuantityChange(record.id, newValue || 1)
                          }
                        />
                      ),
                    },
                    {
                      title: "Medida",
                      dataIndex: "unit_name",
                    },
                    {
                      title: "Acción",
                      render: (_, record: Inventory) => (
                        <Button
                          danger
                          onClick={() => handleRemoveProduct(record.id)}
                        >
                          Eliminar
                        </Button>
                      ),
                    },
                  ]}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{ y: 150 }}
                  style={{ marginTop: 48 }}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="p-4 border rounded">
                <Text strong>Detalles del Proveedor</Text>
                {suppliers.map(
                  (supplier) =>
                    supplier.id === form.getFieldValue("supplier_id") && (
                      <div key={supplier.id} className="mt-2">
                        <div>Nombre: {supplier.name}</div>
                        <div>RIF: {supplier.document}</div>
                        <div>Teléfono: {supplier.phone}</div>
                        <div>Email: {supplier.email}</div>
                      </div>
                    )
                )}
              </div>

              <div className="p-4 border rounded">
                <Text strong>Detalles de la Orden</Text>
                <Table
                  dataSource={selectedProducts}
                  columns={[
                    {
                      title: "Producto",
                      dataIndex: "product_name",
                      key: "product_name",
                    },
                    {
                      title: "Cantidad",
                      dataIndex: "ordered_quantity",
                      key: "ordered_quantity",
                      render: (value, record) => `${value} ${record.unit_name}`,
                    },
                  ]}
                  pagination={false}
                  size="small"
                  className="mt-4"
                  rowKey="id"
                />
              </div>
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default OrderCreatePage;
