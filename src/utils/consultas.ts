import type { NewUser } from "../types/user";

/**
 * Edad desde la que `GET /user_mayores` considera mayor a un usuario. Es la
 * misma regla del backend (`age >= 18`).
 */
export const EDAD_MAYORIA = 18;

/**
 * Qué lista de usuarios se le pide a la API.
 *
 * Es una unión discriminada: el campo `tipo` dice de qué variante se trata y
 * TypeScript sabe que `texto` solo existe cuando `tipo` es "busqueda".
 */
export type ConsultaUsuarios =
  | { tipo: "todos" }
  | { tipo: "mayores" }
  | { tipo: "busqueda"; texto: string };

/**
 * Arma la ruta del endpoint que corresponde a una consulta.
 *
 * Función pura. El texto de búsqueda pasa por `encodeURIComponent` para que
 * caracteres con significado especial en una URL (`#`, `?`, `/`, espacios)
 * viajen como parte del nombre buscado.
 *
 * @param consulta - La consulta elegida en la pantalla.
 * @returns La ruta relativa a `VITE_API_URL`, por ejemplo "/user/search/ma".
 */
export function armarRutaUsuarios(consulta: ConsultaUsuarios): string {
  switch (consulta.tipo) {
    case "todos":
      return "/user";
    case "mayores":
      return "/user_mayores";
    case "busqueda":
      return `/user/search/${encodeURIComponent(consulta.texto)}`;
  }
}

/**
 * Describe en palabras qué se está mostrando.
 *
 * @param consulta - La consulta actual.
 * @returns Un texto como "Todos los usuarios" o "Resultados para «ma»".
 */
export function describirConsulta(consulta: ConsultaUsuarios): string {
  switch (consulta.tipo) {
    case "todos":
      return "Todos los usuarios";
    case "mayores":
      return `Solo mayores de edad (${EDAD_MAYORIA} años o más)`;
    case "busqueda":
      return `Resultados para «${consulta.texto}»`;
  }
}

/**
 * Indica si un usuario recién creado tiene que aparecer en la lista actual.
 *
 * Función pura que repite en el front la regla del endpoint de cada
 * consulta, para agregar el usuario a la lista sin volver a pedirla:
 * - "todos": siempre.
 * - "mayores": si tiene {@link EDAD_MAYORIA} años o más.
 * - "busqueda": si el nombre contiene el texto, sin distinguir mayúsculas
 *   (igual que el `LIKE` de SQLite que usa el backend).
 *
 * @param usuario - Nombre y edad del usuario creado.
 * @param consulta - La consulta que se está mostrando.
 * @returns `true` si el usuario corresponde a la lista actual.
 */
export function coincideConConsulta(
  usuario: Pick<NewUser, "name" | "age">,
  consulta: ConsultaUsuarios,
): boolean {
  switch (consulta.tipo) {
    case "todos":
      return true;
    case "mayores":
      return usuario.age >= EDAD_MAYORIA;
    case "busqueda":
      return usuario.name.toLowerCase().includes(consulta.texto.toLowerCase());
  }
}
