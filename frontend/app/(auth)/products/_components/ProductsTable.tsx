"use client";
import React from 'react';
import { Badge, Divider, Space, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

const { Text } = Typography;

interface DataType {
    key: string;
    id: string;
    code: string;
    name: string;
    states: string[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Disponible':
            return <Badge status="success" text={status} />;
        case 'En Stock':
            return <Badge color='geekblue' text={status} />;
        case 'Agotado':
            return <Badge status="error" text={status} />;
        default:
            return <Badge status="default" text={status} />;
    }
};

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Código',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (_, { states }) => (
            <Space>
                {states.map((s, index) => (
                    <React.Fragment key={index}>
                        {getStatusBadge(s)}
                    </React.Fragment>
                ))}
            </Space>
        ),
    },
    {
        title: 'Acciones',
        key: 'actions',
        render: (_, record) => (
            <Space size="middle" split={<Divider type="vertical" />}>
                <a href={"products/" + record.id} >Ver</a>
                <a>Modificar</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        id: '001',
        code: 'A001',
        name: 'Producto 1',
        states: ['Disponible', 'En Stock'],
    },
    {
        key: '2',
        id: '002',
        code: 'A002',
        name: 'Producto 2',
        states: ['Agotado'],
    },
    {
        key: '3',
        id: '003',
        code: 'A003',
        name: 'Producto 3',
        states: ['Disponible'],
    },
    {
        key: '4',
        id: '004',
        code: 'A004',
        name: 'Producto 4',
        states: ['Disponible', 'En Stock'],
    },
    {
        key: '5',
        id: '005',
        code: 'A005',
        name: 'Producto 5',
        states: ['Agotado'],
    },
    {
        key: '6',
        id: '006',
        code: 'A006',
        name: 'Producto 6',
        states: ['Disponible'],
    },
    {
        key: '7',
        id: '007',
        code: 'A007',
        name: 'Producto 7',
        states: ['Disponible', 'En Stock'],
    },
    {
        key: '8',
        id: '008',
        code: 'A008',
        name: 'Producto 8',
        states: ['Agotado'],
    },
    {
        key: '9',
        id: '009',
        code: 'A009',
        name: 'Producto 9',
        states: ['Disponible'],
    },
    {
        key: '10',
        id: '010',
        code: 'A010',
        name: 'Producto 10',
        states: ['Disponible', 'En Stock'],
    },
];

const App: React.FC = () => {
    return (
        <Table<DataType>
            columns={columns}
            dataSource={data}
            bordered
            pagination={{ pageSize: 5 }}
            title={() => <Text strong style={{ fontSize: 16 }}>Listado de Productos</Text>}
        />
    );
}

export default App;