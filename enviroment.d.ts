declare global {
    namespace NodeJS {
      interface ProcessEnv {
        SECRET: string;
        API_URL: string;
      }
    }
  }
  
  export {};