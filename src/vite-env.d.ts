/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// to keep with backwards compatability
export const __APP_VERSION__: string;
export const API_URL: string;
export const SANDBOX_KEY: string;

// why does this exist? it should be a config thing
export const TEST_URL: string;

interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
