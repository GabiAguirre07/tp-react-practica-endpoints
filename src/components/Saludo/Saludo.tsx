import { useConsultaApi } from "../../hooks/useConsultaApi";
import type { UserDetail } from "../../types/user";
import { formatearSaludo } from "../../utils/usuarios";
import "./Saludo.css";

/** Props de {@link Saludo}. */
interface SaludoProps {
  /** JWT de la sesión actual. */
  token: string;
  /** Se llama al presionar "Cerrar sesión". */
  onCerrarSesion: () => void;
  /** Se llama si la API responde 401: el token venció o no es válido. */
  onUnauthorized: () => void;
}

/**
 * Saluda al usuario logueado y ofrece cerrar la sesión.
 *
 * El token no dice quién es el usuario, así que se hacen dos pedidos
 * encadenados con {@link useConsultaApi}: `GET /user/me/id` devuelve el id
 * del dueño del token y, cuando llega, `GET /user/{id}` trae sus datos con
 * los roles ("Hola, Martina (ADMIN)"). Mientras no hay id, la segunda ruta
 * es `null` y el hook no pide nada. Si algo falla, el saludo no se muestra
 * (la lista ya informa el error) pero el botón sigue disponible.
 *
 * @param props - {@link SaludoProps}.
 * @returns El saludo y el botón "Cerrar sesión".
 */
export function Saludo({ token, onCerrarSesion, onUnauthorized }: SaludoProps) {
  const { datos: miId } = useConsultaApi<{ id: number }>(
    "/user/me/id",
    token,
    onUnauthorized,
  );
  const { datos: usuario } = useConsultaApi<UserDetail>(
    miId ? `/user/${miId.id}` : null,
    token,
    onUnauthorized,
  );

  return (
    <div className="saludo">
      {usuario && (
        <p className="saludo-texto">
          {formatearSaludo(usuario.name, usuario.roles)}
        </p>
      )}
      <button className="saludo-boton" type="button" onClick={onCerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}
