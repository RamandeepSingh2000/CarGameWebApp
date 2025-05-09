// shell-app/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "shellApp",
			remotes: {
				authApp: "http://localhost:3003/assets/remoteEntry.js",
				gameProgressApp: "http://localhost:3004/assets/remoteEntry.js",
				gameApp: "http://localhost:3005/assets/remoteEntry.js",
				chatbotApp: "http://localhost:3006/assets/remoteEntry.js",
			},
			shared: {
				react: { singleton: true, requiredVersion: "^18.2.0" },
				"react-dom": { singleton: true, requiredVersion: "^18.2.0" },
				"@apollo/client": { singleton: true, requiredVersion: "^3.9.5" },
				graphql: { singleton: true, requiredVersion: "^16.8.1" },
			},
		}),
	],
	build: {
		target: "esnext",
		minify: true,
	},
});
