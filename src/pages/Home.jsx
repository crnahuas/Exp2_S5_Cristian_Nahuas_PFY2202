import { Link, useNavigate } from "react-router";
import { useDestinations } from "../hooks/useDestinations.js";
import usePageTitle from "../hooks/usePageTitle.js";
import DestinationCard from "../components/DestinationCard.jsx";
import RequestState from "../components/RequestState.jsx";
import TravelImage from "../components/TravelImage.jsx";
import Icon from "../components/Icon.jsx";
import { categories } from "../config/navigation.js";
import styles from "./Pages.module.css";

export default function Home() {
  usePageTitle("Vuelos y hoteles");
  const destinations = useDestinations({ limit: 3 });
  const navigate = useNavigate();

  function searchDestinations(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const search = data.get("q").trim();
    if (search) params.set("q", search);
    if (data.get("tipo")) params.set("tipo", data.get("tipo"));
    navigate(`/destinos${params.size ? `?${params}` : ""}`);
  }

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <figure className={styles.heroFigure}>
          <TravelImage
            src="images/rio.webp"
            alt="Playa de Río de Janeiro"
            eager
          />
          <figcaption className="sr-only">Río de Janeiro, Brasil</figcaption>
        </figure>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroCopy}>
            <p className={styles.heroLocation}>Chile y Sudamérica</p>
            <h1 id="hero-title">Busca tu próximo viaje</h1>
            <p>Consulta destinos, compara vuelos y elige dónde alojarte.</p>
          </div>
        </div>
        <div className={`container ${styles.searchPosition}`}>
          <form
            className={styles.heroSearch}
            role="search"
            aria-label="Buscar destinos"
            onSubmit={searchDestinations}
          >
            <label>
              <span>¿A dónde quieres ir?</span>
              <input
                name="q"
                type="search"
                placeholder="Destino, país o actividad"
              />
            </label>
            <label>
              <span>Tipo de viaje</span>
              <select name="tipo" defaultValue="">
                <option value="">Todas las experiencias</option>
                {categories
                  .filter((category) => category !== "Todos")
                  .map((category) => (
                    <option key={category}>{category}</option>
                  ))}
              </select>
            </label>
            <button className="button" type="submit">
              <Icon name="search" size={18} />
              Explorar destinos
            </button>
          </form>
        </div>
      </section>
      <section className={`container ${styles.featured}`}>
        <div className={styles.sectionHeading}>
          <div>
            <h2 className="section-title">Destinos para explorar</h2>
            <p>Actividades, vuelos y alojamiento de cada lugar.</p>
          </div>
          <Link className="text-link" to="/destinos">
            Ver todos los destinos
          </Link>
        </div>
        <RequestState resource={destinations} label="los destinos" />
        <div className={styles.destinationGrid}>
          {destinations.data?.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
        {destinations.data?.length === 0 && (
          <p>
            No hay destinos disponibles. Vuelve a consultar en unos momentos.
          </p>
        )}
      </section>
    </>
  );
}
