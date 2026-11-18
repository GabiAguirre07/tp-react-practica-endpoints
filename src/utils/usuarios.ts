/**
 * Obtiene el primer nombre de un nombre completo.
 *
 * @param nombreCompleto - Nombre tal como lo guarda la API ("Martina Gómez").
 * @returns La primera palabra del nombre ("Martina").
 */
export function obtenerPrimerNombre(nombreCompleto: string): string {
  return nombreCompleto.trim().split(" ")[0];
}

/**
 * Arma el texto del saludo del usuario logueado.
 *
 * @param nombreCompleto - Nombre completo del usuario logueado.
 * @returns El saludo, por ejemplo "Hola, Martina".
 */
export function formatearSaludo(nombreCompleto: string): string {
  return `Hola, ${obtenerPrimerNombre(nombreCompleto)}`;
}
