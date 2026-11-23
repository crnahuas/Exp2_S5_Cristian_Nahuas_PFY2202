import { useState } from "react";
import { useTravelOptions } from "../hooks/useTravelOptions.js";
import FlightCard from "./FlightCard.jsx";
import HotelCard from "./HotelCard.jsx";
import TripSummary from "./TripSummary.jsx";
import RequestState from "./RequestState.jsx";
import EmptyState from "./EmptyState.jsx";
import ServiceControls from "./ServiceControls.jsx";
import Icon from "./Icon.jsx";
import styles from "./Planner.module.css";

function OptionsForDates({
  data,
  destination,
  departure,
  availableOnly,
  isFetching,
}) {
  const [flightId, setFlightId] = useState(null);
  const [hotelId, setHotelId] = useState(null);
  const flights = data?.flights?.filter(
    (item) =>
      item.departureDate === departure &&
      (!availableOnly || item.availableSeats > 0),
  );
  const hotels = data?.hotels?.filter(
    (item) =>
      item.checkIn === departure && (!availableOnly || item.availableRooms > 0),
  );
  const flight = data?.flights?.find(
    (item) =>
      item.id === flightId &&
      item.availableSeats > 0 &&
      item.departureDate === departure,
  );
  const hotel = data?.hotels?.find(
    (item) =>
      item.id === hotelId &&
      item.availableRooms > 0 &&
      item.checkIn === departure,
  );
  return (
    <div className={styles.plannerLayout}>
      <div className={styles.options}>
        <section aria-labelledby="flights-title" aria-busy={isFetching}>
          <div className={styles.optionsHeading}>
            <span className={styles.headingIcon}>
              <Icon name="plane" />
            </span>
            <div>
              <h2 id="flights-title">Vuelos</h2>
              <p>Desde Santiago (SCL) · ida y vuelta por persona</p>
            </div>
            {flights && (
              <span>
                {flights.length} {flights.length === 1 ? "vuelo" : "vuelos"}
              </span>
            )}
          </div>
          {flights === null || flights === undefined ? (
            !isFetching && (
              <EmptyState title="Los vuelos no están disponibles">
                Reintenta la consulta para recuperar las opciones de vuelo.
              </EmptyState>
            )
          ) : flights.length === 0 ? (
            <EmptyState title="No hay vuelos para esta selección">
              Prueba otra fecha o desactiva el filtro de disponibilidad.
            </EmptyState>
          ) : (
            <div className={styles.optionList}>
              {flights.map((item) => (
                <FlightCard
                  key={item.id}
                  flight={item}
                  selected={item.id === flight?.id}
                  onSelect={() => setFlightId(item.id)}
                />
              ))}
            </div>
          )}
        </section>
        <section aria-labelledby="hotels-title" aria-busy={isFetching}>
          <div className={styles.optionsHeading}>
            <span className={styles.headingIcon}>
              <Icon name="bed" />
            </span>
            <div>
              <h2 id="hotels-title">Hoteles</h2>
              <p>Habitación para una persona · estadías de 5 noches</p>
            </div>
            {hotels && (
              <span>
                {hotels.length} {hotels.length === 1 ? "hotel" : "hoteles"}
              </span>
            )}
          </div>
          {hotels === null || hotels === undefined ? (
            !isFetching && (
              <EmptyState title="Los hoteles no están disponibles">
                Puedes revisar los vuelos recuperados y reintentar la consulta.
              </EmptyState>
            )
          ) : hotels.length === 0 ? (
            <EmptyState title="No hay hoteles para esta selección">
              Prueba otra fecha o desactiva el filtro de disponibilidad.
            </EmptyState>
          ) : (
            <div className={styles.optionList}>
              {hotels.map((item) => (
                <HotelCard
                  key={item.id}
                  hotel={item}
                  selected={item.id === hotel?.id}
                  onSelect={() => setHotelId(item.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <TripSummary
        destination={destination}
        flight={flight}
        hotel={hotel}
        clear={() => {
          setFlightId(null);
          setHotelId(null);
        }}
      />
    </div>
  );
}

export default function TravelPlanner({ destination }) {
  const resource = useTravelOptions(destination.id);
  const [departure, setDeparture] = useState("2027-01-12");
  const [availableOnly, setAvailableOnly] = useState(false);
  return (
    <div className={styles.planner}>
      <div className={styles.plannerHeading}>
        <div>
          <h2 className="section-title">Vuelos y hoteles</h2>
        </div>
        <button
          className="text-link"
          onClick={resource.refetch}
          disabled={resource.isFetching}
        >
          <Icon name="refresh" size={17} />
          Actualizar opciones
        </button>
      </div>
      <div className={styles.plannerFilters}>
        <label>
          <Icon name="calendar" size={20} />
          <span>
            Salidas disponibles
            <select
              value={departure}
              onChange={(event) => setDeparture(event.target.value)}
            >
              <option value="2027-01-12">12 al 17 de enero de 2027</option>
              <option value="2027-01-19">19 al 24 de enero de 2027</option>
            </select>
          </span>
        </label>
        <label className={styles.availabilityFilter}>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
          />
          Solo opciones disponibles
        </label>
      </div>
      <RequestState resource={resource} label="los vuelos y hoteles" />
      {(resource.data || (!resource.isFetching && !resource.isError)) && (
        <OptionsForDates
          key={`${destination.id}-${departure}`}
          data={resource.data}
          destination={destination}
          departure={departure}
          availableOnly={availableOnly}
          isFetching={resource.isFetching}
        />
      )}
      <ServiceControls resource={resource} protocol="GraphQL" />
    </div>
  );
}
