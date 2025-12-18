# 🏥 RIPS 275 - Sistema de Gestión de Registros RIPS

<div align="center">

![RIPS 275](https://img.shields.io/badge/RIPS-275-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Plataforma integrada para la gestión, validación y consulta de registros RIPS para el Instituto Departamental de Salud de Nariño**

[Características](#-características-principales) • [Instalación](#-instalación) • [Uso](#-uso) • [Documentación](#-documentación)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roles y Permisos](#-roles-y-permisos)
- [API Endpoints](#-api-endpoints)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🔍 Descripción

**RIPS 275** es una plataforma web completa diseñada para facilitar la gestión, validación y consulta de **Registros Individuales de Prestación de Servicios de Salud (RIPS)** en el Instituto Departamental de Salud de Nariño. El sistema se integra directamente con la plataforma del **Ministerio de Salud y Protección Social** para validar CUV (Código Único de Validación) y procesar información de facturación electrónica.

### 🎯 Propósito

La plataforma permite a las instituciones de salud:
- ✅ Validar facturas electrónicas mediante consulta de CUV
- 📊 Gestionar y consultar registros RIPS almacenados localmente
- 🔄 Sincronizar información con el Ministerio de Salud
- 📥 Descargar archivos JSON desde la plataforma oficial
- 🔍 Comparar valores entre documentos CUV y XML
- 👥 Administrar usuarios con diferentes niveles de acceso

---

## ✨ Características Principales

### 🔐 Conexión Ministerio

#### **Consultar CUV**
- Validación de **Código Único de Validación** directamente desde la base de datos del Ministerio
- Soporte para múltiples formatos de entrada:
  - Entrada manual de código CUV
  - Carga de archivo JSON con estructura del CUV
  - Carga de archivo TXT con formato clave-valor
- Extracción automática del CUV desde archivos con diversas variaciones de claves:
  - `CodigoUnicoValidacion`
  - `Código Unico de Validación (CUV)` (con tildes)
  - `Codigo Unico de Validacion (CUV)` (sin tildes)
  - `CUV`
- Visualización completa de datos:
  - Estado de validación (Válido/Rechazado)
  - Proceso ID y fecha de validación
  - Total Factura y Total Valor Servicios
  - Cantidad de usuarios y atenciones
  - Detalles del prestador
  - Errores de validación (si existen)

#### **Comparar CUV y XML**
- Comparación automática entre:
  - **Total Valor Servicios** (del CUV) o **Total Factura** (fallback para documentos tipo CapitaPeriodo)
  - **PayableAmount** (del archivo XML de facturación)
- Características:
  - Tolerancia de comparación de 0.01 (1 centavo)
  - Soporte para entrada de CUV vía archivo o texto directo
  - Parser XML robusto con búsqueda recursiva
  - Eliminación automática de prefijos de namespace XML
  - Visualización clara de coincidencias y diferencias
  - Tabla detallada con toda la información del CUV

#### **Descargar JSON** *(Solo Admin)*
- Descarga automática de archivos RIPS desde la plataforma del Ministerio
- Integración con Azure Blob Storage
- Descompresión automática de archivos `.gz`
- Filtros avanzados de búsqueda:
  - Por rango de fechas
  - Por número de factura
  - Por estado de validación

### 📊 Subir/Consultar Información

#### **Consultar Registros**
- Búsqueda avanzada de facturas en la base de datos local
- Filtros disponibles:
  - Número de factura
  - Rango de fechas (desde/hasta)
  - Estado del proceso
- Exportación de resultados
- Visualización detallada de cada registro

#### **Subir JSON** *(Solo Admin)*
- Carga masiva de archivos RIPS en formato JSON
- Validación de estructura antes de procesar
- Procesamiento asíncrono para archivos grandes
- Feedback en tiempo real del estado de carga
- Manejo automático de duplicados

### ⚙️ Administrar *(Solo Admin)*

#### **Gestionar Facturas**
- Listado completo de facturas registradas
- Opciones de edición y eliminación
- Filtros y ordenamiento personalizables
- Exportación a diferentes formatos

#### **Crear Usuario**
- Registro de nuevos usuarios del sistema
- Asignación de roles (Admin/User)
- Gestión de credenciales
- Validación de datos de entrada

---

## 🛠 Tecnologías

### Backend
- **Node.js** (v18+) - Entorno de ejecución
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **Sequelize** - ORM para PostgreSQL
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hash de contraseñas
- **Axios** - Cliente HTTP para APIs externas
- **fast-xml-parser** - Parser de archivos XML
- **pako** - Descompresión de archivos .gz

### Frontend
- **React** (v18+) - Librería UI
- **React Router DOM** - Enrutamiento
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos utilitarios
- **Lucide React** - Biblioteca de iconos
- **React Toastify** - Notificaciones

### Integraciones
- **API Ministerio de Salud** - Validación de CUV y descarga de archivos
- **Azure Blob Storage** - Almacenamiento de documentos

---

## 📦 Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener:

- **Node.js** v18.0.0 o superior
- **PostgreSQL** v14.0 o superior
- **pnpm** (recomendado) o npm
- Acceso a la API del Ministerio de Salud (credenciales)

---

## 👥 Roles y Permisos

### 👤 Usuario Regular (USER)

**Permisos:**
- ✅ Consultar CUV
- ✅ Comparar CUV y XML
- ✅ Consultar registros locales
- ❌ Descargar JSON del Ministerio
- ❌ Subir JSON
- ❌ Gestionar facturas
- ❌ Crear usuarios

### 👨‍💼 Administrador (ADMIN)

**Permisos:**
- ✅ Todas las funcionalidades de Usuario Regular
- ✅ Descargar JSON del Ministerio
- ✅ Subir JSON
- ✅ Gestionar facturas
- ✅ Crear usuarios

---