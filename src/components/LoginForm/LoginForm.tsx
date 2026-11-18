import { useId, useState } from "react";
import type { SubmitEvent } from "react";
import { MENSAJE_ERROR_RED, obtenerMensajeError } from "../../utils/errores";
import "./LoginForm.css";

/** Props de {@link LoginForm}. */
interface LoginFormProps {
  /** Se llama con el token cuando el login sale bien. */
  onLogin: (token: string) => void;
}

/**
 * Formulario de inicio de sesión (`POST /login`).
 *
 * Inputs controlados para email y contraseña. Si la API rechaza los datos,
 * muestra su `detail` ("User/password incorrect"); si responde bien, le pasa
 * el token a `App` con `onLogin`. Este componente no guarda el token: decide
 * qué hacer con él quien lo usa (responsabilidad única).
 *
 * @param props - {@link LoginFormProps}.
 * @returns La pantalla de login.
 */
export function LoginForm({ onLogin }: LoginFormProps) {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(obtenerMensajeError(data));
        return;
      }
      onLogin(data.token);
    } catch {
      setError(MENSAJE_ERROR_RED);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login">
      <form className="login-formulario" onSubmit={handleSubmit}>
        <h1 className="login-titulo">Iniciar sesión</h1>
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
