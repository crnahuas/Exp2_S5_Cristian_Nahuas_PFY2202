# Componentes de Rumbo

Las páginas conectan los datos de los servicios con componentes de presentación. Los hooks coordinan las consultas; los componentes reciben sus datos y acciones mediante propiedades.

## Páginas y navegación

`App` relaciona las rutas de React Router con Inicio, Destinos, Detalle, Cómo planificar y Página no encontrada. Las páginas distintas de Inicio se cargan al visitarlas.

`Layout` reúne la cabecera, el menú, el contenido y el pie. Al cambiar de ruta, mueve el foco al contenido sin desplazar la cabecera y vuelve al inicio de la página. `usePageTitle` actualiza el título. El menú móvil mantiene su estado con `useState`, se cierra al navegar y devuelve el foco al botón al pulsar Escape.

## Catálogo

`DestinationCard` muestra fotografía, nombre, país, categoría, actividades y duración sugerida. Sus enlaces abren la ficha del destino.

`Destinations` filtra una copia de los datos por texto, país y experiencia. La normalización ignora tildes y mayúsculas. El texto filtra de inmediato y se guarda en la URL después de 300 ms. Los efectos sincronizan el campo con la navegación y cancelan las actualizaciones pendientes. El ordenamiento no modifica la caché.

## Planificación

`DestinationDetail` obtiene la ficha REST y habilita el selector y las opciones cuando existe un destino válido. Su contenido se identifica por `destinationId` para mantener separados los datos de cada ruta.

`TravelPlanner` consulta vuelos y hoteles, mantiene la fecha y el filtro de disponibilidad, y compone las listas de alternativas y el resumen. Cambiar la fecha o el destino reinicia los identificadores seleccionados.

`FlightCard` presenta aerolínea, horarios, aeropuertos, duración, escalas, fechas, precio y asientos. `HotelCard` presenta nombre, categoría, ubicación, servicios, fechas, precio por noche y habitaciones. Las opciones sin disponibilidad tienen el botón deshabilitado.

`TripSummary` obtiene el vuelo y el hotel elegidos desde la respuesta actual. El total suma el vuelo de ida y vuelta y el precio por noche multiplicado por el número de noches. El resumen no mantiene una copia de los precios en otro estado. Si una opción deja de estar disponible, no se incluye en el cálculo.

## Estados de consulta

`RequestState` muestra carga, errores, reintento y datos recuperados del mismo recurso. Los mensajes utilizan `role="status"` o `role="alert"` según corresponda. `EmptyState` presenta una explicación y una acción cuando un listado no tiene resultados.

`TravelImage` sirve imágenes locales, utiliza carga diferida salvo para la imagen principal y muestra un respaldo cuando falla una fotografía. El texto alternativo se proporciona cuando la imagen aporta información que no está junto a ella.

## Estilos y recursos

`global.css` define la paleta, las fuentes locales, los controles, el foco y el comportamiento de movimiento reducido. Los archivos CSS Modules describen la distribución de páginas, tarjetas, estados y planificación. Los colores de los componentes usan las variables globales.

Los iconos SVG de `Icon` acompañan controles e información concreta. `Brand` y `favicon.svg` identifican la aplicación.
