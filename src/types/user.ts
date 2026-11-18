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

/** Rol asignado a un usuario (`ADMIN` o `REGULAR` en los datos de prueba). */
export interface Role {
  id: number;
  /** Nombre del rol, por ejemplo "ADMIN". */
  name: string;
}

/** País de un usuario. */
export interface Country {
  id: number;
  /** Nombre del país, por ejemplo "Argentina". */
  name: string;
}

/**
 * Usuario con todos sus datos, tal como lo devuelve `GET /user/{id}`.
 *
 * Extiende {@link User}: todo `UserDetail` también es un `User`, así que se
 * puede usar en cualquier lugar donde se espere un `User`.
 */
export interface UserDetail extends User {
  /** Edad en años. */
  age: number;
  email: string;
  /** País del usuario; `null` si no tiene uno asignado. */
  country: Country | null;
  /** Roles del usuario; la lista puede venir vacía. */
  roles: Role[];
}
