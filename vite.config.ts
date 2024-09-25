/// <reference types="vitest/config" />
import preact from "@preact/preset-vite";
import path, { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";

import pkg from "./package.json";

const BANNER_CONTENT = `${pkg.name}@v${pkg.version}`;
const MAJOR_VERSION = `v${pkg.version.split(".")[0]}`;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // const _isProduction = mode === "prod";

    // allows .env files in /config folder
    const envDir = path.resolve(process.cwd(), "config");
    const envPrefix = ["VITE", "CONFIG"];
    // load all .env files here so we have access to non `VITE_` variables in the config
    const env = loadEnv(mode, envDir, "");

    const PORT = env.LUMA_PORT;

    return {
        plugins: [
            banner(BANNER_CONTENT),
            svgr({
                svgrOptions: {
                    svgo: false,
                },
                include: "**/*.svg",
            }),
            preact(),
            dts({
                compilerOptions: {
                    emitDeclarationOnly: true,
                    declaration: true,
                    noEmit: false,
                },
                include: ["src"],
            }),
        ],
        envDir,
        envPrefix, // only allow CONFIG on dev ???
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            port: parseInt(PORT),
            strictPort: true,
            open: `http://localhost:${PORT}/${MAJOR_VERSION}/index.html`,
        },
        define: {
            __APP_VERSION__: JSON.stringify(env.npm_package_version),
            __API_URL__: JSON.stringify(env.VITE_API_URL ?? ""),
            // for backwards compatability
            API_URL: JSON.stringify(env.VITE_API_URL ?? ""),
        },
        // https://vitejs.dev/guide/build#library-mode
        build: {
            lib: {
                entry: resolve(__dirname, "src/LiveSearchPLP.tsx"),
                name: "LiveSearchPLP",
                fileName: "search",
            },
            rollupOptions: {
                external: ["preact", "preact/compat"],
            },
            copyPublicDir: false,
        },
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: "./vitest.setup.ts",
            alias: {
                "\\.svg$": "./src/__mocks__/mock-file.ts",
            },
        },
    };
});
