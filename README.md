# Rumbo

Rumbo permite explorar destinos de Chile y Sudamérica, comparar vuelos y hoteles, y calcular el valor de un viaje para una persona. Los destinos se consultan mediante REST; los vuelos y alojamientos, mediante GraphQL con Apollo Client.

## Ejecutar

Requiere Node.js 24 y npm.

```bash
npm ci
npm run dev
```

La aplicación se abre en `http://127.0.0.1:5175/`. También se puede iniciar con `npm start`.

## Usar la aplicación

1. Busca un lugar desde Inicio o entra a Destinos.
2. Filtra por país o tipo de viaje. También puedes buscar por nombre o actividad y ordenar alfabéticamente.
3. Abre un destino para consultar sus actividades y las opciones de vuelo y hotel.
4. Elige una salida y selecciona un vuelo y un alojamiento disponibles.
5. Revisa el resumen: suma el vuelo de ida y vuelta y las cinco noches de una habitación para una persona.

Los precios están en pesos chilenos. Por ejemplo, el vuelo de Aerolínea Horizonte a Puerto Natales y cinco noches en Refugio del Fiordo suman $373.990 CLP para la salida del 12 de enero de 2027.

Cambiar de destino o fecha limpia la selección. Las opciones agotadas están deshabilitadas y pueden ocultarse con **Solo opciones disponibles**. La selección y la caché se mantienen durante la sesión; se eliminan al recargar.

La búsqueda ignora tildes y mayúsculas. El texto, país, experiencia y orden se guardan en la URL, por lo que puedes volver desde el detalle sin perder los filtros.

## Pantallas

| Ruta después de `#` | Función |
| --- | --- |
| `/` | Buscador y selección de destinos. |
| `/destinos` | Catálogo, filtros y orden. |
| `/destinos/:destinationId` | Información del destino, vuelos, hoteles y resumen. |
| `/como-viajar` | Instrucciones de uso y preguntas frecuentes. |
| Otras rutas | Página no encontrada con acceso a los destinos. |

React Router utiliza HashRouter para admitir enlaces directos y recargas en alojamiento estático. La navegación actualiza el título de la pestaña, el enlace activo, el foco y la posición de la página. El menú móvil se puede cerrar con Escape.

## Componentes

| Componente | Responsabilidad |
| --- | --- |
| `Layout` | Cabecera, navegación, menú móvil, pie y foco al navegar. |
| `DestinationCard` | Fotografía, país, actividades y acceso al detalle. |
| `TravelPlanner` | Fechas, filtro de disponibilidad y selección de alternativas. |
| `FlightCard` | Horarios, ruta, precio y asientos disponibles. |
| `HotelCard` | Categoría, servicios, fechas, precio y habitaciones disponibles. |
| `TripSummary` | Cálculo del vuelo y la estadía seleccionados. |
| `RequestState` y `EmptyState` | Carga, errores, recuperación y resultados vacíos. |
| `TravelImage` | Carga de fotografías locales y respaldo si una imagen falla. |

Los detalles de estado y composición están en [Componentes](docs/COMPONENTES.md). Los colores se definen en `src/styles/global.css` y la distribución de cada componente utiliza CSS Modules. Las fotografías y fuentes se sirven localmente; las referencias de las fotografías están en [imagenes.json](docs/imagenes.json).

## Servicios

| Solicitud | Datos |
| --- | --- |
| `GET /api/destinations?limit=3` | Destinos de Inicio. |
| `GET /api/destinations` | Destinos del catálogo y selector. |
| `GET /api/destinations/:id` | Ficha de un destino. |
| `POST /graphql` con `TravelOptions` | Vuelos y hoteles asociados a `destinationId`. |

Mock Service Worker intercepta las solicitudes HTTP y responde con datos locales. La aplicación espera su activación antes de consultar. Las vistas acceden a los servicios mediante hooks y no importan directamente los datos del mock.

TanStack Query conserva resultados REST durante cinco minutos y cancela consultas que dejan de usarse. Apollo Client separa su caché por destino. Buscar, ordenar, filtrar y cambiar de fecha reutiliza datos ya consultados. GraphQL se ejecuta después de obtener un destino válido.

La explicación de consultas, caché y respuestas parciales está en [Integración](docs/INTEGRACION.md).

## Comandos

| Comando | Uso |
| --- | --- |
| `npm test` | Pruebas de servicios, componentes y navegación. |
| `npm run build` | Genera `dist/`. |
| `npm run preview` | Abre la compilación en `http://127.0.0.1:4175/`. |
| `npx playwright install chromium firefox webkit` | Instala los motores usados en las pruebas de navegador. |
| `npm run test:e2e` | Compila y prueba recorridos en Chromium, Firefox y WebKit. |

[Pruebas](docs/PRUEBAS.md) explica los escenarios y la generación de capturas. [Despliegue](docs/DESPLIEGUE.md) describe la configuración de alojamiento y servicios externos.
