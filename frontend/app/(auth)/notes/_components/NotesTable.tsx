"use client";
import React from 'react';
import { Badge, Divider, Space, Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    id: string;
    code: string;
    location: string;
    status: string;
    cedula: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Emitida':
            return <Badge color='geekblue' text={status} />;
        case 'Pendiente':
            return <Badge status="processing" color='yellow' text={status} />;
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
        title: 'Código',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Ubicación',
        dataIndex: 'location',
        key: 'location',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => getStatusBadge(status),
    },
    {
        title: 'Cédula',
        dataIndex: 'cedula',
        key: 'cedula',
    },
    {
        title: 'Acciones',
        key: 'actions',
        render: (_, record) => (
            <Space size="middle" split={<Divider type="vertical" />}>
                <a href={"notes/" + record.id} >Ver</a>
                <a>Modificar</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        id: '001',
        code: 'N001',
        location: 'Ubicación 1',
        status: 'Emitida',
        cedula: 'V-12345678',
    },
    {
        key: '2',
        id: '002',
        code: 'N002',
        location: 'Ubicación 2',
        status: 'Pendiente',
        cedula: 'V-87654321',
    },
    {
        key: '3',
        id: '003',
        code: 'N003',
        location: 'Ubicación 3',
        status: 'Anulada',
        cedula: 'V-11223344',
    },
    {
        key: '4',
        id: '004',
        code: 'N004',
        location: 'Ubicación 4',
        status: 'Emitida',
        cedula: 'V-44332211',
    },
    {
        key: '5',
        id: '005',
        code: 'N005',
        location: 'Ubicación 5',
        status: 'Pendiente',
        cedula: 'V-55667788',
    },
    {
        key: '6',
        id: '006',
        code: 'N006',
        location: 'Ubicación 6',
        status: 'Anulada',
        cedula: 'V-88776655',
    },
    {
        key: '7',
        id: '007',
        code: 'N007',
        location: 'Ubicación 7',
        status: 'Emitida',
        cedula: 'V-99887766',
    },
    {
        key: '8',
        id: '008',
        code: 'N008',
        location: 'Ubicación 8',
        status: 'Pendiente',
        cedula: 'V-66778899',
    },
    {
        key: '9',
        id: '009',
        code: 'N009',
        location: 'Ubicación 9',
        status: 'Anulada',
        cedula: 'V-33445566',
    },
    {
        key: '10',
        id: '010',
        code: 'N010',
        location: 'Ubicación 10',
        status: 'Emitida',
        cedula: 'V-22334455',
    },
];

const NotesTable: React.FC = () => {
    return (
        <Table<DataType> columns={columns} dataSource={data} bordered pagination={{ pageSize: 5 }} />
    );
}

export default NotesTable;