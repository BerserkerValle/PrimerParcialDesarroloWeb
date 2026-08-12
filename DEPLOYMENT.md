# Guía de Despliegue en Render

Esta guía te ayudará a desplegar la API en Render.com de forma gratuita.

## Requisitos previos

1. Cuenta en [Render.com](https://render.com)
2. Repositorio Git (GitHub, GitLab o Gitea)
3. Este proyecto (PrimerParcialDesarrollo)

## Pasos para desplegar

### 1. Preparar el repositorio

Asegúrate de que el proyecto esté en Git:

```bash
# Si aún no has inicializado Git
git init
git add .
git commit -m "Primer commit - API Netflix"
git remote add origin https://github.com/tu-usuario/PrimerParcialDesarrollo.git
git branch -M main
git push -u origin main
```

### 2. Crear base de datos PostgreSQL en Render

1. Ir a https://dashboard.render.com
2. Click en **"New"** → **"PostgreSQL"**
3. Llenar formulario:
   - **Name:** `netflix-db` (o el nombre que quieras)
   - **Database:** `netflix_db`
   - **User:** dejar por defecto
   - **Region:** Selecciona tu región más cercana
   - **PostgreSQL Version:** 15
4. Click en **"Create Database"**
5. Copiar la URL de conexión que aparece en la sección "Connections"
   - Formato: `postgresql://usuario:password@host:puerto/database`

### 3. Crear servicio web en Render

1. En el dashboard, click en **"New"** → **"Web Service"**
2. Seleccionar **"Deploy existing repository"** → conectar con GitHub
3. Buscar y seleccionar el repositorio `PrimerParcialDesarrollo`
4. Llenar formulario:
   - **Name:** `netflix-api` (o el nombre que quieras)
   - **Region:** Mismo que la BD
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

### 4. Agregar variables de entorno

Antes de hacer click en "Create Web Service", ir a la sección de variables de entorno y agregar:

```
DATABASE_URL=postgresql://usuario:password@host:puerto/netflix_db
JWT_SECRET=tu_secreto_super_largo_cambiar_esto_12345678
JWT_EXPIRES_IN=1h
NODE_ENV=production
PORT=8081
```

**⚠️ IMPORTANTE:** 
- El `DATABASE_URL` debe ser el que copiaste del paso 2
- El `JWT_SECRET` debe ser una cadena larga y aleatoria (usa un generador de UUID)
- NO compartir el JWT_SECRET con nadie

### 5. Desplegar

1. Click en **"Create Web Service"**
2. Render comenzará a hacer build del proyecto
3. Esperar a que diga "Deployment live" (puede tomar 5-10 minutos)

## Verificar que está funcionando

Una vez desplegado, tu API estará disponible en:
```
https://netflix-api.onrender.com
```

### Test rápido:

1. **Health check:**
   ```bash
   curl https://netflix-api.onrender.com/health
   ```
   Debe responder: `{"status":"OK"}`

2. **Endpoint raíz:**
   ```bash
   curl https://netflix-api.onrender.com/
   ```
   Debe responder con información de la API

3. **Obtener películas:**
   ```bash
   curl https://netflix-api.onrender.com/api/peliculas
   ```
   Debe responder una lista vacía o con películas

## Crear datos de prueba

### 1. Registrar un usuario

```bash
curl -X POST https://netflix-api.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Respuesta esperada:
```json
{
  "message": "Usuario registrado exitosamente!",
  "id": 1
}
```

### 2. Iniciar sesión

```bash
curl -X POST https://netflix-api.onrender.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

Respuesta esperada (guardar el `accessToken`):
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h"
}
```

### 3. Crear películas

Usa el token del paso anterior:

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST https://netflix-api.onrender.com/api/peliculas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Inception",
    "sinopsis": "Un ladrón que roba secretos empresariales mediante tecnología de compresión de sueños",
    "actores": "Leonardo DiCaprio, Marion Cotillard, Ellen Page",
    "duracion": 148,
    "tipo": "Película",
    "categoria": "Ciencia Ficción",
    "anioLanzamiento": 2010,
    "calificacion": 8.8
  }'
```

