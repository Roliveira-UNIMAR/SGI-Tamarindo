"use client";
import React, { useState } from "react";
import {
  Steps,
  Form,
  Input,
  Button,
  Table,
  Alert,
  message,
  Typography,
  InputNumber,
  Descriptions,
  Select,
  Modal,
  Space,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useStoreResource } from "@/hooks/dataHooks";
import { Client } from "@/types/client";

const { Step } = Steps;
const { Text } = Typography;

interface Recipe {
  id: string;
  name: string;
  category_name: string;
  price: number;
  quantity: number;
}

interface ConsumptionNoteFormValues {
  client_id: number;
  note_details: Array<{
    recipe_id: string;
    recipe_name: string;
    quantity: number;
    unit_price: number;
  }>;
  subtotal: number;
  discount?: number;
  total: number;
}

const ConsumptionNoteFormCreate = ({
  isModalOpen,
  closeModal,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [searchClientDoc, setSearchClientDoc] = useState("");
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [form] = Form.useForm<ConsumptionNoteFormValues>();

  // Buscar clientes en la API
  const handleClientSearch = async (value: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(
        `${baseURL}/api/clients?document_number=${value}`
      );
      if (!response.ok) throw new Error("Client not found");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      setClients([]);
      console.log(error);
    }
  };

  // Buscar productos/recetas en la API
  const handleRecipeSearch = async (value: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${baseURL}/api/recipes?search=${value}`);
      if (!response.ok) throw new Error("No se encontraron productos/recetas");
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      setRecipes([]);
      console.log(error);
    }
  };

  const itemColumns = [
    { title: "Nombre", dataIndex: "name" },
    { title: "Categoria", dataIndex: "category_name" },
    { title: "Precio", dataIndex: "price" },
    {
      title: "Acción",
      render: (record: Recipe) => (
        <Button onClick={() => handleAddRecipe(record)}>Añadir</Button>
      ),
    },
  ];

  const calculateTotals = () => {
    const subtotal = selectedRecipes.reduce(
      (acc, recipe) => acc + recipe.price * (recipe.quantity || 0),
      0
    );
    const discount = form.getFieldValue("discount") || 0;
    const total = subtotal - Number((subtotal * Number(discount)) / 100);
    setSubTotal(subtotal);
    setTotal(total);

    if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Agregar un producto/receta a la nota de consumo
  const handleAddRecipe = (recipe: Recipe) => {
    if (selectedRecipes.some((i) => i.id === recipe.id)) {
      message.warning("Este ítem ya está agregado.");
      return;
    }
    setSelectedRecipes([...selectedRecipes, { ...recipe, quantity: 1 }]);
  };

  // Eliminar un ítem
  const handleRemoveRecipe = (recipeId: string) => {
    setSelectedRecipes(selectedRecipes.filter((i) => i.id !== recipeId));
  };

  // Cambiar cantidad de un ítem
  const handleQuantityChange = (recipeId: string, newQuantity: number) => {
    setSelectedRecipes((prev) =>
      prev.map((i) => (i.id === recipeId ? { ...i, quantity: newQuantity } : i))
    );
  };

  const { execute: storeConsumptionNote, loading: storeLoading } =
    useStoreResource<ConsumptionNoteFormValues>();

  // Guardar la nota de consumo
  const handleSubmit = async (statusId: number) => {
    try {
      await form.validateFields();
      const clientId = form.getFieldValue("client_id");

      if (!clientId) {
        message.error("Debe seleccionar un cliente.");
        return;
      }

      const payload = {
        ...form.getFieldsValue(),
        client_id: clientId,
        status_id: statusId,
        note_details: selectedRecipes.map((i) => ({
          recipe_id: i.id,
          recipe_name: i.name,
          quantity: i.quantity,
          unit_price: Number(i.price),
        })),
      };

      console.log("Enviando nota de consumo:", payload);
      await storeConsumptionNote("consumption-notes", payload);

      message.success("Nota de consumo creada exitosamente");
      closeModal(); // Cierra el modal y refresca la tabla
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Error desconocido.");
      console.log(error);
    }
  };

  return (
    <Modal
      title="Crear Nota de Consumo"
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
          <div className="mt-4 flex justify-between">
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Anterior
              </Button>
            )}
            {currentStep === 1 && (
              <Button type="primary" onClick={() => calculateTotals()}>
                Siguiente
              </Button>
            )}
            {currentStep === 2 && (
              <Space className="mt-4" style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  onClick={() => handleSubmit(7)}
                  loading={storeLoading}
                >
                  Guardar Pendiente
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleSubmit(9)}
                  loading={storeLoading}
                >
                  Emitir
                </Button>
              </Space>
            )}
          </div>
        </>
      }
    >
      <div className="max-w-4xl mx-auto p-4">
        <Steps current={currentStep} className="mb-8">
          <Step title="Seleccionar Cliente" />
          <Step title="Agregar Ítems" />
          <Step title="Revisar Nota" />
        </Steps>

        <Form form={form} layout="vertical" initialValues={{ discount: 0 }}>
          {currentStep === 0 && (
            <div className="space-y-4">
              <Input.Search
                placeholder="Buscar cliente por Cédula"
                enterButton={<SearchOutlined />}
                onSearch={handleClientSearch}
                onChange={(e) => setSearchClientDoc(e.target.value)}
              />

              {clients.length > 0
                ? clients.map((client) => (
                    <div key={client.id} className="p-4 border rounded">
                      <Text strong>{client.full_name}</Text>
                      <div>Cédula: {client.document}</div>
                      <Button
                        onClick={() => {
                          form.setFieldValue("client_id", client.id);
                          setCurrentStep(1);
                        }}
                      >
                        Seleccionar
                      </Button>
                    </div>
                  ))
                : searchClientDoc && (
                    <Alert
                      message="Cliente no encontrado"
                      type="info"
                    />
                  )}

              <Modal
                title="Crear Nuevo Proveedor"
                open={showCreateClient}
                onCancel={() => setShowCreateClient(false)}
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
                  placeholder="Buscar una recetas o categorias"
                  className="mb-4"
                  onSearch={handleRecipeSearch}
                  onChange={(e) => {
                    if (!e.target.value) setRecipes([]); // Si se borra el texto, vacía la tabla
                  }}
                  autoFocus
                />
                <Table
                  dataSource={recipes}
                  columns={itemColumns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{ y: 150 }}
                />
              </div>

              <div className="flex-1">
                <Table
                  dataSource={selectedRecipes}
                  columns={[
                    { title: "Nombre", dataIndex: "name" },
                    {
                      title: "Cantidad",
                      dataIndex: "quantity",
                      render: (_, record) => (
                        <InputNumber
                          className="w-full"
                          min={1}
                          keyboard
                          value={record.quantity}
                          onChange={(value) =>
                            handleQuantityChange(record.id, value || 1)
                          }
                        />
                      ),
                    },
                    {
                      title: "Acción",
                      render: (record: Recipe) => (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveRecipe(record.id)}
                        />
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
            <div>
              <Table
                dataSource={selectedRecipes}
                columns={[
                  { title: "Nombre", dataIndex: "name" },
                  { title: "Cantidad", dataIndex: "quantity" },
                  { title: "Precio Unitario", dataIndex: "price" },
                  {
                    title: "Total",
                    render: (_, record) =>
                      `$ ${(record.quantity * record.price).toFixed(2)}`,
                  },
                ]}
                rowKey="id"
                pagination={false}
                size="small"
              />

              <Descriptions bordered column={1} size="small" className="mt-4">
                <Descriptions.Item label="Subtotal">
                  ${subTotal.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Descuento">
                  <Form.Item name="discount" noStyle>
                    <InputNumber
                      min={0}
                      max={100}
                      step={0.01}
                      decimalSeparator="."
                      formatter={(value) =>
                        `${value} %`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      onChange={calculateTotals}
                    />
                  </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="Total">
                  <Typography.Text strong>${total.toFixed(2)}</Typography.Text>
                </Descriptions.Item>
              </Descriptions>

              <Form.Item name="address" className="mt-4" required>
                <Select placeholder="Lugar de creación...">
                  <Select.Option value="RESTAURANTE PISO 2">
                    RESTAURANTE PISO 2
                  </Select.Option>
                  <Select.Option value="RESTAURANTE PISO 7">
                    RESTAURANTE PISO 7
                  </Select.Option>
                  <Select.Option value="CLUB DE PLAYA">
                    CLUB DE PLAYA
                  </Select.Option>
                  <Select.Option value="TERRAZA">TERRAZA</Select.Option>
                </Select>
              </Form.Item>
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default ConsumptionNoteFormCreate;
