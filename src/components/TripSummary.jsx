import Icon from "./Icon.jsx";
import { formatPrice, nightsBetween } from "../utils/format.js";
import styles from "./Planner.module.css";
export default function TripSummary({ destination, flight, hotel, clear }) {
  const nights = hotel ? nightsBetween(hotel.checkIn, hotel.checkOut) : 0;
  const hotelTotal = hotel ? hotel.pricePerNight * nights : 0;
  const total = (flight?.price || 0) + hotelTotal;
  return (
    <aside className={styles.summary} aria-label="Resumen de tu viaje">
      <h2>Resumen del viaje</h2>
      <p className={styles.summaryDestination}>{destination.name}</p>
      <p className={styles.summaryIntro}>Una persona · una habitación</p>
      <div className={styles.summaryItem}>
        <Icon name="plane" />
        <div>
          <h3>Tu vuelo</h3>
          {flight ? (
            <>
              <p>{flight.airline}</p>
              <strong>{formatPrice(flight.price)}</strong>
              <span>Ida y vuelta</span>
            </>
          ) : (
            <p>Elige una opción de vuelo.</p>
          )}
        </div>
      </div>
      <div className={styles.summaryItem}>
        <Icon name="bed" />
        <div>
          <h3>Tu alojamiento</h3>
          {hotel ? (
            <>
              <p>{hotel.name}</p>
              <strong>{formatPrice(hotelTotal)}</strong>
              <span>
                {nights} noches · {formatPrice(hotel.pricePerNight)} por noche
              </span>
            </>
          ) : (
            <p>Elige un alojamiento.</p>
          )}
        </div>
      </div>
      <div className={styles.summaryTotal} role="status" aria-live="polite">
        <span>
          {flight && hotel ? "Total estimado" : "Subtotal seleccionado"}
        </span>
        <strong>{total ? formatPrice(total) : "Por definir"}</strong>
        <small>Pesos chilenos · CLP</small>
      </div>
      {(flight || hotel) && (
        <button className="text-link" onClick={clear}>
          Limpiar selección
        </button>
      )}
    </aside>
  );
}
