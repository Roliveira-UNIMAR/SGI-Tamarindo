"use client";

import "@ant-design/v5-patch-for-react-19";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StyleProvider } from "@ant-design/cssinjs";
import { App } from "antd";
import { useContext, useLayoutEffect } from "react";
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, theme } = useContext(ConfigProvider.ConfigContext);
  useLayoutEffect(() => {
    ConfigProvider.config({
      holderRender: (children) => (
        <StyleProvider hashPriority="high">
          <ConfigProvider
            prefixCls="static"
            iconPrefixCls="icon"
            locale={locale}
            theme={theme}
          >
            <App message={{ maxCount: 1 }} notification={{ maxCount: 1 }}>
              {children}
            </App>
          </ConfigProvider>
        </StyleProvider>
      ),
    });
  }, [locale, theme]);

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00a7c8",
              colorPrimaryHover: "#004A99",
              colorText: "#403955",
              colorTextSecondary: "#3d4263",
              colorSuccess: "#2BB7A3",
              colorWarning: "#FFA500",
              colorError: "#FF4D4F",
              colorInfo: "#1890FF",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              fontSizeHeading1: 32,
              fontSizeHeading2: 24,
              fontSizeHeading3: 18,
              fontSizeHeading4: 16,
              fontSizeHeading5: 14,
              borderRadius: 8,
            },
          }}
          locale={esES}
        >
          <App>{children}</App>
        </ConfigProvider>
      </body>
    </html>
  );
}
