import preact from "@preact/preset-vite";
import path, { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

import pkg from "./package.json";

// const _banner = `${pkg.name}@v${pkg.version}`;
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
        plugins: [svgr(), preact()],
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
            open: `http://localhost:${PORT}/v${MAJOR_VERSION}/index.html`,
            // proxy: {
            //     [`/v${MAJOR_VERSION}`]: `http://localhost:${PORT}/`
            // }
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
        },
    };
});
