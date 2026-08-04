import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

const allowedHosts = [".exe.xyz", ".edtechathon.com"];

export default defineConfig({
  plugins: [svelte()],
  build: { outDir: "dist", emptyOutDir: true },
  server: { host: "0.0.0.0", port: 8000, allowedHosts },
  preview: { host: "0.0.0.0", port: 8000, allowedHosts },
});
