# Evidencias de Rumbo

Las capturas se generan con `npm run test:e2e`. Las pantallas normales se capturan contra la compilación de producción; las de simulación utilizan el servidor de desarrollo y el Service Worker real.

| Captura | Contenido |
| --- | --- |
| [01 Inicio escritorio](capturas/01-inicio-escritorio.png) | Buscador, fotografía de Río de Janeiro y destinos obtenidos por REST. |
| [02 Destinos escritorio](capturas/02-destinos-escritorio.png) | Seis destinos con país y actividades. |
| [03 Filtro Cultura](capturas/03-filtro-cultura.png) | Filtro de experiencia sin repetir la consulta. |
| [04 Detalle y resumen](capturas/04-detalle-y-resumen.png) | Puerto Natales, opciones GraphQL y estimación del viaje. |
| [05 Destino inexistente](capturas/05-destino-inexistente.png) | REST 404 sin consulta GraphQL innecesaria. |
| [06 Inicio móvil](capturas/06-inicio-movil.png) | Inicio a 390 px. |
| [07 Destinos móvil](capturas/07-destinos-movil.png) | Catálogo y controles adaptados. |
| [08 Detalle móvil](capturas/08-detalle-movil.png) | Selección de vuelo y hotel de Cusco. |
| [09 Carga REST](capturas/09-carga-rest.png) | Mensaje durante una petición lenta. |
| [10 Error REST 500](capturas/10-error-rest-500.png) | Fallo del servicio y respaldo del mismo listado. |
| [10 Error REST 404](capturas/10-error-rest-404.png) | Recurso no encontrado y recuperación. |
| [10 Error de conexión](capturas/10-error-rest-network.png) | Mensaje ante un fallo de red. |
| [11 Error GraphQL](capturas/11-error-graphql.png) | Error de operación y botón para reintentar. |
| [12 Datos parciales](capturas/12-datos-parciales.png) | Vuelos recuperados y servicio de hoteles fallido. |
| [13 Destinos tablet](capturas/13-destinos-tablet.png) | Catálogo a 768 px. |
| [14 Detalle tablet](capturas/14-detalle-tablet.png) | Detalle y alternativas a 768 px. |

Las pruebas de navegador recorren la aplicación en Chromium, Firefox y WebKit. Las capturas muestran el catálogo, las consultas y la selección del viaje en distintos anchos. Para ejecutar los escenarios y abrir el informe, consulta [Pruebas](../docs/PRUEBAS.md).
