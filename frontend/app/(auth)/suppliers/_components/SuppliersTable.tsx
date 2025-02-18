"use client";
import React from 'react';
import { Divider, Space, Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    id: string;
    name: string;
    rif: string;
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
        title: 'RIF',
        dataIndex: 'rif',
        key: 'rif',
    },
    {
        title: 'Acciones',
        key: 'actions',
        render: (_, record) => (
            <Space size="middle" split={<Divider type="vertical" />}>
                <a href={"suppliers/" + record.id} >Ver</a>
                <a>Modificar</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        id: '001',
        name: 'Proveedor 1',
        rif: 'J-12345678-1',
    },
    {
        key: '2',
        id: '002',
        name: 'Proveedor 2',
        rif: 'J-12345678-2',
    },
    {
        key: '3',
        id: '003',
        name: 'Proveedor 3',
        rif: 'J-12345678-3',
    },
    {
        key: '4',
        id: '004',
        name: 'Proveedor 4',
        rif: 'J-12345678-4',
    },
    {
        key: '5',
        id: '005',
        name: 'Proveedor 5',
        rif: 'J-12345678-5',
    },
    {
        key: '6',
        id: '006',
        name: 'Proveedor 6',
        rif: 'J-12345678-6',
    },
    {
        key: '7',
        id: '007',
        name: 'Proveedor 7',
        rif: 'J-12345678-7',
    },
    {
        key: '8',
        id: '008',
        name: 'Proveedor 8',
        rif: 'J-12345678-8',
    },
    {
        key: '9',
        id: '009',
        name: 'Proveedor 9',
        rif: 'J-12345678-9',
    },
    {
        key: '10',
        id: '010',
        name: 'Proveedor 10',
        rif: 'J-12345678-10',
    },
];

const SuppliersTable: React.FC = () => {
    return (
        <Table<DataType> columns={columns} dataSource={data} bordered pagination={{ pageSize: 5 }} />
    );
}

export default SuppliersTable;