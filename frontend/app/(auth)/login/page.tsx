"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, message } from "antd";
import "@ant-design/v5-patch-for-react-19";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";

interface Values {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      console.log("Usuario autenticado, redirigiendo...");
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const resetToken = searchParams.get("reset");
    if (resetToken) {
      console.log("Token de reset:", atob(resetToken));
    }
  }, [searchParams]);

  const onFinish = async (values: Values): Promise<void> => {
    try {
      await login(values);
      message.success("Inicio de sesión exitoso");
      router.push("/dashboard");
    } catch (error) {
      message.error("Credenciales incorrectas");
      console.log(error)
    }
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "¡Por favor introduce tu Correo Electrónico!" },
          { type: "email", message: "¡Por favor introduce un Correo Electrónico válido!" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Correo Electrónico" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "¡Por favor introduce tu Contraseña!" },
          { min: 8, message: "¡La contraseña debe tener al menos 8 caracteres!" },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} type="password" placeholder="Contraseña" />
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Recordarme</Checkbox>
          </Form.Item>
        </Flex>
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Iniciar Sesión
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
