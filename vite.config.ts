import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";


export default defineConfig({
    plugins: [react(), tailwindcss()],
    preview: {
        host: "0.0.0.0",
        port: 3000,
        allowedHosts: [
            'crazy-taski-client-production.up.railway.app'
        ]
    },
    server: {
        host: "0.0.0.0",
        port: 3000
    }
});