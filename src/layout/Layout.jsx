import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { navigation } from "../config/navigation.js";
import Brand from "../components/Brand.jsx";
import Icon from "../components/Icon.jsx";
import styles from "./Layout.module.css";
export default function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const main = useRef(null);
  const menuButton = useRef(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return (
    <>
      <a
        className="skip-link"
        href="#contenido"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.brand} aria-label="Rumbo, inicio">
            <Brand />
          </Link>
          <button
            ref={menuButton}
            className={styles.menuButton}
            type="button"
            aria-controls="menu-principal"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
          <nav
            id="menu-principal"
            className={`${styles.navigation} ${menuOpen ? styles.open : ""}`}
            aria-label="Navegación principal"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setMenuOpen(false);
                menuButton.current?.focus();
              }
            }}
            onClick={(event) => {
              if (menuOpen && event.target.closest("a")) {
                setMenuOpen(false);
                menuButton.current?.focus();
              }
            }}
          >
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/destinos"
            className={`button button-small ${styles.headerCta}`}
          >
            <Icon name="compass" size={17} />
            Ver destinos
          </Link>
        </div>
      </header>
      <main id="contenido" tabIndex={-1} ref={main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <div>
            <Link to="/" aria-label="Rumbo, inicio">
              <Brand light />
            </Link>
            <p>Destinos, vuelos y hoteles.</p>
          </div>
          <nav aria-label="Enlaces del pie de página">
            <Link to="/destinos">Todos los destinos</Link>
            <Link to="/destinos?pais=Chile">Destinos en Chile</Link>
            <Link to="/como-viajar">Cómo planificar</Link>
          </nav>
          <p className={styles.footerNote}>Precios en CLP.</p>
        </div>
        <div className={`container ${styles.footerBottom}`}>
          © {new Date().getFullYear()} Rumbo
        </div>
      </footer>
    </>
  );
}
