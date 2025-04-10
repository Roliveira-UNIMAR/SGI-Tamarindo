"use client";
import React, { useState, useEffect } from "react";
import {
  Steps,
  Form,
  Input,
  Button,
  Table,
  Typography,
  InputNumber,
  message,
  Alert,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useUpdateResource } from "@/hooks/dataHooks";
import { Order } from "@/types/order";

const { Step } = Steps;
const { Text } = Typography;

interface Supplier {
  id: number;
  name: string;
  document: string;
  phone: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  ordered_quantity: number;
  received_quantity: number;
}

interface OrderFormValues {
  id: number;
  supplier_id: number;
  ordered_at: string;
  status_id: number;
  order_details: Array<{
    product_id: number;
    product_name: string;
    ordered_quantity: number;
    received_quantity: number;
  }>;
}

const OrderFormUpdate = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: Order;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<OrderFormValues>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchSupplierDoc, setSearchSupplierDoc] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [isEditingSupplier, setIsEditingSupplier] = useState(false);

  const { execute: updateOrder, loading: updateLoading } =
    useUpdateResource<OrderFormValues>();

  useEffect(() => {
    const fetchSupplierDetails = async (supplierId: number) => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${baseURL}/api/suppliers/${supplierId}`);
        if (!response.ok) throw new Error("Error cargando proveedor");
        const data = await response.json();
        setSelectedSupplier(data);
      } catch (error) {
        console.error("Error fetching supplier:", error);
      }
    };

    if (record) {
      form.setFieldsValue({
        supplier_id: record.supplier_id,
        ordered_at: record.ordered_at
          ? dayjs(record.ordered_at).format("YYYY-MM-DD")
          : undefined,
        status_id: record.status_id,
      });
      fetchSupplierDetails(record.supplier_id);

      const formattedProducts = record.order_details.map((detail) => ({
        id: detail.product_id,
        name: detail.product_name,
        ordered_quantity: detail.ordered_quantity,
        received_quantity: detail.received_quantity || 0,
      }));

      setSelectedProducts(formattedProducts);
    }
  }, [record, form]);

  const handleSupplierSearch = async (value: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(
        `${baseURL}/api/suppliers?document=${value}`
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
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${baseURL}/api/products?name=${value}`);
      if (!response.ok) throw new Error("No se encontraron productos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setProducts([]);
      console.log(error);
    }
  };

  const handleAddProduct = (product: Product) => {
    if (selectedProducts.some((p) => p.id === product.id)) {
      message.warning("Este producto ya está en la lista");
      return;
    }
    setSelectedProducts([
      ...selectedProducts,
      { ...product, ordered_quantity: 1, received_quantity: 0 },
    ]);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleQuantityChange = (
    productId: number,
    newQuantity: number,
    field: "ordered_quantity" | "received_quantity"
  ) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [field]: newQuantity } : p))
    );
  };

  const handleSubmit = async (statusId: number) => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        status_id: statusId,
        order_details: selectedProducts.map((p) => ({
          product_id: p.id,
          product_name: p.name,
          ordered_quantity: p.ordered_quantity,
          received_quantity: p.received_quantity,
        })),
      };

      await updateOrder(`orders/${record.id}`, payload);
      message.success("Orden actualizada exitosamente");
      closeModal(); // Cierra el modal y refresca la tabla
    } catch (error) {
      message.error("Error al actualizar la orden");
      console.log("Error updating record: ", error);
    }
  };

  return (
    <Modal
      title="Actualizar Orden de Compra"
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
            <Button onClick={() => handleSubmit(7)} loading={updateLoading}>
              Guardar Cambios
            </Button>
          )}
        </>
      }
    >
      <div className="max-w-4xl mx-auto p-4">
        <Steps current={currentStep} className="mb-8">
          <Step title="Seleccionar Proveedor" />
          <Step title="Actualizar Productos" />
          <Step title="Revisar y Guardar" />
        </Steps>

        <Form form={form} layout="vertical">
          <Form.Item name="id" hidden>
            <Input type="hidden" />
          </Form.Item>

          {currentStep === 0 && (
            <div className="space-y-4">
              {selectedSupplier && !isEditingSupplier ? (
                <div className="p-4 border rounded">
                  <Text strong>{selectedSupplier.name}</Text>
                  <div>RIF: {selectedSupplier.document}</div>
                  <div>
                    Contactos: {selectedSupplier.phone} |{" "}
                    {selectedSupplier.email}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button type="primary" onClick={() => setCurrentStep(1)}>
                      Continuar
                    </Button>
                    <Button onClick={() => setIsEditingSupplier(true)}>
                      Cambiar Proveedor
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Input.Search
                    placeholder="Buscar proveedor por RIF"
                    enterButton={<SearchOutlined />}
                    onSearch={handleSupplierSearch}
                    onChange={(e) => setSearchSupplierDoc(e.target.value)}
                    className="w-full"
                  />

                  {suppliers.length > 0
                    ? suppliers.map((supplier) => (
                        <div key={supplier.id} className="p-4 border rounded">
                          <Text strong>{supplier.name}</Text>
                          <div>RIF: {supplier.document}</div>
                          <div>
                            Contactos: {supplier.phone} | {supplier.email}
                          </div>
                          <Button
                            onClick={() => {
                              form.setFieldValue("supplier_id", supplier.id);
                              setSelectedSupplier(supplier);
                              setIsEditingSupplier(false);
                              setCurrentStep(1);
                            }}
                            className="mt-2"
                          >
                            Seleccionar
                          </Button>
                        </div>
                      ))
                    : searchSupplierDoc && (
                        <Alert message="Proveedor no encontrado" type="error" />
                      )}
                </>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex gap-4">
              <div className="flex-1">
                <Input.Search
                  placeholder="Buscar un producto"
                  className="mb-4"
                  onSearch={handleProductSearch}
                />
                <Table
                  dataSource={products}
                  columns={[
                    { title: "Nombre", dataIndex: "name" },
                    {
                      title: "Acción",
                      render: (record: Product) => (
                        <Button onClick={() => handleAddProduct(record)}>
                          Agregar
                        </Button>
                      ),
                    },
                  ]}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </div>

              <div className="flex-1">
                <Table
                  dataSource={selectedProducts}
                  columns={[
                    { title: "Nombre", dataIndex: "name" },
                    {
                      title: "Cant. Ordenada",
                      dataIndex: "ordered_quantity",
                      render: (value: number, record: Product) => (
                        <InputNumber
                          className="w-full"
                          min={1}
                          value={record.ordered_quantity}
                          inputMode="numeric"
                          keyboard
                          onChange={(value) =>
                            handleQuantityChange(
                              record.id,
                              value || 1,
                              "ordered_quantity"
                            )
                          }
                        />
                      ),
                    },
                    {
                      title: "Cant. Recibida",
                      dataIndex: "received_quantity",
                      render: (_, record) => (
                        <InputNumber
                          min={0}
                          value={record.received_quantity}
                          className="w-full"
                          inputMode="numeric"
                          keyboard
                          onChange={(value) =>
                            handleQuantityChange(
                              record.id,
                              value || 0,
                              "received_quantity"
                            )
                          }
                        />
                      ),
                    },
                    {
                      title: "Acción",
                      render: (_, record) => (
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
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="p-4 border rounded">
                <Text strong>Detalles del proveedor</Text>
                {/* Buscar el proveedor seleccionado */}
                {suppliers.length > 0 &&
                  form.getFieldValue("supplier_id") &&
                  (() => {
                    const selectedSupplier = suppliers.find(
                      (s) => s.id === form.getFieldValue("supplier_id")
                    );
                    return selectedSupplier ? (
                      <div>
                        <div>Nombre: {selectedSupplier.name}</div>
                        <div>Documento: {selectedSupplier.document}</div>
                        <div>Teléfono: {selectedSupplier.phone}</div>
                        <div>Email: {selectedSupplier.email}</div>
                      </div>
                    ) : (
                      <Alert message="Proveedor no encontrado" type="error" />
                    );
                  })()}
              </div>

              <div className="p-4 border rounded">
                <Text strong>Detalles de la orden</Text>
                {selectedProducts.length > 0 ? (
                  <Table
                    dataSource={selectedProducts}
                    columns={[
                      { title: "Nombre", dataIndex: "name", key: "name" },
                      {
                        title: "Cantidad",
                        dataIndex: "ordered_quantity",
                        key: "ordered_quantity",
                      },
                    ]}
                    pagination={false}
                    rowKey="id"
                  />
                ) : (
                  <Alert message="No hay productos seleccionados" type="info" />
                )}
              </div>
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default OrderFormUpdate;
