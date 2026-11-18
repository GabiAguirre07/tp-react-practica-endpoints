import { useId, useState } from "react";
import type { SubmitEvent } from "react";
import "./UserSearch.css";

/** Props de {@link UserSearch}. */
interface UserSearchProps {
  /** Se llama con el texto escrito (sin espacios en los extremos) al buscar. */
  onBuscar: (texto: string) => void;
  /** Se llama al presionar "Limpiar". */
  onLimpiar: () => void;
}

/**
 * Buscador de usuarios por nombre: un input, "Buscar" y "Limpiar".
 *
 * No hace pedidos a la API: solo junta el texto y avisa qué quiere el
 * usuario. Quién pide los datos y cómo es responsabilidad de `UserList`.
 * Es un formulario, así que también se busca con Enter.
 *
 * @param props - {@link UserSearchProps}.
 * @returns El formulario de búsqueda.
 */
export function UserSearch({ onBuscar, onLimpiar }: UserSearchProps) {
  const [texto, setTexto] = useState("");
  const idInput = useId();

  const textoLimpio = texto.trim();
  const puedeBuscar = textoLimpio !== "";

  /**
   * Avisa la búsqueda pedida sin recargar la página.
   *
   * @param evento - Evento de envío del formulario.
   */
  function handleSubmit(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (puedeBuscar) {
      onBuscar(textoLimpio);
    }
  }

  /** Vacía el input y avisa que se quiere volver a la lista completa. */
  function handleLimpiar() {
    setTexto("");
    onLimpiar();
  }

  return (
    <form className="user-search" role="search" onSubmit={handleSubmit}>
      <label className="user-search-etiqueta" htmlFor={idInput}>
        Buscar por nombre
      </label>
      <div className="user-search-fila">
        <input
          className="user-search-input"
          id={idInput}
          type="search"
          placeholder="Ej: ma"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoComplete="off"
        />
        <button
          className="user-search-boton"
          type="submit"
          disabled={!puedeBuscar}
        >
          Buscar
        </button>
        <button
          className="user-search-boton user-search-boton-secundario"
          type="button"
          onClick={handleLimpiar}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
