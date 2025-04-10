import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  InputNumber,
  Row,
  Col,
  Switch,
  message,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { useStoreResource, useUpdateResource } from "@/hooks/dataHooks";
import { Inventory } from "@/types/inventory";

const InventoryForm = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record?: Inventory;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [form] = Form.useForm<Inventory>();
  const [locations, setLocations] = useState<{ id: number; name: string }[]>(
    []
  );
  const [units, setUnits] = useState<{ id: number; abbr: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

        const [locResponse, unitResponse] = await Promise.all([
          fetch(`${baseURL}/api/locations`),
          fetch(`${baseURL}/api/units`),
        ]);

        // Verificar respuestas HTTP
        if (!locResponse.ok) throw new Error("Error fetching location types");
        if (!unitResponse.ok) throw new Error("Error fetching unit operators");

        // Parsear JSON
        const locData = await locResponse.json();
        const unitData = await unitResponse.json();

        // Asegurar que los datos son arrays
        setLocations(Array.isArray(locData) ? locData : []);
        setUnits(Array.isArray(unitData) ? unitData : []);
      } catch (error) {
        console.error("Error fetching options:", error);
        message.error("Error cargando opciones");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const { execute: storeInventory, loading: storing } =
    useStoreResource<Inventory>();
  const { execute: updateInventory, loading: updating } =
    useUpdateResource<Inventory>();
  const operationLoading = storing || updating;

  const handleSubmit = async (values: Inventory) => {
    try {
      if (values?.unit_id === 4) {
        values.unit_id = 1
      }

      if (values?.unit_id === 5) {
        values.unit_id = 2
      }


      if (record?.id) {
        await updateInventory("inventories", {
          ...values,
          id: record.id,
          transaction_type: record?.id ? "default" : "entrada",
          requires_refrigeration: values.requires_refrigeration ?? false,
        });
      } else {
        await storeInventory("inventories", values);
      }

      form.resetFields();
      message.success(
        `Inventario ${record?.id ? "actualizado" : "creado"} correctamente`
      );
      closeModal(); // Cierra el modal y refresca la tabla
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Error desconocido.");
    }
  };

  return (
    <Modal
      title={record?.id ? "Actualizar Inventario" : "Crear Inventario"}
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
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={operationLoading}
          >
            {record?.id ? "Actualizar Inventario" : "Crear Inventario"}
          </Button>
        </>
      }
    >
      <Spin spinning={loading} tip="Cargando datos...">
        <Form<Inventory>
          form={form}
          initialValues={{
            ...record,
            requires_refrigeration: record?.requires_refrigeration ?? false, // Asegurar un valor por defecto
          }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item name="id" hidden style={{ display: "none" }}>
            <Input type="hidden" />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Producto"
                name="product_name"
                rules={[{ required: true, message: "Requerido" }]}
              >
                <Input placeholder="Ej: Arroz, Azúcar, Harina" />
              </Form.Item>

              <Form.Item
                label="Ubicación"
                name="location_id"
                rules={[{ required: true, message: "Seleccione ubicación" }]}
              >
                <Select
                  options={locations.map((loc) => ({
                    value: loc.id,
                    label: loc.name,
                  }))}
                  placeholder="Seleccione ubicación"
                />
              </Form.Item>

              {record?.id && (
                <Form.Item
                  label="Cantidad Disponible"
                  name="available_quantity"
                  rules={[{ required: true, message: "Requerido" }]}
                >
                  <InputNumber
                    className="w-full"
                    min={0}
                    value={0}
                    inputMode="numeric"
                    keyboard
                    disabled
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Nivel Mínimo"
                name="min_stock_level"
                rules={[
                  {
                    required: true,
                    message: "El nivel mínimo es obligatorio",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        value !== undefined &&
                        value > getFieldValue("max_stock_level")
                      ) {
                        return Promise.reject(
                          new Error(
                            "El nivel mínimo debe ser menor que el máximo"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  value={0}
                  inputMode="numeric"
                  keyboard
                />
              </Form.Item>

              <Form.Item
                label="Requiere Refrigeración"
                name="requires_refrigeration"
                valuePropName="checked"
              >
                <Switch checkedChildren="Sí" unCheckedChildren="No" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Punto de Reorden"
                name="reorder_point"
                rules={[
                  {
                    required: true,
                    message: "El punto de reorden es obligatorio",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        value !== undefined &&
                        value < getFieldValue("min_stock_level")
                      ) {
                        return Promise.reject(
                          new Error(
                            "El punto de reorden no puede ser menor que el mínimo"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  value={0}
                  inputMode="numeric"
                  keyboard
                  placeholder="Punto de reorden"
                />
              </Form.Item>

              <Form.Item
                label="Unidad de Medida"
                name="unit_id"
                rules={[{ required: true, message: "Seleccione unidad" }]}
              >
                <Select
                  options={units.map((unit) => ({
                    value: unit.id,
                    label: unit.abbr,
                  }))}
                  placeholder="Seleccione unidad"
                />
              </Form.Item>

              {record?.id && (
                <Form.Item label="Estado" name="is_available">
                  <Select
                    disabled
                    options={[
                      { value: true, label: "Disponible" },
                      { value: false, label: "No Disponible" },
                    ]}
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Nivel Máximo"
                name="max_stock_level"
                rules={[
                  {
                    required: true,
                    message: "El nivel máximo es obligatorio",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        value !== undefined &&
                        value < getFieldValue("min_stock_level")
                      ) {
                        return Promise.reject(
                          new Error(
                            "El nivel máximo no puede ser menor que el mínimo"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  value={0}
                  inputMode="numeric"
                  keyboard
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default InventoryForm;
