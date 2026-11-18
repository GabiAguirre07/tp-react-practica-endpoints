import { useEffect, useState } from "react";
import type { User } from "../../types/user";
import { MENSAJE_ERROR_RED, obtenerMensajeError } from "../../utils/errores";
import { UserDetailPanel } from "../UserDetailPanel/UserDetailPanel";
import "./UserList.css";

/** Props de {@link UserList}. */
interface UserListProps {
  /** JWT de la sesión actual; se manda en el encabezado `Authorization`. */
  token: string;
}

/**
 * Lista de usuarios (`GET /user`).
 *
 * Pide la lista al montarse y cada vez que cambia el token. Mientras espera
 * la respuesta muestra "Cargando..."; si la API responde con error (401,
 * 403, 404…), muestra su `detail` en lugar de la lista.
 * Cada nombre es un botón: al elegirlo se guarda su id en `selectedId` y se
 * muestra su detalle en {@link UserDetailPanel}.
 *
 * @param props - {@link UserListProps}.
 * @returns La sección con la lista de usuarios o el mensaje de error.
 */
export function UserList({ token }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    let ignorar = false;

    async function cargarUsuarios() {
      setLoading(true);
      setError(null);
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
      } finally {
        if (!ignorar) {
          setLoading(false);
        }
      }
    }

    cargarUsuarios();
    return () => {
      ignorar = true;
    };
  }, [token]);

  /**
   * Muestra el detalle del usuario elegido.
   *
   * @param id - Id del usuario cuyo nombre se presionó.
   */
  function handleSeleccionar(id: number) {
    setSelectedId(id);
  }

  /** Oculta el panel de detalle. */
  function handleCerrarDetalle() {
    setSelectedId(null);
  }

  return (
    <section className="user-list" aria-labelledby="user-list-titulo">
      <h2 className="user-list-titulo" id="user-list-titulo">
        Usuarios
      </h2>
      {loading && (
        <p className="user-list-cargando" role="status">
          Cargando...
        </p>
      )}
      {!loading && error && (
        <p className="user-list-error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (
        <ul className="user-list-items">
          {users.map((user) => (
            <li className="user-list-item" key={user.id}>
              <button
                className={`user-list-nombre ${user.id === selectedId ? "user-list-nombre-activo" : ""}`}
                type="button"
                onClick={() => handleSeleccionar(user.id)}
                aria-pressed={user.id === selectedId}
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedId !== null && (
        <UserDetailPanel
          key={selectedId}
          token={token}
          userId={selectedId}
          onCerrar={handleCerrarDetalle}
        />
      )}
    </section>
  );
}
