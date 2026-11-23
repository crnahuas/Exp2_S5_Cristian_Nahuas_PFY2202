import { useState } from "react";
import { assetUrl } from "../utils/format.js";
import Icon from "./Icon.jsx";
export default function TravelImage({
  src,
  alt = "",
  eager = false,
  className = "",
}) {
  const [failed, setFailed] = useState(null);
  return (
    <div className={`travel-image ${className}`}>
      {failed === src ? (
        <span
          className="image-fallback"
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={!alt}
        >
          <Icon name="mountain" size={56} />
          <span>Imagen no disponible</span>
        </span>
      ) : (
        <img
          src={assetUrl(src)}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(src)}
        />
      )}
    </div>
  );
}
