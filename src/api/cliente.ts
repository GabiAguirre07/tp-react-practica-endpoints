import { MENSAJE_ERROR_RED, obtenerMensajeError } from "../utils/errores";
import type { RespuestaError } from "../utils/errores";

/** URL base de la API. Es el único lugar del código que lee la variable de entorno. */
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Error de un pedido a la API.
 *
 * Extiende `Error` (así `message` tiene el texto para mostrar) y agrega el
 * código HTTP de la respuesta. `status` es 0 cuando no hubo respuesta
 * legible (backend apagado o error interno sin CORS).
 */
export class ErrorApi extends Error {
  readonly status: number;

  /**
   * @param status - Código HTTP de la respuesta, o 0 si no la hubo.
   * @param mensaje - Texto para mostrar en pantalla.
   */
  constructor(status: number, mensaje: string) {
    super(mensaje);
    this.name = "ErrorApi";
    this.status = status;
  }
}

/** Opciones de {@link pedirApi}. */
interface OpcionesPedido {
  /** JWT de la sesión. Si está, se manda el encabezado `Authorization`. */
  token?: string;
  /** Método HTTP; por defecto "GET". */
  method?: "GET" | "POST" | "DELETE";
  /** Datos a enviar como JSON. Si está, se manda `Content-Type`. */
  body?: unknown;
}

/**
 * Hace un pedido a la API y devuelve el cuerpo de la respuesta ya leído.
 *
 * Centraliza lo que antes se repetía en cada componente: la URL base, el
 * encabezado `Authorization: Bearer ...`, el `Content-Type` del body, el
 * chequeo de `response.ok` y la lectura del `detail` de los errores. Si el
 * backend cambia la forma de mandar el token, se modifica solo esta función.
 *
 * @typeParam T - Tipo del cuerpo de una respuesta exitosa.
 * @param ruta - Ruta del endpoint, por ejemplo "/user/3".
 * @param opciones - {@link OpcionesPedido}.
 * @returns El cuerpo de la respuesta exitosa.
 * @throws {@link ErrorApi} si la API responde con error o no responde.
 */
export async function pedirApi<T>(
  ruta: string,
  { token, method = "GET", body }: OpcionesPedido = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  let data: unknown;
  try {
    response = await fetch(`${API_URL}${ruta}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    data = await response.json();
  } catch {
    throw new ErrorApi(0, MENSAJE_ERROR_RED);
  }

  if (!response.ok) {
    throw new ErrorApi(
      response.status,
      obtenerMensajeError(data as RespuestaError),
    );
  }
  return data as T;
}

/**
 * Indica si un error significa que la sesión ya no es válida (401).
 *
 * @param error - Lo que se atrapó en un `catch`.
 * @returns `true` si es un {@link ErrorApi} con status 401.
 */
export function esNoAutorizado(error: unknown): boolean {
  return error instanceof ErrorApi && error.status === 401;
}

/**
 * Obtiene el texto para mostrar a partir de un error atrapado.
 *
 * @param error - Lo que se atrapó en un `catch`.
 * @returns El mensaje del {@link ErrorApi}, o el mensaje genérico de red.
 */
export function obtenerMensaje(error: unknown): string {
  return error instanceof ErrorApi ? error.message : MENSAJE_ERROR_RED;
}
