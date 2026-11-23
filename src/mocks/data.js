// Datos de demostración. Solo el backend mock importa este archivo.
export const destinations = [
  {
    id: "puerto-natales",
    name: "Puerto Natales",
    country: "Chile",
    category: "Naturaleza",
    region: "Patagonia chilena",
    airport: "PNT",
    image: "images/patagonia.webp",
    description:
      "Puerto Natales es una base para visitar Torres del Paine y navegar por los fiordos de la Patagonia chilena.",
    activities: ["Torres del Paine", "Navegación por fiordos", "Senderismo"],
    bestSeason: "Octubre a abril",
    recommendedDays: "5 a 7 días",
    tip: "Lleva ropa por capas y reserva con anticipación los accesos al parque. El clima puede cambiar durante el día.",
  },
  {
    id: "san-pedro",
    name: "San Pedro de Atacama",
    country: "Chile",
    category: "Naturaleza",
    region: "Desierto de Atacama",
    airport: "CJC",
    image: "images/atacama.webp",
    description:
      "San Pedro de Atacama reúne excursiones al Valle de la Luna, lagunas altiplánicas y observación astronómica. El acceso aéreo es por Calama.",
    activities: [
      "Valle de la Luna",
      "Observación de estrellas",
      "Géiseres del Tatio",
    ],
    bestSeason: "Marzo a mayo · septiembre a noviembre",
    recommendedDays: "4 a 5 días",
    tip: "El aeropuerto de llegada está en Calama. Considera el traslado a San Pedro y dedica el primer día a aclimatarte antes de subir al altiplano.",
  },
  {
    id: "rio-de-janeiro",
    name: "Río de Janeiro",
    country: "Brasil",
    category: "Playa",
    region: "Costa brasileña",
    airport: "GIG",
    image: "images/rio.webp",
    description:
      "Río de Janeiro combina playas como Ipanema y Copacabana con visitas al Pan de Azúcar y al Cristo Redentor.",
    activities: ["Ipanema", "Pan de Azúcar", "Cristo Redentor"],
    bestSeason: "Abril a junio · septiembre a noviembre",
    recommendedDays: "5 a 7 días",
    tip: "Planifica las visitas a los miradores para los días despejados y considera tiempo para recorrer la ciudad sin apuro.",
  },
  {
    id: "cusco",
    name: "Cusco",
    country: "Perú",
    category: "Cultura",
    region: "Andes peruanos",
    airport: "CUZ",
    image: "images/cusco.webp",
    description:
      "Desde Cusco se puede visitar el Valle Sagrado y Machu Picchu. El centro histórico reúne arquitectura inca y colonial, mercados y museos.",
    activities: ["Machu Picchu", "Valle Sagrado", "Centro histórico"],
    bestSeason: "Mayo a septiembre",
    recommendedDays: "5 a 7 días",
    tip: "Considera un día de descanso al llegar por la altura y revisa con anticipación las entradas a Machu Picchu.",
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    category: "Ciudad",
    region: "Río de la Plata",
    airport: "EZE",
    image: "images/buenos-aires.webp",
    description:
      "Buenos Aires ofrece recorridos por San Telmo, Palermo y el centro, además de visitas al Teatro Colón y espectáculos de tango.",
    activities: ["San Telmo", "Teatro Colón", "Cafés de Palermo"],
    bestSeason: "Marzo a mayo · septiembre a noviembre",
    recommendedDays: "3 a 5 días",
    tip: "Agrupa los paseos por barrio para aprovechar los días y deja una tarde libre para descubrir sus cafés y librerías.",
  },
  {
    id: "rapa-nui",
    name: "Rapa Nui",
    country: "Chile",
    category: "Cultura",
    region: "Polinesia chilena",
    airport: "IPC",
    image: "images/rapa-nui.webp",
    description:
      "Rapa Nui ofrece visitas a sitios arqueológicos, volcanes y playas. El aeropuerto de Mataveri se encuentra en Hanga Roa.",
    activities: ["Ahu Tongariki", "Playa Anakena", "Volcán Rano Kau"],
    bestSeason: "Septiembre a abril",
    recommendedDays: "5 a 6 días",
    tip: "Revisa los requisitos vigentes de ingreso y las condiciones de visita del parque antes de viajar. Recorre los sitios con guías autorizados.",
  },
];