## Datos de prueba completos

Aquí hay varias películas para agregar:

### Película 1: Inception
```json
{
  "nombre": "Inception",
  "sinopsis": "Un ladrón que roba secretos empresariales mediante tecnología de compresión de sueños debe cambiar sus objetivos",
  "actores": "Leonardo DiCaprio, Marion Cotillard, Ellen Page",
  "duracion": 148,
  "tipo": "Película",
  "categoria": "Ciencia Ficción",
  "anioLanzamiento": 2010,
  "calificacion": 8.8
}
```

### Película 2: Breaking Bad
```json
{
  "nombre": "Breaking Bad",
  "sinopsis": "Un profesor de química se convierte en traficante de metanfetamina con su estudiante",
  "actores": "Bryan Cranston, Aaron Paul, Anna Gunn",
  "duracion": 47,
  "tipo": "Serie",
  "categoria": "Drama",
  "anioLanzamiento": 2008,
  "calificacion": 9.5
}
```

### Película 3: The Matrix
```json
{
  "nombre": "The Matrix",
  "sinopsis": "Un hacker descubre la verdadera naturaleza de su realidad",
  "actores": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
  "duracion": 136,
  "tipo": "Película",
  "categoria": "Ciencia Ficción",
  "anioLanzamiento": 1999,
  "calificacion": 8.7
}
```

### Película 4: Stranger Things
```json
{
  "nombre": "Stranger Things",
  "sinopsis": "Un grupo de amigos se enfrenta a eventos paranormales en un pequeño pueblo",
  "actores": "Winona Ryder, David Harbour, Finn Wolfhard",
  "duracion": 50,
  "tipo": "Serie",
  "categoria": "Misterio",
  "anioLanzamiento": 2016,
  "calificacion": 8.7
}
```

### Película 5: The Shawshank Redemption
```json
{
  "nombre": "The Shawshank Redemption",
  "sinopsis": "Un banquero injustamente encarcelado forma una amistad especial con un compañero prisionero",
  "actores": "Tim Robbins, Morgan Freeman",
  "duracion": 142,
  "tipo": "Película",
  "categoria": "Drama",
  "anioLanzamiento": 1994,
  "calificacion": 9.3
}
```

## Solucionar problemas

### Problema: "Application failed to start"

**Solución:**
1. Revisar los logs en Render: Dashboard → Tu servicio → Logs
2. Verificar que el `DATABASE_URL` sea correcto
3. Verificar que todas las variables de entorno estén configuradas

### Problema: "Error connecting to database"

**Solución:**
1. Verificar que la base de datos está activa en Render
2. Copiar nuevamente el `DATABASE_URL` correcto
3. Verificar que la BD tiene el protocolo `postgresql://` al inicio

### Problema: "Cannot find module"

**Solución:**
1. Verificar que `npm install` está incluido en el Build Command
2. Revisar que todos los módulos estén en `package.json`
3. Hacer un rebuild: Dashboard → Tu servicio → Manual Deployments → Redeploy

### Problema: Token no funciona

**Solución:**
1. Asegurar que el token esté en el header correcto: `Authorization: Bearer <token>`
2. Verificar que el token no ha expirado (expira en 1 hora)
3. Hacer login nuevamente para obtener un nuevo token

## Monitoreo

Para ver el estado del servidor:

1. Ir a tu dashboard de Render
2. Haz click en tu servicio (netflix-api)
3. Ver la sección "Logs" para errores
4. Ver "Status" para el estado actual

## Actualizaciones

Para actualizar el código en producción:

1. Hacer commit y push a GitHub
2. Render detectará el cambio automáticamente
3. Hará un rebuild y desplegará la versión nueva
4. El proceso toma 5-10 minutos

```bash
git add .
git commit -m "Actualización: agregar nueva funcionalidad"
git push origin main
```

## Información útil

- **URL de tu API:** `https://netflix-api.onrender.com`
- **Dashboard de Render:** https://dashboard.render.com
- **Documentación de Render:** https://render.com/docs
- **Panel de BD PostgreSQL:** https://dashboard.render.com (sección Databases)

---

**¡Éxito en tu despliegue!** 🚀
