import { useConsultaApi } from "../../hooks/useConsultaApi";
import type { UserDetail } from "../../types/user";
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
 * El pedido, el "Cargando..." y los errores los resuelve
 * {@link useConsultaApi}, que repite el pedido cada vez que cambia `userId`.
 * Quien lo usa le pasa `key={userId}`: así React crea un panel nuevo por
 * cada usuario elegido y nunca se ve, ni por un instante, el detalle del
 * usuario anterior. Si la API responde 401, avisa con `onUnauthorized`.
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
  const {
    datos: user,
    loading,
    error,
  } = useConsultaApi<UserDetail>(`/user/${userId}`, token, onUnauthorized);

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
