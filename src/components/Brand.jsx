import { assetUrl } from "../utils/format.js";

export default function Brand({ light = false }) {
  return (
    <span className="brand-logo">
      <img
        src={assetUrl(light ? "logo-rumbo-light.svg" : "logo-rumbo.svg")}
        alt="Rumbo"
        width="232"
        height="72"
      />
    </span>
  );
}
