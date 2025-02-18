"use client";
import React from 'react';
import { Badge, Divider, Space, Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    id: string;
    full_name: string;
    document_identity: string;
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
        dataIndex: 'full_name',
        key: 'full_name',
    },
    {
        title: 'Cédula',
        dataIndex: 'document_identity',
        key: 'document_identity',
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
                <a href={"users/" + record.id} >Ver</a>
                <a>Modificar</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        id: '001',
        full_name: 'Usuario 1',
        document_identity: 'V-12345678',
        status: 'Activo',
    },
    {
        key: '2',
        id: '002',
        full_name: 'Usuario 2',
        document_identity: 'V-87654321',
        status: 'No Activo',
    },
    {
        key: '3',
        id: '003',
        full_name: 'Usuario 3',
        document_identity: 'V-11223344',
        status: 'Activo',
    },
    {
        key: '4',
        id: '004',
        full_name: 'Usuario 4',
        document_identity: 'V-44332211',
        status: 'No Activo',
    },
    {
        key: '5',
        id: '005',
        full_name: 'Usuario 5',
        document_identity: 'V-55667788',
        status: 'Activo',
    },
    {
        key: '6',
        id: '006',
        full_name: 'Usuario 6',
        document_identity: 'V-88776655',
        status: 'No Activo',
    },
    {
        key: '7',
        id: '007',
        full_name: 'Usuario 7',
        document_identity: 'V-99887766',
        status: 'Activo',
    },
    {
        key: '8',
        id: '008',
        full_name: 'Usuario 8',
        document_identity: 'V-66778899',
        status: 'No Activo',
    },
    {
        key: '9',
        id: '009',
        full_name: 'Usuario 9',
        document_identity: 'V-33445566',
        status: 'Activo',
    },
    {
        key: '10',
        id: '010',
        full_name: 'Usuario 10',
        document_identity: 'V-22334455',
        status: 'No Activo',
    },
];

const UsersTable: React.FC = () => {
    return (
        <Table<DataType> columns={columns} dataSource={data} bordered pagination={{ pageSize: 5 }} />
    );
}

export default UsersTable;