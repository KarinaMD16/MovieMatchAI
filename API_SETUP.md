# Configuración de API - MovieMatchAI

## Instalación

Tu proyecto está configurado para conectarse a una API NestJS en el puerto 3000.

### Variables de Entorno

El archivo `.env.local` ya está configurado:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Estructura de Endpoints Esperados

Tu API NestJS debe proporcionar los siguientes endpoints:

#### Autenticación

- **POST** `/auth/login` - Iniciar sesión

  ```json
  {
    "email": "usuario@email.com",
    "password": "contraseña"
  }
  ```

  Respuesta:

  ```json
  {
    "access_token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "usuario@email.com",
      "name": "Nombre Usuario"
    }
  }
  ```

- **POST** `/auth/register` - Registrar nuevo usuario
  ```json
  {
    "name": "Nombre Completo",
    "email": "usuario@email.com",
    "password": "contraseña"
  }
  ```

#### Películas

- **GET** `/movies` - Obtener todas las películas

  ```json
  [
    {
      "id": 1,
      "title": "Nombre Película",
      "overview": "Descripción",
      "posterPath": "url_imagen",
      "backdropPath": "url_fondo",
      "releaseDate": "2024-01-01",
      "rating": 8.5,
      "genres": ["Acción", "Drama"],
      "runtime": 120,
      "director": "Nombre Director",
      "cast": ["Actor 1", "Actor 2"]
    }
  ]
  ```

- **GET** `/movies/:id` - Obtener detalles de una película

- **GET** `/movies/search?q=query` - Buscar películas

#### Recomendaciones con IA

- **POST** `/recommendations` - Obtener recomendaciones basadas en IA
  ```json
  {
    "prompt": "Descripción de lo que el usuario busca"
  }
  ```
  Respuesta:
  ```json
  {
    "movies": [Movie[], ...],
    "explanation": "Explicación de las recomendaciones"
  }
  ```

## Cliente API

El cliente API está en `lib/api.ts` y proporciona métodos para:

- `apiClient.login(credentials)` - Login
- `apiClient.register(data)` - Registro
- `apiClient.getMovies()` - Obtener películas
- `apiClient.getMovieDetails(id)` - Detalles de película
- `apiClient.getRecommendations(prompt)` - Recomendaciones IA
- `apiClient.searchMovies(query)` - Buscar películas
- `apiClient.logout()` - Logout

### Manejo de Tokens

El token JWT se almacena automáticamente en `localStorage` bajo la clave `authToken` y se envía en el header `Authorization: Bearer <token>` en todas las solicitudes autenticadas.

## Ejecutar el Proyecto

1. Asegúrate que tu API NestJS está corriendo en `http://localhost:3000`
2. Instala dependencias: `npm install`
3. Ejecuta el proyecto: `npm run dev`
4. Accede a `http://localhost:3001` (o el puerto que use Next.js)

## Cambios Realizados

✅ Creado archivo `.env.local` con configuración de API
✅ Creado cliente API en `lib/api.ts`
✅ Actualizado `auth-form.tsx` para usar API real
✅ Actualizado `dashboard/page.tsx` para cargar películas desde API
✅ Actualizado `movie-catalog.tsx` para recibir películas como prop
✅ Actualizado `ai-recommendation.tsx` para usar endpoint de recomendaciones
✅ Actualizado `header.tsx` para logout con API
