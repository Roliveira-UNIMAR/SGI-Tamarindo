import { useState } from "react";
import {
  Steps,
  Form,
  Input,
  Button,
  Table,
  message,
  InputNumber,
  Typography,
  Modal,
  Select,
} from "antd";
import { useStoreResource } from "@/hooks/dataHooks";
import { InventoryTransaction } from "@/types/inventoryTransaction";

const { Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

interface Product {
  id: string;
  name: string;
  quantity: number;
  unit_name: string;
}

interface TransactionFormValues {
  inventory_id: number;
  transaction_type: string;
  quantity: number;
  user_id: number;
  transaction_date: string;
  notes: string;
  products_details: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
  }>;
}

const InventoryTransactionForm = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record?: InventoryTransaction;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<TransactionFormValues>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleProductSearch = async (value: string) => {
    try {
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
      message.warning("Este producto ya está agregado.");
      return;
    }
    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const { execute: storeTransaction, loading: storeLoading } =
    useStoreResource<TransactionFormValues>();

  const handleSubmit = async (values: TransactionFormValues) => {
    if (selectedProducts.length === 0) {
      message.error("Agrega al menos un producto.");
      return;
    }

    try {
      const payload: TransactionFormValues = {
        ...values,
        transaction_type: "salida",
        products_details: selectedProducts.map((p) => ({
          product_id: p.id,
          product_name: p.name,
          quantity: p.quantity,
        })),
      };

      await storeTransaction("inventory-transactions", payload);
      message.success("Transacción registrada exitosamente.");
      setSelectedProducts([]);
      closeModal();
    } catch (error) {
      message.error("Error al registrar la transacción.");
      console.error(error);
    }
  };

  return (
    <Modal
      title="Registar Salida"
      centered
      open={isModalOpen}
      onCancel={closeModal} // Cierra el modal correctamente
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
          {currentStep === 0 && (
            <Button
              type="primary"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Siguiente
            </Button>
          )}
          {currentStep === 1 && (
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={storeLoading}
            >
              Registrar
            </Button>
          )}
        </>
      }
    >
      <div className="max-w-4xl mx-auto p-4">
        <Steps current={currentStep} className="mb-8">
          <Step title="Seleccionar Productos" />
          <Step title="Revisar Salida" />
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={record}
        >
          {currentStep === 0 && (
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
                  columns={[
                    { title: "Nombre", dataIndex: "name", key: "name" },
                    { title: "Medida", dataIndex: "unit_name" },
                    {
                      title: "Acción",
                      key: "action",
                      render: (record: Product) => (
                        <Button onClick={() => handleAddProduct(record)}>
                          Añadir
                        </Button>
                      ),
                    },
                  ]}
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
                    { title: "Producto", dataIndex: "name" },
                    {
                      title: "Cantidad",
                      dataIndex: "quantity",
                      render: (value: number, record: Product) => (
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
                    { title: "Medida", dataIndex: "unit_name" },
                    {
                      title: "Acción",
                      render: (record: Product) => (
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

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="p-4 border rounded">
                <Text strong>Detalles de la transacción</Text>
                <Table
                  dataSource={selectedProducts}
                  columns={[
                    { title: "Producto", dataIndex: "name" },
                    {
                      title: "Cantidad",
                      dataIndex: "quantity",
                      render: (value, record) => (`${value} ${record.unit_name}`),
                    },
                  ]}
                  pagination={false}
                  size="small"
                  className="mt-4"
                  rowKey="id"
                />
              </div>
              <div>
                <Form.Item
                  label="Tipo de Transacción"
                  name="notes"
                  rules={[{ required: true, message: "Seleccione" }]}
                >
                  <Select placeholder="Seleccione el concepto de salida">
                    <Option value="Desayuno">Desayuno</Option>
                    <Option value="Comida del personal">
                      Comida del Personal
                    </Option>
                    <Option value="Desperdicio">Desperdicio</Option>
                    <Option value="Merma">Merma</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default InventoryTransactionForm;
