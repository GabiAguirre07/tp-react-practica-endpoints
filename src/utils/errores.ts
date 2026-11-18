/**
 * Mensaje para cuando no llega una respuesta legible de la API: el backend
 * está apagado, la URL es incorrecta o la API tuvo un error interno (500),
 * que FastAPI responde sin encabezados CORS y el navegador no deja leer.
 */
export const MENSAJE_ERROR_RED =
  "No se pudo completar el pedido: la API no respondió o tuvo un error interno. Verificá que el backend esté levantado.";

/** Un error de validación de FastAPI (código 422). */
interface ErrorValidacion {
  /** Descripción del problema, por ejemplo "Input should be a valid integer...". */
  msg: string;
}

/**
 * Cuerpo de una respuesta de error de FastAPI.
 *
 * `detail` es un texto en los errores que lanza el backend con
 * `HTTPException` (401, 403, 404) y una lista de errores de validación
 * cuando FastAPI rechaza los datos recibidos (422).
 */
export interface RespuestaError {
  detail: string | ErrorValidacion[];
}

/**
 * Obtiene un mensaje legible a partir del cuerpo de un error de la API.
 *
 * Función pura. Si `detail` es un texto lo devuelve tal cual; si es una
 * lista de errores de validación, une sus mensajes. Así ningún componente
 * intenta mostrar un array de objetos (React no puede renderizarlo).
 *
 * @param datos - Cuerpo JSON de la respuesta con error.
 * @returns El mensaje para mostrar en pantalla.
 */
export function obtenerMensajeError(datos: RespuestaError): string {
  if (typeof datos.detail === "string") {
    return datos.detail;
  }
  return datos.detail.map((error) => error.msg).join(". ");
}
