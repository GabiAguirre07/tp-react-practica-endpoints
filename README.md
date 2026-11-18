# TP Frontend — Práctica de endpoints con React

Resolución de la **"Práctica: frontend React con lo visto hasta el paso 7"** (`practica-bk-endpoints.pdf`), hecha con **React + TypeScript + Vite** sobre la API de usuarios de la cátedra (FastAPI + SQLModel).

|              |                                                             |
| ------------ | ----------------------------------------------------------- |
| **Alumno**   | Gabriel Salvador Aguirre                                    |
| **Carrera**  | Tecnicatura Universitaria en Programación (T.U.P.)          |
| **Facultad** | Universidad Tecnológica Nacional — Facultad Regional Paraná |
| **Materia**  | Programación IV                                             |
| **Año**      | 2026                                                        |

---

## Requisitos

- **Node.js 22 LTS o 24 LTS** (mínimo: 20.19 o 22.12). npm viene incluido con Node.
- **Python 3.12 o superior** (para levantar el backend de la cátedra).
- **Git** (opcional: también se pueden descargar los proyectos como ZIP).

Para verificar las versiones:

```bash
node -v
python --version     # en Linux: python3 --version
```

## Cómo ejecutarlo

Hacen falta **dos terminales**: una para el backend y otra para el frontend.

### 1. Backend (API de la cátedra)

