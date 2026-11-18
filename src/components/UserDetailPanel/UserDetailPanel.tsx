import { useEffect, useState } from "react";
import type { UserDetail } from "../../types/user";
import { MENSAJE_ERROR_RED, obtenerMensajeError } from "../../utils/errores";
import { formatearRoles } from "../../utils/usuarios";
import "./UserDetailPanel.css";

/** Props de {@link UserDetailPanel}. */
interface UserDetailPanelProps {
  /** JWT de la sesión actual. */
  token: string;
  /** Id del usuario cuyo detalle se muestra. */
  userId: number;
  /** Se llama al presionar "Cerrar". */
  onCerrar: () => void;
  /** Se llama si la API responde 401: el token venció o no es válido. */
  onUnauthorized: () => void;
}

/**
 * Muestra email, edad, país y roles de un usuario (`GET /user/{id}`).
 *
 * Mientras llega la respuesta muestra "Cargando...". El pedido se repite
 * cada vez que cambia `userId`. Quien lo usa le pasa `key={userId}`: así
 * React crea un panel nuevo por cada usuario elegido y nunca se ve, ni por
 * un instante, el detalle del usuario anterior. Si la API responde 401,
 * avisa con `onUnauthorized`.
 *
 * @param props - {@link UserDetailPanelProps}.
 * @returns El panel con los datos del usuario o el mensaje de error.
 */
export function UserDetailPanel({
  token,
  userId,
  onCerrar,
  onUnauthorized,
}: UserDetailPanelProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignorar = false;

    async function cargarDetalle() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await response.json();
        if (ignorar) {
          return;
        }
        if (response.status === 401) {
          onUnauthorized();
          return;
        }
        if (!response.ok) {
          setError(obtenerMensajeError(data));
          return;
        }
        setUser(data);
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

    cargarDetalle();
    return () => {
      ignorar = true;
    };
  }, [token, userId, onUnauthorized]);

  return (
    <aside className="user-detail" aria-label="Detalle del usuario">
      <div className="user-detail-encabezado">
        <h3 className="user-detail-titulo">{user ? user.name : "Detalle"}</h3>
        <button className="user-detail-cerrar" type="button" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
      {loading && (
        <p className="user-detail-cargando" role="status">
          Cargando...
        </p>
      )}
      {error && (
        <p className="user-detail-error" role="alert">
          {error}
        </p>
      )}
      {user && (
        <dl className="user-detail-datos">
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Edad</dt>
          <dd>{user.age} años</dd>
          <dt>País</dt>
          <dd>{user.country ? user.country.name : "Sin país"}</dd>
          <dt>Roles</dt>
          <dd>{formatearRoles(user.roles)}</dd>
        </dl>
      )}
    </aside>
  );
}
