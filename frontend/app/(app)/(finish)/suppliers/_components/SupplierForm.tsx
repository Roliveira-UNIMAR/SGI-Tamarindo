"use client";

import { useStoreResource, useUpdateResource } from "@/hooks/dataHooks";
import { Supplier } from "@/types/supplier";
import { Form, Input, Button, Select, Spin, message, Row, Col, Modal, InputNumber } from "antd";
import { useEffect, useState } from "react";

interface DocumentType {
  id: number;
  name: string;
}

interface PhoneOperator {
  id: number;
  name: string;
}

const SupplierForm = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record?: Supplier;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [form] = Form.useForm<Supplier>();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [phoneOperators, setPhoneOperators] = useState<PhoneOperator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

        const [docResponse, phoneResponse] = await Promise.all([
          fetch(`${baseURL}/api/document-types/?type=supplier`),
          fetch(`${baseURL}/api/phone-operators`),
        ]);

        if (!docResponse.ok) throw new Error("Error fetching document types");
        if (!phoneResponse.ok) throw new Error("Error fetching phone operators");

        const docData = await docResponse.json();
        const phoneData = await phoneResponse.json();

        setDocumentTypes(Array.isArray(docData) ? docData : []);
        setPhoneOperators(Array.isArray(phoneData) ? phoneData : []);
      } catch (error) {
        console.error("Error fetching options:", error);
        message.error("Error cargando opciones");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const { execute: storeSupplier, loading: storeLoading } = useStoreResource<Supplier>();
  const { execute: updateSupplier, loading: updateLoading } = useUpdateResource<Supplier>();

  const operationLoading = storeLoading || updateLoading;

  const handleSubmit = async (values: Supplier) => {
    try {
      if (values.id) {
        await updateSupplier("suppliers", values);
      } else {
        await storeSupplier("suppliers", values);
      }

      message.success(`Proveedor ${values.id ? "actualizado" : "creado"} correctamente`);

      form.resetFields();

      closeModal(); // Cierra el modal y refresca la tabla
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Error desconocido.");
    }
  };

  return (
    <Modal
      title={record?.id ? "Actualizar Proveedor" : "Crear Proveedor"}
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
          <Button type="primary" onClick={() => form.submit()} loading={operationLoading}>
            {record?.id ? "Actualizar" : "Crear"} Proveedor
          </Button>
        </>
      }
    >
    <Spin spinning={loading}>
      <Form<Supplier>
        form={form}
        initialValues={record}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item name="status_id" hidden>
          <Input type="hidden" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="RIF"
              name="document_number"
              tooltip="Solo colocar los números mayores a 0, si el RIF es menor a nueve (9) dígitos automaticament se completara con ceros (0) a la izquierda cuando se registre"
              rules={[{ required: true, message: "Ingrese el RIF" }]}
            >
              <InputNumber
                className="w-full"
                maxLength={9}
                addonBefore={
                  <Form.Item
                    noStyle
                    name="document_type_id"
                    rules={[{ required: true, message: "Seleccione un tipo de documento" }]}
                  >
                    <Select placeholder="-">
                      {documentTypes.map((type) => (
                        <Select.Option key={type.id} value={type.id}>
                          {type.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                }
              />
            </Form.Item>

            <Form.Item
              label="Razón Social"
              name="name"
              rules={[{ required: true, message: "Ingrese el Razón Social" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Número de Teléfono"
              name="phone_number"
              rules={[{ required: true, message: "Ingrese el número telefónico" }]}
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
                    rules={[{ required: true, message: "Seleccione operador" }]}
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

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Ingrese un email válido" },
                { type: "email", message: "Formato de email inválido" },
              ]}
            >
              <Input type="email" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Dirección"
          name="address"
          rules={[{ required: true, message: "Ingrese una dirección" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Spin>
    </Modal>
  );
};

export default SupplierForm;
