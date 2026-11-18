import { useId, useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import type { Country, NewUser, NewUserFields } from "../../types/user";
import { esNoAutorizado, obtenerMensaje, pedirApi } from "../../api/cliente";
import { crearNuevoUsuario } from "../../utils/usuarios";
import "./UserForm.css";

/**
 * Países disponibles. La API no tiene un endpoint de países, así que se
 * escriben a mano con los mismos ids que siembra el backend.
 */
const PAISES: readonly Country[] = [
  { id: 1, name: "Argentina" },
  { id: 2, name: "Brasil" },
];

/** Valores iniciales del formulario (también se usan para vaciarlo). */
const CAMPOS_VACIOS: NewUserFields = {
  name: "",
  age: "",
  email: "",
  password: "",
  country_id: "",
};

/** Largo mínimo de la contraseña (el backend rechaza las más cortas). */
const LARGO_MINIMO_PASSWORD = 4;

/** Props de {@link UserForm}. */
interface UserFormProps {
  /** JWT de la sesión actual. */
  token: string;
  /**
   * Se llama cuando la API confirma el alta.
   *
   * @param id - Id que la API le asignó al usuario nuevo.
   * @param datos - Datos con los que se creó.
   */
  onCreado: (id: number, datos: NewUser) => void;
  /** Se llama si la API responde 401: el token venció o no es válido. */
  onUnauthorized: () => void;
}

/**
 * Formulario de alta de usuario (`POST /user`).
 *
 * Guarda todos los campos en un solo estado `campos` (un objeto de textos)
 * y los actualiza con un único handler gracias al atributo `name` de cada
 * input. Al enviar convierte los textos con `crearNuevoUsuario` (edad y país
 * como número). Si la API responde con error, por ejemplo
 * "Missing permission: write_users" al usar `sfer`, muestra ese mensaje;
 * si responde 401, avisa con `onUnauthorized`.
 *
 * @param props - {@link UserFormProps}.
 * @returns El formulario de alta con su mensaje de resultado.
 */
export function UserForm({ token, onCreado, onUnauthorized }: UserFormProps) {
  const [campos, setCampos] = useState<NewUserFields>(CAMPOS_VACIOS);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const id = useId();

  /**
   * Actualiza el campo que cambió, sin tocar los demás.
   *
   * Usa la forma funcional del setter porque el objeto nuevo se arma a
   * partir del anterior (spread) y solo reemplaza la clave `name` del input.
   *
   * @param evento - Evento de cambio de un input o del select.
   */
  function handleCambio(
    evento: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = evento.target;
    setCampos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  /**
   * Envía el alta a la API y, si sale bien, vacía el formulario y avisa a
   * `UserList` para que agregue el usuario sin volver a pedir la lista.
   *
   * @param evento - Evento de envío del formulario.
   */
  async function handleSubmit(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setExito(null);
    setEnviando(true);
    const nuevoUsuario = crearNuevoUsuario(campos);
    try {
      const data = await pedirApi<{ id: number }>("/user", {
        method: "POST",
        token,
        body: nuevoUsuario,
      });
      setCampos(CAMPOS_VACIOS);
      setExito(`Usuario «${nuevoUsuario.name}» creado con id ${data.id}.`);
      onCreado(data.id, nuevoUsuario);
    } catch (e) {
      if (esNoAutorizado(e)) {
        onUnauthorized();
        return;
      }
      setError(obtenerMensaje(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      className="user-form"
      onSubmit={handleSubmit}
      aria-labelledby={`${id}-titulo`}
    >
      <h3 className="user-form-titulo" id={`${id}-titulo`}>
        Alta de usuario
      </h3>
      <div className="user-form-campos">
        <label className="user-form-etiqueta" htmlFor={`${id}-name`}>
          Nombre
        </label>
        <input
          className="user-form-input"
          id={`${id}-name`}
          name="name"
          type="text"
          value={campos.name}
          onChange={handleCambio}
          required
        />
        <label className="user-form-etiqueta" htmlFor={`${id}-age`}>
          Edad
        </label>
        <input
          className="user-form-input"
          id={`${id}-age`}
          name="age"
          type="number"
          min={0}
          value={campos.age}
          onChange={handleCambio}
          required
        />
        <label className="user-form-etiqueta" htmlFor={`${id}-email`}>
          Email
        </label>
        <input
          className="user-form-input"
          id={`${id}-email`}
          name="email"
          type="email"
          value={campos.email}
          onChange={handleCambio}
          autoComplete="off"
          required
        />
        <label className="user-form-etiqueta" htmlFor={`${id}-password`}>
          Contraseña
        </label>
        <input
          className="user-form-input"
          id={`${id}-password`}
          name="password"
          type="password"
          minLength={LARGO_MINIMO_PASSWORD}
          value={campos.password}
          onChange={handleCambio}
          autoComplete="new-password"
          required
        />
        <label className="user-form-etiqueta" htmlFor={`${id}-country`}>
          País
        </label>
        <select
          className="user-form-input"
          id={`${id}-country`}
          name="country_id"
          value={campos.country_id}
          onChange={handleCambio}
          required
        >
          <option value="" disabled>
            Elegí un país
          </option>
          {PAISES.map((pais) => (
            <option key={pais.id} value={pais.id}>
              {pais.name}
            </option>
          ))}
        </select>
      </div>
      <button className="user-form-boton" type="submit" disabled={enviando}>
        Crear usuario
      </button>
      {error && (
        <p className="user-form-mensaje user-form-mensaje-error" role="alert">
          {error}
        </p>
      )}
      {exito && (
        <p className="user-form-mensaje" role="status">
          {exito}
        </p>
      )}
    </form>
  );
}
