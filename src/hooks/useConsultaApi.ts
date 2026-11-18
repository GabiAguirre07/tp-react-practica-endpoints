import { useEffect, useState } from "react";
import { esNoAutorizado, obtenerMensaje, pedirApi } from "../api/cliente";

/**
 * Hook propio para leer datos de la API (pedidos GET) desde un componente.
 *
 * Reúne el patrón que se repetía en cada componente: los estados `datos`,
 * `loading` y `error`, el `useEffect` que pide los datos cuando cambia la
 * ruta, el descarte de respuestas viejas (`ignorar`) y el aviso de sesión
 * vencida cuando la API responde 401.
 *
 * @typeParam T - Tipo de los datos que devuelve el endpoint.
 * @param ruta - Ruta del endpoint, o `null` para no pedir nada todavía
 *   (sirve para encadenar pedidos que dependen de otro).
 * @param token - JWT de la sesión.
 * @param onUnauthorized - Se llama si la API responde 401.
 * @returns Los datos (o `null` mientras no hay), `loading`, `error` y
 *   `setDatos`, para actualizar los datos sin volver a pedirlos.
 */
export function useConsultaApi<T>(
  ruta: string | null,
  token: string,
  onUnauthorized: () => void,
) {
  const [datos, setDatos] = useState<T | null>(null);
  const [loading, setLoading] = useState(ruta !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ruta === null) {
      return;
    }
    const rutaPedida = ruta;
    let ignorar = false;

    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const respuesta = await pedirApi<T>(rutaPedida, { token });
        if (!ignorar) {
          setDatos(respuesta);
        }
      } catch (e) {
        if (ignorar) {
          return;
        }
        if (esNoAutorizado(e)) {
          onUnauthorized();
          return;
        }
        setError(obtenerMensaje(e));
      } finally {
        if (!ignorar) {
          setLoading(false);
        }
      }
    }

    cargar();
    return () => {
      ignorar = true;
    };
  }, [ruta, token, onUnauthorized]);

  return { datos, setDatos, loading, error };
}
