import { useEffect, useState } from "react";
import type { User } from "../../types/user";
import { MENSAJE_ERROR_RED, obtenerMensajeError } from "../../utils/errores";
import "./UserList.css";

/** Props de {@link UserList}. */
interface UserListProps {
  /** JWT de la sesión actual; se manda en el encabezado `Authorization`. */
  token: string;
}

/**
 * Lista de usuarios (`GET /user`).
 *
 * Pide la lista al montarse y cada vez que cambia el token. Si la API
 * responde con error (401, 403…), muestra su `detail` en lugar de la lista.
 *
 * @param props - {@link UserListProps}.
 * @returns La sección con la lista de usuarios o el mensaje de error.
 */
export function UserList({ token }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignorar = false;

    async function cargarUsuarios() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (ignorar) {
          return;
        }
        if (!response.ok) {
          setError(obtenerMensajeError(data)); // 401, 403…: viene { detail }
          return;
        }
        setUsers(data); // 200: recién acá es una lista
      } catch {
        if (!ignorar) {
          setError(MENSAJE_ERROR_RED);
        }
      }
    }

    cargarUsuarios();
    return () => {
      ignorar = true;
    };
  }, [token]);

  return (
    <section className="user-list" aria-labelledby="user-list-titulo">
      <h2 className="user-list-titulo" id="user-list-titulo">
        Usuarios
      </h2>
      {error && (
        <p className="user-list-error" role="alert">
          {error}
        </p>
      )}
      {!error && (
        <ul className="user-list-items">
          {users.map((user) => (
            <li className="user-list-item" key={user.id}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
