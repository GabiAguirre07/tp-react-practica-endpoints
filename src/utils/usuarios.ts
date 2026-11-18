import type { NewUser, NewUserFields } from "../types/user";

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

/**
 * Arma el texto del saludo del usuario logueado.
 *
 * Reutiliza {@link formatearRoles}, la misma función que usa el detalle de
 * un usuario, así los roles se escriben igual en toda la aplicación.
 *
 * @param nombreCompleto - Nombre completo del usuario logueado.
 * @param roles - Roles del usuario; si la lista está vacía no se muestran.
 * @returns El saludo, por ejemplo "Hola, Martina (ADMIN)".
 */
export function formatearSaludo(
  nombreCompleto: string,
  roles: readonly { name: string }[],
): string {
  const saludo = `Hola, ${obtenerPrimerNombre(nombreCompleto)}`;
  if (roles.length === 0) {
    return saludo;
  }
  return `${saludo} (${formatearRoles(roles)})`;
}

/**
 * Convierte los valores del formulario de alta en el body de `POST /user`.
 *
 * Función pura: los inputs guardan texto y la API espera números en `age` y
 * `country_id`, así que se convierten con `Number(...)` recién al enviar.
 * El nombre y el email se envían sin espacios en los extremos.
 *
 * @param campos - Valores del formulario, como texto.
 * @returns El objeto listo para `JSON.stringify`.
 */
export function crearNuevoUsuario(campos: NewUserFields): NewUser {
  return {
    name: campos.name.trim(),
    age: Number(campos.age),
    email: campos.email.trim(),
    password: campos.password,
    country_id: Number(campos.country_id),
  };
}
