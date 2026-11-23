import Icon from "./Icon.jsx";
import { formatPrice, formatDate } from "../utils/format.js";
import styles from "./Planner.module.css";
export default function FlightCard({ flight, selected, onSelect }) {
  const available = flight.availableSeats > 0;
  return (
    <article
      className={`${styles.flight} ${selected ? styles.selected : ""}`}
      aria-label={`Vuelo de ${flight.airline}`}
    >
      <div className={styles.flightHeading}>
        <span className={styles.airlineIcon}>
          <Icon name="plane" />
        </span>
        <span>{flight.airline}</span>
        <span
          className={`${styles.availability} ${!available ? styles.soldOut : ""}`}
        >
          {available
            ? `${flight.availableSeats} asientos disponibles`
            : "Agotado"}
        </span>
      </div>
      <div className={styles.flightMain}>
        <div className={styles.flightRoute}>
          <div>
            <strong>{flight.departureTime}</strong>
            <span>{flight.origin}</span>
          </div>
          <div className={styles.flightLine}>
            <span>{flight.duration}</span>
            <span className={styles.routeLine}>
              <i />
              <Icon name="plane" size={17} />
            </span>
            <small>
              {flight.stops === 0 ? "Directo" : `${flight.stops} escala`}
            </small>
          </div>
          <div>
            <strong>{flight.arrivalTime}</strong>
            <span>{flight.arrival}</span>
          </div>
        </div>
        <div className={styles.flightPrice}>
          <strong>{formatPrice(flight.price)}</strong>
          <span>CLP · ida y vuelta / persona</span>
          <button
            className={`button button-small ${selected ? "button-outline" : ""}`}
            disabled={!available}
            onClick={onSelect}
            aria-pressed={selected}
          >
            {selected ? (
              <>
                <Icon name="check" size={16} />
                Vuelo elegido
              </>
            ) : available ? (
              "Elegir vuelo"
            ) : (
              "Sin disponibilidad"
            )}
          </button>
        </div>
      </div>
      <div className={styles.flightDates}>
        <Icon name="calendar" size={15} />
        <span>
          Ida: {formatDate(flight.departureDate)} · Vuelta:{" "}
          {formatDate(flight.returnDate)}
        </span>
      </div>
    </article>
  );
}
