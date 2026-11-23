export default function DevelopmentControls({
  resource,
  protocol,
  allowEmpty = true,
}) {
  if (!resource.changeScenario) return null;
  return (
    <details className="dev-controls">
      <summary>Probar estados de {protocol}</summary>
      <label>
        Respuesta de {protocol}
        <select
          value={resource.scenario}
          onChange={(event) => resource.changeScenario(event.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="slow">Carga lenta</option>
          <option value="500">Error HTTP 500</option>
          <option value="404">Error HTTP 404</option>
          <option value="network">Fallo de conexión</option>
          {allowEmpty && <option value="empty">Sin resultados</option>}
          {protocol === "GraphQL" && (
            <>
              <option value="graphql">Error GraphQL</option>
              <option value="partial">Datos parciales</option>
            </>
          )}
        </select>
      </label>
      <button
        className="text-link"
        onClick={resource.refetch}
        disabled={resource.isFetching}
      >
        Actualizar consulta
      </button>
    </details>
  );
}
