/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_APP_I18N_CONFIG_KEY: string;
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
