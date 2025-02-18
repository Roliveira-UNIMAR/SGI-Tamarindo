"use client";
import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, MenuProps, message } from "antd";
import {
    ContainerOutlined,
    DashboardOutlined,
    FundOutlined,
    IdcardOutlined,
    LogoutOutlined,
    ProductOutlined,
    ProfileOutlined,
    ShopOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import '@ant-design/v5-patch-for-react-19';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem(<Link href="/dashboard">Dashboard</Link>, '1', <DashboardOutlined />),
    getItem(<Link href="/products">Productos</Link>, '2', <ProductOutlined />),
    getItem(<Link href="/suppliers">Proveedores</Link>, '3', <ShopOutlined />),
    getItem(<Link href="/orders">Pedidos</Link>, '4', <ContainerOutlined />),
    getItem(<Link href="/notes">Notas de consumo</Link>, '5', <ProfileOutlined />),
    getItem(<Link href="/clients">Clientes</Link>, '6', <UserOutlined />),
    getItem(<Link href="/users">Usuarios</Link>, '7', <IdcardOutlined />),
    getItem(<Link href="/reports">Reportes</Link>, '8', <FundOutlined />),
];

const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

const { Sider } = Layout;

const AppSidebar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedKey, setSelectedKey] = useState<string>('1');

    useEffect(() => {
        if (pathname.startsWith('/dashboard')) {
            setSelectedKey('1');
        } else if (pathname.startsWith('/products')) {
            setSelectedKey('2');
        } else if (pathname.startsWith('/suppliers')) {
            setSelectedKey('3');
        } else if (pathname.startsWith('/orders')) {
            setSelectedKey('4');
        } else if (pathname.startsWith('/notes')) {
            setSelectedKey('5');
        } else if (pathname.startsWith('/clients')) {
            setSelectedKey('6');
        } else if (pathname.startsWith('/users')) {
            setSelectedKey('7');
        } else if (pathname.startsWith('/reports')) {
            setSelectedKey('8');
        } else {
            setSelectedKey('1');
        }
    }, [pathname]);

    const handleLogout = () => {
        message.info("Cerrando sesión...");
        router.push("/login");
    };

    return (
        <Sider style={siderStyle}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} />
            <div style={{ position: "absolute", bottom: 16, width: "100%", textAlign: "center" }}>
                <Button danger ghost icon={<LogoutOutlined />} onClick={handleLogout}>
                    Cerrar sesión
                </Button>
            </div>
        </Sider>
    );
};

export default AppSidebar;