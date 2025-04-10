import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  message,
  Row,
  Col,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { Client, DocumentType, PhoneOperator, Gender } from "@/types/client";
import { useStoreResource, useUpdateResource } from "@/hooks/dataHooks";

const ClientForm = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record?: Client;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [form] = Form.useForm<Client>();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [phoneOperators, setPhoneOperators] = useState<PhoneOperator[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

        const [docResponse, phoneResponse, genderResponse] = await Promise.all([
          fetch(`${baseURL}/api/document-types/?type=client`),
          fetch(`${baseURL}/api/phone-operators`),
          fetch(`${baseURL}/api/genders`),
        ]);

        // Verificar respuestas HTTP
        if (!docResponse.ok) throw new Error("Error fetching document types");
        if (!phoneResponse.ok)
          throw new Error("Error fetching phone operators");
        if (!genderResponse.ok) throw new Error("Error fetching genders");

        // Parsear JSON
        const docData = await docResponse.json();
        const phoneData = await phoneResponse.json();
        const genderData = await genderResponse.json();

        // Asegurar que los datos son arrays
        setDocumentTypes(Array.isArray(docData) ? docData : []);
        setPhoneOperators(Array.isArray(phoneData) ? phoneData : []);
        setGenders(Array.isArray(genderData) ? genderData : []);
      } catch (error) {
        console.error("Error fetching options:", error);
        message.error("Error cargando opciones");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const { execute: storeClient, loading: storing } = useStoreResource<Client>();
  const { execute: updateClient, loading: updating } =
    useUpdateResource<Client>();
  const operationLoading = storing || updating;

  const handleSubmit = async (values: Client) => {
    try {
      const method = values.id ? "PUT" : "POST";

      if (method === "POST") {
        await storeClient("clients", values);
      } else {
        if (!values.id) throw new Error("ID es requerido para editar");
        await updateClient("clients", values as Client);
      }

      message.success(
        `Cliente ${values.id ? "actualizado" : "creado"} correctamente`
      );

      form.resetFields();

      closeModal(); // Cierra el modal y refresca la tabla
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Error desconocido.");
    }
  };

  return (
    <Modal
      title={record?.id ? "Actualizar Cliente" : "Crear Cliente"}
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
            {record?.id ? "Actualizar Cliente" : "Crear Cliente"}
          </Button>
        </>
      }
    >
      <Spin spinning={loading} tip="Cargando datos...">
        <Form<Client>
          form={form}
          initialValues={record}
          onFinish={handleSubmit}
          layout="vertical"
          onFinishFailed={({ errorFields }) => {
            setFormError(`Errores en ${errorFields.length} campos`);
          }}
          onValuesChange={(changedValues) => {
            if ("document_type_id" in changedValues) {
              const documentType = changedValues.document_type_id;
              if (documentType === 1) {
                form.setFieldsValue({ nationality: "VENEZOLANO" });
              } else {
                form.setFieldsValue({ nationality: "" });
              }
            }
          }}
        >
          {formError && (
            <div
              className="ant-form-item-explain-error"
              style={{ marginBottom: 24 }}
            >
              {formError}
            </div>
          )}

          <Form.Item name="id" hidden style={{ display: "none" }}>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item name="status_id" hidden style={{ display: "none" }}>
            <Input type="hidden" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nombres"
                name="names"
                rules={[{ required: true, message: "Requerido" }]}
              >
                <Input placeholder="Ej: María José" />
              </Form.Item>

              <Form.Item
                label="Número de Documento"
                name="document_number"
                dependencies={["document_type_id"]}
                rules={[
                  { required: true, message: "Requerido" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const documentType = getFieldValue("document_type_id");

                      if (!value) {
                        return Promise.reject(new Error("Requerido"));
                      }

                      if (documentType === 4) {
                        // Validación mejorada para pasaportes: alfanumérico, 6-9 caracteres, al menos un número
                        const passportRegex = /^(?=.*\d)[A-Z0-9]{6,9}$/i;
                        if (!passportRegex.test(value)) {
                          return Promise.reject(
                            new Error(
                              "El pasaporte debe tener entre 6 y 9 caracteres alfanuméricos e incluir al menos un número"
                            )
                          );
                        }
                      } else {
                        // Validación para otros documentos: solo números
                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(
                            new Error("Solo números permitidos")
                          );
                        }
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  className="w-full"
                  maxLength={9}
                  placeholder="Ingrese el número de documento"
                  addonBefore={
                    <Form.Item
                      noStyle
                      name="document_type_id"
                      rules={[
                        {
                          required: true,
                          message: "Seleccione tipo de documento",
                        },
                      ]}
                    >
                      <Select
                        placeholder="-"
                        options={documentTypes.map((dt) => ({
                          value: dt.id,
                          label: dt.name,
                        }))}
                      />
                    </Form.Item>
                  }
                />
              </Form.Item>

              <Form.Item
                label="Nacionalidad"
                name="nationality"
                rules={[{ required: true, message: "Requerido" }]}
              >
                <Input placeholder="VENEZOLANO" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Apellidos"
                name="surnames"
                rules={[{ required: true, message: "Requerido" }]}
              >
                <Input placeholder="Ej: Pérez González" />
              </Form.Item>

              <Form.Item
                label="Género"
                name="gender_id"
                rules={[{ required: true, message: "Seleccione" }]}
              >
                <Select
                  options={genders.map((g) => ({
                    value: g.id,
                    label: g.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Teléfono"
                name="phone_number"
                rules={[
                  { required: true, message: "Requerido" },
                  { pattern: /^\d+$/, message: "Solo números" },
                ]}
              >
                <Input
                  placeholder="0000000"
                  className="w-full"
                  maxLength={7}
                  onKeyDown={(event) => {
                    if (!/^\d$/.test(event.key) && event.key !== "Backspace") {
                      event.preventDefault();
                    }
                  }}
                  addonBefore={
                    <Form.Item
                      noStyle
                      name="phone_operator_id"
                      rules={[
                        { required: true, message: "Seleccione operador" },
                      ]}
                    >
                      <Select
                        placeholder="- - - -"
                        options={phoneOperators.map((operator) => ({
                          value: operator.id,
                          label: operator.name,
                        }))}
                      />
                    </Form.Item>
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Dirección"
            name="address"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Ej: Av. Principal, Edificio Centro, Piso 5"
            />
          </Form.Item>

          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[
              { type: "email", message: "Formato inválido" },
            ]}
          >
            <Input placeholder="Ej: cliente@dominio.com" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ClientForm;
