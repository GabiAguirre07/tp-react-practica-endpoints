import { useState } from "react";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { Saludo } from "./components/Saludo/Saludo";
import { UserList } from "./components/UserList/UserList";
import { borrarToken, guardarToken, leerToken } from "./utils/sesion";
import "./App.css";

/** Mensaje del login cuando la API rechazó el token (respuesta 401). */
const MENSAJE_SESION_VENCIDA = "Tu sesión venció";

/**
 * Componente raíz: maneja la sesión.
 *
 * Es el único que guarda el token. El estado arranca con lo que haya en el
 * Local Storage (`leerToken`), así una recarga no cierra la sesión. Sin token
 * muestra el login; con token, el saludo y la lista de usuarios.
 *
 * Los componentes que hacen pedidos no pueden cerrar la sesión por su
 * cuenta: reciben `handleSesionVencida` como prop `onUnauthorized` y la
 * llaman cuando la API responde 401.
 *
 * @returns La pantalla de login o la de usuarios, según haya sesión.
 */
export default function App() {
  const [token, setToken] = useState<string | null>(leerToken);
  const [aviso, setAviso] = useState<string | null>(null);

  /**
   * Inicia la sesión: guarda el token en el Local Storage y en el estado, y
   * borra el aviso de sesión vencida si lo había.
   *
   * @param nuevoToken - JWT devuelto por `POST /login`.
   */
  function handleLogin(nuevoToken: string) {
    guardarToken(nuevoToken);
    setToken(nuevoToken);
    setAviso(null);
  }

  /** Cierra la sesión: borra el token del Local Storage y del estado. */
  function handleCerrarSesion() {
    borrarToken();
    setToken(null);
  }

  /** Cierra la sesión y vuelve al login con el mensaje "Tu sesión venció". */
  function handleSesionVencida() {
    handleCerrarSesion();
    setAviso(MENSAJE_SESION_VENCIDA);
  }

  if (!token) {
    return <LoginForm onLogin={handleLogin} aviso={aviso} />;
  }

  return (
    <main className="app">
      <header className="app-encabezado">
        <h1 className="app-titulo">Gestión de usuarios</h1>
        <Saludo
          token={token}
          onCerrarSesion={handleCerrarSesion}
          onUnauthorized={handleSesionVencida}
        />
      </header>
      <UserList token={token} onUnauthorized={handleSesionVencida} />
    </main>
  );
}
