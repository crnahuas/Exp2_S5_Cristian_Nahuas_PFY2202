import { Link } from "react-router";
import Icon from "./Icon.jsx";
import styles from "./States.module.css";
export default function RequestState({ resource, label }) {
  return (
    <>
      {resource.isFetching && (
        <div className={styles.loading} role="status">
          <span className={styles.spinner} />
          <span>Cargando {label}…</span>
        </div>
      )}
      {resource.isError && (
        <div className={styles.error} role="alert">
          <Icon name="info" size={26} />
          <div>
            <h2>No pudimos cargar {label}</h2>
            <p>{resource.error.message}</p>
            {resource.hasFallback && (
              <p>Mostramos la información recuperada de este mismo destino.</p>
            )}
            <div className={styles.actions}>
              <button
                className="button button-small"
                onClick={resource.retry}
                disabled={resource.isFetching}
              >
                Reintentar
              </button>
              <Link className="text-link" to="/destinos">
                Ver destinos
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
