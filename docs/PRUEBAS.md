# Pruebas de Rumbo

El proyecto utiliza Vitest y Testing Library para comprobar servicios y componentes, y Playwright para probar los recorridos en navegador con el Service Worker activo.

## Servicios y componentes

```bash
npm test
```

Las pruebas comprueban contratos REST, límites y errores HTTP, respuestas GraphQL, selección de campos, caché por destino, filtrado, cálculo del viaje y recuperación de errores. Un caso entrega una respuesta tardía del destino anterior para comprobar que no cambie la pantalla actual. También se comprueba el respaldo de imágenes.

Los handlers de `src/mocks/handlers.js` se utilizan mediante `msw/node` en estas pruebas. Los handlers temporales de un caso se restablecen antes del siguiente.

## Navegadores

Instala los motores la primera vez:

```bash
npx playwright install chromium firefox webkit
npm run test:e2e
```

La suite compila la aplicación y comprueba:

- Consulta REST del inicio y búsqueda desde el formulario.
- Filtros, orden e historial sin solicitudes repetidas.
- Consulta GraphQL con el destino seleccionado.
- Selección de alternativas, bloqueo de opciones agotadas y cálculo del total.
- Limpieza de selecciones al cambiar destino o fecha.
- Navegación, foco y recuperación de rutas inexistentes.
- Recarga, fotografías y consultas bajo un subdirectorio.
- Adaptación a 320, 390, 768 y 1024 px sin desbordamiento horizontal.
- Separación entre la aplicación de producción y las herramientas de simulación.

La configuración inicia los servidores en los puertos 5175, 4176 y 4177 y los detiene al finalizar si los inició la suite. Las pruebas normales se ejecutan en Chromium, Firefox y WebKit; los escenarios de desarrollo usan Chromium.

## Simular respuestas

En desarrollo, los controles **Probar estados de REST** y **Probar estados de GraphQL** permiten seleccionar carga lenta, errores HTTP, fallo de conexión y listas vacías. GraphQL incluye errores de operación y datos parciales.

| URL | Comportamiento |
| --- | --- |
| `/#/destinos?rest=slow` | Carga lenta del catálogo. |
| `/#/destinos?rest=500` | Error HTTP 500. |
| `/#/destinos/cusco?gql=graphql` | Error de operación GraphQL. |
| `/#/destinos/cusco?gql=partial` | Vuelos recuperados y hoteles no disponibles. |

**Reintentar** solicita el escenario normal. **Actualizar consulta** repite el escenario seleccionado. La producción no muestra estos controles ni consume escenarios de la URL.

## Capturas e informe

Las capturas se generan en `evidencias/capturas`. El [índice de pantallas](../evidencias/README.md) permite recorrerlas. El informe HTML queda en `playwright-report/` y las trazas de fallos en `test-results/`; ambas carpetas están excluidas de Git.
