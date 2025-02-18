import { Card } from 'antd';
import React from 'react';
import { Metadata } from 'next';

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5'
      }}
    >
      <Card style={{ width: 400 }} title={<h2 style={{ textAlign: 'center' }}>SGI TAMARINDO</h2>}>
        {children}
      </Card>
    </div >
  );
};
