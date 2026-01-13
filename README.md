# App Incidencias — Frontend

## Descripción
Aplicación web desarrollada con **React** para la gestión de incidencias y máquinas dentro de una organización.  
Permite a distintos roles (Administrador, Jefe, Técnico, Cliente y Demo) crear, visualizar, actualizar y gestionar incidencias, así como administrar máquinas y usuarios según permisos.

---

## Tecnologías utilizadas
- **React** (SPA)
- **Vite** (entorno de desarrollo y build)
- **React Router DOM** (enrutado)
- **Chart.js / react-chartjs-2** (gráficas y estadísticas)
- **JWT** (autenticación basada en tokens)
- **Yarn** (gestor de dependencias)

---

## Requisitos
- **Node.js 16 o superior**
- **Yarn**

---

## Instalación y ejecución en local

1. Clona el repositorio y entra en la carpeta del frontend:
```bash
git clone <url-del-repositorio>
cd frontend
```
2. Instala las dependencias:
```bash
yarn install
```
3. Configura las variables de entorno:

Crea un archivo .env en la raíz del proyecto:
```bash
VITE_API_URL=http://localhost:3000/api
```
4. Ejecuta la aplicación en modo desarrollo:
```bash
yarn dev
```
La aplicación estará disponible en:
```bash
http://localhost:5173
```
de manera local

## Comandos útiles

```bash
yarn dev       # Ejecutar en modo desarrollo
yarn build     # Generar build de producción
yarn preview   # Previsualizar el build
yarn lint      # Ejecutar ESLint
```
## Características principales

- **Paneles y estadísticas con gráficas**
- **Gestión CRUD de incidencias, máquinas y usuarios.**
- **Autenticación mediante JWT.**
- **Rutas protegidas según rol.**
- **Hooks personalizados para comunicación con el backend.**
- **Componentes reutilizables y estructura modular.**

## Estructura del proyecto
- `src/pages/` — Páginas por rol (Admin, Jefe, Técnico, Cliente, Login).

- `src/components/` — Componentes UI reutilizables (tablas, formularios, modales, sidebar).

- `src/contexts/` — Contexto global de usuario y sesión.

- `src/hooks/` — Hooks personalizados para llamadas a la API.

- `src/helpers/` — Funciones auxiliares (fetch, helpers).

- `src/styles/` — Hojas de estilo CSS.

## Roles de usuario
- **Administrador (Admin)**
Gestión completa de usuarios, máquinas e incidencias.

- **Jefe**
Supervisión y gestión de incidencias.

- **Técnico**
Atención y resolución de incidencias asignadas.

- **Cliente**
Creación de incidencias y consulta de su histórico.

- **Demo**
Cuenta de prueba (credenciales disponibles en
`src/components/auth/DemoCredentials.jsx`).

## Diagrama de base de datos
El diagrama entidad–relación del sistema se encuentra disponible en el archivo `baseDatos.sql` del backend

## Diagrama de la base de datos

A continuación se muestra el diagrama entidad–relación utilizado en la aplicación:

![Diagrama de la base de datos](/public/baseDeDatos.png)


## Notas de despliegue
- Configurar correctamente la variable `VITE_API_URL`.

- Asegurar HTTPS en producción.

- Revisar la configuración CORS del backend.

- El frontend consume una API REST desarrollada en Node.js.
