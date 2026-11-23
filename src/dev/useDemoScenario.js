import { useSearchParams } from "react-router";
const allowed = new Set([
  "normal",
  "404",
  "500",
  "network",
  "slow",
  "empty",
  "graphql",
  "partial",
]);
export function useDemoScenario(key) {
  const [params, setParams] = useSearchParams();
  const value = params.get(key);
  const scenario = allowed.has(value) ? value : "normal";
  function changeScenario(next) {
    if (!allowed.has(next)) return;
    setParams(
      (current) => {
        const updated = new URLSearchParams(current);
        if (next === "normal") updated.delete(key);
        else updated.set(key, next);
        return updated;
      },
      { replace: true },
    );
  }
  return { scenario, changeScenario };
}
