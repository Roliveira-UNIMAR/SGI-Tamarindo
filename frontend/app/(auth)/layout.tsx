import { Card } from "antd";
import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import logo from "@/public/logo.png"

export const metadata: Metadata = {
  title: "Login",
  description: "Login del SGI Tamarindo",
};

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#00a7c8",
      }}
    >
      <Card
        style={{ width: 400 }}
        title={
          <Image
            src={logo}
            alt="Picture of the author"
            placeholder="blur"
            style={{
              borderRadius: 4,
              backgroundColor: "#ffffff",
              margin: 4,
              padding: 4,
            }}
          />
        }
      >
        {children}
      </Card>
    </div>
  );
}
