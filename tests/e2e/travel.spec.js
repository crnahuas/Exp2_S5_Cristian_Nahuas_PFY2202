import { test, expect } from "@playwright/test";
const summary = (page) =>
  page.getByRole("complementary", { name: "Resumen de tu viaje" });
async function capture(page, testInfo, name) {
  if (testInfo.project.name !== "chromium") return;
  await page.evaluate(() => document.fonts.ready);
  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images.map(async (image) => {
        image.loading = "eager";
        await image.decode().catch(() => {});
      }),
    );
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(0, 0);
  await page.screenshot({
    path: `evidencias/capturas/${name}.png`,
    fullPage: true,
    animations: "disabled",
  });
}

test("inicio usa REST y el buscador conduce al destino", async ({
  page,
}, testInfo) => {
  const requests = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname.includes("/api/"))
      requests.push(url.pathname + url.search);
  });
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(3);
  expect(requests).toEqual(["/api/destinations?limit=3"]);
  await capture(page, testInfo, "01-inicio-escritorio");
  await page
    .getByRole("searchbox", { name: "¿A dónde quieres ir?" })
    .fill("rio de janeiro");
  await page
    .getByRole("combobox", { name: "Tipo de viaje" })
    .selectOption("Playa");
  await page.getByRole("button", { name: "Explorar destinos" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Río de Janeiro", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveTitle("Destinos · Rumbo");
  await expect(page).toHaveURL(/tipo=Playa/);
});

test("filtros, búsqueda e historial no repiten las consultas", async ({
  page,
}, testInfo) => {
  let requests = 0;
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.endsWith("/api/destinations"))
      requests++;
  });
  await page.goto("/#/destinos?source=prueba");
  await expect(page.getByRole("article")).toHaveCount(6);
  await capture(page, testInfo, "02-destinos-escritorio");
  await page
    .getByRole("searchbox", { name: "Buscar destino" })
    .fill("rio de janeiro");
  await expect(page.getByRole("article")).toHaveCount(1);
  await page.getByLabel("Ordenar por").selectOption("nombre");
  await expect(page).toHaveURL(/q=rio/);
  expect(page.url()).toContain("source=prueba");
  expect(page.url()).toContain("orden=nombre");
  const filtered = page.url();
  await page.getByRole("link", { name: "Río de Janeiro", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Casa Ipanema" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(filtered);
  await expect(
    page.getByRole("searchbox", { name: "Buscar destino" }),
  ).toHaveValue("rio de janeiro");
  expect(requests).toBe(1);
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await page.getByRole("button", { name: "Cultura", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(2);
  await capture(page, testInfo, "03-filtro-cultura");
});

test("REST y GraphQL entregan opciones coherentes y calculan el total", async ({
  page,
}, testInfo) => {
  const operations = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.endsWith("/graphql"))
      operations.push(request.postDataJSON());
  });
  await page.goto("/#/destinos/puerto-natales");
  await expect(
    page.getByRole("heading", { name: "Refugio del Fiordo" }),
  ).toBeVisible();
  expect(operations).toHaveLength(1);
  expect(operations[0].variables).toEqual({ destinationId: "puerto-natales" });
  await expect(
    page.getByRole("button", { name: "Sin disponibilidad" }).first(),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Elegir vuelo", exact: true }).click();
  await page
    .getByRole("button", { name: "Elegir hotel", exact: true })
    .first()
    .click();
  await expect(summary(page)).toContainText("$373.990");
  await capture(page, testInfo, "04-detalle-y-resumen");
  await page.getByLabel("Solo opciones disponibles").check();
  await expect(
    page.getByRole("button", { name: "Sin disponibilidad" }),
  ).toHaveCount(0);
  await page.getByLabel("Salidas disponibles").selectOption("2027-01-19");
  await expect(summary(page)).toContainText("Por definir");
  await expect(page.getByRole("button", { name: "Vuelo elegido" })).toHaveCount(
    0,
  );
  await page.getByLabel("Cambiar destino").selectOption("san-pedro");
  await expect(
    page.getByRole("heading", { name: "Casa del Desierto" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Refugio del Fiordo" }),
  ).toHaveCount(0);
  await expect(summary(page)).toContainText("San Pedro de Atacama");
  await expect(summary(page)).toContainText("Por definir");
  expect(operations).toHaveLength(2);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Casa del Desierto" }),
  ).toBeVisible();
});

test("producción ignora simulación y un destino inexistente no consulta GraphQL", async ({
  page,
}, testInfo) => {
  const operations = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.endsWith("/graphql"))
      operations.push(request);
  });
  await page.goto("/#/destinos/no-existe");
  await expect(page.getByRole("alert")).toContainText("404");
  expect(operations).toHaveLength(0);
  await capture(page, testInfo, "05-destino-inexistente");
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.getByRole("alert")).toContainText("404");
  expect(operations).toHaveLength(0);
  await page.goto("/#/destinos/cusco?rest=500&gql=graphql");
  await expect(
    page.getByRole("heading", { name: "Patio del Sol" }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText("Probar estados", { exact: false })).toHaveCount(
    0,
  );
  expect(operations[0].headers()["x-demo-scenario"]).toBeUndefined();
});

