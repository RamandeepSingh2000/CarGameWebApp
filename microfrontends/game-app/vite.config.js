import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "GameApp",
			filename: "remoteEntry.js",
			exposes: {
				"./App": "./src/App.jsx",
			},
			shared: {
				"react": {},
				"react-dom": {},
				"@apollo/client": { singleton: true },
				"graphql": {}
			},
		}),
	],
	build: {
		modulePreload: false,
		target: "esnext",
		minify: true,
		cssCodeSplit: false,
		rollupOptions: {
			external: [/node_modules\/graphql\/error\/index\.mjs/],
			onwarn(warning, warn) {
				if (
					warning.code === "PARSE_ERROR" &&
					warning.loc?.file?.includes("graphql/error/index.mjs")
				) {
					console.log(`Suppressed PARSE_ERROR from ${warning.loc?.file}`);
					return;
				}
				warn(warning);
			},
		},
	},
});
