// user-app/src/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "gameProgressApp",
			filename: "remoteEntry.js",
			exposes: {
				"./App": "./src/App",
				"./Chat": "./src/components/ChatWrapper.jsx",
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