test("móvil mantiene navegación y opciones sin desbordamiento", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(3);
  await capture(page, testInfo, "06-inicio-movil");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("link", { name: "Destinos", exact: true })
    .focus();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menú" })).toBeFocused();
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("link", { name: "Destinos", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Abrir menú" }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("article")).toHaveCount(6);
  await capture(page, testInfo, "07-destinos-movil");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Cusco", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Patio del Sol" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Elegir vuelo", exact: true }).click();
  await page
    .getByRole("button", { name: "Elegir hotel", exact: true })
    .first()
    .click();
  await expect(summary(page)).toContainText("Total estimado");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await capture(page, testInfo, "08-detalle-movil");
});

test("rutas desconocidas y navegación por teclado conservan foco", async ({
  page,
}) => {
  await page.goto("/#/ruta-no-existe");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Página no encontrada",
  );
  await page
    .getByRole("link", { name: "Explorar destinos", exact: true })
    .click();
  await expect(page.locator("#contenido")).toBeFocused();
  await expect(
    page
      .getByRole("navigation", { name: "Navegación principal" })
      .getByRole("link", { name: "Destinos" }),
  ).toHaveAttribute("aria-current", "page");
  await page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("link", { name: "Cómo planificar" })
    .click();
  await page
    .getByText("¿Qué incluyen los precios?", { exact: true })
    .click();
  await expect(
    page.getByText("Todos los valores están en pesos chilenos.", { exact: false }),
  ).toBeVisible();
});

test("funciona bajo el subdirectorio de GitHub Pages", async ({ page }) => {
  const paths = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname.includes("/api/") || url.pathname.endsWith("/graphql"))
      paths.push(url.pathname);
  });
  await page.goto(
    "http://127.0.0.1:4177/Exp2_S5_Cristian_Nahuas_PFY2202/#/destinos/cusco",
  );
  await expect(
    page.getByRole("heading", { name: "Patio del Sol" }),
  ).toBeVisible();
  expect(paths.length).toBe(3);
  expect(
    paths.every((path) => path.startsWith("/Exp2_S5_Cristian_Nahuas_PFY2202/")),
  ).toBe(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Patio del Sol" }),
  ).toBeVisible();
  expect(
    await page
      .locator("img")
      .first()
      .evaluate((image) => image.complete && image.naturalWidth > 0),
  ).toBe(true);
});

test("se adapta a pantallas pequeñas y tablet", async ({ page }, testInfo) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto("/#/destinos");
    await expect(page.getByRole("article")).toHaveCount(6);
    const overflow = await page.evaluate(() => ({
      width: innerWidth,
      document: document.documentElement.scrollWidth,
      elements: [...document.querySelectorAll("body *")]
        .filter((element) => {
          const box = element.getBoundingClientRect();
          return box.width > 0 && box.right > innerWidth + 1;
        })
        .slice(0, 6)
        .map((element) => element.tagName + "." + element.className),
    }));
    expect(overflow.document, JSON.stringify(overflow)).toBeLessThanOrEqual(
      width,
    );
    if (width === 768) await capture(page, testInfo, "13-destinos-tablet");
    await page.goto("/#/destinos/san-pedro");
    await expect(
      page.getByRole("heading", { name: "Casa del Desierto" }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    if (width === 768) await capture(page, testInfo, "14-detalle-tablet");
  }
});
