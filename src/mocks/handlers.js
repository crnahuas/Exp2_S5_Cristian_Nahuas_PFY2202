import { http, graphql, HttpResponse, delay } from "msw";
import { graphql as executeGraphQL } from "graphql";
import { destinations } from "./data.js";
import { schema, createResolvers } from "./schema.js";

// Los escenarios se consumen solo durante desarrollo y pruebas.
function getScenario(request) {
  if (import.meta.env.PROD) return "normal";
  return (
    request.headers.get("x-demo-scenario") ||
    new URL(request.url).searchParams.get("scenario") ||
    "normal"
  );
}
async function simulate(request) {
  const scenario = getScenario(request);
  await delay(
    scenario === "slow" ? 2200 : import.meta.env.MODE === "test" ? 0 : 350,
  );
  if (scenario === "network") return HttpResponse.error();
  if (scenario === "500" || scenario === "404")
    return HttpResponse.json(
      { message: "El servicio no está disponible." },
      { status: Number(scenario) },
    );
  return null;
}
const graph = graphql.link("*/graphql");
export const handlers = [
  http.get("*/api/destinations", async ({ request }) => {
    const failure = await simulate(request);
    if (failure) return failure;
    if (getScenario(request) === "empty") return HttpResponse.json([]);
    const limit = new URL(request.url).searchParams.get("limit");
    if (
      limit !== null &&
      (!/^\d+$/.test(limit) ||
        !Number.isSafeInteger(Number(limit)) ||
        Number(limit) < 1)
    )
      return HttpResponse.json(
        { message: "El límite debe ser un entero positivo." },
        { status: 400 },
      );
    return HttpResponse.json(
      limit === null ? destinations : destinations.slice(0, Number(limit)),
    );
  }),
  http.get("*/api/destinations/:id", async ({ request, params }) => {
    const failure = await simulate(request);
    if (failure) return failure;
    const destination = destinations.find((item) => item.id === params.id);
    return destination
      ? HttpResponse.json(destination)
      : HttpResponse.json(
          { message: "El destino no existe." },
          { status: 404 },
        );
  }),
  graph.operation(async ({ request, query, variables, operationName }) => {
    const failure = await simulate(request);
    if (failure) return failure;
    // Ejecutar un esquema real valida campos, variables y proyecta solo la selección solicitada.
    const result = await executeGraphQL({
      schema,
      source: query,
      variableValues: variables,
      operationName,
      rootValue: createResolvers(getScenario(request)),
    });
    return HttpResponse.json(result);
  }),
];
