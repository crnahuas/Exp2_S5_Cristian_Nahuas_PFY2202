import { test, expect } from "@playwright/test";

test("REST muestra carga lenta, errores, vacío y recuperación", async ({
  page,
}) => {
  await page.goto("/#/destinos?rest=slow");
  await expect(
    page.getByRole("status").filter({ hasText: "Cargando los destinos" }),
  ).toBeVisible();
  await page.screenshot({
    path: "evidencias/capturas/09-carga-rest.png",
    fullPage: true,
  });
  await expect(page.getByRole("article")).toHaveCount(6);
  for (const scenario of ["500", "404", "network"]) {
    await page.getByText("Probar estados de REST", { exact: true }).click();
    await page.getByLabel("Respuesta de REST").selectOption(scenario);
    await expect(page.getByRole("alert")).toBeVisible();
    await page.screenshot({
      path: `evidencias/capturas/10-error-rest-${scenario}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Reintentar" }).click();
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByRole("article")).toHaveCount(6);
    await page.getByText("Probar estados de REST", { exact: true }).click();
  }
  await page.getByText("Probar estados de REST", { exact: true }).click();
  await page.getByLabel("Respuesta de REST").selectOption("empty");
  await expect(
    page.getByRole("heading", { name: "No hay destinos disponibles" }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("GraphQL distingue error, datos parciales y vacío", async ({ page }) => {
  await page.goto("/#/destinos/cusco?gql=graphql");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.screenshot({
    path: "evidencias/capturas/11-error-graphql.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(
    page.getByRole("heading", { name: "Patio del Sol" }),
  ).toBeVisible();
  await page.getByText("Probar estados de GraphQL", { exact: true }).click();
  await page.getByLabel("Respuesta de GraphQL").selectOption("partial");
  await expect(page.getByRole("alert")).toContainText(
    "Parte de la información",
  );
  await expect(
    page.getByRole("button", { name: "Elegir vuelo", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Los hoteles no están disponibles" }),
  ).toBeVisible();
  await page.screenshot({
    path: "evidencias/capturas/12-datos-parciales.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(
    page.getByRole("heading", { name: "Patio del Sol" }),
  ).toBeVisible();
  await page.getByText("Probar estados de GraphQL", { exact: true }).click();
  await page.getByLabel("Respuesta de GraphQL").selectOption("empty");
  await expect(
    page.getByRole("heading", { name: "No hay vuelos para esta selección" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "No hay hoteles para esta selección" }),
  ).toBeVisible();
});
