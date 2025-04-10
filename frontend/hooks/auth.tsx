import useSWR from "swr";
import { useEffect, useCallback, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { message } from "antd";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: {
  middleware?: string;
  redirectIfAuthenticated?: string;
}) => {
  const router = useRouter();
  const params = useParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Función para obtener el token CSRF
  const getCsrfToken = async (): Promise<string | null> => {
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: "include" });
    const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("XSRF-TOKEN="));

    return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;
  };

  // Fetcher para useSWR
  const fetchUser = async (url: string) => {
    const token = await getCsrfToken();
    if (!token) throw new Error("No se pudo obtener el token CSRF");

    const response = await fetch(`${baseUrl}${url}`, {
      method: "GET",
      credentials: "include",
      headers: { "X-XSRF-TOKEN": token },
    });

    if (!response.ok) {
      window.location.href = "/login";
      throw new Error("Error al obtener el usuario");
    }

    return response.json();
  };

  // Obtiene el usuario autenticado
  const {
    data: user,
    error,
    mutate,
  } = useSWR(middleware === "auth" ? "/api/user" : null, fetchUser, {
    revalidateOnFocus: false,
  });

  // Registro de usuario
  const register = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      const token = await getCsrfToken();
      if (!token) throw new Error("No se pudo obtener el token CSRF");

      await fetch(`${baseUrl}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      mutate(); // Actualizar estado del usuario
    } catch (error) {
      message.error("Error al registrar");
      throw error;
    }
  };

  // Inicio de sesión
  const login = async (data: { email: string; password: string; remember: boolean }) => {
    try {
      const token = await getCsrfToken();
      if (!token) throw new Error("No se pudo obtener el token CSRF");

      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al iniciar sesión");

      console.log("Autenticación exitosa, actualizando usuario...");
      await mutate(); // Forzar actualización del usuario

    } catch (error) {
      message.error("Credenciales incorrectas");
      throw error;
    }
  };


  // Recuperación de contraseña
  const forgotPassword = async (data: { email: string }) => {
    try {
      const token = await getCsrfToken();
      if (!token) throw new Error("No se pudo obtener el token CSRF");

      return await fetch(`${baseUrl}/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  };

  // Restablecer contraseña
  const resetPassword = async (data: {
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      const token = await getCsrfToken();
      if (!token) throw new Error("No se pudo obtener el token CSRF");

      const response = await fetch(`${baseUrl}/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, token: params.token }),
      });

      router.push("/login?reset=" + btoa(response.statusText));
    } catch (error) {
      throw error;
    }
  };

  // Reenviar correo de verificación
  const resendEmailVerification = async () => {
    try {
      return await fetch(`${baseUrl}/email/verification-notification`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      throw error;
    }
  };

  // Cerrar sesión
  const logout = useCallback(async () => {
    try {
      // Llamada al endpoint de logout con credentials:include para permitir al servidor
      // enviar cabeceras que borren las cookies HttpOnly
      const token = await getCsrfToken();
      if (!token) throw new Error("No se pudo obtener el token CSRF");

      const response = await fetch(`${baseUrl}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": token
        },
      });

      if (!response.ok) {
        throw new Error('Error en el logout: ' + response.status);
      }

      // Función para borrar cookies accesibles desde JavaScript (no-HttpOnly)
      const deleteAccessibleCookies = () => {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

          // Borrar con diferentes variaciones para cubrir todos los casos posibles
          document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=;";
          document.cookie = name + "=; Path=/; Max-Age=0;";
        }
      };

      // Borra las cookies accesibles desde JavaScript
      deleteAccessibleCookies();

      mutate(null, false); // Limpiar estado de usuario en SWR
      message.success("Sesión cerrada");
      router.push("/login");
    } catch (error) {
      message.error("Error al cerrar sesión");
      console.error("Error completo:", error);
    }
  }, [mutate, router]);

  // Redirección en base a la autenticación
  useEffect(() => {
    if (middleware === "auth") {
      const timeout = setTimeout(() => {
        if (!user && !error) {
          window.location.href = "/login";
        }
        setIsCheckingAuth(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [user, error, middleware]);

  return {
    user,
    isLoading: isCheckingAuth || (!user && !error),
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
