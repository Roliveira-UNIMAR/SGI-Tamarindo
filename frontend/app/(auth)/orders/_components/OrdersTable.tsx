"use client";
import React from 'react';
import { Badge, Divider, Space, Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    id: string;
    orderedBy: string;
    directedToProvider: string;
    receivedDate: string;
    status: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Emitida':
            return <Badge color='geekblue' text={status} />;
        case 'Pendiente':
            return <Badge status="processing" text={status} />;
        case 'Anulada':
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
        title: 'Quien Ordena',
        dataIndex: 'orderedBy',
        key: 'orderedBy',
    },
    {
        title: 'Dirigido a Proveedor',
        dataIndex: 'directedToProvider',
        key: 'directedToProvider',
    },
    {
        title: 'Se Recibe',
        dataIndex: 'receivedDate',
        key: 'receivedDate',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => getStatusBadge(status),
    },
    {
        title: 'Acciones',
        key: 'actions',
        render: (_, record) => (
            <Space size="middle" split={<Divider type="vertical" />}>
                <a href={"orders/" + record.id} >Ver</a>
                <a>Modificar</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        id: '001',
        orderedBy: 'Usuario 1',
        directedToProvider: 'Proveedor A',
        receivedDate: '2023-12-01',
        status: 'Emitida',
    },
    {
        key: '2',
        id: '002',
        orderedBy: 'Usuario 2',
        directedToProvider: 'Proveedor B',
        receivedDate: '2023-12-05',
        status: 'Pendiente',
    },
    {
        key: '3',
        id: '003',
        orderedBy: 'Usuario 3',
        directedToProvider: 'Proveedor C',
        receivedDate: '2023-12-10',
        status: 'Anulada',
    },
    {
        key: '4',
        id: '004',
        orderedBy: 'Usuario 4',
        directedToProvider: 'Proveedor D',
        receivedDate: '2023-12-15',
        status: 'Emitida',
    },
    {
        key: '5',
        id: '005',
        orderedBy: 'Usuario 5',
        directedToProvider: 'Proveedor E',
        receivedDate: '2023-12-20',
        status: 'Pendiente',
    },
    {
        key: '6',
        id: '006',
        orderedBy: 'Usuario 6',
        directedToProvider: 'Proveedor F',
        receivedDate: '2023-12-25',
        status: 'Anulada',
    },
    {
        key: '7',
        id: '007',
        orderedBy: 'Usuario 7',
        directedToProvider: 'Proveedor G',
        receivedDate: '2023-12-30',
        status: 'Emitida',
    },
    {
        key: '8',
        id: '008',
        orderedBy: 'Usuario 8',
        directedToProvider: 'Proveedor H',
        receivedDate: '2024-01-05',
        status: 'Pendiente',
    },
    {
        key: '9',
        id: '009',
        orderedBy: 'Usuario 9',
        directedToProvider: 'Proveedor I',
        receivedDate: '2024-01-10',
        status: 'Anulada',
    },
    {
        key: '10',
        id: '010',
        orderedBy: 'Usuario 10',
        directedToProvider: 'Proveedor J',
        receivedDate: '2024-01-15',
        status: 'Emitida',
    },
];

const OrdersTable: React.FC = () => {
    return (
        <Table<DataType> columns={columns} dataSource={data} bordered pagination={{ pageSize: 5 }} />
    );
}

export default OrdersTable;