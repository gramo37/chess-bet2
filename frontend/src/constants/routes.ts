export const WS_ROUTE = "ws";
export const BACKEND_ROUTE = "api";

export const BACKEND_URL = `${
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000"
}/${BACKEND_ROUTE}`;
export const WS_URL = `${import.meta.env.VITE_WS_URL ?? "ws://localhost:8000"}`;
export const WS_BACKEND_URL = `${
  import.meta.env.VITE_WS_REST_URL ?? "httpj://localhost:8000"
}/${WS_ROUTE}`;
export const PAYPALCLIENTID = "test"


// const HOST = "http://prochesser.com"
// const HOST = "https://chess.gramo37.com"

// // // Deployment routes
// export const BACKEND_URL = `${HOST}/api`;
// export const WS_URL = `${HOST}/ws`;
// export const WS_BACKEND_URL = `${HOST}/ws`;
