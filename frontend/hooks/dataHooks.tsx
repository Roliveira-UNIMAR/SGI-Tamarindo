import { useEffect, useState } from "react";
import { message } from "antd";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Error en la solicitud.");
  }
  return response.json();
};

export const useStoreResource = <TData,>() => {
  const [loading, setLoading] = useState<boolean>(false);

  const execute = async (endpoint: string, data: TData): Promise<void> => {
    setLoading(true);
    try {
      const token = await getCsrfToken();
      if (!token) throw new Error("No se pudo obtener el token CSRF");

      console.log(data)
      const response = await fetch(`${baseUrl}/api/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await handleResponse(response);
      message.success("Datos guardados correctamente.");
    } catch (error: unknown) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};


// Función para obtener el token CSRF
export const getCsrfToken = async (): Promise<string | null> => {
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: "include" });
  const tokenCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("XSRF-TOKEN="));

  return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;
};

export const useUpdateResource = <TData extends { id: number }>() => {
  const [loading, setLoading] = useState<boolean>(false);

  const execute = async (endpoint: string, data: TData): Promise<void> => {
    setLoading(true);
    try {
      const token = await getCsrfToken();
      if (!token) throw new Error("No se pudo obtener el token CSRF");

      const response = await fetch(`${baseUrl}/api/${endpoint}/${data.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await handleResponse(response);
      message.success("Datos actualizados correctamente.");
    } catch (error: unknown) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};


export const useFetchResource = <TData,>(url: string) => {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/${url}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const result = await handleResponse(response);
        setData(result);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, refetchTrigger]);

  return { data, loading, error, refetch };
};

