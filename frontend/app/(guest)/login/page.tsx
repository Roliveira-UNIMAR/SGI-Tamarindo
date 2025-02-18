'use client';
import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const router = useRouter();

  interface LoginFormValues {
    email: string;
    password: string;
  }

  const onFinish = (values: LoginFormValues) => {
    const { email, password } = values;
    if (email === 'admin@admin.com' && password === 'admin1234') {
      message.success('Inicio de sesión exitoso');
      router.push('/dashboard');
    } else {
      message.error('Credenciales incorrectas');
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
        rules={[{ required: true, message: '¡Por favor introduce tu Correo Electrónico!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Correo Electrónico" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '¡Por favor introduce tu Contraseña!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Contraseña" />
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
      <Form.Item>
        <p>Credecnciales:</p>
        <p>Email: admin@admin.com</p>
        <p>Password: admin1234</p>
      </Form.Item>
    </Form>
  );
};

export default Login;