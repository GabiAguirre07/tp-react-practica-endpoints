import { useState } from "react";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { Saludo } from "./components/Saludo/Saludo";
import { UserList } from "./components/UserList/UserList";
import { borrarToken, guardarToken, leerToken } from "./utils/sesion";
import "./App.css";

/**
 * Componente raíz: maneja la sesión.
 *
 * Es el único que guarda el token. El estado arranca con lo que haya en el
 * Local Storage (`leerToken`), así una recarga no cierra la sesión. Sin token
 * muestra el login; con token, el saludo y la lista de usuarios.
 *
 * @returns La pantalla de login o la de usuarios, según haya sesión.
 */
export default function App() {
  const [token, setToken] = useState<string | null>(leerToken);

  /**
   * Inicia la sesión: guarda el token en el Local Storage y en el estado.
   *
   * @param nuevoToken - JWT devuelto por `POST /login`.
   */
  function handleLogin(nuevoToken: string) {
    guardarToken(nuevoToken);
    setToken(nuevoToken);
  }

  /** Cierra la sesión: borra el token del Local Storage y del estado. */
  function handleCerrarSesion() {
    borrarToken();
    setToken(null);
  }

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <main className="app">
      <header className="app-encabezado">
        <h1 className="app-titulo">Gestión de usuarios</h1>
        <Saludo token={token} onCerrarSesion={handleCerrarSesion} />
      </header>
      <UserList token={token} />
    </main>
  );
}
