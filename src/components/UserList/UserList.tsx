import { useEffect, useState } from "react";
import type { NewUser, User } from "../../types/user";
import {
  armarRutaUsuarios,
  coincideConConsulta,
  describirConsulta,
} from "../../utils/consultas";
import type { ConsultaUsuarios } from "../../utils/consultas";
import { MENSAJE_ERROR_RED, obtenerMensajeError } from "../../utils/errores";
import { UserDetailPanel } from "../UserDetailPanel/UserDetailPanel";
import { UserForm } from "../UserForm/UserForm";
import { UserSearch } from "../UserSearch/UserSearch";
import "./UserList.css";

/** Props de {@link UserList}. */
interface UserListProps {
  /** JWT de la sesión actual; se manda en el encabezado `Authorization`. */
  token: string;
}

/**
 * Lista de usuarios: completa (`GET /user`), solo mayores de edad
 * (`GET /user_mayores`) o filtrada por nombre (`GET /user/search/{name}`).
 *
 * El estado `consulta` dice qué lista se quiere ver; el efecto vuelve a
 * pedirla cada vez que cambia. Mientras espera la respuesta muestra
 * "Cargando..."; si la API responde con error (401, 403, 404…), muestra su
 * `detail` en lugar de la lista. Cada nombre es un botón: al elegirlo se
 * guarda su id en `selectedId` y se muestra su detalle en
 * {@link UserDetailPanel}. Debajo está el alta ({@link UserForm}): el usuario
 * creado se agrega a la lista sin volver a pedirla.
 *
 * @param props - {@link UserListProps}.
 * @returns La sección con el buscador, la lista (o su estado), el detalle y
 *   el formulario de alta.
 */
export function UserList({ token }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [consulta, setConsulta] = useState<ConsultaUsuarios>({ tipo: "todos" });

  useEffect(() => {
    let ignorar = false;

    async function cargarUsuarios() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}${armarRutaUsuarios(consulta)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
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
  }, [token, consulta]);

  const hayUsuarios = users.length > 0;
  const soloMayores = consulta.tipo === "mayores";

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

  /**
   * Pide solo los usuarios cuyo nombre contiene el texto.
   *
   * Siempre se crea un objeto nuevo: aunque se repita el mismo texto, React
   * ve un valor distinto y el efecto vuelve a pedir la lista.
   *
   * @param texto - Parte del nombre a buscar.
   */
  function handleBuscar(texto: string) {
    setConsulta({ tipo: "busqueda", texto });
  }

  /** Vuelve a la lista completa. */
  function handleLimpiar() {
    setConsulta({ tipo: "todos" });
  }

  /**
   * Alterna entre la lista completa y la de mayores de edad.
   *
   * Si se estaba mostrando una búsqueda, pasa a "Solo mayores".
   */
  function handleAlternarMayores() {
    setConsulta(soloMayores ? { tipo: "todos" } : { tipo: "mayores" });
  }

  /**
   * Agrega a la lista el usuario recién creado, si corresponde a la
   * consulta actual (ver `coincideConConsulta`).
   *
   * Usa la forma funcional del setter porque la lista nueva se arma a partir
   * de la anterior, con spread: no se modifica el array existente.
   *
   * @param id - Id asignado por la API.
   * @param datos - Datos con los que se creó el usuario.
   */
  function handleUsuarioCreado(id: number, datos: NewUser) {
    if (coincideConConsulta(datos, consulta)) {
      setUsers((anteriores) => [...anteriores, { id, name: datos.name }]);
    }
  }

  return (
    <section className="user-list" aria-labelledby="user-list-titulo">
      <h2 className="user-list-titulo" id="user-list-titulo">
        Usuarios
      </h2>
      <UserSearch onBuscar={handleBuscar} onLimpiar={handleLimpiar} />
      <button
        className={`user-list-filtro ${soloMayores ? "user-list-filtro-activo" : ""}`}
        type="button"
        onClick={handleAlternarMayores}
        aria-pressed={soloMayores}
      >
        {soloMayores ? "Ver todos" : "Ver solo mayores"}
      </button>
      <p className="user-list-consulta">{describirConsulta(consulta)}</p>
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
      {!loading && !error && !hayUsuarios && (
        <p className="user-list-vacia">No hay usuarios para mostrar.</p>
      )}
      {!loading && !error && hayUsuarios && (
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
      <UserForm token={token} onCreado={handleUsuarioCreado} />
    </section>
  );
}
