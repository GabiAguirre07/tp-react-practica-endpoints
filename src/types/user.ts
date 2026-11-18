/**
 * Usuario tal como lo devuelve la lista `GET /user`: solo `id` y `name`.
 *
 * Es el tipo base del front: los endpoints que devuelven más datos se tipan
 * extendiendo esta interfaz, y de las respuestas que traen el usuario
 * completo (incluida la contraseña hasheada) solo se usan estos dos campos.
 */
export interface User {
  /** Identificador único del usuario en la base de datos. */
  id: number;
  /** Nombre completo, por ejemplo "Martina Gómez". */
  name: string;
}
