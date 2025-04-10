import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Divider,
  message,
  Space,
  Table,
  Input,
  Button,
  Form,
  Select,
} from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";

interface DataTableProps<T> extends Omit<TableProps<T>, "dataSource"> {
  endpoint: string;
  filters?: { key: keyof T; label: string }[];
  statusOptions?: { value: string; label: string }[];
  onFetchData?: (queryParams: string) => Promise<T[]>;
  createForm?: () => React.ReactNode;
  editForm?: (record: T) => React.ReactNode;
  detailView?: (record: T) => React.ReactNode;
  onCreate?: () => void;
  onEdit?: (record: T) => void;
  onView?: (record: T) => void;
  showActions?: boolean;
}

const DataTable = <T extends { id: number | undefined; status_id?: number }>({
  endpoint,
  columns = [],
  scroll = { x: "max-content", y: 340 },
  filters = [],
  statusOptions = [],
  onFetchData,
  createForm,
  editForm,
  detailView,
  onCreate,
  onEdit,
  onView,
  showActions = true,
  ...props
}: DataTableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValues, setSearchValues] = useState<Partial<T>>({});
  const [roleId, setRoleId] = useState<number | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/user`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al obtener el usuario");

        const user = await response.json();
        setRoleId(user.role_id);
      } catch (error) {
        message.error("Error al obtener el rol del usuario.");
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [baseUrl]);

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

  const dynamicColumns = useMemo(
    () =>
      [
        ...columns,
        showActions
          ? {
              title: "Acciones",
              key: "actions",
              fixed: "right" as const,
              width: 120,
              render: (_: unknown, record: T) => (
                <Space split={<Divider type="vertical" />}>
                  {detailView && (
                    <Button
                      type="default"
                      onClick={() => onView?.(record)}
                      icon={<EyeOutlined />}
                      style={{ color: "green" }}
                    >
                      Ver
                    </Button>
                  )}
                  {editForm && roleId !== 8 && (
                    <Button
                      type="default"
                      onClick={() => onEdit?.(record)}
                      icon={<EditOutlined />}
                      style={{ color: "blue" }}
                    >
                      Editar
                    </Button>
                  )}
                </Space>
              ),
            }
          : null,
      ].filter((col) => col !== null),
    [columns, detailView, editForm, onEdit, onView, showActions, roleId]
  );

  return (
    <div>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Form layout="inline">
          {filters.map((filter) => (
            <Form.Item key={filter.key as string} label={filter.label}>
              <Input
                value={searchValues[filter.key]?.toString() || ""}
                onChange={(e) =>
                  setSearchValues((prev) => ({
                    ...prev,
                    [filter.key]: e.target.value,
                  }))
                }
                placeholder={`Buscar por ${filter.label}`}
              />
            </Form.Item>
          ))}
          {statusOptions.length > 0 && (
            <Form.Item label="Estado">
              <Select
                value={searchValues.status_id}
                onChange={(value) =>
                  setSearchValues((prev) => ({ ...prev, status_id: value }))
                }
                options={statusOptions}
                placeholder="Seleccione un estado"
                allowClear
              />
            </Form.Item>
          )}
          {!!filters && Object.keys(filters).length > 0 && (
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Buscar
            </Button>
            <Button icon={<ClearOutlined />} onClick={handleClear}>
              Limpiar
            </Button>
          </Space>
          )}
        </Form>

        {createForm && roleId !== 8 && showActions && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            Crear
          </Button>
        )}
      </Space>

      <Table<T>
        columns={dynamicColumns}
        dataSource={data}
        bordered
        loading={loading}
        size="small"
        scroll={scroll}
        tableLayout="fixed"
        rowKey="id"
        {...props}
      />
    </div>
  );
};

export default DataTable;
