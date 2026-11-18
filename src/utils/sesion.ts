/** Clave con la que se guarda el token en el Local Storage del navegador. */
const CLAVE_TOKEN = "token";

/**
 * Lee el token guardado en el Local Storage.
 *
 * Se usa como valor inicial del estado `token` en `App`: si el usuario ya
 * había iniciado sesión, al recargar la página sigue logueado.
 *
 * @returns El token guardado, o `null` si no hay sesión iniciada.
 */
export function leerToken(): string | null {
  return localStorage.getItem(CLAVE_TOKEN);
}

/**
 * Guarda el token en el Local Storage para que sobreviva a una recarga.
 *
 * @param token - JWT devuelto por `POST /login`.
 */
export function guardarToken(token: string): void {
  localStorage.setItem(CLAVE_TOKEN, token);
}

/** Borra el token del Local Storage (cerrar sesión o sesión vencida). */
export function borrarToken(): void {
  localStorage.removeItem(CLAVE_TOKEN);
}
