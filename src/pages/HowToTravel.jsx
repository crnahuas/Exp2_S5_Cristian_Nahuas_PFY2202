import { Link } from "react-router";
import Icon from "../components/Icon.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import styles from "./Pages.module.css";
const steps = [
  {
    icon: "compass",
    title: "Empieza por un destino",
    description:
      "Explora por país o por lo que te gusta hacer. En cada destino encontrarás actividades y una recomendación para aprovechar tu visita.",
  },
  {
    icon: "plane",
    title: "Encuentra tu vuelo",
    description:
      "Elige una de las fechas disponibles y revisa los vuelos desde Santiago. Compara el precio de ida y vuelta por persona, las escalas y los asientos disponibles.",
  },
  {
    icon: "bed",
    title: "Elige dónde quedarte",
    description:
      "Compara alojamientos para las mismas fechas. El valor del hotel es por habitación y por noche; el resumen calcula las cinco noches de estadía.",
  },
];
export default function HowToTravel() {
  usePageTitle("Cómo planificar");
  return (
    <>
      <section className={styles.pageIntro}>
        <div className="container">
          <h1>Cómo planificar tu viaje</h1>
          <p>Selecciona un destino y compara las opciones disponibles.</p>
        </div>
      </section>
      <div className={`container ${styles.howPage}`}>
        <div className={styles.stepGrid}>
          {steps.map((step) => (
            <article key={step.title}>
              <span>
                <Icon name={step.icon} size={30} />
              </span>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
        <section className={styles.faq}>
          <h2 className="section-title">Preguntas frecuentes</h2>
          <details>
            <summary>¿Qué incluyen los precios?</summary>
            <p>
              Los vuelos muestran un valor de ida y vuelta por persona. Los
              hoteles muestran el valor de una habitación para una persona por
              noche. El resumen suma el vuelo y las cinco noches del alojamiento
              elegido. Todos los valores están en pesos chilenos.
            </p>
          </details>
          <details>
            <summary>¿Qué ocurre si cambio de destino o fecha?</summary>
            <p>
              La aplicación muestra las opciones del nuevo destino o fecha y
              limpia la selección anterior. Así, el resumen siempre corresponde
              al viaje que estás revisando.
            </p>
          </details>
          <details>
            <summary>¿Por qué aparecen opciones agotadas?</summary>
            <p>
              Permiten comparar la oferta completa. Las opciones agotadas no se
              pueden elegir. Activa “Solo opciones disponibles” para ocultarlas.
            </p>
          </details>
          <details>
            <summary>¿Qué hago si no carga la información?</summary>
            <p>
              Usa Reintentar para volver a consultar el servicio. Si ya se había
              recuperado información de ese mismo destino, puede seguir visible
              mientras se restablece la consulta.
            </p>
          </details>
        </section>
        <div className={styles.howCta}>
          <Link to="/destinos" className="button">
            Explorar destinos
          </Link>
        </div>
      </div>
    </>
  );
}
