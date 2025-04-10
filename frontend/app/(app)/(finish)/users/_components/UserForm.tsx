import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  message,
  Row,
  Col,
  InputNumber,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { User, DocumentType, PhoneOperator, Gender, Role } from "@/types/user";
import { useStoreResource, useUpdateResource } from "@/hooks/dataHooks";

const UserForm = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record?: User;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [form] = Form.useForm<User>();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [phoneOperators, setPhoneOperators] = useState<PhoneOperator[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

        const roleURL = !record?.id ?  `${baseURL}/api/roles/?type=create`: `${baseURL}/api/roles/` ;

        const [docResponse, phoneResponse, genderResponse, roleResponse] = await Promise.all([
          fetch(`${baseURL}/api/document-types/?type=user`),
          fetch(`${baseURL}/api/phone-operators`),
          fetch(`${baseURL}/api/genders`),
          fetch(`${roleURL}`),

        ]);

        // Verificar respuestas HTTP
        if (!docResponse.ok) throw new Error("Error fetching document types");
        if (!phoneResponse.ok) throw new Error("Error fetching phone operators");
        if (!genderResponse.ok) throw new Error("Error fetching genders");
        if (!roleResponse.ok) throw new Error("Error fetching roles");

        // Parsear JSON
        const docData = await docResponse.json();
        const phoneData = await phoneResponse.json();
        const genderData = await genderResponse.json();
        const roleData = await roleResponse.json();

        // Asegurar que los datos son arrays
        setDocumentTypes(Array.isArray(docData) ? docData : []);
        setPhoneOperators(Array.isArray(phoneData) ? phoneData : []);
        setGenders(Array.isArray(genderData) ? genderData : []);
        setRoles(Array.isArray(roleData) ? roleData : []);
      } catch (error) {
        console.error("Error fetching options:", error);
        message.error("Error cargando opciones");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [record?.id]);

  const { execute: storeUser, loading: storing } = useStoreResource<User>();
  const { execute: updateUser, loading: updating } = useUpdateResource<User>();
  const operationLoading = storing || updating;

  const handleSubmit = async (values: User) => {
    try {
      const method = values.id ? "PUT" : "POST";

      if (method === "POST") {
        await storeUser("users", values);
      } else {
        if (!values.id) throw new Error("ID es requerido para editar");
        await updateUser("users", values as User);
      }

      form.resetFields();

      message.success(
        `Usuario ${values.id ? "actualizado" : "creado"} correctamente`
      );

      closeModal(); // Cierra el modal y refresca la tabla
    } catch (error) {
      console.error("Error saving user:", error);
      message.error("Error al guardar el usuario");
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
        <Form<User>
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
                rules={[
                  { required: true, message: "Requerido" },
                  { pattern: /^\d+$/, message: "Solo números" },
                ]}
              >
                <InputNumber
                  className="w-full"
                  stringMode
                  maxLength={9}
                  placeholder="Ej: 12345678"
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
                dependencies={["document_type_id"]}
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
                  placeholder="Seleccione un Genero"
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

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Correo Electrónico"
                name="email"
                rules={[
                  { required: true, message: "Requerido" },
                  { type: "email", message: "Formato inválido" },
                ]}
              >
                <Input placeholder="Ej: usuario@dominio.com" />
              </Form.Item>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  { required: true, message: "Requerido" },
                  { min: 8, message: "Mínimo 8 caracteres" },
                ]}
              >
                <Input.Password placeholder="Ingrese su contraseña" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Rol de Usuario"
                name="role_id"
                rules={[{ required: true, message: "Seleccione el rol" }]}
              >
                <Select
                  placeholder="Seleccione un Rol"
                  disabled={!!record?.id}
                  options={roles.map((r) => ({
                    value: r.id,
                    label: r.name,
                  }))}
                />
              </Form.Item>

                <Form.Item
                  label="Confirmar Contraseña"
                  name="password2"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Requerido",
                    },
                    { min: 8, message: "Mínimo 8 caracteres" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("¡La contraseña no coincide!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirme su contraseña" />
                </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UserForm;
