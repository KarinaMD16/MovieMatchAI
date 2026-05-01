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
    "preferences": "Descripción de lo que el usuario busca"
  }
  ```
  Respuesta:
  ```json
  {
    "interpretedPreferences": {
      "genres": ["acción", "ciencia ficción"],
      "keywords": ["espacio"],
      "similarTitles": ["Interestelar"],
      "isNew": false,
      "tone": "épico",
      "explanation": "Explicación del análisis"
    },
    "total": 8,
    "recommendations": [
      {
        "tmdbMovieId": 324857,
        "title": "Spider-Man: un nuevo universo",
        "overview": "Descripción",
        "rating": "8.5",
        "releaseDate": "2018-12-14",
        "posterUrl": "url_imagen",
        "reason": "Por qué se recomienda"
      }
    ],
    "originalPreferences": "Lo que escribió el usuario"
  }
  ```

- **GET** `/recommendations/suggestions` - Obtener sugerencias de búsqueda
  Respuesta:
  ```json
  {
    "total": 8,
    "suggestions": [
      "Dramas intensos sobre acoso...",
      "Películas de supervivencia..."
    ]
  }
  ```

#### Favoritos

- **POST** `/favorites/{userId}` - Agregar película a favoritos
  ```json
  {
    "movieId": 123
  }
  ```
  Respuesta:
  ```json
  {
    "message": "Película agregada a favoritos"
  }
  ```

## Cliente API

El cliente API está en `lib/api.ts` y proporciona métodos para:

- `apiClient.login(credentials)` - Login
- `apiClient.register(data)` - Registro
- `apiClient.getMovies()` - Obtener películas
- `apiClient.getMovieDetails(id)` - Detalles de película
- `apiClient.getRecommendations(preferences)` - Recomendaciones IA
- `apiClient.getSuggestions()` - Sugerencias de búsqueda
- `apiClient.searchMovies(query)` - Buscar películas
- `apiClient.addToFavorites(userId, movieId)` - Agregar a favoritos
- `apiClient.logout()` - Logout

### Manejo de Tokens y Usuario

El token JWT se almacena automáticamente en `localStorage` bajo la clave `authToken` y se envía en el header `Authorization: Bearer <token>` en todas las solicitudes autenticadas.

El ID del usuario se almacena en `localStorage` bajo la clave `userId` cuando se hace login o registro, permitiendo agregar películas a favoritos.

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
