import { describe, expect, it } from "vitest";
import { gql } from "@apollo/client";
import { createApolloClient, TRAVEL_OPTIONS } from "../src/services/apollo.js";
import { validateOptions } from "../src/services/validators.js";
const clients = [];
function client() {
  const instance = createApolloClient();
  clients.push(instance);
  return instance;
}
import { afterEach } from "vitest";
afterEach(() => {
  clients.splice(0).forEach((instance) => instance.stop());
});
async function graph(query, variables = { destinationId: "cusco" }, scenario) {
  const response = await fetch("http://localhost:3000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(scenario ? { "x-demo-scenario": scenario } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

describe("Vuelos y hoteles mediante GraphQL y Apollo", () => {
  it("Apollo recupera vuelos y hoteles que corresponden al destino", async () => {
    const data = await client().query({
      query: TRAVEL_OPTIONS,
      variables: { destinationId: "cusco" },
    });
    const options = data.data.travelOptions;
    expect(options.flights).toHaveLength(3);
    expect(options.hotels).toHaveLength(6);
    expect(options.flights.every((item) => item.arrival === "CUZ")).toBe(true);
    expect(validateOptions(options, "cusco")).toBe(true);
    expect(validateOptions(options, "san-pedro")).toBe(false);
  });
  it("devuelve únicamente los campos solicitados y valida el esquema", async () => {
    const result = await graph(
      "query Short($destinationId: ID!) { travelOptions(destinationId: $destinationId) { destinationId flights { price } } }",
    );
    expect(Object.keys(result.data.travelOptions)).toEqual([
      "destinationId",
      "flights",
    ]);
    expect(Object.keys(result.data.travelOptions.flights[0])).toEqual([
      "price",
    ]);
    const invalid = await graph(
      'query { travelOptions(destinationId: "cusco") { campoInexistente } }',
    );
    expect(invalid.errors[0].message).toContain("Cannot query field");
    expect(invalid.data).toBeUndefined();
  });
  it("devuelve NOT_FOUND en errors para un destino desconocido", async () => {
    const result = await graph(
      "query Missing($destinationId: ID!) { travelOptions(destinationId: $destinationId) { destinationId } }",
      { destinationId: "no-existe" },
    );
    expect(result.data.travelOptions).toBeNull();
    expect(result.errors[0].extensions.code).toBe("NOT_FOUND");
  });
  it("mantiene los vuelos cuando falla el servicio de hoteles", async () => {
    const result = await graph(
      "query Partial($destinationId: ID!) { travelOptions(destinationId: $destinationId) { destinationId flights { id } hotels { id } } }",
      undefined,
      "partial",
    );
    expect(result.data.travelOptions.flights).toHaveLength(3);
    expect(result.data.travelOptions.hotels).toBeNull();
    expect(result.errors[0].path).toEqual(["travelOptions", "hotels"]);
  });
  it("almacena resultados independientes en caché por destino", async () => {
    const apollo = client();
    await apollo.query({
      query: TRAVEL_OPTIONS,
      variables: { destinationId: "cusco" },
    });
    await apollo.query({
      query: TRAVEL_OPTIONS,
      variables: { destinationId: "san-pedro" },
    });
    const cached = apollo.readQuery({
      query: TRAVEL_OPTIONS,
      variables: { destinationId: "cusco" },
    });
    expect(
      cached.travelOptions.flights.every(
        (item) => item.destinationId === "cusco",
      ),
    ).toBe(true);
    expect(cached.travelOptions.hotels[0].name).toBe("Patio del Sol");
  });
  it("no interpreta una respuesta sin vuelos ni hoteles como una consulta válida", () => {
    expect(validateOptions({ destinationId: "cusco" }, "cusco")).toBe(false);
  });
});
