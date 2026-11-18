/**
 * Qué lista de usuarios se le pide a la API.
 *
 * Es una unión discriminada: el campo `tipo` dice de qué variante se trata y
 * TypeScript sabe que `texto` solo existe cuando `tipo` es "busqueda".
 */
export type ConsultaUsuarios =
  | { tipo: "todos" }
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
    case "busqueda":
      return `Resultados para «${consulta.texto}»`;
  }
}
