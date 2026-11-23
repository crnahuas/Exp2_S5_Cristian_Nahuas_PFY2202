import { Link, useNavigate, useParams } from "react-router";
import { useDestinations } from "../hooks/useDestinations.js";
import { useDemoScenario } from "../hooks/useDemoScenario.js";
import usePageTitle from "../hooks/usePageTitle.js";
import RequestState from "../components/RequestState.jsx";
import ServiceControls from "../components/ServiceControls.jsx";
import TravelImage from "../components/TravelImage.jsx";
import TravelPlanner from "../components/TravelPlanner.jsx";
import Icon from "../components/Icon.jsx";
import styles from "./Pages.module.css";
function DetailContent({ destinationId }) {
  const resource = useDestinations({ id: destinationId, demo: true });
  const destination = resource.data;
  const list = useDestinations({ enabled: Boolean(destination) });
  const { scenario } = useDemoScenario("gql");
  const navigate = useNavigate();
  usePageTitle(destination?.name || "Detalle del destino");
  return (
    <div className={`container ${styles.detailPage}`}>
      <nav className={styles.breadcrumbs} aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/destinos">Destinos</Link>
        <span>/</span>
        <span>{destination?.name || "Tu destino"}</span>
      </nav>
      <RequestState resource={resource} label="el destino" />
      {!destination && (
        <h1 className="sr-only">
          {resource.isError ? "Destino no disponible" : "Detalle del destino"}
        </h1>
      )}
      {destination && (
        <>
          <div className={styles.detailTitle}>
            <div>
              <p className={styles.detailLocation}>
                {destination.country} · {destination.region}
              </p>
              <h1>{destination.name}</h1>
            </div>
            <label className={styles.destinationSelect}>
              Cambiar destino
              <select
                value={destinationId}
                onChange={(event) =>
                  navigate(`/destinos/${event.target.value}`)
                }
                disabled={!list.data}
              >
                {!list.data && (
                  <option value={destination.id}>{destination.name}</option>
                )}
                {list.data?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {list.isError && (
            <RequestState
              resource={list}
              label="la lista para cambiar de destino"
            />
          )}
          <div className={styles.detailOverview}>
            <TravelImage
              src={destination.image}
              alt={`Paisaje de ${destination.region}`}
              eager
              className={styles.detailImage}
            />
            <div className={styles.detailInfo}>
              <h2>Sobre el destino</h2>
              <p>{destination.description}</p>
              <div className={styles.detailFacts}>
                <div>
                  <Icon name="sun" />
                  <span>
                    Mejor época<strong>{destination.bestSeason}</strong>
                  </span>
                </div>
                <div>
                  <Icon name="clock" />
                  <span>
                    Tiempo para disfrutar
                    <strong>{destination.recommendedDays}</strong>
                  </span>
                </div>
              </div>
              <h3>Actividades</h3>
              <ul className={styles.detailActivities}>
                {destination.activities.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={15} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <TravelPlanner
            key={`${destination.id}-${scenario}`}
            destination={destination}
          />
          <div className={styles.travelTip}>
            <Icon name="leaf" size={26} />
            <div>
              <h2>Antes de viajar</h2>
              <p>{destination.tip}</p>
            </div>
          </div>
        </>
      )}
      <ServiceControls resource={resource} protocol="REST" allowEmpty={false} />
    </div>
  );
}
export default function DestinationDetail() {
  const { destinationId } = useParams();
  // Remontar por destino impide reutilizar selecciones o resultados de otra ruta.
  return <DetailContent key={destinationId} destinationId={destinationId} />;
}
