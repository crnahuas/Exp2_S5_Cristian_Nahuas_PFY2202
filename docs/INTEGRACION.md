# Integración de Rumbo con REST y GraphQL

La aplicación obtiene destinos mediante REST y sus alternativas mediante GraphQL. MSW intercepta solicitudes HTTP reales del navegador; las vistas no importan los datos de `src/mocks/data.js`.

## Inicio y rutas

`main.jsx` espera `worker.start()` antes de montar React. El worker se sirve desde `BASE_URL + mockServiceWorker.js`, tanto en desarrollo como en la compilación de producción. Si falla el registro, se muestra una alerta y un botón para recargar.

HashRouter mantiene las rutas de React después de `#`. Los archivos, fuentes y URLs de API se resuelven dentro del subdirectorio publicado. Las páginas distintas de Inicio se cargan al visitarlas. El build separa las dependencias de React y GraphQL para facilitar la reutilización de archivos en caché.

## Recorridos de datos

| Recorrido sin caché previa | Solicitudes | Comportamiento |
| --- | --- | --- |
| Inicio | `GET /api/destinations?limit=3` | Tres tarjetas desde REST. La fotografía y el buscador son contenido de presentación. |
| Abrir Destinos | `GET /api/destinations` | Seis destinos con país y actividades. Búsqueda, orden y filtros reutilizan este resultado. |
| Abrir un destino válido directamente | `GET /api/destinations/:id`, `GET /api/destinations`, `POST /graphql` | La ficha REST habilita el selector y la consulta GraphQL. Las dos últimas pueden ejecutarse en paralelo. |
| Abrir un destino desconocido | `GET /api/destinations/:id` | Error 404; no se consultan opciones GraphQL ni el selector. |
| Cambiar las fechas | Ninguna adicional | Se filtran los vuelos y hoteles ya obtenidos para ese destino. Se limpia la selección. |
| Cambiar de destino | REST de la nueva ficha y GraphQL con el nuevo `destinationId` | El listado REST se reutiliza si sigue vigente. La selección anterior se elimina. |

En desarrollo, StrictMode puede iniciar y cancelar una consulta durante la comprobación inicial de React. Las pruebas de conteo se realizan contra producción.

## REST

`getResource` construye la URL desde BASE_URL o VITE_API_URL, propaga AbortSignal, verifica el estado HTTP y valida JSON antes de devolverlo. Un listado vacío es válido; una ficha incompleta no lo es. El mock valida `limit` y responde 404 para identificadores desconocidos.

TanStack Query mantiene los resultados cinco minutos como frescos y elimina cachés inactivas a los diez minutos. No hace reintentos automáticos ni vuelve a consultar al recuperar el foco. Una consulta fallida puede conservar datos previos de su misma ruta; nunca utiliza los de otra ficha.

## GraphQL y Apollo

La operación `TravelOptions($destinationId: ID!)` solicita vuelos y hoteles en una misma petición. Incluye campos usados para comparar precios, fechas, disponibilidad y condiciones de cada alternativa.

`schema.js` define los tipos y sus resolvers. El handler ejecuta la consulta con GraphQL, de modo que un campo inexistente genera `errors` y una consulta reducida obtiene solo su selección. No se responde un JSON fijo sin interpretar la consulta.

Apollo usa InMemoryCache y una política `cache-first` para las consultas normales. Las variables distinguen los resultados por destino. `errorPolicy: "all"` admite datos parciales: si fallan hoteles, se conserva la lista de vuelos y se informa de la parte que no se pudo recuperar.

Los contratos de respuesta comprueban que `destinationId` coincida tanto en el contenedor como en cada vuelo y hotel. Un resultado de otro destino se descarta. La prueba de concurrencia entrega una respuesta tardía de Cusco después de navegar a San Pedro y verifica que no cambie los datos actuales.

## Estado de interfaz

`useState` controla búsqueda, menú, fechas, disponibilidad y selecciones. `useEffect` sincroniza la búsqueda con la URL, cancela el temporizador pendiente, actualiza títulos y cierra el menú al navegar. Los efectos de ruta coordinan foco y desplazamiento.

La ficha se remonta por `destinationId`; las opciones seleccionadas se reinician también por fecha. El resumen obtiene los objetos elegidos desde la respuesta actual, comprueba que sigan disponibles y calcula el total sin duplicar precios en otro estado.

## Errores y simulación

REST distingue 404, errores HTTP, fallo de red, JSON inválido y contrato incompleto. GraphQL admite error de transporte, error de operación, datos parciales y listas vacías. Reintentar repite una consulta normal; Actualizar vuelve a solicitar el recurso.

Las herramientas de desarrollo usan `rest` y `gql` en la URL. Cada escenario REST tiene su propia clave de caché; GraphQL simulado usa `no-cache`. El cambio de escenario remonta el panel para ejecutar la nueva consulta con sus cabeceras. Producción elimina los controles y las cabeceras de simulación, ignora parámetros de escenario y mantiene respuestas normales.

## Fuentes técnicas

- [Apollo Client para React](https://www.apollographql.com/docs/react/get-started).
- [Consultas y políticas de caché de Apollo](https://www.apollographql.com/docs/react/data/queries).
- [Handlers GraphQL de Mock Service Worker](https://mswjs.io/docs/api/graphql).

El proyecto utiliza Apollo Client 4 y MSW 2, fijados de manera reproducible por `package-lock.json`. Los imports de React de Apollo Client se resuelven desde `@apollo/client/react`.
