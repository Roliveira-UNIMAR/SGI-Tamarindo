"use client";
import { Layout, theme, Spin } from "antd";
import AppSidebar from "@/components/siderbar/Sidebar";
import AppHeader from "@/components/header/Header";
import AppFooter from "@/components/Footer";
import { useAuth } from "@/hooks/auth";

const { Content } = Layout;

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { isLoading, user } = useAuth({ middleware: "auth" });

  // Bloqueo total hasta confirmar autenticación
  if (isLoading || !user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: colorBgContainer,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout>
        <AppHeader user={user} />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
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
}
