import { useEffect, useState } from "react";
import type { User } from "../../types/user";
import { formatearSaludo } from "../../utils/usuarios";
import "./Saludo.css";

/** Props de {@link Saludo}. */
interface SaludoProps {
  /** JWT de la sesión actual. */
  token: string;
  /** Se llama al presionar "Cerrar sesión". */
  onCerrarSesion: () => void;
}

/**
 * Saluda al usuario logueado y ofrece cerrar la sesión.
 *
 * El token no dice quién es el usuario, así que se hacen dos pedidos
 * encadenados: `GET /user/me/id` devuelve el id del dueño del token y
 * `GET /user/{id}` sus datos. Si alguno falla, el saludo no se muestra (la
 * lista de usuarios ya informa el error) pero el botón sigue disponible.
 *
 * @param props - {@link SaludoProps}.
 * @returns El saludo y el botón "Cerrar sesión".
 */
export function Saludo({ token, onCerrarSesion }: SaludoProps) {
  const [usuario, setUsuario] = useState<User | null>(null);

  useEffect(() => {
    let ignorar = false;

    async function cargarUsuario() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const responseId = await fetch(
          `${import.meta.env.VITE_API_URL}/user/me/id`,
          { headers },
        );
        const dataId = await responseId.json();
        if (!responseId.ok) {
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${dataId.id}`,
          { headers },
        );
        const data = await response.json();
        if (!ignorar && response.ok) {
          setUsuario(data);
        }
      } catch {
        // Sin conexión no hay saludo; la lista muestra el error.
      }
    }

    cargarUsuario();
    return () => {
      ignorar = true;
    };
  }, [token]);

  return (
    <div className="saludo">
      {usuario && (
        <p className="saludo-texto">{formatearSaludo(usuario.name)}</p>
      )}
      <button className="saludo-boton" type="button" onClick={onCerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}