El backend es la carpeta `clase-1-sqlmodel` del repositorio [`ffumaneri/utn-tup-2026-python`](https://github.com/ffumaneri/utn-tup-2026-python). Al arrancar crea (si no existe) la base `database.db` y carga países, usuarios, roles y permisos.

| Paso                     | Windows (PowerShell)                                             | Linux                                                            |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Descargar                | `git clone https://github.com/ffumaneri/utn-tup-2026-python.git` | `git clone https://github.com/ffumaneri/utn-tup-2026-python.git` |
| Entrar a la carpeta      | `cd utn-tup-2026-python\clase-1-sqlmodel`                        | `cd utn-tup-2026-python/clase-1-sqlmodel`                        |
| Crear el entorno virtual | `python -m venv .venv`                                           | `python3 -m venv .venv`                                          |
| Activarlo                | `.venv\Scripts\activate`                                         | `source .venv/bin/activate`                                      |
| Instalar dependencias    | ver la nota de abajo ⬇                                           | `pip install -r requirements.txt`                                |
| Levantar la API          | `uvicorn main:app --reload`                                      | `uvicorn main:app --reload`                                      |

La API queda en **http://localhost:8000** (documentación Swagger en http://localhost:8000/docs). Dejar esta terminal abierta.

> **Windows: instalar sin `uvloop`.** El `requirements.txt` del backend incluye `uvloop`, una librería que solo existe para Linux y macOS: en Windows hace fallar `pip install -r requirements.txt` completo. `uvicorn` funciona igual sin ella. Con el entorno activado, instalar todo lo demás con:
>
> ```powershell
> pip install (Get-Content requirements.txt | Where-Object { $_ -notmatch '^uvloop' })
> ```
>
> Otros problemas frecuentes en Windows:
>
> - `python` no se reconoce o abre la Microsoft Store → usar `py -m venv .venv` para crear el entorno (una vez activado, `python` y `pip` ya son los del entorno).
> - Al activar aparece _"la ejecución de scripts está deshabilitada en este sistema"_ → ejecutar `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` y volver a activar (vale solo para esa ventana).
> - `[WinError 10048]` al levantar → el puerto 8000 está ocupado por otra API (por ejemplo, la de otro TP): cerrarla con `Ctrl + C` en su terminal.

### 2. Frontend (este proyecto)

En otra terminal. Los comandos son **los mismos en Windows y en Linux**:

```bash
git clone https://github.com/GabiAguirre07/tp-react-practica-endpoints.git
cd tp-react-practica-endpoints
npm ci
npm run dev
```

Abrir la dirección que muestra la terminal (normalmente **http://localhost:5173**).

No hay que configurar nada: el archivo `.env.development` ya está en el repositorio con `VITE_API_URL=http://localhost:8000`, la dirección donde levanta el backend.

> **¿Por qué `npm ci` y no `npm install`?** `npm ci` instala exactamente las versiones registradas en `package-lock.json`, sin modificarlo. Así el proyecto se ejecuta con las mismas versiones con las que fue desarrollado y verificado.

**Sin Git:** en GitHub, botón **Code → Download ZIP** en cada repositorio, descomprimir y seguir los mismos pasos desde la carpeta correspondiente.

### Usuarios de prueba

Todos tienen la contraseña **`123`**.

| Email              | Usuario            | Rol     | Permisos                                                   |
| ------------------ | ------------------ | ------- | ---------------------------------------------------------- |
| `mgomez@email.com` | Martina Gómez      | ADMIN   | Leer, crear, modificar y borrar usuarios                   |
| `sfer@email.com`   | Santiago Fernández | REGULAR | Solo leer: la API rechaza el alta (403) y el borrado (403) |

> **Volver a los datos iniciales:** las prácticas 5 y 7 crean y borran usuarios en `database.db`. Para restaurar los 10 usuarios de prueba, detener la API (`Ctrl + C`) y, dentro de `clase-1-sqlmodel`, ejecutar `git checkout -- database.db` (el archivo viene incluido en el repositorio del backend). Después volver a levantarla.

### Scripts disponibles

| Comando           | Qué hace                                                                      |
| ----------------- | ----------------------------------------------------------------------------- |
| `npm run dev`     | Levanta el servidor de desarrollo con recarga automática                      |
| `npm run build`   | Verifica los tipos de TypeScript y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión generada por `build` (http://localhost:4173)      |
| `npm run lint`    | Analiza el código con Oxlint                                                  |

---

## Prácticas

La base del profesor (login y lista de usuarios) se completó primero con lo que la consigna da por hecho de los pasos anteriores: token guardado en Local Storage, saludo "Hola, {nombre}" y botón para cerrar la sesión (**Etapa 0**). Las prácticas modifican la misma aplicación, así que el código está organizado por funcionalidad y cada práctica es un commit.

| N°  | Práctica                     | Endpoint                         | Archivos principales                                             | Estado      |
| --- | ---------------------------- | -------------------------------- | ---------------------------------------------------------------- | ----------- |
| 0   | Base: sesión y saludo        | `POST /login`, `GET /user/me/id` | `App.tsx`, `LoginForm`, `Saludo`, `UserList`, `utils/sesion.ts`  | ✅ Resuelto |
| 1   | Detalle de un usuario        | `GET /user/{id}`                 | `UserDetailPanel`, `UserList`, `types/user.ts`                   | ✅ Resuelto |
| 2   | "Cargando..." y errores      | —                                | `UserList`, `UserDetailPanel`                                    | ✅ Resuelto |
| 3   | Buscar por nombre            | `GET /user/search/{name}`        | `UserSearch`, `UserList`, `utils/consultas.ts`                   | ✅ Resuelto |
| 4   | Mostrar mis roles            | `GET /user/{id}`                 | `Saludo`, `utils/usuarios.ts`                                    | ✅ Resuelto |
| 5   | Alta de usuario              | `POST /user`                     | `UserForm`, `UserList`, `types/user.ts`, `utils/usuarios.ts`     | ✅ Resuelto |
| 6   | Solo mayores de edad         | `GET /user_mayores`              | `UserList`, `utils/consultas.ts`                                 | ✅ Resuelto |
| 7   | Borrar un usuario            | `DELETE /user/{id}`              | `UserList`                                                       | ✅ Resuelto |
| 8   | Sesión vencida               | (cualquiera que responda 401)    | `App.tsx`, `LoginForm` y todos los componentes que hacen pedidos | ✅ Resuelto |
| 9   | Para pensar antes del paso 8 | —                                | Respuesta abajo                                                  | ✅ Resuelto |

### Cómo verificar cada práctica

Con el backend recién levantado (10 usuarios de prueba) e iniciando sesión como **mgomez** salvo que se indique otra cosa:

| N°  | Qué hacer                                                                                                      | Resultado esperado                                                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 0   | Iniciar sesión, recargar la página y después presionar **Cerrar sesión**                                       | Arriba dice "Hola, Martina"; la recarga no cierra la sesión; "Cerrar sesión" vuelve al login                              |
| 1   | Hacer clic en **Valentina López**                                                                              | Panel con vlo@email.com, 22 años, Argentina, REGULAR. En Network: `GET /user/3`                                           |
| 2   | DevTools → Network → **Slow 4G** y recargar. Para el error: cambiar `/user` por `/usr` en `utils/consultas.ts` | "Cargando..." mientras llega la lista. Con `/usr` aparece **Not Found** en lugar de la lista                              |
| 3   | Buscar `ma`; después buscar `#`; después **Limpiar**                                                           | `ma`: Martina, Mateo y Camila. `#`: "No hay usuarios para mostrar" (Network: `/user/search/%23`). Limpiar vuelve a los 10 |
| 4   | Solo mirar el encabezado                                                                                       | "Hola, Martina (ADMIN)". Con sfer: "Hola, Santiago (REGULAR)"                                                             |
| 5   | Crear un usuario de 30 años y otro de **16**. Repetir el alta con **sfer**                                     | Aparecen en la lista sin recargar. Con sfer: **Missing permission: write_users**                                          |
| 6   | Presionar **Ver solo mayores** y después **Ver todos**                                                         | El usuario de 16 años no está en "Solo mayores" y vuelve a aparecer en "Todos"                                            |
| 7   | **Borrar** los usuarios creados (aceptar la confirmación). Repetir con **sfer** sobre cualquier usuario        | Desaparecen sin volver a pedir la lista. Con sfer: **Missing permission: delete_users** y la lista queda igual            |
| 8   | DevTools → Application → Local Storage → cambiar una letra del `token` y recargar                              | Vuelve al login con el mensaje **Tu sesión venció** y el token se borra del Local Storage                                 |

> En la práctica 7, borrar solo los usuarios creados en la práctica 5: si Martina se borra a sí misma, su token deja de corresponder a un usuario y la API responde 401 en todos los pedidos.

---

## Respuestas a los "Para pensar"

### Práctica 1 — ¿Por qué la lista no trae todos los datos de todos los usuarios?

En Network, `GET /user` devuelve de cada usuario solo `id` y `name` (unos 34 bytes por usuario: 342 bytes los 10), mientras que `GET /user/{id}` devuelve todo de uno solo (140 bytes con email, edad, país y roles). La lista sirve para **elegir**; el detalle, para **mirar uno**.

Con 10.000 usuarios, mandar todo en la lista significaría transferir varias veces más datos (≈1,4 MB contra ≈340 KB), que el backend arme los países y roles de cada uno (más consultas a la base) y que el navegador reciba y guarde información que el usuario casi nunca va a abrir. Además expondría datos personales (emails, edades) de todos sin necesidad: mejor pedir cada detalle cuando hace falta (carga bajo demanda). Por eso también la API limita la lista a 100 usuarios por pedido (`limit`, máximo 100) y permite paginar con `offset`.

`GET /user_mayores` y `GET /user/search/{name}` muestran el problema contrario: devuelven el usuario **completo** (1566 bytes los 10, unas 4,5 veces más que la lista), incluida la contraseña hasheada. Por eso el front tipa esas respuestas solo con `id` y `name` y no usa el resto.

### Práctica 3 — Buscar `#` con y sin `encodeURIComponent`

- **Con** `encodeURIComponent("#")` la URL que sale es `/user/search/%23`: el `#` viaja codificado como parte del nombre y la API responde `[]` (ningún nombre contiene `#`).
- **Sin** codificar, la URL es `/user/search/#`. Para el navegador, `#` marca el comienzo del **fragmento** (la parte que nunca se envía al servidor), así que el pedido real es `GET /user/search/`. FastAPI no tiene esa ruta con la barra final y redirige (307) a `/user/search`, que coincide con `GET /user/{user_id}` con `user_id = "search"`. Como no es un número, responde **422** con un `detail` que es una **lista** de errores: _"Input should be a valid integer, unable to parse string as an integer"_.

Lo mismo pasa con `?` (empieza los parámetros de búsqueda), `/` (separa segmentos de la ruta), `%` o los espacios. Cualquier texto que escribe el usuario y va dentro de la URL tiene que pasar por `encodeURIComponent`. Además, como el `detail` del 422 es una lista y no un texto, todos los errores se muestran con `obtenerMensajeError` (`utils/errores.ts`), que contempla los dos formatos: React no puede mostrar un array de objetos.

### Práctica 7 — ¿Está bien que el botón Borrar aparezca igual con sfer?

No es lo ideal. La **seguridad** está bien resuelta porque la decide el backend: aunque el botón esté, la API responde **403 Missing permission: delete_users** y no borra nada. Ocultar el botón nunca puede reemplazar ese control, porque cualquiera puede mandar el `DELETE` con otra herramienta.

Pero la **experiencia de uso** es mala: se le ofrece a sfer una acción que siempre va a fallar, y recién se entera después de confirmar. Lo correcto es que el front conozca los permisos del usuario logueado y muestre (o deshabilite) "Borrar" y el formulario de alta solo si los tiene. Hoy `GET /user/{id}` trae los roles pero no sus permisos, así que el front no tiene con qué decidirlo sin otro pedido; la consigna lo deja para el paso 12.

### Práctica 9 — ¿Cuántas veces escribimos lo mismo?

Conteo sobre el código terminado de las prácticas 1 a 8 (commit de la práctica 8):

| Qué se repite                               | Veces | Archivos                                                                    |
| ------------------------------------------- | ----- | --------------------------------------------------------------------------- |
| `import.meta.env.VITE_API_URL`              | 7     | 5: `LoginForm`, `Saludo` (2), `UserList` (2), `UserDetailPanel`, `UserForm` |
| `` Authorization: `Bearer ${token}` ``      | 5     | 4: `Saludo`, `UserList` (2), `UserDetailPanel`, `UserForm`                  |
| `if (!response.ok)`                         | 6     | 5: `LoginForm`, `Saludo`, `UserList` (2), `UserDetailPanel`, `UserForm`     |
| `if (response.status === 401)` (práctica 8) | 6     | 4: `Saludo` (2), `UserList` (2), `UserDetailPanel`, `UserForm`              |
| `useState` para `loading`                   | 2     | `UserList`, `UserDetailPanel`                                               |
| `useState` para `error`                     | 4     | `LoginForm`, `UserList`, `UserDetailPanel`, `UserForm`                      |

Si el backend cambiara la forma de mandar el token (por ejemplo, un header `X-Token`), habría que tocar **4 archivos en 5 lugares**. Si se olvida uno, el error no aparece al compilar ni al abrir la app: aparece recién al usar esa función. Ese pedido saldría sin token, la API respondería **401** y, por la práctica 8, la aplicación cerraría la sesión diciendo "Tu sesión venció", un mensaje falso que lleva a buscar el problema en el lugar equivocado.

El problema de fondo es que cada componente sabe **cómo** hablar con la API (URL, headers, formato de errores) además de **qué** mostrar: dos responsabilidades mezcladas y el mismo conocimiento copiado en varios lugares.

---

## Estructura del proyecto

```
tp-react-practica-endpoints/
├── index.html                  ← página base donde se monta la aplicación
├── package.json                ← dependencias y scripts
├── package-lock.json           ← versiones exactas de las dependencias (usado por npm ci)
├── .env.development            ← VITE_API_URL=http://localhost:8000
├── vite.config.ts              ← configuración de Vite
├── .oxlintrc.json              ← reglas del linter
├── public/                     ← favicon
└── src/
    ├── main.tsx                ← punto de entrada: monta <App /> en el #root
    ├── App.tsx / App.css       ← sesión: login o pantalla de usuarios
    ├── index.css               ← estilos globales
    ├── components/             ← un componente por carpeta, con su CSS
    │   ├── LoginForm/          formulario de inicio de sesión
    │   ├── Saludo/             "Hola, Martina (ADMIN)" y cerrar sesión
    │   ├── UserList/           lista, filtros, borrado; compone a los demás
    │   ├── UserSearch/         input con Buscar y Limpiar
    │   ├── UserDetailPanel/    detalle de un usuario
    │   └── UserForm/           alta de usuario
    ├── types/
    │   └── user.ts             ← User, UserDetail, Role, Country, NewUser
    └── utils/                  ← funciones puras (sin React)
        ├── consultas.ts        rutas de la lista, encodeURIComponent, filtros
        ├── errores.ts          mensaje legible a partir del detail de la API
        ├── sesion.ts           token en Local Storage
        └── usuarios.ts         saludo, roles y body del alta
```

Cada componente tiene su propio `.css` con clases prefijadas (`user-list-…`, `user-form-…`) para que no choquen entre sí.

## Decisiones de diseño

- **Un componente, una responsabilidad.** `App` maneja la sesión; `UserList` coordina la lista; `UserSearch` solo junta el texto a buscar; `UserDetailPanel` y `UserForm` resuelven su pedido. Los componentes avisan hacia arriba con props de función (`onBuscar`, `onCreado`, `onUnauthorized`).
- **Tipos que reflejan la API.** `User` (id y nombre) es la base; `UserDetail` la extiende con lo que trae `GET /user/{id}`. De las respuestas con datos de más (incluida la contraseña) solo se tipa lo que se usa.
- **Estado mínimo, valores derivados.** Lo que se puede calcular no se guarda: si hay usuarios, si el filtro está activo, el texto del saludo.
- **Una consulta, una ruta.** Qué lista se ve es un solo estado (`consulta`, una unión discriminada: todos, mayores o búsqueda). Una función pura arma la ruta, con `encodeURIComponent` en un único lugar.
- **Actualizar sin volver a pedir.** El alta agrega con spread (`[...anteriores, nuevo]`) solo si el usuario corresponde a la lista actual; el borrado saca con `filter`. Nunca se modifica el array existente.
- **Respuestas viejas descartadas.** Cada `useEffect` que pide datos tiene una limpieza (`ignorar = true`): si el usuario busca dos veces seguidas, la respuesta lenta de la primera no pisa a la segunda.
- **Errores legibles siempre.** Se contemplan los dos formatos de `detail` (texto y lista de errores 422) y el caso sin respuesta (backend apagado o error 500 sin CORS).
- **Accesibilidad básica.** `label` vinculado a cada campo con `useId`, `role="alert"` en los errores, `role="status"` en "Cargando...", `aria-pressed` en el filtro y en el usuario elegido, `aria-label` en cada "Borrar".

## Tecnologías

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter)
- Backend de la cátedra: [FastAPI](https://fastapi.tiangolo.com/) + [SQLModel](https://sqlmodel.tiangolo.com/)
