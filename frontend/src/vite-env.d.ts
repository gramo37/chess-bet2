interface ImportMetaEnv {
  readonly VITE_BLOG_LINK: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_WS_REST_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
