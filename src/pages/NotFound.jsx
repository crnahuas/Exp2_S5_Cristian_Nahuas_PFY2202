import { Link } from "react-router";
import usePageTitle from "../hooks/usePageTitle.js";
import styles from "./Pages.module.css";
export default function NotFound() {
  usePageTitle("Página no encontrada");
  return (
    <div className={`container ${styles.notFound}`}>
      <p className={styles.errorCode}>404</p>
      <h1>Página no encontrada</h1>
      <p>Revisa la dirección o vuelve al listado de destinos.</p>
      <Link className="button" to="/destinos">
        Explorar destinos
      </Link>
    </div>
  );
}
