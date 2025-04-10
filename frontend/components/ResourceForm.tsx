"use client";

import { Button, Form, message, FormInstance, Input } from "antd";
import { ReactNode } from "react";
import { useStoreResource } from "@/hooks/useStoreResource";
import { useUpdateResource } from "@/hooks/useUpdateResource";
import { useDestroyResource } from "@/hooks/useDestroyResource";
import { useRouter } from "next/navigation";

export type FormMode = "create" | "edit" | "show";

interface BaseResource {
  id?: string | number;
}

interface ResourceFormProps<T extends BaseResource> {
  endpoint: string;
  mode: FormMode;
  children: ReactNode;
  form: FormInstance<T>; // Hacer obligatoria la prop form
}

const ResourceForm = <T extends BaseResource>({
  mode,
  children,
  endpoint,
  form, // Recibir la prop form
}: ResourceFormProps<T>) => {
  // Eliminar el useForm interno

  const router = useRouter();

  const { storeResource, loading: storeLoading } = useStoreResource<T>();
  const { destroyResource, loading: destroyLoading } = useDestroyResource<
    T & { id: string | number }
  >();
  const { updateResource, loading: updateLoading } = useUpdateResource<
    T & { id: string | number }
  >();

  const operationLoading = storeLoading || updateLoading || destroyLoading;

  const handleSuccess = () => {
    form.resetFields();
    router.refresh();
  };

  const handleError = (error: unknown) => {
    message.error("Error al procesar la solicitud");
    console.error("Error detallado:", error);
  };

  const handleSubmit = async (values: T) => {
    try {
      if (mode === "create") {
        await storeResource(endpoint, values);
      }
      if (mode === "edit") {
        if (!values.id) throw new Error("ID es requerido para editar");
        await updateResource(endpoint, values as T & { id: string | number });
      }
      handleSuccess();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async () => {
    try {
      const values = await form.validateFields();
      if (!values.id) throw new Error("Se requiere ID para eliminar");
      await destroyResource(endpoint, values as T & { id: string | number });
      handleSuccess();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Form<T>
      form={form} // Usar la instancia proporcionada
      layout="vertical"
      onFinish={handleSubmit}
      disabled={mode === "show"}
    >
      <Form.Item
        name="id"
        hidden
        style={{ display: "none" }}
      >
        <Input type="hidden" />
      </Form.Item>
      {children}
      {mode !== "show" && (
        <Form.Item>
          <div style={{ textAlign: "right" }}>
            {mode === "create" && (
              <Button
                onClick={() => form.resetFields()}
                style={{ marginRight: 8 }}
              >
                Limpiar
              </Button>
            )}

            {mode === "edit" && (
              <Button
                danger
                type="primary"
                onClick={handleDelete}
                loading={destroyLoading}
                style={{ marginRight: 8 }}
              >
                Eliminar
              </Button>
            )}

            <Button type="primary" htmlType="submit" loading={operationLoading}>
              {mode === "create" ? "Crear" : "Actualizar"}
            </Button>
          </div>
        </Form.Item>
      )}
    </Form>
  );
};

export default ResourceForm;
