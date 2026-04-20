# 🚀 Guía de Despliegue en Producción

## Cambios realizados para producción

### `backend/Dockerfile`
- Migrado de `npm` a `pnpm`
- Eliminado el multi-stage build innecesario (el backend no tiene paso de compilación)
- Imagen final más limpia y predecible

### `frontend/Dockerfile`
- Migrado de `npm` a `pnpm`
- **Stage 1 (build):** Vite compila el React con `VITE_API_URL=""` (URL relativa, nginx maneja el routing)
- **Stage 2 (producción):** `nginx:alpine` sirve los archivos estáticos — reemplaza el `serve` que no es apto para producción

### `frontend/nginx.conf` *(nuevo)*
- Sirve el SPA con fallback a `index.html` (necesario para React Router)
- Proxea todas las llamadas a `/api/*` al backend internamente (red Docker)
- No se expone el backend al exterior

### `docker-compose.yml`
| Antes | Después |
|---|---|
| Credenciales hardcodeadas | Variables desde `.env` |
| Frontend en puerto 5173 | Nginx en puerto 80 |
| Backend en puerto 3000 (expuesto) | Backend interno (sin exposición) |
| Postgres en puerto 5432 (expuesto) | Postgres interno (sin exposición) |
| Sin healthcheck en postgres | Healthcheck — backend espera a que la BD esté lista |
| DB name `rips_2275` (typo) | Configurable via `DB_DATABASE` en `.env` |
| `backup.sql` como único init | `01_backup.sql` + `02_seed.sql` en orden |

### `backend/scripts/generate-seed.js` *(nuevo)*
- Genera `seed.sql` con el usuario admin y los prestadores del Excel
- Se ejecuta una vez antes de levantar Docker

### `.env.example` *(nuevo)*
- Template con todas las variables requeridas

---

## Arquitectura en producción

```
Internet
    │
    ▼
  :80  (nginx / frontend container)
    ├── /              →  archivos estáticos React (SPA)
    └── /api/*         →  backend:3000  (red interna Docker)
                              └── postgres:5432  (red interna Docker)
```

Solo el **puerto 80** está expuesto al exterior. Backend y base de datos son completamente internos.

---

## Requisitos en el servidor

- Docker + Docker Compose instalados
- Puerto 80 disponible
- Node.js 20+ (solo para generar el `seed.sql` antes del deploy)
- Acceso a la red interna `172.16.4.7` para la API CUV

---

## Paso a paso: primer despliegue

### 1. Clonar el repositorio en el servidor

```bash
git clone <url-del-repo> /opt/fevrips
cd /opt/fevrips
```

### 2. Crear el archivo `.env`

```bash
cp .env.example .env
nano .env
```

Completar con los valores reales:

```env
DB_USERNAME=sistemas
DB_PASSWORD=tu_password_segura
DB_DATABASE=rips_275
JWT_SECRET=un_secreto_largo_y_aleatorio
JWT_EXPIRATION=8h
CUV_API_URL=https://172.16.4.7:9443
```

### 3. Generar el `seed.sql`

> Ejecutar desde la máquina de desarrollo (donde está el Excel) o en el servidor si tiene Node.js.

```bash
cd backend
node scripts/generate-seed.js
cd ..
```

Esto crea `seed.sql` en la raíz del proyecto con:
- El usuario **admin / admin123**
- Todos los prestadores del `Prestadores1.xlsx`

### 4. Construir y levantar los contenedores

```bash
docker compose up -d --build
```

> La primera vez puede tardar varios minutos mientras se construyen las imágenes y se inicializa la BD.

### 5. Verificar que todo esté corriendo

```bash
docker compose ps
docker compose logs backend
docker compose logs frontend
```

### 6. Acceder a la aplicación

```
http://IP_DEL_SERVIDOR
```

Credenciales iniciales:
- **Usuario:** `admin`
- **Contraseña:** `admin123`

> ⚠️ Cambia la contraseña inmediatamente después del primer login.

---

## Actualizaciones (re-deploy)

```bash
git pull
docker compose up -d --build
```

> La base de datos **no se toca** en un re-deploy siempre que el volumen `postgres_data` exista.

---

## Comandos útiles

| Acción | Comando |
|---|---|
| Ver estado de contenedores | `docker compose ps` |
| Logs del backend | `docker compose logs -f backend` |
| Logs del frontend | `docker compose logs -f frontend` |
| Reiniciar un servicio | `docker compose restart backend` |
| Detener todo | `docker compose down` |
| **Borrar BD y reiniciar desde cero** | `docker compose down -v && docker compose up -d` |

---

## ⚠️ Notas importantes

- **No uses `docker compose down -v`** a menos que quieras perder todos los datos de la BD.
- El `seed.sql` se ejecuta **solo cuando el volumen de postgres está vacío** (primer arranque). Si ya existe el volumen, no corre de nuevo.
- Si necesitas regenerar el seed (nuevo Excel), debes hacer `down -v` y volver a levantar.
- El archivo `seed.sql` contiene la contraseña hasheada del admin — está bien comitearlo ya que bcrypt no es reversible.
