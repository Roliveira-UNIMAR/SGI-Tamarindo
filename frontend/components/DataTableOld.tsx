"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Divider,
  message,
  Space,
  Table,
  Input,
  Button,
  Form,
  Select,
  Modal,
} from "antd";
import { SearchOutlined, ClearOutlined, PlusOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";

interface DataTableProps<T> extends Omit<TableProps<T>, "dataSource"> {
  endpoint: string;
  filters?: { key: keyof T; label: string }[];
  statusOptions?: { value: string; label: string }[];
  showCreateButton?: boolean;
  createForm?: (submit: (values: T) => Promise<T>) => React.ReactNode;
  editForm?: (record: T, submit: (values: T) => Promise<T>) => React.ReactNode;
  detailView?: (record: T) => React.ReactNode;
  onFetchData?: (queryParams: string) => Promise<T[]>;
  onCustomCreate?: (values: T) => Promise<T>;
  onCustomUpdate?: (id: number, values: T) => Promise<T>;
  createTitle?: string;
  updateTitle?: string;
  viewTitle?: string;
}

const DataTable = <T extends { id: number | undefined; status_id?: number }>({
  endpoint,
  columns = [],
  pagination = { pageSize: 25 },
  scroll = { x: "max-content", y: 340 },
  filters = [],
  statusOptions = [],
  showCreateButton = false,
  createForm,
  editForm,
  detailView,
  onFetchData,
  onCustomCreate,
  onCustomUpdate,
  createTitle,
  updateTitle,
  viewTitle,
  ...props
}: DataTableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValues, setSearchValues] = useState<Partial<T>>({});
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [modalType, setModalType] = useState<"create" | "edit" | "detail" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(
    async (queryParams = "") => {
      setLoading(true);
      try {
        const result = onFetchData
          ? await onFetchData(queryParams)
          : await defaultFetcher(endpoint, queryParams);

        setData(result.map((item: T) => ({ ...item, key: item.id })));
      } catch (error) {
        console.error("Fetch error:", error);
        message.error("Error al cargar la data.");
      } finally {
        setLoading(false);
      }
    },
    [endpoint, onFetchData]
  );

  const defaultFetcher = async (endpoint: string, queryParams: string) => {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${baseURL}/api/${endpoint}${queryParams}`, {
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    if (!response.ok) throw new Error(`Error al obtener los datos.`);
    return response.json();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    Object.entries(searchValues).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        queryParams.append(key, value.toString());
      }
    });

    fetchData(`?${queryParams.toString()}`);
  };

  const handleClear = () => {
    setSearchValues({});
    fetchData();
  };

  const handleModalSubmit = async (values: T) => {
    try {
      let result: T;

      if (modalType === 'edit' && selectedItem?.id) {
        result = onCustomUpdate
          ? await onCustomUpdate(selectedItem.id, values)
          : await defaultUpdate(selectedItem.id, values);
      } else if (modalType === 'create') {
        result = onCustomCreate
          ? await onCustomCreate(values)
          : await defaultCreate(values);
      } else {
        throw new Error('Operación inválida');
      }

      message.success(modalType === 'edit' ? 'Registro actualizado' : 'Registro creado');
      setModalType(null);
      setSelectedItem(null);
      await fetchData();
      return result;
    } catch (error) {
      console.error(`${modalType} error:`, error);
      message.error(`Error al ${modalType === 'edit' ? 'actualizar' : 'crear'} el registro`);
      throw error;
    }
  };

  const defaultCreate = async (values: T) => {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${baseURL}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    return response.json();
  };

  const defaultUpdate = async (id: number, values: T) => {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${baseURL}/api/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    return response.json();
  };

  const dynamicColumns = useMemo(
    () => [
      ...columns,
      {
        title: "Acciones",
        key: "actions",
        fixed: 'right' as const,
        width: 150,
        render: (_: unknown, record: T) => (
          <Space split={<Divider type="vertical" />}>
            <Button
              type="default"
              onClick={() => {
                setSelectedItem(record);
                setModalType('detail');
                setIsModalOpen(true)
              }}
              icon={<EyeOutlined/>}
              style={{ color: "green" }}
            >
              Ver
            </Button>
            <Button
              type="default"
              onClick={() => {
                setSelectedItem(record);
                setModalType('edit');
                setIsModalOpen(true)
              }}
              icon={<EditOutlined/>}
              style={{ color: "blue" }}
            >
              Editar
            </Button>
          </Space>
        ),
      },
    ],
    [columns]
  );

  return (
    <div>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Form layout="inline">
          {filters.map((filter) => (
            <Form.Item key={filter.key as string} label={filter.label}>
              <Input
                value={searchValues[filter.key]?.toString() || ""}
                onChange={(e) => setSearchValues(prev => ({
                  ...prev,
                  [filter.key]: e.target.value
                }))}
                placeholder={`Buscar por ${filter.label}`}
              />
            </Form.Item>
          ))}

          {statusOptions.length > 0 && (
            <Form.Item label="Estado">
              <Select
                value={searchValues.status_id?.toString() || ""}
                style={{ width: 140 }}
                onChange={(value) => setSearchValues(prev => ({
                  ...prev,
                  status_id: value
                }))}
                options={statusOptions}
                placeholder="Seleccionar Estado"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
            >
              Buscar
            </Button>
          </Form.Item>

          <Form.Item>
            <Button onClick={handleClear} icon={<ClearOutlined />}>
              Limpiar
            </Button>
          </Form.Item>
        </Form>

        {showCreateButton && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalType('create')}
          >
            Nuevo
          </Button>
        )}
      </Space>

      <Table<T>
        columns={dynamicColumns}
        dataSource={data}
        bordered
        pagination={pagination}
        loading={loading}
        size="small"
        scroll={scroll}
        tableLayout="fixed"
        rowKey="id"
        {...props}
      />

      <Modal
        title={
          modalType === 'create' ? createTitle || 'Nuevo Registro' :
          modalType === 'edit' ? updateTitle || 'Editar Registro' :
          viewTitle || 'Detalles del Registro'
        }
        open={!!modalType && isModalOpen}
        onCancel={() => {
          setModalType(null);
          setSelectedItem(null);
          fetchData();
          setIsModalOpen(false)
        }}
        footer={null}
        destroyOnClose
        width={modalType === 'detail' ? 800 : 1000}
      >

      {modalType !== 'detail' && (
        <span style={{ color: "red", marginBottom: 24 }}>* Indica que el campo es obligatorio</span>
      )}


        {modalType === 'detail' && selectedItem && (
          detailView ? detailView(selectedItem) : (
            <div>
              <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
            </div>
          )
        )}

        {modalType === 'create' && createForm?.(handleModalSubmit)}

        {modalType === 'edit' && selectedItem &&
          editForm?.(selectedItem, handleModalSubmit)}
      </Modal>
    </div>
  );
};

export default DataTable;
