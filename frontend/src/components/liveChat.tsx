import { useRef } from "react";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

export default function LiveChat() {
  const tawkMessengerRef = useRef(null);

  return (
    <TawkMessengerReact
      propertyId="6706978802d78d1a30eefdb7"
      widgetId="1i9s2li2d"
      onLoad={() => window.dispatchEvent(new Event("tawkLoad"))}
      ref={tawkMessengerRef}
    />
  );
}
