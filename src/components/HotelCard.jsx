import Icon from "./Icon.jsx";
import { formatPrice, formatDate, nightsBetween } from "../utils/format.js";
import styles from "./Planner.module.css";
export default function HotelCard({ hotel, selected, onSelect }) {
  const available = hotel.availableRooms > 0;
  return (
    <article
      className={`${styles.hotel} ${selected ? styles.selected : ""}`}
      aria-label={`Hotel ${hotel.name}`}
    >
      <div className={styles.hotelMain}>
        <div className={styles.hotelCopy}>
          <span
            className={styles.stars}
            aria-label={`${hotel.stars} estrellas`}
          >
            {Array.from({ length: hotel.stars }, (_, i) => (
              <Icon name="star" key={i} size={12} />
            ))}
          </span>
          <h3>{hotel.name}</h3>
          <p>
            <Icon name="pin" size={14} />
            {hotel.area}
          </p>
          <p className={styles.amenities}>{hotel.amenities.join(" · ")}</p>
        </div>
        <div className={styles.hotelPrice}>
          <strong>{formatPrice(hotel.pricePerNight)}</strong>
          <span>CLP · habitación / noche</span>
          <button
            className={`button button-small ${selected ? "button-outline" : ""}`}
            disabled={!available}
            onClick={onSelect}
            aria-pressed={selected}
          >
            {selected ? (
              <>
                <Icon name="check" size={16} />
                Hotel elegido
              </>
            ) : available ? (
              "Elegir hotel"
            ) : (
              "Sin disponibilidad"
            )}
          </button>
        </div>
      </div>
      <div className={styles.hotelFooter}>
        <span>
          <Icon name="calendar" size={15} />
          {formatDate(hotel.checkIn)} al {formatDate(hotel.checkOut)} ·{" "}
          {nightsBetween(hotel.checkIn, hotel.checkOut)} noches
        </span>
        <span
          className={`${styles.availability} ${!available ? styles.soldOut : ""}`}
        >
          {available
            ? `${hotel.availableRooms} habitaciones disponibles`
            : "Agotado"}
        </span>
      </div>
    </article>
  );
}
