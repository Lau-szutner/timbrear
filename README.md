# TimbreAR

TimbreAR es un prototipo de aplicación web para avisar a los residentes cuando
llega una visita o un paquete, especialmente cuando el timbre convencional no
funciona. La idea es colocar un código QR en la entrada: quien lo escanea abre
una página del timbre y puede enviar un aviso.

## Estado actual

El proyecto está en desarrollo. Hoy incluye:

- Una landing page en `/` que explica la idea.
- Formularios de registro en `/register` e inicio de sesión en `/login`, con
  cambio entre ambos. Las contraseñas se validan y almacenan usando `scrypt`.
- Endpoints `POST /api/auth/register` y `POST /api/auth/login` que validan las
  entradas en el servidor. Ambos crean una cookie de sesión firmada y
  `HttpOnly`.
- Una página de timbre en `/t/[token]`.
- Un formulario para avisar si alguien es una visita o trae un paquete.
- Un endpoint que valida el aviso y, para timbres reales, lo guarda en MySQL.
- Una ruta de demostración en `/t/demo1234abcd`. Esta simulación no requiere
  conexión a la base de datos, no guarda el aviso y no envía notificaciones.
- Un endpoint de salud de la base de datos en `/api/health`.

Todavía no están implementadas la administración de timbres, la generación de
códigos QR ni las notificaciones push. El registro y el login funcionan, pero
no hay aún una página privada de administración. El mensaje de éxito de la demo
no representa una notificación real.

## Tecnologías

- Next.js con App Router y TypeScript.
- React y Tailwind CSS.
- MySQL, Sequelize y `mysql2`.
- Zod para validar los datos que recibe la API.

Next.js reúne frontend y backend en una misma aplicación. Las páginas y
componentes de interfaz viven en `src/app`; los endpoints HTTP también están
ahí, bajo `src/app/api`. La lógica de negocio y el acceso a la base de datos
están en `src/server`.

## Estructura del proyecto

```text
src/
  app/
    page.tsx                 Landing page (/)
    layout.tsx               Layout compartido y metadatos
    register/page.tsx        Formulario de registro (/register)
    login/page.tsx           Formulario de inicio de sesión (/login)
    api/
      health/route.ts        Comprueba la conexión a MySQL
      auth/register/route.ts Valida y registra usuarios
      auth/login/route.ts    Autentica usuarios y crea sesión
      rings/route.ts         Recibe avisos de visitas y paquetes
    t/
      [token]/
        page.tsx             Página pública de un timbre
  components/
    AuthModeSwitch.tsx       Navegación entre login y registro
    LoginForm.tsx            Formulario de inicio de sesión
    LoginPanel.tsx           Estados visuales del login
    RegisterForm.tsx         Formulario de alta de usuario
    RegistrationPanel.tsx    Estados del flujo de registro
    RingForm.tsx             Formulario interactivo del visitante
  lib/validation/
    registerSchema.ts        Validación del registro
    loginSchema.ts           Validación del login
  server/
    config/database.js       Conexión Sequelize a MySQL
    models/
      User.js                Modelo de residente
      Doorbell.js            Modelo de timbre
      Ring.js                Modelo de aviso recibido
      Index.js               Asociaciones entre los modelos
    services/
      userService.js         Alta de usuario y hash de contraseña
      ringService.js         Búsqueda del timbre y registro del aviso
    security/
      password.js            Hash de contraseñas con scrypt
      session.js             Firma y valida la cookie de sesión
db/
  config.cjs                 Configuración de Sequelize CLI
  migrations/                Cambios versionados del esquema de la base
```

En una URL como `/t/abc12345`, `[token]` representa un segmento dinámico: la
página recibe ese valor, busca un timbre activo con ese token y muestra el
formulario correspondiente. Los archivos `route.ts` definen endpoints de API;
por ejemplo, `POST /api/rings` valida una solicitud y delega el trabajo en
`ringService.js`.

## Requisitos

- Node.js compatible con la versión indicada en `package.json`.
- npm.
- MySQL, solo para usar la base de datos y los timbres reales.

## Configuración local

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Crear un archivo `.env.local` en la raíz del proyecto y configurar la URL
   de conexión:

   ```env
   DATABASE_URL=mysql://USUARIO:CONTRASEÑA@localhost:3306/timbrear_dev
   AUTH_SECRET=un-secreto-aleatorio-de-al-menos-32-bytes
   ```

   Reemplazá `USUARIO` y `CONTRASEÑA` con las credenciales de un usuario de
   MySQL que tenga permisos sobre `timbrear_dev`. Si la contraseña contiene
   caracteres reservados de URL, como `@`, `/` o `#`, deben codificarse para
   usarse en la URL. No subas `.env.local` ni compartas sus credenciales.
   Generá `AUTH_SECRET` con `openssl rand -base64 32`. Es necesario tanto para
   registrarse como para iniciar sesión, ya que el servidor firma la cookie de
   sesión con ese secreto.

3. Crear la base de datos con una cuenta autorizada de MySQL:

   ```sql
   CREATE DATABASE IF NOT EXISTS timbrear_dev;
   ```

4. Crear las tablas ejecutando las migraciones:

   ```bash
   npm run db:migrate
   ```

5. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrí [http://localhost:3000](http://localhost:3000). Para probar el flujo
   de demostración, visitá
   [http://localhost:3000/t/demo1234abcd](http://localhost:3000/t/demo1234abcd).

La demo no necesita que MySQL esté iniciado. El registro, el login, las páginas
de timbres reales y `/api/health` requieren una conexión válida a la base de
datos. El registro y el login también requieren que `AUTH_SECRET` esté
configurado.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la compilación de producción. |
| `npm run start` | Inicia la aplicación compilada. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run db:migrate` | Aplica las migraciones pendientes de MySQL. |
| `npm run db:rollback` | Revierte la última migración aplicada. |

## Modelo de datos inicial

- **Users**: residentes, con email y hash de contraseña.
- **Doorbells**: timbres pertenecientes a un residente, con token, etiqueta,
  estado activo y campos previstos para configurar un canal de notificación.
- **Rings**: avisos asociados a un timbre, clasificados como `visit` o
  `package`, con mensaje opcional y estado.

La migración inicial se encuentra en `db/migrations`. Las migraciones modifican
el esquema de la base de datos; no crean cuentas de MySQL ni configuran sus
permisos.

## Rutas principales

| Ruta | Función |
| --- | --- |
| `/` | Landing page del proyecto. |
| `/register` | Formulario para crear una cuenta. |
| `/login` | Formulario para iniciar sesión. |
| `/t/[token]` | Página pública del timbre identificado por token. |
| `POST /api/auth/register` | Valida y crea una cuenta de residente. |
| `POST /api/auth/login` | Valida credenciales e inicia una sesión. |
| `POST /api/rings` | Valida y registra un aviso. |
| `GET /api/health` | Comprueba la conexión a la base de datos. |

El token `demo1234abcd` es una excepción de demostración implementada en el
servicio: muestra un timbre de ejemplo y simula el éxito sin persistir datos.
