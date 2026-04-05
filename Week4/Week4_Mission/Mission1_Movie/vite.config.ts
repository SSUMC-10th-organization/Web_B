import tailwindcss from "@tailwindcss/vite"; // 1. 이거 추가
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(), // 2. 이거 추가
	],
});
