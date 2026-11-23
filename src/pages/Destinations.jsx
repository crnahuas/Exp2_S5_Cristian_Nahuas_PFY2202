import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { useDestinations } from "../hooks/useDestinations.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { categories } from "../config/navigation.js";
import { normalize } from "../utils/format.js";
import DestinationCard from "../components/DestinationCard.jsx";
import RequestState from "../components/RequestState.jsx";
import ServiceControls from "../components/ServiceControls.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Icon from "../components/Icon.jsx";
import styles from "./Pages.module.css";
export default function Destinations() {
  usePageTitle("Destinos");
  const [params, setParams] = useSearchParams();
  const { pathname } = useLocation();
  const urlSearch = params.get("q") || "";
  const [search, setSearch] = useState(urlSearch);
  const type = params.get("tipo") || "Todos";
  const country = params.get("pais") || "";
  const order = params.get("orden") || "destacados";
  const resource = useDestinations({ demo: true });
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch, pathname]);
  useEffect(() => {
    if (search === urlSearch) return;
    const timeout = setTimeout(
      () =>
        setParams(
          (current) => {
            const next = new URLSearchParams(current);
            if (search) next.set("q", search);
            else next.delete("q");
            return next;
          },
          { replace: true },
        ),
      300,
    );
    return () => clearTimeout(timeout);
  }, [search, urlSearch, pathname, setParams]);
  const visible = useMemo(() => {
    const term = normalize(search.trim());
    const filtered = resource.data?.filter(
      (destination) =>
        (type === "Todos" || destination.category === type) &&
        (!country || destination.country === country) &&
        normalize(
          `${destination.name} ${destination.country} ${destination.region} ${destination.activities.join(" ")}`,
        ).includes(term),
    );
    if (order === "nombre")
      filtered?.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return filtered;
  }, [resource.data, search, type, country, order]);
  function update(key, value) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value && value !== "Todos" && value !== "destacados")
          next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }
  function clear() {
    setSearch("");
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        ["q", "tipo", "pais", "orden"].forEach((key) => next.delete(key));
        return next;
      },
      { replace: true },
    );
  }
  const countries = [
    ...new Set(resource.data?.map((item) => item.country)),
  ].sort();
  return (
    <>
      <section className={styles.pageIntro}>
        <div className="container">
          <h1>Destinos</h1>
          <p>Busca por país, actividad o tipo de viaje.</p>
        </div>
      </section>
      <div className={`container ${styles.catalog}`}>
        <div className={styles.filterPanel}>
          <label className={styles.searchLabel}>
            <span>Buscar destino</span>
            <span className={styles.inputWithIcon}>
              <Icon name="search" />
              <input
                type="search"
                placeholder="Nombre, país o actividad"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </span>
          </label>
          <label>
            <span>País</span>
            <select
              value={country}
              onChange={(event) => update("pais", event.target.value)}
            >
              <option value="">Todos los países</option>
              {countries.map((item) => (
                <option key={item}>{item}</option>
              ))}
              {country && !countries.includes(country) && (
                <option>{country}</option>
              )}
            </select>
          </label>
          <label>
            <span>Ordenar por</span>
            <select
              value={order}
              onChange={(event) => update("orden", event.target.value)}
            >
              <option value="destacados">Destacados</option>
              <option value="nombre">Nombre: A–Z</option>
            </select>
          </label>
        </div>
        <div className={styles.catalogBar}>
          <div
            className={styles.categoryFilters}
            role="group"
            aria-label="Tipo de experiencia"
          >
            {categories.map((item) => (
              <button
                key={item}
                aria-pressed={type === item}
                onClick={() => update("tipo", item)}
              >
                {item}
              </button>
            ))}
          </div>
          <p role="status">
            {visible
              ? `${visible.length} ${visible.length === 1 ? "destino" : "destinos"}`
              : "Consultando destinos"}
          </p>
        </div>
        {(search || type !== "Todos" || country) && (
          <button
            className={`text-link ${styles.clearFilters}`}
            onClick={clear}
          >
            Limpiar filtros
          </button>
        )}
        <section
          aria-label="Destinos disponibles"
          aria-busy={resource.isFetching}
        >
          <RequestState resource={resource} label="los destinos" />
          {visible?.length === 0 && !resource.isFetching && (
            <EmptyState
              title={
                resource.data.length
                  ? "No hay destinos que coincidan"
                  : "No hay destinos disponibles"
              }
              action={
                <button
                  className="button"
                  onClick={resource.data.length ? clear : resource.refetch}
                >
                  {resource.data.length
                    ? "Ver todos los destinos"
                    : "Volver a consultar"}
                </button>
              }
            >
              {resource.data.length
                ? "Prueba otra búsqueda o cambia los filtros para seguir explorando."
                : "Vuelve a consultar en unos momentos."}
            </EmptyState>
          )}
          <div className={styles.destinationGrid}>
            {visible?.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>
        <ServiceControls resource={resource} protocol="REST" />
        <div className={styles.catalogNote}>
          <Icon name="info" />
          <p>
            Todos los destinos incluyen opciones de vuelos y alojamiento. Los
            valores se muestran en pesos chilenos.
          </p>
          <Link to="/como-viajar" className="text-link">
            Cómo planificar
          </Link>
        </div>
      </div>
    </>
  );
}
