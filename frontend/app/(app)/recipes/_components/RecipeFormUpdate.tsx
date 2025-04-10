import React, { useState, useEffect } from "react"; // Añadir useEffect
import {
  Steps,
  Form,
  Input,
  Button,
  Table,
  message,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useUpdateResource } from "@/hooks/dataHooks";
import { Product } from "@/types/product";
import { Recipe } from "@/types/recipe";

const { Step } = Steps;

interface RecipeIngredient {
  id: number;
  name: string;
  unit_id: number;
  unit_name: string;
  quantity: number;
}

interface RecipeFormValues {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  recipe_ingredients: Array<{
    product_id: number;
    quantity: number;
    unit_id: number;
  }>;
}

interface Category {
  id: number;
  name: string;
}

const RecipeFormUpdate = ({
  isModalOpen,
  closeModal,
  record,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  record: Recipe;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [productItems, setProductItems] = useState<Product[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    RecipeIngredient[]
  >([]);
  const [form] = Form.useForm<RecipeFormValues>();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

        const categoryResponse = await fetch(`${baseURL}/api/categories`);
        if (!categoryResponse.ok) throw new Error("Error fetching categories");

        const categoryData = await categoryResponse.json();

        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (error) {
        console.error("Error fetching options:", error);
        message.error("Error cargando opciones");
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (isModalOpen && record) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        price: record.price,
        category_id: record. category_id,
      });

      const initialIngredients = record.recipe_ingredients.map((ing) => ({
        id: ing.product_id,
        name: ing.product_name, // Asegurar que el backend envía esta data
        unit_id: ing.unit_id,
        unit_name: ing.unit_name, // Asegurar que el backend envía esta data
        quantity: ing.quantity,
      }));

      setSelectedIngredients(initialIngredients);
    }
  }, [isModalOpen, record, form]);

  const handleProductSearch = async (value: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${baseURL}/api/products?name=${value}`);
      if (!response.ok) throw new Error("No se encontraron ingredientes");
      const data: Product[] = await response.json();
      setProductItems(data);
    } catch (error) {
      setProductItems([]);
      console.log(error);
    }
  };

  const handleAddIngredient = (product: RecipeIngredient) => {
    if (selectedIngredients.some((i) => i.id === product.id)) {
      message.warning("Este ingrediente ya está agregado.");
      return;
    }
    setSelectedIngredients([
      ...selectedIngredients,
      {
        id: product.id,
        name: product.name,
        unit_id: product.unit_id,
        unit_name: product.unit_name, // Assuming Product has a unit object with name
        quantity: 1,
      },
    ]);
  };

  const handleRemoveIngredient = (ingredientId: number) => {
    setSelectedIngredients(
      selectedIngredients.filter((i) => i.id !== ingredientId)
    );
  };

  const handleQuantityChange = (ingredientId: number, newQuantity: number) => {
    setSelectedIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredientId ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  const { execute: updateRecipe, loading: updateLoading } =
    useUpdateResource<RecipeFormValues>();

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      const payload = {
        id: record.id,
        name: form.getFieldValue("name"),
        description: form.getFieldValue("description"),
        price: form.getFieldValue("price") ?? 0,
        category_id: form.getFieldValue("category_id"),
        recipe_ingredients: selectedIngredients.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
          unit_id: i.unit_id,
        })),
      };

      await updateRecipe("recipes", payload); // Usar update con ID
      message.success("Receta actualizada exitosamente");
      closeModal();
    } catch (error) {
      message.error("Error al actualizar la receta");
      console.log(error);
    }
  };

  return (
    <Modal
      title="Actualizar Receta"
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
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Siguiente
              </Button>
            )}
            {currentStep === 2 && (
              <Button
                type="primary"
                onClick={() => handleSubmit()}
                loading={updateLoading}
              >
                Actualizar Receta
              </Button>
            )}
          </div>
        </>
      }
    >
      <div className="max-w-4xl mx-auto p-4">
        <Steps current={currentStep} className="mb-8">
          <Step title="Datos de la Receta" />
          <Step title="Agregar Ingredientes" />
          <Step title="Revisar Receta" />
        </Steps>

        <Form form={form} layout="vertical">
          {currentStep === 0 && (
            <div className="space-y-4">
              <Form.Item
                name="name"
                label="Nombre"
                rules={[
                  { required: true, message: "El nombre es obligatorio" },
                ]}
              >
                <Input placeholder="Nombre de la receta" />
              </Form.Item>
              <Form.Item name="description" label="Descripción">
                <Input.TextArea placeholder="Descripción de la receta" />
              </Form.Item>
              <Form.Item
                name="price"
                label="Precio"
                rules={[
                  { required: true, message: "El precio es obligatorio" },
                ]}
              >
                <InputNumber
                  placeholder="Precio de la receta"
                  className="w-full"
                  min={0.01}
                  value={0}
                  step={0.1}
                  keyboard
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item
                label="Categoria"
                name="category_id"
                rules={[{ required: true, message: "Seleccione" }]}
              >
                <Select
                  placeholder="Seleccione una Categoria"
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
              </Form.Item>
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex gap-4">
              <div className="flex-1">
                <Input.Search
                  placeholder="Buscar ingredientes"
                  className="mb-4"
                  onSearch={handleProductSearch}
                  onChange={(e) => {
                    if (!e.target.value) setProductItems([]);
                  }}
                />
                <Table
                  dataSource={productItems}
                  columns={[
                    { title: "Nombre", dataIndex: "name" },
                    { title: "Unidad", dataIndex: "unit_name" },
                    {
                      title: "Acción",
                      render: (record: RecipeIngredient) => (
                        <Button onClick={() => handleAddIngredient(record)}>
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
                  dataSource={selectedIngredients}
                  columns={[
                    { title: "Nombre", dataIndex: "name" },
                    {
                      title: "Cantidad",
                      dataIndex: "quantity",
                      render: (_, record) => (
                        <InputNumber
                          min={1}
                          value={record.quantity}
                          onChange={(value) =>
                            handleQuantityChange(record.id, value || 1)
                          }
                        />
                      ),
                    },
                    {
                      title: "Unidad",
                      dataIndex: "unit_name",
                    },
                    {
                      title: "Acción",
                      render: (record: RecipeIngredient) => (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveIngredient(record.id)}
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
                dataSource={selectedIngredients}
                columns={[
                  { title: "Nombre", dataIndex: "name" },
                  { title: "Cantidad", dataIndex: "quantity" },
                  { title: "Medida", dataIndex: "unit_name" },
                ]}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default RecipeFormUpdate;
