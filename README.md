# API Netflix - Catálogo de Películas y Series

API RESTful para gestionar un catálogo de películas y series similar a Netflix.

**Desarrollador:** Francisco Rene Samayoa Valle  
**Versión:** 1.0.0

## Características

- ✅ CRUD completo para películas y series (POST, GET, PUT, DELETE, GET ALL)
- ✅ Autenticación JWT con endpoints de registro e inicio de sesión
- ✅ Endpoints públicos y protegidos
- ✅ Códigos HTTP correctos (201, 200, 404, 500, 403, 401)
- ✅ Manejo de errores robusto
- ✅ Configuración lista para producción (Render)
- ✅ Base de datos PostgreSQL con Sequelize ORM

## Requisitos

- Node.js >= 14.x
- PostgreSQL >= 11.x
- npm o yarn

## Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd PrimerParcialDesarrollo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/netflix_db
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=1h
PORT=8081
NODE_ENV=development
```

4. **Iniciar el servidor**
```bash
npm start
```

El servidor estará disponible en `http://localhost:8081`

## Estructura del Proyecto

```
.
├── app/
│   ├── config/          # Configuraciones (BD, JWT)
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Modelos de datos
│   └── routes/          # Definición de rutas
├── middlewares/         # Middleware personalizado
├── server.js            # Punto de entrada
├── package.json         # Dependencias
└── .env.example         # Variables de entorno
```

## Modelos de Datos

### Usuario
```json
{
  "id": "integer",
  "username": "string (único)",
  "email": "string (único)",
  "password": "string (hasheada con bcryptjs)"
}
```

### Película/Serie
```json
{
  "id": "integer",
  "nombre": "string",
  "sinopsis": "text",
  "actores": "text (separados por comas)",
  "duracion": "integer (minutos)",
  "tipo": "enum (Serie/Película)",
  "categoria": "string",
  "anioLanzamiento": "integer",
  "calificacion": "float (0-10)",
  "activo": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Documentación de Endpoints

### 1. Autenticación

#### Registro
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "juan",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario registrado exitosamente!",
  "id": 1
}
```

#### Inicio de Sesión
```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "juan",
  "password": "password123"
}
```

**Respuesta (200):**
```json
{
  "id": 1,
  "username": "juan",
  "email": "juan@example.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h"
}
```

### 2. Películas/Series

#### Crear película (PROTEGIDO)
```http
POST /api/peliculas
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Inception",
  "sinopsis": "Un ladrón especializado en robar secretos...",
  "actores": "Leonardo DiCaprio, Marion Cotillard, Ellen Page",
  "duracion": 148,
  "tipo": "Película",
  "categoria": "Ciencia Ficción",
  "anioLanzamiento": 2010,
  "calificacion": 8.8
}
```

**Respuesta (201):**
```json
{
  "message": "Película creada exitosamente.",
  "data": {
    "id": 1,
    "nombre": "Inception",
    "sinopsis": "Un ladrón especializado en robar secretos...",
    "actores": "Leonardo DiCaprio, Marion Cotillard, Ellen Page",
    "duracion": 148,
    "tipo": "Película",
    "categoria": "Ciencia Ficción",
    "anioLanzamiento": 2010,
    "calificacion": 8.8,
    "activo": true,
    "createdAt": "2024-08-11T10:30:00Z",
    "updatedAt": "2024-08-11T10:30:00Z"
  }
}
```

#### Obtener todas las películas (PÚBLICO)
```http
GET /api/peliculas
```

**Parámetros de búsqueda (query):**
- `nombre`: Buscar por nombre (búsqueda parcial)
- `categoria`: Filtrar por categoría
- `tipo`: Filtrar por tipo (Serie/Película)

**Ejemplos:**
```http
GET /api/peliculas?nombre=Inception
GET /api/peliculas?categoria=Ciencia%20Ficción
GET /api/peliculas?tipo=Serie
```

**Respuesta (200):**
```json
{
  "message": "Películas obtenidas exitosamente.",
  "total": 1,
  "data": [
    {
      "id": 1,
      "nombre": "Inception",
      "sinopsis": "Un ladrón especializado en robar secretos...",
      "actores": "Leonardo DiCaprio, Marion Cotillard, Ellen Page",
      "duracion": 148,
      "tipo": "Película",
      "categoria": "Ciencia Ficción",
      "anioLanzamiento": 2010,
      "calificacion": 8.8,
      "activo": true,
      "createdAt": "2024-08-11T10:30:00Z",
      "updatedAt": "2024-08-11T10:30:00Z"
    }
  ]
}
```

