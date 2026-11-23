import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, useNavigate } from "react-router";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { graphql, HttpResponse, delay } from "msw";
import { graphql as executeGraphQL } from "graphql";
import { schema, createResolvers } from "../src/mocks/schema.js";
import { createApolloClient } from "../src/services/apollo.js";
import { createQueryClient } from "../src/services/queryClient.js";
import { server } from "./setup.js";
import App from "../src/App.jsx";
import TravelImage from "../src/components/TravelImage.jsx";
function NavigateTest() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/destinos/san-pedro")}>
      Cambiar rápidamente
    </button>
  );
}
function open(route = "/", extra) {
  const apollo = createApolloClient();
  const queries = createQueryClient();
  render(
    <QueryClientProvider client={queries}>
      <ApolloProvider client={apollo}>
        <MemoryRouter initialEntries={[route]}>
          <App />
          {extra}
        </MemoryRouter>
      </ApolloProvider>
    </QueryClientProvider>,
  );
  return { apollo, queries };
}

describe("Navegación, selección y recuperación", () => {
  it("filtra destinos sin distinguir tildes y conserva los datos originales", async () => {
    open("/destinos");
    await screen.findByRole("link", { name: "Río de Janeiro", exact: true });
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Buscar destino" }),
      { target: { value: "rio de janeiro" } },
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Buscar destino" }),
      { target: { value: "" } },
    );
    expect(screen.getAllByRole("article")).toHaveLength(6);
    fireEvent.click(
      screen.getByRole("button", { name: "Cultura", exact: true }),
    );
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });
  it("calcula una estimación coherente y reinicia al cambiar de fecha", async () => {
    open("/destinos/puerto-natales");
    await screen.findByRole("heading", { name: "Refugio del Fiordo" });
    fireEvent.click(
      screen.getByRole("button", { name: "Elegir vuelo", exact: true }),
    );
    fireEvent.click(
      screen.getAllByRole("button", { name: "Elegir hotel", exact: true })[0],
    );
    const summary = screen.getByRole("complementary", {
      name: "Resumen de tu viaje",
    });
    expect(within(summary).getByText("$373.990")).toBeTruthy();
    expect(
      screen
        .getAllByRole("button", { name: "Sin disponibilidad" })
        .every((item) => item.disabled),
    ).toBe(true);
    fireEvent.change(
      screen.getByRole("combobox", { name: "Salidas disponibles" }),
      { target: { value: "2027-01-19" } },
    );
    expect(
      within(
        screen.getByRole("complementary", { name: "Resumen de tu viaje" }),
      ).getByText("Por definir"),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Vuelo elegido" })).toBeNull();
  });
  it("descarta una respuesta tardía del destino anterior", async () => {
    let signalStarted;
    const started = new Promise((resolve) => {
      signalStarted = resolve;
    });
    server.use(
      graphql.query(
        "TravelOptions",
        async ({ variables, query, operationName }) => {
          if (variables.destinationId !== "cusco") return;
          signalStarted();
          await delay(250);
          return HttpResponse.json(
            await executeGraphQL({
              schema,
              source: query,
              operationName,
              variableValues: variables,
              rootValue: createResolvers(),
            }),
          );
        },
      ),
    );
    open("/destinos/cusco", <NavigateTest />);
    await started;
    fireEvent.click(
      screen.getByRole("button", { name: "Cambiar rápidamente" }),
    );
    await screen.findByRole("heading", {
      level: 1,
      name: "San Pedro de Atacama",
    });
    await screen.findByRole("heading", { name: "Casa del Desierto" });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(screen.queryByText("Patio del Sol")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(
      screen.getByRole("complementary", { name: "Resumen de tu viaje" })
        .textContent,
    ).toContain("San Pedro de Atacama");
  });
  it("explica un error GraphQL y permite recuperarse", async () => {
    open("/destinos/cusco?gql=graphql");
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    await screen.findByRole("heading", { name: "Patio del Sol" });
    expect(screen.queryByRole("alert")).toBeNull();
  });
  it("muestra una imagen alternativa cuando falla una fotografía", () => {
    const { container } = render(
      <TravelImage src="images/no-existe.webp" alt="Paisaje" />,
    );
    fireEvent.error(container.querySelector("img"));
    expect(screen.getByRole("img", { name: "Paisaje" }).textContent).toContain(
      "Imagen no disponible",
    );
  });
  it("mantiene la navegación accesible y permite recuperar una ruta desconocida", async () => {
    open("/no-existe");
    expect(
      (await screen.findByRole("heading", { level: 1 })).textContent,
    ).toContain("Página no encontrada");
    fireEvent.click(
      screen.getByRole("link", { name: "Explorar destinos", exact: true }),
    );
    await screen.findByRole("link", { name: "Cusco", exact: true });
    expect(document.activeElement.id).toBe("contenido");
    await waitFor(() => expect(document.title).toBe("Destinos · Rumbo"));
  });
});

it("trata una respuesta GraphQL nula sin errores como recurso no encontrado", async () => {
  server.use(
    graphql.query("TravelOptions", () =>
      HttpResponse.json({ data: { travelOptions: null } }),
    ),
  );
  open("/destinos/cusco");
  expect((await screen.findByRole("alert")).textContent).toContain(
    "No encontramos alternativas",
  );
  expect(screen.queryByRole("button", { name: "Elegir vuelo" })).toBeNull();
});
