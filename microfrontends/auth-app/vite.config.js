// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "authApp",
			filename: "remoteEntry.js",
			exposes: {
				"./App": "./src/App",
			},
			shared: ["react", "react-dom", "@apollo/client", "graphql"],
		}),
	],

	build: {
		modulePreload: false,
		target: "esnext",
		minify: false,
		cssCodeSplit: false,
	},
});
