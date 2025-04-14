declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      CORS_ORIGIN: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
    }
  }
}

export {}
