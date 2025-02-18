'use client';
import { Layout, theme } from 'antd';
import AppSidebar from "@/components/siderbar/Sidebar";
import AppHeader from "@/components/header/Header";
import AppFooter from "@/components/Footer";

const { Content } = Layout;

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout hasSider>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Content style={{ margin: '16px', overflow: 'initial' }}>
                    <div
                        style={{
                            padding: 24,
                            textAlign: 'center',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    );
};