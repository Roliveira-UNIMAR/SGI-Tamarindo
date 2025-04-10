"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "./_components/Dashboard";
import { message, Card, Typography, Spin } from "antd";

export default function DashboardPage() {
  const [roleId, setRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/user`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener el usuario");
        }

        const user = await response.json();
        setRoleId(user.role_id);
      } catch (error) {
        message.error("Error al obtener el rol del usuario.");
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return roleId === 1 || roleId === 2 ? (
    <Dashboard />
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Card
        style={{
          textAlign: "center",
          maxWidth: 500,
          padding: 20,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 10,
          marginTop: 80,
        }}
      >
        <Typography.Title level={2} style={{ margin: 0 }}>
          ¡Bienvenid@ a SGI Tamarindo! 👋
        </Typography.Title>
      </Card>
    </div>
  );
}
