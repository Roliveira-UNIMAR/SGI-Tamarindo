"use client";
import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, StatisticProps, Table } from "antd";
import {
  ContainerOutlined,
  ProfileOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  fetchSummary,
  fetchOrdersAndNotes,
  fetchInventoryManagement,
} from "@/hooks/useDashboard";
import {
  SummaryData,
  Order,
  ConsumptionNote,
  InventoryProduct,
  Transfer,
  ConsumedProduct,
} from "@/hooks/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CountUp from "react-countup";
import dayjs from "dayjs";

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} />
);

const formatDate = (date?: string) =>
  date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A";

const Dashboard = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [ordersData, setOrdersData] = useState<{
    orders_by_status: { status: string; count: number }[];
    latest_orders: Order[];
    latest_notes: ConsumptionNote[];
  } | null>(null);
  const [inventoryData, setInventoryData] = useState<{
    low_stock_products: InventoryProduct[];
    recent_transfers: Transfer[];
    top_consumed_products: ConsumedProduct[];
  } | null>(null);

  useEffect(() => {
    fetchSummary().then((data) => setSummary(data));
    fetchOrdersAndNotes().then((data) => setOrdersData(data));
    fetchInventoryManagement().then((data) => setInventoryData(data));
  }, []);

  return (
    <div>
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card size="small" style={{ borderColor: "#00a7c8" }}>
            <Statistic
              title="Órdenes del Mes"
              value={summary?.total_orders}
              valueStyle={{ color: "#00a7c8" }}
              suffix={<ContainerOutlined />}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderColor: "#00a7c8" }}>
            <Statistic
              title="Notas de Consumo"
              value={summary?.total_consumption_notes}
              valueStyle={{ color: "#00a7c8" }}
              suffix={<ProfileOutlined />}
              formatter={formatter}
            />
          </Card>
        </Col>
        {/* <Col span={6}>
          <Card size="small" style={{ borderColor: "#00a7c8" }}>
            <Statistic
              title="Inventario Disponible"
              value={summary?.inventory_value}
              valueStyle={{ color: "#00a7c8" }}
              suffix={<DropboxOutlined />}
              formatter={formatter}
            />
          </Card>
        </Col> */}
        <Col span={6}>
          <Card size="small" style={{ borderColor: "#00a7c8" }}>
            <Statistic
              title="Órdenes Pendientes"
              value={summary?.pending_orders}
              valueStyle={{ color: "#00a7c8" }}
              suffix={<WarningOutlined />}
              formatter={formatter}
            />
          </Card>
        </Col>
        {/* <Col span={6}>
          <Card size="small" style={{ borderColor: "#00a7c8" }}>
            <Statistic
              title="Órdenes Retrasadas"
              value={summary?.pending_orders}
              valueStyle={{ color: "#00a7c8" }}
              suffix={<WarningOutlined />}
              formatter={formatter}
            />
          </Card>
        </Col> */}
      </Row>

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card title="Órdenes por Estado" size="small">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={ordersData?.orders_by_status || []}>
                <XAxis dataKey="status_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00a7c8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Table
            title={() => "Ordenes Recientes"}
            bordered
            size="small"
            pagination={false}
            dataSource={ordersData?.latest_orders}
            columns={[
              { title: "Proveedor", dataIndex: "supplier_name" },
              { title: "Estado", dataIndex: "status_name" },
              {
                title: "Fecha de Creación",
                dataIndex: "created_at",
                render: (created_at) => formatDate(created_at),
              },
            ]}
            rowKey="id"
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Table
            title={() => "Poductos con Stock Bajo"}
            bordered
            size="small"
            pagination={false}
            dataSource={inventoryData?.low_stock_products}
            columns={[
              { title: "Producto", dataIndex: "product_name" },
              { title: "Cantidad Disponible", dataIndex: "available_quantity" },
            ]}
            rowKey="id"
          />
        </Col>
        <Col span={12}>
          <Table
            title={() => "Tranferencias Recientes"}
            bordered
            size="small"
            pagination={false}
            dataSource={inventoryData?.recent_transfers}
            columns={[
              { title: "De", dataIndex: "from_location" },
              { title: "A", dataIndex: "to_location" },
              { title: "Realizado Por", dataIndex: "user_name" },
            ]}
            rowKey="id"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
