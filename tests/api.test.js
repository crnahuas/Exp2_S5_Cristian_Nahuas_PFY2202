import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { getResource } from "../src/services/api.js";
import {
  isDestination,
  isDestinationList,
} from "../src/services/validators.js";
import { server } from "./setup.js";

describe("Destinos mediante REST", () => {
  it("lista destinos con país y actividades y permite limitar inicio", async () => {
    const data = await getResource("destinations", {
      validate: isDestinationList,
    });
    expect(data).toHaveLength(6);
    expect(
      data.every((item) => item.country && item.activities.length > 0),
    ).toBe(true);
    expect(
      await getResource("destinations?limit=3", {
        validate: isDestinationList,
      }),
    ).toHaveLength(3);
  });
  it.each(["0", "-1", "1.5", "texto"])(
    "rechaza el límite inválido %s",
    async (limit) => {
      await expect(
        getResource(`destinations?limit=${limit}`, {
          validate: isDestinationList,
        }),
      ).rejects.toMatchObject({ status: 400 });
    },
  );
  it("distingue un destino válido de uno inexistente", async () => {
    expect(
      await getResource("destinations/cusco", { validate: isDestination }),
    ).toMatchObject({ name: "Cusco", country: "Perú" });
    await expect(
      getResource("destinations/no-existe", { validate: isDestination }),
    ).rejects.toMatchObject({ status: 404 });
  });
  it.each(["404", "500"])("explica HTTP %s", async (scenario) => {
    await expect(
      getResource("destinations", { validate: isDestinationList, scenario }),
    ).rejects.toMatchObject({ status: Number(scenario) });
  });
  it("admite el listado vacío sin inventar destinos", async () => {
    expect(
      await getResource("destinations", {
        validate: isDestinationList,
        scenario: "empty",
      }),
    ).toEqual([]);
  });
  it("diferencia fallo de conexión, JSON inválido y datos incompletos", async () => {
    await expect(
      getResource("destinations", {
        validate: isDestinationList,
        scenario: "network",
      }),
    ).rejects.toThrow("Revisa tu conexión");
    server.use(
      http.get("*/api/destinations", () => new HttpResponse("no es JSON")),
    );
    await expect(
      getResource("destinations", { validate: isDestinationList }),
    ).rejects.toThrow("respuesta del servicio no es válida");
    server.use(
      http.get("*/api/destinations", () =>
        HttpResponse.json([{ id: "incompleto" }]),
      ),
    );
    await expect(
      getResource("destinations", { validate: isDestinationList }),
    ).rejects.toThrow("datos recibidos están incompletos");
  });
  it("propaga AbortSignal sin presentarlo como error de red", async () => {
    const controller = new AbortController();
    const request = getResource("destinations", {
      signal: controller.signal,
      scenario: "slow",
      validate: isDestinationList,
    });
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: "AbortError" });
  });
});
