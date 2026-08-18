declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    SERVER_PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_SYNC: boolean;
    //
    API_PREFIX: string;

    // JWT
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXP: string;

    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXP: string;
    JWT_ALGORITHM: string;
  }
}
