import { useState } from "react";
import axios from "@/lib/axios";
import { message } from "antd";

export const useDestroyResource = <TData extends { id: number }>() => {
  const [loading, setLoading] = useState<boolean>(false);

  const destroyResource = async (
    endpoint: string,
    data: TData
  ): Promise<void> => {
    setLoading(true);
    try {
      await axios.delete(`api/${endpoint}/${data.id}`);
    } catch (error: unknown) {
      message.error("Error al eliminar los datos.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { destroyResource, loading };
};
