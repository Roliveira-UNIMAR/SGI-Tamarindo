"use client";
import React from 'react';
import { Badge, Divider, Space, Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    id: string;
    name: string;
    cedula: string;
    status: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Activo':
            return <Badge status="success" text={status} />;
        case 'No Activo':
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
        title: 'Cédula',
        dataIndex: 'cedula',
        key: 'cedula',
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
                <a href={"clients/" + record.id} >Ver</a>
                <a>Modificar</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        id: '001',
        name: 'Cliente 1',
        cedula: 'V-12345678',
        status: 'Activo',
    },
    {
        key: '2',
        id: '002',
        name: 'Cliente 2',
        cedula: 'V-87654321',
        status: 'No Activo',
    },
    {
        key: '3',
        id: '003',
        name: 'Cliente 3',
        cedula: 'V-11223344',
        status: 'Activo',
    },
    {
        key: '4',
        id: '004',
        name: 'Cliente 4',
        cedula: 'V-44332211',
        status: 'No Activo',
    },
    {
        key: '5',
        id: '005',
        name: 'Cliente 5',
        cedula: 'V-55667788',
        status: 'Activo',
    },
    {
        key: '6',
        id: '006',
        name: 'Cliente 6',
        cedula: 'V-88776655',
        status: 'No Activo',
    },
    {
        key: '7',
        id: '007',
        name: 'Cliente 7',
        cedula: 'V-99887766',
        status: 'Activo',
    },
    {
        key: '8',
        id: '008',
        name: 'Cliente 8',
        cedula: 'V-66778899',
        status: 'No Activo',
    },
    {
        key: '9',
        id: '009',
        name: 'Cliente 9',
        cedula: 'V-33445566',
        status: 'Activo',
    },
    {
        key: '10',
        id: '010',
        name: 'Cliente 10',
        cedula: 'V-22334455',
        status: 'No Activo',
    },
];

const ClientsTable: React.FC = () => {
    return (
        <Table<DataType> columns={columns} dataSource={data} bordered pagination={{ pageSize: 5 }} />
    );
}

export default ClientsTable;