const prices = [128990, 72990, 189990, 214990, 119990, 329990];
const hotelNames = [
  ["Refugio del Fiordo", "Casa Viento Sur", "Estancia del Lago"],
  ["Casa del Desierto", "Refugio Licancabur", "Patio de la Luna"],
  ["Casa Ipanema", "Mirador de Guanabara", "Jardín de Santa Teresa"],
  ["Patio del Sol", "Casa del Valle", "Posada de los Andes"],
  ["Casa Palermo", "Patio de San Telmo", "Mirador del Plata"],
  ["Cabañas del Pacífico", "Casa Anakena", "Refugio Rano Kau"],
];

export const travelOptions = Object.fromEntries(
  destinations.map((destination, index) => {
    const base = prices[index];
    return [
      destination.id,
      {
        id: `options-${destination.id}`,
        destinationId: destination.id,
        flights: [
          {
            id: `${destination.id}-flight-1`,
            destinationId: destination.id,
            airline: "Aerolínea Horizonte",
            origin: "SCL",
            arrival: destination.airport,
            departureDate: "2027-01-12",
            returnDate: "2027-01-17",
            departureTime: "08:20",
            arrivalTime: "11:40",
            duration:
              index === 3
                ? "5 h 20 min"
                : index === 5
                  ? "5 h 30 min"
                  : "3 h 20 min",
            stops: index === 3 ? 1 : 0,
            price: base,
            currency: "CLP",
            availableSeats: 8,
          },
          {
            id: `${destination.id}-flight-2`,
            destinationId: destination.id,
            airline: "Aerolínea Austral",
            origin: "SCL",
            arrival: destination.airport,
            departureDate: "2027-01-19",
            returnDate: "2027-01-24",
            departureTime: "14:10",
            arrivalTime: "18:10",
            duration: "4 h",
            stops: 1,
            price: base + 36000,
            currency: "CLP",
            availableSeats: 3,
          },
          {
            id: `${destination.id}-flight-3`,
            destinationId: destination.id,
            airline: "Aerolínea del Pacífico",
            origin: "SCL",
            arrival: destination.airport,
            departureDate: "2027-01-12",
            returnDate: "2027-01-17",
            departureTime: "17:30",
            arrivalTime: "21:00",
            duration: "3 h 30 min",
            stops: 0,
            price: base - 12000,
            currency: "CLP",
            availableSeats: 0,
          },
        ],
        hotels: ["2027-01-12", "2027-01-19"].flatMap((checkIn, dateIndex) =>
          hotelNames[index].map((name, hotelIndex) => ({
            id: `${destination.id}-hotel-${hotelIndex + 1}-${dateIndex}`,
            destinationId: destination.id,
            name,
            area:
              hotelIndex === 0
                ? "Zona céntrica"
                : hotelIndex === 1
                  ? "Barrio residencial"
                  : "Entorno natural",
            stars: hotelIndex === 2 ? 5 : hotelIndex === 0 ? 3 : 4,
            pricePerNight: 49000 + index * 8000 + hotelIndex * 24000,
            currency: "CLP",
            availableRooms: hotelIndex === 2 ? 0 : hotelIndex === 0 ? 5 : 2,
            checkIn,
            checkOut: dateIndex === 0 ? "2027-01-17" : "2027-01-24",
            amenities:
              hotelIndex === 0
                ? ["Desayuno incluido", "Wi-Fi"]
                : ["Wi-Fi", "Terraza", "Desayuno incluido"],
          })),
        ),
      },
    ];
  }),
);
