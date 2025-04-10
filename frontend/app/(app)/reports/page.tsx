"use client";

import React, { useState } from "react";
import { Button, Select, Space, message, DatePicker } from "antd";
import FileSaver from "file-saver";
import { getCsrfToken } from "@/hooks/dataHooks";

const { RangePicker } = DatePicker;

const reportTypes = [
  { label: "Reporte de Órdenes", value: "orders" },
  { label: "Reporte de Inventarios", value: "inventory" },
  // { label: "Reporte de Ventas", value: "sales" },
];

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const generateReport = async () => {
    if (!selectedReport) {
      message.error("Por favor, selecciona un tipo de reporte.");
      return;
    }

    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (dateRange) {
        params.append("start_date", dateRange[0]);
        params.append("end_date", dateRange[1]);
      }
      if (status !== null) {
        params.append("status", status.toString());
      } else {
        setStatus(1)
      }

      const token = await getCsrfToken();
      if (!token) throw new Error("No se pudo obtener el token CSRF");

      // Llamada única al endpoint de generación de reportes
      const response = await fetch(`${baseUrl}/api/reports/generate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: selectedReport,
          start_date: dateRange ? dateRange[0] : null,
          end_date: dateRange ? dateRange[1] : null,
          status
        }),
      });

      if (!response.ok) throw new Error("Error al generar el reporte.");

      const blob = await response.blob();
      FileSaver.saveAs(blob, `Reporte_${selectedReport}_${new Date().toISOString()}.pdf`);

    } catch (error) {
      message.error("Hubo un error al generar el reporte.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 className="mb-4">Generar Reporte</h1>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Select
          placeholder="Selecciona un tipo de reporte"
          style={{ width: "100%" }}
          onChange={setSelectedReport}
        >
          {reportTypes.map((report) => (
            <Select.Option key={report.value} value={report.value}>
              {report.label}
            </Select.Option>
          ))}
        </Select>

        <RangePicker
          onChange={(_, dateStrings) => setDateRange(dateStrings as [string, string])}
        />

        {/* <Select
          placeholder="Selecciona un estado"
          style={{ width: "100%" }}
          onChange={setStatus}
          allowClear
        >
          <Select.Option value={1}>Pendiente</Select.Option>
          <Select.Option value={2}>Procesado</Select.Option>
          <Select.Option value={3}>Cancelado</Select.Option>
        </Select> */}

        <Button
          type="primary"
          onClick={generateReport}
          loading={isLoading}
          disabled={!selectedReport}
        >
          Generar Reporte
        </Button>
      </Space>
    </div>
  );
};

export default ReportsPage;
