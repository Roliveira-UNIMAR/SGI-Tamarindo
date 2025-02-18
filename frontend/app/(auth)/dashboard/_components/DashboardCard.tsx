import React from "react";
import { Card } from "antd";

interface DashboardCardProps {
  title: string;
  value: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
  return (
    <Card title={title} style={{ width: 250 }}>
      <p>{value}</p>
    </Card>
  );
};

export default DashboardCard;