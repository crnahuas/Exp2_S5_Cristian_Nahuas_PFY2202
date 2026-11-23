import { useDemoScenario as useDevelopmentScenario } from "../dev/useDemoScenario.js";
const useNormalScenario = () => ({ scenario: "normal" });
export const useDemoScenario = import.meta.env.DEV
  ? useDevelopmentScenario
  : useNormalScenario;
