# Ejecución y despliegue

La aplicación se compila como sitio estático con Vite. El servicio simulado funciona en desarrollo y en la compilación mediante Mock Service Worker.

## Desarrollo y producción local

```bash
npm ci
npm run dev
```

El servidor de desarrollo usa `http://127.0.0.1:5175/`.

```bash
npm run build
npm run preview
```

La compilación se genera en `dist/` y la vista previa usa `http://127.0.0.1:4175/`. Se necesita un servidor HTTP; no se debe abrir `index.html` directamente desde el sistema de archivos.

## GitHub Pages

El flujo `.github/workflows/deploy.yml` compila y publica `dist/` al ejecutarse manualmente. En el repositorio, el origen de Pages se configura como GitHub Actions.

`base: "./"` permite resolver recursos dentro del subdirectorio del sitio. HashRouter conserva la navegación después de `#`, sin reglas de redirección del servidor. Las fotografías, fuentes, solicitudes API y el Service Worker utilizan la misma base de publicación.

El flujo `.github/workflows/verify.yml` ejecuta pruebas de integración y navegador en los push a `main` y las pull requests. Sus artefactos contienen capturas e informe de Playwright.

## Servicios externos

Para usar un backend externo, crea `.env.local` a partir de `.env.example`:

```dotenv
VITE_ENABLE_MOCKS=false
VITE_API_URL=https://backend.example/api/
VITE_GRAPHQL_URL=https://backend.example/graphql
```

`VITE_API_URL` debe terminar en `/api/`. El endpoint GraphQL debe admitir la operación `TravelOptions` definida en `src/services/apollo.js`. Los servicios externos deben permitir solicitudes desde el origen de la aplicación.

Las variables de Vite se incorporan al código del navegador. No deben contener credenciales ni secretos. Cambiar su valor requiere reiniciar el servidor o volver a compilar.
