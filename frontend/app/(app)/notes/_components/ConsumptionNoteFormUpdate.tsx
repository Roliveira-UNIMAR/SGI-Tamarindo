"use client";
import React, { useEffect, useState } from "react";
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
  notification,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useUpdateResource } from "@/hooks/dataHooks";
import { Client } from "@/types/client";
import { ConsumptionNote } from "@/types/consumptionNote";

const { Step } = Steps;
const { Text } = Typography;

interface Recipe {
  recipe_id: string;
  recipe_name: string;
  unit_price: number;
  quantity: number;
}

interface ConsumptionNoteFormValues {
  id: number;
  client_id: number;
  status_id: number;
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

const ConsumptionNoteFormUpdate = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: ConsumptionNote;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [searchClientDoc, setSearchClientDoc] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [form] = Form.useForm<ConsumptionNote>();

  const { execute: updateConsumptionNote, loading: updateLoading } =
    useUpdateResource<ConsumptionNoteFormValues>();

  useEffect(() => {
    const fetchClientDetails = async (clientId: number) => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${baseURL}/api/clients/${clientId}`);
        if (!response.ok) throw new Error("Error cargando proveedor");
        const data = await response.json();
        setSelectedClient(data);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };

    if (record) {
      form.setFieldsValue({
        id: record.id,
        client_id: record.client_id,
        status_id: record.status_id,
        note_details: record.note_details.map((detail) => ({
          recipe_id: detail.recipe_id,
          recipe_name: detail.recipe_name,
          quantity: detail.quantity,
          unit_price: detail.unit_price || 0,
        })),
      });

      fetchClientDetails(record.client_id);

      setSelectedRecipes(record.note_details);
    }
  }, [record, form]);

  // Buscar clientes en la API
  const handleClientSearch = async (value: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${baseURL}/api/clients?document=${value}`);
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
      const response = await fetch(`${baseURL}/api/recipes?name=${value}`);
      if (!response.ok) throw new Error("No se encontraron productos/recetas");
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      setRecipes([]);
      console.log(error);
    }
  };

  const itemColumns = [
    { title: "Id", dataIndex: "id" },
    { title: "Nombre", dataIndex: "name" },
    { title: "Tipo", dataIndex: "type" },
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
      (acc, recipe) => acc + recipe.unit_price * (recipe.quantity || 0),
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
    if (selectedRecipes.some((i) => i.recipe_id === recipe.recipe_id)) {
      message.warning("Este ítem ya está agregado.");
      return;
    }
    setSelectedRecipes([...selectedRecipes, { ...recipe, quantity: 1 }]);
  };

  // Eliminar un ítem
  const handleRemoveRecipe = (recipeId: string) => {
    setSelectedRecipes(selectedRecipes.filter((i) => i.recipe_id !== recipeId));
  };

  // Cambiar cantidad de un ítem
  const handleQuantityChange = (recipeId: string, newQuantity: number) => {
    setSelectedRecipes((prev) =>
      prev.map((i) =>
        i.recipe_id === recipeId ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  // Guardar la nota de consumo
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const clientId = form.getFieldValue("client_id");

      if (!clientId) {
        message.error("Debe seleccionar un cliente.");
        return;
      }

      const payload = {
        ...values,
        id: record.id,
        client_id: clientId,
        status_id: 9,
        note_details: selectedRecipes.map((i) => ({
          recipe_id: i.recipe_id,
          recipe_name: i.recipe_name,
          quantity: i.quantity,
          unit_price: Number(i.unit_price),
        })),
      };

      console.log("Enviando nota de consumo:", payload);
      await updateConsumptionNote("consumption-notes", payload);
      message.success("Nota de consumo creada exitosamente");
      closeModal(); // Cierra el modal y refresca la tabla
    } catch (error) {
      // Obtener el mensaje de error y convertirlo en array
      const errorMessageString = error instanceof Error ? error.message : "";
      const errorMessages = errorMessageString
        .split(',') // Dividir por comas
        .map(msg => msg.trim()) // Limpiar espacios
        .filter(msg => msg.length > 0); // Filtrar vacíos

      notification.error({
        message: "Error al procesar la solicitud",
        description: (
          <div>
            <ul>
              {errorMessages.map((msg, index) => (
                <li key={index}>
                  {msg}
                </li>
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
      title="Actualizar Nota de Consumo"
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
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={updateLoading}
              >
                Guardar Nota
              </Button>
            )}
          </div>
        </>
      }
    >
      <div className="max-w-4xl mx-auto p-4">
        <Steps current={currentStep} className="mb-8">
          <Step title="Seleccionar Cliente" />
          <Step title="Actualizar Ítems" />
          <Step title="Revisar Nota" />
        </Steps>

        <Form form={form} layout="vertical" initialValues={{ discount: 0 }}>
          <Form.Item name="id" hidden>
            <Input type="hidden" />
          </Form.Item>
          {currentStep === 0 && (
            <div className="space-y-4">
              {selectedClient && !isEditingClient ? (
                <div className="p-4 border rounded">
                  <Text strong>{selectedClient.full_name}</Text>
                  <div>Cédula: {selectedClient.document}</div>
                  <div>
                    Contactos: {selectedClient.phone} | {selectedClient.email}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button type="primary" onClick={() => setCurrentStep(1)}>
                      Continuar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Input.Search
                    placeholder="Buscar proveedor por RIF"
                    enterButton={<SearchOutlined />}
                    onSearch={handleClientSearch}
                    onChange={(e) => setSearchClientDoc(e.target.value)}
                    className="w-full"
                  />

                  {clients.length > 0
                    ? clients.map((client) => (
                        <div key={client.id} className="p-4 border rounded">
                          <Text strong>{client.full_name}</Text>
                          <div>Cédula: {client.document}</div>
                          <div>
                            Contactos: {client.phone} | {client.email}
                          </div>
                          <Button
                            onClick={() => {
                              form.setFieldValue("client_id", client.id);
                              setSelectedClient(client);
                              setIsEditingClient(false);
                              setCurrentStep(1);
                            }}
                            className="mt-2"
                          >
                            Seleccionar
                          </Button>
                        </div>
                      ))
                    : searchClientDoc && (
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
                  placeholder="Buscar un producto  o recetas"
                  className="mb-4"
                  onSearch={handleRecipeSearch}
                  onChange={(e) => {
                    if (!e.target.value) setRecipes([]); // Si se borra el texto, vacía la tabla
                  }}
                />
                <Table
                  dataSource={recipes}
                  columns={itemColumns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{
                    x: "max-content",
                    y: 340,
                  }}
                />
              </div>

              <div className="flex-1">
                <Table
                  dataSource={selectedRecipes}
                  columns={[
                    { title: "Nombre", dataIndex: "recipe_name" },
                    {
                      title: "Cantidad",
                      dataIndex: "quantity",
                      render: (_, record) => (
                        <InputNumber
                          min={1}
                          value={record.quantity}
                          className="w-full"
                          inputMode="numeric"
                          keyboard
                          onChange={(value) =>
                            handleQuantityChange(record.recipe_id, value || 1)
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
                          onClick={() => handleRemoveRecipe(record.recipe_id)}
                        />
                      ),
                    },
                  ]}
                  rowKey="recipe_id"
                  pagination={false}
                  size="small"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <Table
                dataSource={selectedRecipes}
                columns={[
                  { title: "Nombre", dataIndex: "recipe_name" },
                  { title: "Cantidad", dataIndex: "quantity" },
                  { title: "Precio Unitario", dataIndex: "price" },
                  {
                    title: "Total",
                    render: (_, record) =>
                      `$ ${(record.quantity * record.unit_price).toFixed(2)}`,
                  },
                ]}
                rowKey="recipe_id"
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

export default ConsumptionNoteFormUpdate;
