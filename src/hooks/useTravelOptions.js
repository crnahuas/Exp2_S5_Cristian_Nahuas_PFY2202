import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { TRAVEL_OPTIONS } from "../services/apollo.js";
import { validateOptions } from "../services/validators.js";
import { ApiError } from "../services/api.js";
import { useDemoScenario } from "./useDemoScenario.js";

export function useTravelOptions(destinationId, enabled = true) {
  const controls = useDemoScenario("gql");
  const { scenario } = controls;
  const context = useMemo(
    () =>
      import.meta.env.DEV && scenario !== "normal"
        ? { headers: { "x-demo-scenario": scenario } }
        : {},
    [scenario],
  );
  const query = useQuery(TRAVEL_OPTIONS, {
    variables: { destinationId },
    skip: !enabled,
    context,
    fetchPolicy:
      import.meta.env.DEV && scenario !== "normal" ? "no-cache" : "cache-first",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });
  const raw = !enabled
    ? undefined
    : query.data && Object.hasOwn(query.data, "travelOptions")
      ? query.data.travelOptions
      : !query.loading && query.error
        ? query.previousData?.travelOptions
        : undefined;
  const valid = raw && validateOptions(raw, destinationId);
  const data = valid ? raw : undefined;
  let error = query.error;
  if (raw && !valid)
    error = new ApiError(
      "La respuesta no corresponde a este destino o tiene datos incompletos.",
    );
  if (!query.loading && enabled && raw === null && !error)
    error = new ApiError("No encontramos alternativas para este destino.", 404);
  if (!query.loading && enabled && raw === undefined && !error)
    error = new ApiError(
      "La respuesta de vuelos y hoteles está incompleta. Intenta nuevamente.",
    );
  if (error && !(error instanceof ApiError)) {
    const code = error.errors?.find((item) => item.extensions?.code)?.extensions
      ?.code;
    const status = code === "NOT_FOUND" ? 404 : error.statusCode || 0;
    error = new ApiError(
      code === "NOT_FOUND"
        ? "El destino solicitado no existe (404)."
        : data
          ? "Parte de la información no está disponible. Puedes consultar las opciones recuperadas y reintentar."
          : "No pudimos consultar vuelos y hoteles. Revisa tu conexión o reintenta en unos momentos.",
      status,
    );
  }
  return {
    data,
    error,
    isError: Boolean(error),
    isFetching: enabled && query.loading,
    hasFallback: Boolean(error && data),
    refetch: () => query.refetch().catch(() => {}),
    retry: () =>
      scenario !== "normal"
        ? controls.changeScenario("normal")
        : query.refetch().catch(() => {}),
    ...controls,
  };
}
