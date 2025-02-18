"use client";
import React from 'react';
import { Badge, Divider, Space, Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    id: string;
    code: string;
    name: string;
    states: string[];
}

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
                    <Badge key={index} status="success" text={s} />
                ))}
            </Space>
        ),
    },
    {
        title: 'Actiones',
        key: 'actions',
        render: (_, record) => (
            <Space size="middle" split={<Divider type="vertical" />}>
                <a href={"product/" + record.id} >Descargar</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        id: '001',
        code: 'A001',
        name: 'Product 1',
        states: ['Available', 'In Stock'],
    },
    {
        key: '2',
        id: '002',
        code: 'A002',
        name: 'Product 2',
        states: ['Out of Stock'],
    },
    {
        key: '3',
        id: '003',
        code: 'A003',
        name: 'Product 3',
        states: ['Available'],
    },
];

const App: React.FC = () => {
    return (
        <Table<DataType> columns={columns} dataSource={data} />
    );
}

export default App;