#### Obtener película por ID (PÚBLICO)
```http
GET /api/peliculas/:id
```

**Ejemplo:**
```http
GET /api/peliculas/1
```

**Respuesta (200):**
```json
{
  "message": "Película obtenida exitosamente.",
  "data": {
    "id": 1,
    "nombre": "Inception",
    ...
  }
}
```

#### Actualizar película (PROTEGIDO)
```http
PUT /api/peliculas/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "calificacion": 9.0,
  "activo": true
}
```

**Respuesta (200):**
```json
{
  "message": "Película actualizada exitosamente.",
  "data": {
    "id": 1,
    "nombre": "Inception",
    "calificacion": 9.0,
    ...
  }
}
```

#### Eliminar película (PROTEGIDO)
```http
DELETE /api/peliculas/:id
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "message": "Película eliminada exitosamente."
}
```

#### Eliminar todas las películas (PROTEGIDO - Solo desarrollo)
```http
DELETE /api/peliculas
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "message": "Se eliminaron 5 películas."
}
```

## Códigos HTTP Utilizados

| Código | Significado | Casos |
|--------|------------|-------|
| **200** | OK | GET exitoso, PUT exitoso, DELETE exitoso |
| **201** | Creado | POST exitoso |
| **400** | Solicitud inválida | Datos faltantes o inválidos |
| **401** | No autorizado | Token inválido o expirado |
| **403** | Prohibido | Token no proporcionado |
| **404** | No encontrado | Recurso inexistente |
| **409** | Conflicto | Usuario duplicado (username/email) |
| **500** | Error interno | Error del servidor |

## Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación.

### Flujo de autenticación:
1. **Registro:** POST `/api/auth/signup`
2. **Login:** POST `/api/auth/signin` → obtener token
3. **Usar token:** Incluir en header `Authorization: Bearer <token>`
4. **Token expira:** Después de 1 hora, debe hacer login nuevamente

### Headers de autenticación:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

O alternativamente:
```http
x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Despliegue en Render

### Pasos para desplegar:

1. **Crear base de datos PostgreSQL en Render:**
   - Ir a https://dashboard.render.com
   - Click en "New" → "PostgreSQL"
   - Anotar la URL de conexión (DATABASE_URL)

2. **Desplegar la aplicación:**
   - Click en "New" → "Web Service"
   - Conectar con tu repositorio Git
   - Variables de entorno:
     ```
     DATABASE_URL=<url de la BD>
     JWT_SECRET=<secreto-super-seguro>
     JWT_EXPIRES_IN=1h
     NODE_ENV=production
     ```

3. **Verificar que está funcionando:**
   - Ir a `https://tu-app.onrender.com/health`
   - Debe responder: `{"status":"OK"}`

## Ejemplo de uso con Postman o cURL

### Registrar usuario
```bash
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Iniciar sesión
```bash
curl -X POST http://localhost:8081/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan",
    "password": "password123"
  }'
```

### Crear película
```bash
TOKEN="tu_token_aqui"

curl -X POST http://localhost:8081/api/peliculas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Inception",
    "sinopsis": "Un ladrón especializado en robar secretos...",
    "actores": "Leonardo DiCaprio, Marion Cotillard",
    "duracion": 148,
    "tipo": "Película",
    "categoria": "Ciencia Ficción",
    "anioLanzamiento": 2010,
    "calificacion": 8.8
  }'
```

### Obtener todas las películas
```bash
curl -X GET http://localhost:8081/api/peliculas
```

### Buscar películas por categoría
```bash
curl -X GET "http://localhost:8081/api/peliculas?categoria=Ciencia%20Ficción"
```

## Pruebas

Para probar la API puedes usar:
- **Postman** - Interfaz gráfica
- **Insomnia** - Cliente HTTP
- **cURL** - Línea de comandos
- **Thunder Client** - Extensión de VS Code

## Estructura de respuestas

### Respuesta exitosa
```json
{
  "message": "Descripción de éxito",
  "data": { /* datos */ },
  "total": 1
}
```

### Respuesta de error
```json
{
  "message": "Descripción del error"
}
```

## Notas de Seguridad

- ✅ Las contraseñas se hashean con bcryptjs (salt rounds: 8)
- ✅ Los tokens JWT expiran después de 1 hora
- ✅ Los campos sensibles nunca se retornan en la respuesta
- ✅ Se valida entrada en todos los endpoints
- ✅ CORS está configurado para producción

## Licencia

ISC

## Autor

Francisco Rene Samayoa Valle  
Universidad Mariano Gálvez (UMG)

---

**¿Problemas?** Revisa los logs en la consola del servidor para más detalles.
