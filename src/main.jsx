import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createApolloClient } from "./services/apollo.js";
import { createQueryClient } from "./services/queryClient.js";
import App from "./App.jsx";
import "./styles/global.css";

async function start() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== "false") {
    const { worker } = await import("./mocks/browser.js");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    });
  }
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <QueryClientProvider client={createQueryClient()}>
        <ApolloProvider client={createApolloClient()}>
          <HashRouter>
            <App />
          </HashRouter>
        </ApolloProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
start().catch(() => {
  const root = document.getElementById("root");
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent =
    "No pudimos iniciar el servicio de viajes. Vuelve a cargar la página para reintentar.";
  const retry = document.createElement("button");
  retry.className = "button";
  retry.textContent = "Volver a cargar";
  retry.addEventListener("click", () => window.location.reload());
  root.className = "startup-error";
  root.replaceChildren(message, retry);
});
