# 🚀 Instrucciones de Despliegue — FEV RIPS App

Guía para instalar y ejecutar la aplicación en una máquina nueva usando las imágenes Docker pre-compiladas.

---

## ✅ Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución
- Los siguientes archivos en la misma carpeta:
  - `fevrips_app.tar` — imágenes Docker exportadas
  - `docker-compose.yml` — configuración de los servicios
  - `backup.sql` — base de datos inicial

---

## 📦 Pasos de instalación

### 1. Copiar los archivos

Coloca los tres archivos en una misma carpeta, por ejemplo:

```
C:\fevrips\
  ├── fevrips_app.tar
  ├── docker-compose.yml
  └── backup.sql
```

### 2. Abrir una terminal en esa carpeta

En Windows: clic derecho en la carpeta → **"Abrir en Terminal"**

### 3. Cargar las imágenes Docker

```bash
docker load -i fevrips_app.tar
```

> Esto puede tardar unos minutos. Al terminar verás los nombres de las imágenes cargadas.

### 4. Iniciar la aplicación

```bash
docker compose up -d
```

> La primera vez, PostgreSQL inicializará la base de datos con `backup.sql`. Puede tardar 1-2 minutos.

---

## 🌐 Acceso a la aplicación

Una vez en ejecución, abre el navegador en:

```
http://localhost:5173
```

---


## Credenciales de acceso

usuario: admin
contraseña: admin123

## 🔧 Comandos útiles

| Acción                     | Comando                          |
|----------------------------|----------------------------------|
| Ver estado de contenedores | `docker compose ps`              |
| Ver logs del backend       | `docker compose logs backend`    |
| Ver logs del frontend      | `docker compose logs frontend`   |
| Detener la app             | `docker compose down`            |
| Detener y borrar datos BD  | `docker compose down -v`         |
| Reiniciar un servicio      | `docker compose restart backend` |

---

## ⚠️ Notas importantes

- **No uses `docker compose down -v`** a menos que quieras reiniciar la base de datos desde cero.
- El puerto `5432` (PostgreSQL) está expuesto si necesitas conectarte con DBeaver o pgAdmin.
