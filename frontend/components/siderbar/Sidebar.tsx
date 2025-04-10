"use client";

import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, message } from "antd";
import {
  ContainerOutlined,
  DashboardOutlined,
  FundOutlined,
  IdcardOutlined,
  LogoutOutlined,
  ShopOutlined,
  SolutionOutlined,
  FileDoneOutlined,
  OrderedListOutlined,
  TeamOutlined,
  BookOutlined,
  ReadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import Image from "next/image";
import logo from "@/public/logo.png";

const { Sider } = Layout;

const menuItems = [
  {
    key: "1",
    label: "Dashboard",
    icon: <DashboardOutlined />,
    path: "/dashboard",
  },
  {
    key: "2",
    label: "Inventario",
    icon: <FundOutlined />,
    path: "/inventories",
  },
  {
    key: "3",
    label: "Proveedores",
    icon: <ShopOutlined />,
    path: "/suppliers",
  },
  {
    key: "4",
    label: "Órdenes de Compra",
    icon: <ContainerOutlined />,
    children: [
      {
        key: "4-1",
        label: "Ver Órdenes",
        icon: <OrderedListOutlined />,
        path: "/orders",
      },
      {
        key: "4-2",
        label: "Validar Órdenes",
        icon: <FileDoneOutlined />,
        path: "/orders/validate",
      },
    ],
  },
  {
    key: "5",
    label: "Notas de Consumo",
    icon: <SolutionOutlined />,
    path: "/notes",
  },
  { key: "6", label: "Clientes", icon: <TeamOutlined />, path: "/clients" },
  { key: "7", label: "Usuarios", icon: <IdcardOutlined />, path: "/users" },
  { key: "8", label: "AyB", icon: <BookOutlined />, path: "/recipes" },
  { key: "9", label: "Cocina", icon: <ReadOutlined />, path: "/kitchen" },
  {
    key: "10",
    label: "Reportes",
    icon: <FileTextOutlined />,
    path: "/reports",
  },
];

// Definir acceso por rol
const roleAccess = {
  1: ["1", "2", "3", "4", "4-1", "4-2", "5", "6", "7", "8", "9", "10"], // Superadministrador
  2: ["1", "2", "3", "4", "4-1", "4-2", "5", "6", "7", "8", "9", "10"], // Administrador
  3: ["1", "2", "3", "4", "4-1", "5", "6", "7", "8", "9", "10"], // Jefe de AyB (no ve Validar Órdenes)
  4: ["1", "2", "5"], // Asistente de Sala (solo Inventario y Notas de Consumo)
  5: ["1", "2", "5", "6", "10"], // Jefe de Sala (no ve Órdenes ni Cocina)
  6: ["1", "2", "4-2"], // Asistente de Cocina (solo Inventario y Validar Órdenes)
  7: ["1", "2", "4", "4-1", "4-2", "9"], // Jefe de Cocina (no ve Notas de Consumo)
  8: ["1", "5"], // Cajero (solo Notas de Consumo)
};

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth({});
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<number | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/user`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al obtener el usuario");

        const user = await response.json();
        setRoleId(user.role_id);
      } catch (error) {
        message.error("Error al obtener el rol del usuario.");
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [baseUrl]);

  // Filtrar menú según el rol
  const accessibleKeys = roleAccess[roleId as keyof typeof roleAccess] || [];
  const filteredMenu = menuItems
    .filter((item) => accessibleKeys.includes(item.key))
    .map((item) =>
      item.children
        ? {
            ...item,
            children: item.children.filter((child) =>
              accessibleKeys.includes(child.key)
            ),
          }
        : item
    );

  return (
    <Sider
      width={240}
      breakpoint="lg"
      onCollapse={(value) => setCollapsed(value)}
      style={{ height: "100vh", position: "sticky", top: 0 }}
    >
      <div
        style={{
          width: "100%",
          padding: 12,
          paddingTop: 8,
          textAlign: "center",
        }}
      >
        <Image
          src={logo}
          alt="Logo"
          placeholder="blur"
          style={{
            borderRadius: 4,
            backgroundColor: "#ffffff",
            padding: 8,
            width: "100%",
            transition: "width 0.3s",
          }}
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={filteredMenu.map(({ label, key, icon, path, children }) => ({
          key,
          icon,
          label: path ? <Link href={path}>{label}</Link> : label,
          children: children?.map(({ label, key, icon, path }) => ({
            key,
            icon,
            label: <Link href={path}>{label}</Link>,
          })),
        }))}
      />

      <div
        style={{
          position: "absolute",
          bottom: 16,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Button
          danger
          ghost
          icon={<LogoutOutlined />}
          onClick={logout}
          style={{ width: collapsed ? 40 : "60%" }}
        >
          {!collapsed && "Cerrar sesión"}
        </Button>
      </div>
    </Sider>
  );
};

export default AppSidebar;
