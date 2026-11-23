import { Link } from "react-router";
import TravelImage from "./TravelImage.jsx";
import styles from "./Cards.module.css";

export default function DestinationCard({ destination }) {
  return (
    <article className={styles.destination}>
      <Link
        to={`/destinos/${destination.id}`}
        className={styles.imageLink}
        aria-label={`Explorar ${destination.name}`}
      >
        <TravelImage src={destination.image} />
      </Link>
      <div className={styles.destinationCopy}>
        <p className={styles.location}>
          {destination.country} · {destination.category}
        </p>
        <h3>
          <Link to={`/destinos/${destination.id}`}>{destination.name}</Link>
        </h3>
        <p className={styles.activities}>
          {destination.activities.join(" · ")}
        </p>
        <div className={styles.cardFooter}>
          <span>{destination.recommendedDays}</span>
          <Link to={`/destinos/${destination.id}`} className="text-link">
            Vuelos y hoteles
          </Link>
        </div>
      </div>
    </article>
  );
}
