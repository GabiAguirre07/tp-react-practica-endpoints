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

/**
 * Une los nombres de los roles en un solo texto.
 *
 * @param roles - Roles del usuario (solo se usa `name`).
 * @returns Los nombres separados por coma ("ADMIN, REGULAR"), o "Sin roles"
 *   si la lista está vacía.
 */
export function formatearRoles(roles: readonly { name: string }[]): string {
  if (roles.length === 0) {
    return "Sin roles";
  }
  return roles.map((rol) => rol.name).join(", ");
}
