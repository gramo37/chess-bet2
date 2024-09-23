export const WS_ROUTE = "ws";
export const BACKEND_ROUTE = "api"

export const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000"}/${BACKEND_ROUTE}`;
export const WS_URL = `${import.meta.env.VITE_WS_URL ?? "ws://localhost:8000"}`;
export const WS_BACKEND_URL = `${import.meta.env.VITE_WS_REST_URL ?? "http://localhost:8000"}/${WS_ROUTE}`