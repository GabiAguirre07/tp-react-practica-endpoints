import { useId, useState } from "react";
import type { SubmitEvent } from "react";
import { obtenerMensaje, pedirApi } from "../../api/cliente";
import "./LoginForm.css";

/** Props de {@link LoginForm}. */
interface LoginFormProps {
  /** Se llama con el token cuando el login sale bien. */
  onLogin: (token: string) => void;
  /** Mensaje para mostrar arriba del formulario, por ejemplo "Tu sesión venció". */
  aviso: string | null;
}

/**
 * Formulario de inicio de sesión (`POST /login`).
 *
 * Inputs controlados para email y contraseña. Si la API rechaza los datos,
 * muestra su `detail` ("User/password incorrect"); si responde bien, le pasa
 * el token a `App` con `onLogin`. Este componente no guarda el token: decide
 * qué hacer con él quien lo usa (responsabilidad única). Si `App` le pasa
 * un `aviso` (sesión vencida), lo muestra arriba del formulario.
 *
 * @param props - {@link LoginFormProps}.
 * @returns La pantalla de login.
 */
export function LoginForm({ onLogin, aviso }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const idEmail = useId();
  const idPassword = useId();

  /**
   * Envía las credenciales a la API.
   *
   * `preventDefault` evita que el navegador recargue la página al enviar el
   * formulario. Mientras espera la respuesta, el botón queda deshabilitado
   * para no mandar el pedido dos veces.
   *
   * @param evento - Evento de envío del formulario.
   */
  async function handleSubmit(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const data = await pedirApi<{ token: string }>("/login", {
        method: "POST",
        body: { email, password },
      });
      onLogin(data.token);
    } catch (e) {
      setError(obtenerMensaje(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login">
      <form className="login-formulario" onSubmit={handleSubmit}>
        <h1 className="login-titulo">Iniciar sesión</h1>
        {aviso && (
          <p className="login-aviso" role="alert">
            {aviso}
          </p>
        )}
        <label className="login-etiqueta" htmlFor={idEmail}>
          Email
        </label>
        <input
          className="login-input"
          id={idEmail}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <label className="login-etiqueta" htmlFor={idPassword}>
          Contraseña
        </label>
        <input
          className="login-input"
          id={idPassword}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button className="login-boton" type="submit" disabled={enviando}>
          Ingresar
        </button>
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
