import { useResource } from "./useResource.js";
import { useDemoScenario } from "./useDemoScenario.js";
import { isDestination, isDestinationList } from "../services/validators.js";
export function useDestinations({
  id,
  limit,
  enabled = true,
  demo = false,
} = {}) {
  const controls = useDemoScenario("rest");
  const path = id
    ? `destinations/${encodeURIComponent(id)}`
    : `destinations${limit ? `?limit=${limit}` : ""}`;
  const resource = useResource(path, {
    validate: id ? isDestination : isDestinationList,
    enabled,
    scenario: demo ? controls.scenario : "normal",
  });
  return {
    ...resource,
    ...(demo ? controls : {}),
    retry: () => {
      if (demo && controls.scenario !== "normal")
        controls.changeScenario("normal");
      else resource.refetch();
    },
  };
}
